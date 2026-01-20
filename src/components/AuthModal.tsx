import React, { useState } from 'react';
import { User, Lock, Mail, Eye, EyeOff, X, KeyRound, Building2, MapPin, Phone } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { hashPassword, verifyPassword } from '../lib/crypto';
import { generateVerificationCode, sendPasswordResetCode } from '../lib/emailService';

interface AuthUser {
  id: string;
  email: string;
  name: string;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: AuthUser) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showResetCodeInput, setShowResetCodeInput] = useState(false);
  const [resetCode, setResetCode] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    address: '',
    phoneNumber: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      if (isLoginMode) {
        const { data: users, error: fetchError } = await supabase
          .from('catalog_users')
          .select('*')
          .eq('email', formData.email)
          .maybeSingle();

        if (fetchError) throw fetchError;

        if (users) {
          if (users.status === 'pending') {
            setError('Ваш аккаунт ожидает одобрения администратора');
            return;
          }

          if (users.status === 'rejected') {
            setError('Ваш аккаунт был отклонен. Пожалуйста, зарегистрируйтесь заново для повторной отправки запроса.');
            return;
          }

          const isPasswordValid = await verifyPassword(formData.password, users.password_hash);

          if (isPasswordValid) {
            const authUser: AuthUser = {
              id: users.id,
              email: users.email,
              name: users.name
            };
            onLogin(authUser);
            onClose();
            resetForm();
          } else {
            setError('Неверный email или пароль');
          }
        } else {
          setError('Неверный email или пароль');
        }
      } else {
        if (formData.password !== formData.confirmPassword) {
          setError('Пароли не совпадают');
          return;
        }

        if (formData.password.length < 6) {
          setError('Пароль должен содержать минимум 6 символов');
          return;
        }

        const { data: existingUser } = await supabase
          .from('catalog_users')
          .select('*')
          .eq('email', formData.email)
          .maybeSingle();

        if (existingUser) {
          if (existingUser.status === 'rejected') {
            const passwordHash = await hashPassword(formData.password);

            const { error: updateError } = await supabase
              .from('catalog_users')
              .update({
                password_hash: passwordHash,
                name: formData.name,
                company_name: formData.companyName,
                address: formData.address,
                phone_number: formData.phoneNumber,
                status: 'pending',
                updated_at: new Date().toISOString()
              })
              .eq('id', existingUser.id);

            if (updateError) throw updateError;

            setSuccess('Ваш запрос отправлен повторно на одобрение администратора!');
            setTimeout(() => {
              resetForm();
              onClose();
            }, 3000);
            return;
          } else {
            setError('Пользователь с таким email уже существует');
            return;
          }
        }

        const passwordHash = await hashPassword(formData.password);

        const { data: newUser, error: insertError } = await supabase
          .from('catalog_users')
          .insert([{
            email: formData.email,
            password_hash: passwordHash,
            name: formData.name,
            company_name: formData.companyName,
            address: formData.address,
            phone_number: formData.phoneNumber,
            status: 'pending'
          }])
          .select()
          .single();

        if (insertError) throw insertError;

        setSuccess('Регистрация отправлена на одобрение администратора. Вы получите доступ после одобрения.');
        setTimeout(() => {
          resetForm();
          onClose();
        }, 3000);
      }
    } catch (error: any) {
      setError(error.message || 'Произошла ошибка. Попробуйте снова.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      companyName: '',
      address: '',
      phoneNumber: ''
    });
    setError('');
    setSuccess('');
  };

  const switchMode = () => {
    setIsLoginMode(!isLoginMode);
    resetForm();
  };

  const handleForgotPassword = async () => {
    if (!resetEmail) {
      setError('Введите email');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const { data: user } = await supabase
        .from('catalog_users')
        .select('*')
        .eq('email', resetEmail)
        .maybeSingle();

      if (!user) {
        setError('Пользователь с таким email не найден');
        return;
      }

      const code = generateVerificationCode();
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 10);

      const { error: insertError } = await supabase
        .from('password_reset_codes')
        .insert([{
          email: resetEmail,
          code: code,
          expires_at: expiresAt.toISOString()
        }]);

      if (insertError) throw insertError;

      const emailSent = await sendPasswordResetCode(resetEmail, user.name, code);

      if (!emailSent) {
        setError('Ошибка отправки email. Попробуйте снова');
        return;
      }

      setShowResetCodeInput(true);
      setSuccess(`Код сброса пароля отправлен на ${resetEmail}`);
    } catch (error: any) {
      setError(error.message || 'Произошла ошибка');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (resetCode.length !== 6) {
      setError('Код должен содержать 6 цифр');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError('Пароли не совпадают');
      return;
    }

    if (newPassword.length < 6) {
      setError('Пароль должен содержать минимум 6 символов');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const { data: resetRecord, error: fetchError } = await supabase
        .from('password_reset_codes')
        .select('*')
        .eq('code', resetCode)
        .eq('email', resetEmail)
        .eq('used', false)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (!resetRecord) {
        setError('Неверный код');
        return;
      }

      const now = new Date();
      const expiresAt = new Date(resetRecord.expires_at);

      if (now > expiresAt) {
        setError('Код истек. Попробуйте снова');
        await supabase
          .from('password_reset_codes')
          .delete()
          .eq('id', resetRecord.id);
        return;
      }

      const passwordHash = await hashPassword(newPassword);

      const { error: updateError } = await supabase
        .from('catalog_users')
        .update({ password_hash: passwordHash })
        .eq('email', resetEmail);

      if (updateError) throw updateError;

      await supabase
        .from('password_reset_codes')
        .update({ used: true })
        .eq('id', resetRecord.id);

      setSuccess('Пароль успешно изменен!');
      setTimeout(() => {
        setShowForgotPassword(false);
        setShowResetCodeInput(false);
        setResetEmail('');
        setResetCode('');
        setNewPassword('');
        setConfirmNewPassword('');
        resetForm();
      }, 2000);
    } catch (error: any) {
      setError(error.message || 'Произошла ошибка');
    } finally {
      setIsLoading(false);
    }
  };

  if (showForgotPassword) {
    if (showResetCodeInput) {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: 'url(/background_cap_with_avto_details.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            <div className="absolute inset-0 bg-white/85"></div>
          </div>
          <div className="relative z-10 bg-white/95 backdrop-blur-xl rounded-2xl p-8 w-full max-w-md border-2 border-blue-500/30 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Сброс пароля
              </h2>
              <button
                onClick={() => {
                  setShowForgotPassword(false);
                  setShowResetCodeInput(false);
                  setResetEmail('');
                  setResetCode('');
                  setNewPassword('');
                  setConfirmNewPassword('');
                  resetForm();
                }}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <KeyRound className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-gray-700 mb-2">
                Код отправлен на
              </p>
              <p className="text-gray-900 font-semibold mb-4">
                {resetEmail}
              </p>
            </div>

            {success && (
              <div className="bg-green-500/20 border border-green-600 rounded-lg p-3 mb-4">
                <p className="text-green-700 text-sm text-center font-medium">{success}</p>
              </div>
            )}

            {error && (
              <div className="bg-red-500/20 border border-red-600 rounded-lg p-3 mb-4">
                <p className="text-red-700 text-sm text-center font-medium">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
                  Введите код подтверждения
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-gray-900 text-center text-2xl tracking-widest placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  placeholder="000000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Новый пароль
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Введите новый пароль"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Подтвердите пароль
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <input
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Повторите пароль"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleResetPassword}
              disabled={isLoading || resetCode.length !== 6 || !newPassword || !confirmNewPassword}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6 shadow-lg"
            >
              {isLoading ? 'Обработка...' : 'Изменить пароль'}
            </button>

            <button
              onClick={() => {
                setShowResetCodeInput(false);
                setResetCode('');
                setNewPassword('');
                setConfirmNewPassword('');
              }}
              className="w-full text-gray-600 hover:text-gray-900 py-2 text-sm transition-colors mt-4 font-medium"
            >
              Вернуться назад
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(/background_cap_with_avto_details.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="absolute inset-0 bg-white/85"></div>
        </div>
        <div className="relative z-10 bg-white/95 backdrop-blur-xl rounded-2xl p-8 w-full max-w-md border-2 border-blue-500/30 shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Забыли пароль?
            </h2>
            <button
              onClick={() => {
                setShowForgotPassword(false);
                setResetEmail('');
                resetForm();
              }}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-gray-700">
              Введите ваш email для сброса пароля
            </p>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-600 rounded-lg p-3 mb-4">
              <p className="text-red-700 text-sm text-center font-medium">{error}</p>
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                placeholder="Введите ваш email"
              />
            </div>
          </div>

          <button
            onClick={handleForgotPassword}
            disabled={isLoading || !resetEmail}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-4 shadow-lg"
          >
            {isLoading ? 'Отправка...' : 'Отправить код'}
          </button>

          <button
            onClick={() => {
              setShowForgotPassword(false);
              setResetEmail('');
              resetForm();
            }}
            className="w-full text-gray-600 hover:text-gray-900 py-2 text-sm transition-colors font-medium"
          >
            Вернуться к входу
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(/background_cap_with_avto_details.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-white/85"></div>
      </div>
      <div className="relative z-10 bg-white/95 backdrop-blur-xl rounded-2xl p-8 w-full max-w-md my-8 border-2 border-blue-500/30 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {isLoginMode ? 'Вход в систему' : 'Регистрация'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLoginMode ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ФИО
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Введите ваше ФИО"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Название компании/магазина
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <input
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Введите название компании/магазина"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Номер телефона
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <input
                    type="tel"
                    required
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Введите номер телефона"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Введите ваш email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Адрес
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Введите ваш адрес"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Придумайте пароль
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full pl-10 pr-12 py-3 bg-white border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Введите пароль"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-900"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Подтвердите пароль
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Повторите пароль"
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Введите ваш email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Пароль
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full pl-10 pr-12 py-3 bg-white border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Введите пароль"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-900"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </>
          )}

          {error && (
            <div className="bg-red-500/20 border border-red-600 rounded-lg p-3">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-500/20 border border-green-600 rounded-lg p-3">
              <p className="text-green-700 text-sm font-medium">{success}</p>
            </div>
          )}

          {isLoginMode && (
            <div className="text-right mb-4">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Забыли пароль?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {isLoading ? 'Загрузка...' : (isLoginMode ? 'Войти' : 'Зарегистрироваться')}
          </button>

          <div className="mt-6 text-center">
            <p className="text-gray-700">
              {isLoginMode ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}
              <button
                type="button"
                onClick={switchMode}
                className="ml-2 text-blue-600 hover:text-blue-700 font-semibold"
              >
                {isLoginMode ? 'Зарегистрироваться' : 'Войти'}
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
