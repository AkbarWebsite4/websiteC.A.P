import React, { useState, useEffect, useRef } from 'react';
import { Search, Package, Weight, Info, LogOut, User, Upload, Menu, ChevronDown, ShoppingCart, Plus, FileUp } from 'lucide-react';
import * as XLSX from 'xlsx';
import { AdminPanel } from './AdminPanel';
import { SidebarMenu } from './SidebarMenu';
import { CartModal } from './CartModal';
import { supabase } from '../lib/supabase';

interface PartData {
  code: string;
  name: string;
  brand: string;
  price: string;
  weight: string;
  category: string;
  description?: string;
  availability: string;
  qty?: string;
}

interface AuthUser {
  email: string;
  password: string;
  name: string;
}

interface CatalogPageProps {
  user: AuthUser;
  onLogout: () => void;
  onBack: () => void;
}

interface AccessRequest {
  id: string;
  userEmail: string;
  userName: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedDate?: string;
}

interface CartItem {
  id: string;
  part_code: string;
  part_name: string;
  brand: string;
  price: string;
  quantity: number;
  max_qty?: string;
}

interface ExchangeRate {
  currency_from: string;
  currency_to: string;
  rate: number;
  updated_at: string;
}
/**
 * Separate Catalog Page Component
 * Dedicated page for catalog search after authentication
 */
export const CatalogPage: React.FC<CatalogPageProps> = ({ user, onLogout, onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<PartData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [partsData, setPartsData] = useState<PartData[]>([]);
  const [showUploadSection, setShowUploadSection] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadPassword, setUploadPassword] = useState('');
  const [isUploadAuthenticated, setIsUploadAuthenticated] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<'ru' | 'en'>('ru');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [partQuantities, setPartQuantities] = useState<{ [key: string]: number }>({});
  const [selectedCurrency, setSelectedCurrency] = useState<'AED' | 'TJS' | 'USD'>('AED');
  const [exchangeRates, setExchangeRates] = useState<{ [key: string]: number }>({ AED: 1, TJS: 2.89, USD: 0.2723 });
  const [quantityWarnings, setQuantityWarnings] = useState<{ [key: string]: string }>({});
  const [uploadStatusMessage, setUploadStatusMessage] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const UPLOAD_PASSWORD = 'cap2025';
  const ADMIN_EMAIL = 't8.fd88@gmail.com';
  const ADMIN_EMAILS = ['t8.fd88@gmail.com', 'admin@cap.com']; // Список админов

  // Проверка является ли пользователь админом
  const isAdmin = ADMIN_EMAILS.includes(user.email.toLowerCase());

  const formatPrice = (price: string): string => {
    if (!price) return 'Цена по запросу';
    const numPrice = parseFloat(price);
    if (isNaN(numPrice)) return price;

    const rate = exchangeRates[selectedCurrency] || 1;
    const convertedPrice = numPrice * rate;

    return `${convertedPrice.toFixed(2)} ${selectedCurrency}`;
  };

  const calculateCartTotal = (): number => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.price);
      if (!isNaN(price)) {
        return total + (price * item.quantity);
      }
      return total;
    }, 0);
  };

  useEffect(() => {
    const updateExchangeRatesFromAPI = async () => {
      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

        const response = await fetch(
          `${supabaseUrl}/functions/v1/update-exchange-rates`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.ok) {
          console.log('Exchange rates updated successfully');
        }
      } catch (error) {
        console.error('Error updating exchange rates from API:', error);
      }
    };

    const fetchExchangeRates = async () => {
      try {
        const { data, error } = await supabase
          .from('exchange_rates')
          .select('currency_to, rate');

        if (error) {
          console.error('Error fetching exchange rates:', error);
          return;
        }

        if (data && data.length > 0) {
          const rates: { [key: string]: number } = { AED: 1 };
          data.forEach((item: any) => {
            rates[item.currency_to] = item.rate;
          });
          setExchangeRates(rates);
        }
      } catch (error) {
        console.error('Error loading exchange rates:', error);
      }
    };

    updateExchangeRatesFromAPI();
    fetchExchangeRates();

    const interval = setInterval(() => {
      updateExchangeRatesFromAPI();
      fetchExchangeRates();
    }, 3600000);

    return () => clearInterval(interval);
  }, []);

  const handleUploadLogin = () => {
    if (uploadPassword === UPLOAD_PASSWORD) {
      setIsUploadAuthenticated(true);
    } else {
      alert('Неверный пароль!');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      setSelectedFiles(files);
      processMultipleExcelFiles(files);
    }
  };

  const processMultipleExcelFiles = (files: File[]) => {
    setIsProcessing(true);
    const allProcessedData: PartData[] = [...partsData];

    let processedFiles = 0;

    console.log(`Начало обработки ${files.length} файлов Excel...`);

    files.forEach((file, fileIndex) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          console.log(`Обработка файла: ${file.name}`);
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          const headerRow = jsonData[0] as string[];
          
          const partNoIndex = headerRow.findIndex(header => {
            if (!header) return false;
            const headerLower = header.toString().toLowerCase();
            return headerLower === 'part no' || 
                   headerLower === 'part no.' ||
                   headerLower === 'partno';
          });
          
          const descriptionIndex = headerRow.findIndex(header => {
            if (!header) return false;
            const headerLower = header.toString().toLowerCase();
            return headerLower === 'part name' ||
                   headerLower.includes('description') || 
                   headerLower === 'discrapion';
          });
          
          const priceIndex = headerRow.findIndex(header => {
            if (!header) return false;
            const headerLower = header.toString().toLowerCase();
            return headerLower === 'price in aed' ||
                   headerLower === 'u/p aed' ||
                   headerLower === 'nett';
          });

          const qtyIndex = headerRow.findIndex(header => {
            if (!header) return false;
            const headerLower = header.toString().toLowerCase().trim();
            return headerLower === 'qty' ||
                   headerLower === 'available qty' ||
                   headerLower === 'quantity' ||
                   headerLower.includes('qty');
          });

          console.log('Headers found:', {
            partNo: partNoIndex,
            description: descriptionIndex,
            price: priceIndex,
            qty: qtyIndex
          });
          console.log('Header row:', headerRow);

          for (let i = 1; i < jsonData.length; i++) {
            const row = jsonData[i] as any[];

            if (row && row.length > 0 && partNoIndex !== -1) {
              const partNo = row[partNoIndex]?.toString().trim() || '';
              const description = descriptionIndex !== -1 ? (row[descriptionIndex]?.toString().trim() || '') : '';
              const price = priceIndex !== -1 ? (row[priceIndex]?.toString().trim() || '') : '';
              const qty = qtyIndex !== -1 ? (row[qtyIndex]?.toString().trim() || '') : '';

              if (i <= 3) {
                console.log(`Row ${i} data:`, {
                  partNo,
                  description,
                  price,
                  qty,
                  qtyRaw: row[qtyIndex]
                });
              }

              if (partNo && partNo !== '') {
                const existingIndex = allProcessedData.findIndex(item => item.code === partNo);
                const cleanPrice = price && price !== '' ? price.toString().replace(/[^\d.]/g, '') : '';
                const newItem = {
                  code: partNo,
                  name: description || partNo,
                  brand: '',
                  price: cleanPrice || '0',
                  weight: '',
                  category: 'Автозапчасти',
                  description: description || partNo,
                  availability: 'В наличии',
                  qty: qty || '0'
                };
                
                if (existingIndex >= 0) {
                  allProcessedData[existingIndex] = newItem;
                } else {
                  allProcessedData.push(newItem);
                }
              }
            }
          }

          processedFiles++;
          console.log(`Файл ${file.name} обработан. Всего позиций: ${allProcessedData.length}`);

          if (processedFiles === files.length) {
            console.log(`Все ${files.length} файлов обработаны. Всего позиций: ${allProcessedData.length}`);
            setPartsData(allProcessedData);
            localStorage.setItem('capCatalog', JSON.stringify(allProcessedData));
            sessionStorage.setItem('capCatalog', JSON.stringify(allProcessedData));
            const backupKey = `capCatalog_backup_${Date.now()}`;
            localStorage.setItem(backupKey, JSON.stringify(allProcessedData));

            console.log('Начало сохранения в базу данных...');
            saveCatalogToDatabase(allProcessedData).then(savedCount => {
              setIsProcessing(false);
              console.log(`Сохранение завершено. Сохранено: ${savedCount} из ${allProcessedData.length}`);
              alert(`Каталог обновлен! Загружено ${allProcessedData.length} позиций. Сохранено в базу данных: ${savedCount} позиций.`);
              setSelectedFiles([]);
              setShowUploadSection(false);
              loadCatalogFromDatabase();
            }).catch(error => {
              console.error('Ошибка сохранения в базу:', error);
              setIsProcessing(false);
              alert(`Каталог обновлен! Загружено ${allProcessedData.length} позиций. Ошибка сохранения в базу данных.`);
              setSelectedFiles([]);
              setShowUploadSection(false);
            });
          }
        } catch (error) {
          console.error(`Ошибка обработки файла ${file.name}:`, error);
          processedFiles++;
          
          if (processedFiles === files.length) {
            setIsProcessing(false);
          }
        }
      };

      reader.readAsArrayBuffer(file);
    });
  };

  // Загрузить каталог из базы данных при запуске
  useEffect(() => {
    loadCatalogFromDatabase();
    loadCartItems();
  }, []);

  const loadCartItems = async () => {
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_email', user.email)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) {
        setCartItems(data);
      }
    } catch (error) {
      console.error('Ошибка загрузки корзины:', error);
    }
  };

  const showQuantityWarning = (partCode: string, message: string) => {
    setQuantityWarnings(prev => ({ ...prev, [partCode]: message }));
    setTimeout(() => {
      setQuantityWarnings(prev => {
        const updated = { ...prev };
        delete updated[partCode];
        return updated;
      });
    }, 3000);
  };

  const addToCart = async (part: PartData) => {
    try {
      const quantityToAdd = partQuantities[part.code] || 0;

      if (quantityToAdd <= 0) {
        showQuantityWarning(part.code, 'Укажите количество больше 0');
        return;
      }

      const maxQty = parseInt(part.qty || '999999');
      if (quantityToAdd > maxQty) {
        showQuantityWarning(part.code, `Максимальное количество: ${maxQty}`);
        return;
      }

      const existingItem = cartItems.find(item => item.part_code === part.code);

      if (existingItem) {
        const newQuantity = existingItem.quantity + quantityToAdd;
        if (newQuantity > maxQty) {
          showQuantityWarning(part.code, `Максимальное количество: ${maxQty}. В корзине уже ${existingItem.quantity} шт.`);
          return;
        }

        const { error } = await supabase
          .from('cart_items')
          .update({
            quantity: newQuantity,
            max_qty: part.qty || '999999',
            updated_at: new Date().toISOString()
          })
          .eq('id', existingItem.id);

        if (error) throw error;

        setCartItems(prev => prev.map(item =>
          item.id === existingItem.id
            ? { ...item, quantity: newQuantity, max_qty: part.qty || '999999' }
            : item
        ));
      } else {
        const { data, error } = await supabase
          .from('cart_items')
          .insert([{
            user_email: user.email,
            part_code: part.code,
            part_name: part.name,
            brand: part.brand,
            price: part.price,
            quantity: quantityToAdd,
            max_qty: part.qty || '999999'
          }])
          .select();

        if (error) throw error;
        if (data) {
          setCartItems(prev => [...prev, data[0]]);
        }
      }

      setPartQuantities(prev => ({ ...prev, [part.code]: 1 }));
      showQuantityWarning(part.code, `✓ Добавлено ${quantityToAdd} шт. в корзину`);
    } catch (error) {
      console.error('Ошибка добавления в корзину:', error);
      showQuantityWarning(part.code, `Ошибка: ${error instanceof Error ? error.message : 'Не удалось добавить в корзину'}`);
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      setCartItems(prev => prev.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Ошибка удаления из корзины:', error);
      alert('Ошибка удаления из корзины');
    }
  };

  const updateCartQuantity = async (itemId: string, quantity: number) => {
    try {
      const item = cartItems.find(i => i.id === itemId);
      if (!item) return;

      const maxQty = parseInt(item.max_qty || '999999');
      const validQuantity = Math.min(Math.max(1, quantity), maxQty);

      const { error } = await supabase
        .from('cart_items')
        .update({ quantity: validQuantity, updated_at: new Date().toISOString() })
        .eq('id', itemId);

      if (error) throw error;

      setCartItems(prev => prev.map(item =>
        item.id === itemId ? { ...item, quantity: validQuantity } : item
      ));
    } catch (error) {
      console.error('Ошибка обновления количества:', error);
      alert('Ошибка обновления количества');
    }
  };

  const clearCart = async () => {
    if (!confirm('Очистить всю корзину?')) return;

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_email', user.email);

      if (error) throw error;

      setCartItems([]);
    } catch (error) {
      console.error('Ошибка очистки корзины:', error);
      alert('Ошибка очистки корзины');
    }
  };

  const saveCatalogToDatabase = async (catalogData: PartData[]) => {
    try {
      console.log(`Начало сохранения ${catalogData.length} позиций в базу данных...`);

      const { error: deleteError } = await supabase
        .from('catalog_parts')
        .delete()
        .neq('code', '___IMPOSSIBLE_VALUE___');

      if (deleteError) {
        console.error('Ошибка очистки таблицы:', deleteError);
      } else {
        console.log('Таблица успешно очищена');
      }

      const batchSize = 500;
      let successCount = 0;

      for (let i = 0; i < catalogData.length; i += batchSize) {
        const batch = catalogData.slice(i, i + batchSize);

        const dataToInsert = batch.map(item => ({
          code: item.code,
          name: item.name,
          brand: item.brand || '',
          price: item.price,
          weight: item.weight || '',
          category: item.category,
          description: item.description,
          availability: item.availability,
          qty: item.qty || '0'
        }));

        try {
          const { error } = await supabase
            .from('catalog_parts')
            .insert(dataToInsert);

          if (error) {
            console.error(`Ошибка сохранения батча ${i}-${i + batchSize}:`, error);
            console.error('Детали ошибки:', error);
          } else {
            successCount += batch.length;
            console.log(`Сохранено ${successCount} из ${catalogData.length} позиций`);
          }
        } catch (batchError) {
          console.error(`Критическая ошибка в батче ${i}-${i + batchSize}:`, batchError);
        }

        await new Promise(resolve => setTimeout(resolve, 50));
      }

      console.log(`Сохранение завершено: ${successCount} из ${catalogData.length} позиций`);
      return successCount;
    } catch (error) {
      console.error('Ошибка сохранения каталога в базу:', error);
      return 0;
    }
  };

  const loadCatalogFromDatabase = async () => {
    try {
      let allData: any[] = [];
      let from = 0;
      const batchSize = 10000;
      let hasMore = true;

      console.log('Начало загрузки каталога из базы данных...');

      while (hasMore) {
        const { data, error } = await supabase
          .from('catalog_parts')
          .select('*')
          .order('code')
          .range(from, from + batchSize - 1);

        if (error) throw error;

        if (data && data.length > 0) {
          allData = [...allData, ...data];
          console.log(`Загружено ${allData.length} позиций...`);
          from += batchSize;
          hasMore = data.length === batchSize;
        } else {
          hasMore = false;
        }
      }

      const catalogData: PartData[] = allData.map(item => ({
        code: item.code,
        name: item.name,
        brand: item.brand,
        price: item.price,
        weight: item.weight,
        category: item.category,
        description: item.description,
        availability: item.availability,
        qty: item.qty
      }));
      setPartsData(catalogData);
      console.log(`Загружен каталог из базы: ${catalogData.length} позиций`);
    } catch (error) {
      console.error('Ошибка загрузки каталога из базы:', error);
      setPartsData([]);
    }
  };

  const totalParts = partsData.length;

  // Функция поиска
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    
    setIsLoading(true);

    setTimeout(() => {
      if (term.trim() === '') {
        setSearchResults([]);
      } else {
        const results = partsData.filter(part =>
          part.code.toLowerCase().includes(term.toLowerCase()) ||
          part.name.toLowerCase().includes(term.toLowerCase()) ||
          part.brand.toLowerCase().includes(term.toLowerCase()) ||
          part.category.toLowerCase().includes(term.toLowerCase())
        );
        setSearchResults(results);
      }
      setIsLoading(false);
    }, 300);
  };

  return (
    <div className="min-h-screen font-sans relative">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: 'url(/background_cap_with_avto_details_4.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            imageRendering: 'high-quality'
          }}
        >
          <div className="absolute inset-0 bg-white/80"></div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Sidebar Menu */}
        <SidebarMenu
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          currentLanguage={currentLanguage}
          onLanguageChange={setCurrentLanguage}
        />

        {/* Header - Mobile Responsive */}
        <div className="bg-gradient-to-r from-gray-900/95 to-gray-800/95 backdrop-blur-sm border-2 border-blue-600/30 rounded-2xl p-3 md:p-4 mb-6 md:mb-8 shadow-xl">
          {/* Mobile Layout - Stacked */}
          <div className="lg:hidden">
            {/* Top Row - Menu, Cart and User */}
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="flex items-center space-x-2 text-white hover:text-blue-400 transition-colors px-2 py-2 rounded-lg hover:bg-blue-600/10"
              >
                <Menu className="w-6 h-6" />
                <span className="font-medium text-sm">Меню</span>
              </button>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowCart(true)}
                  className="relative bg-blue-600/20 border border-blue-500 rounded-xl px-3 py-2 hover:bg-blue-600/30 transition-colors flex items-center space-x-2 min-w-[120px] max-w-[120px]"
                >
                  <ShoppingCart className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  {cartItems.length > 0 && (
                    <>
                      <span className="text-white font-semibold text-sm truncate">
                        {calculateCartTotal().toFixed(2)} AED
                      </span>
                      <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                        {cartItems.length}
                      </span>
                    </>
                  )}
                </button>

                <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center bg-blue-600/20 border border-blue-500 rounded-xl px-2 py-2 hover:bg-blue-600/30 transition-colors w-[110px]"
                >
                  <User className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  <span className="text-white font-medium text-sm truncate flex-1 mx-1">{user.name}</span>
                  <ChevronDown className="w-4 h-4 text-blue-400 flex-shrink-0" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
                    {isAdmin && (
                      <>
                        <button
                          onClick={() => {
                            setShowAdminPanel(true);
                            setShowUserMenu(false);
                          }}
                          className="w-full flex items-center space-x-2 px-4 py-3 text-white hover:bg-gray-700 transition-colors border-b border-gray-700"
                        >
                          <Upload className="w-4 h-4" />
                          <span>Управление каталогом</span>
                        </button>
                        <button
                          onClick={() => {
                            fileInputRef.current?.click();
                            setShowUserMenu(false);
                          }}
                          className="w-full flex items-center space-x-2 px-4 py-3 text-green-400 hover:bg-gray-700 transition-colors border-b border-gray-700"
                        >
                          <FileUp className="w-4 h-4" />
                          <span>Загрузить Excel файлы</span>
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => {
                        onLogout();
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center space-x-2 px-4 py-3 text-red-400 hover:bg-gray-700 transition-colors rounded-b-lg"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Выход</span>
                    </button>
                  </div>
                )}
                </div>
              </div>
            </div>

            {/* Bottom Row - Currency and Search */}
            <div className="flex items-center space-x-2">
              <select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value as 'AED' | 'TJS' | 'USD')}
                className="px-3 py-2.5 bg-gray-800/90 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm font-medium"
              >
                <option value="AED">AED</option>
                <option value="TJS">TJS</option>
                <option value="USD">USD</option>
              </select>

              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Поиск..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-12 py-2.5 bg-gray-800/90 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
                />
                <button
                  onClick={() => handleSearch(searchTerm)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded-lg transition-colors"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Desktop Layout - Single Row */}
          <div className="hidden lg:flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex items-center space-x-2 text-white hover:text-blue-400 transition-colors px-3 py-2 rounded-lg hover:bg-blue-600/10"
            >
              <Menu className="w-6 h-6" />
              <span className="font-medium">Меню</span>
            </button>

            <div className="flex items-center space-x-3 flex-1 max-w-3xl mx-6">
              <select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value as 'AED' | 'TJS' | 'USD')}
                className="px-4 py-3 bg-gray-800/90 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
              >
                <option value="AED">AED</option>
                <option value="TJS">TJS</option>
                <option value="USD">USD</option>
              </select>

              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Поиск по коду, названию или бренду..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-12 pr-16 py-3 bg-gray-800/90 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
                <button
                  onClick={() => handleSearch(searchTerm)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowCart(true)}
                className="relative bg-blue-600/20 border border-blue-500 rounded-xl px-4 py-3 hover:bg-blue-600/30 transition-colors flex items-center space-x-3"
              >
                <ShoppingCart className="w-5 h-5 text-blue-400" />
                <div className="flex flex-col items-start">
                  <span className="text-white font-medium text-sm">Корзина</span>
                  {cartItems.length > 0 && (
                    <span className="text-green-400 font-bold text-xs">
                      {calculateCartTotal().toFixed(2)} AED
                    </span>
                  )}
                </div>
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">
                    {cartItems.length}
                  </span>
                )}
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center bg-blue-600/20 border border-blue-500 rounded-xl px-3 py-3 hover:bg-blue-600/30 transition-colors w-[180px]"
                >
                <User className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <span className="text-white font-medium truncate flex-1 mx-2">{user.name}</span>
                <ChevronDown className="w-4 h-4 text-blue-400 flex-shrink-0" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
                  {isAdmin && (
                    <>
                      <button
                        onClick={() => {
                          setShowAdminPanel(true);
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center space-x-2 px-4 py-3 text-white hover:bg-gray-700 transition-colors border-b border-gray-700"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Управление каталогом</span>
                      </button>
                      <button
                        onClick={() => {
                          fileInputRef.current?.click();
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center space-x-2 px-4 py-3 text-green-400 hover:bg-gray-700 transition-colors border-b border-gray-700"
                      >
                        <FileUp className="w-4 h-4" />
                        <span>Загрузить Excel файлы</span>
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => {
                      onLogout();
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center space-x-2 px-4 py-3 text-red-400 hover:bg-gray-700 transition-colors rounded-b-lg"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Выход</span>
                  </button>
                </div>
              )}
              </div>
            </div>
          </div>
        </div>


        {/* Loading */}
        {isLoading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#144374]"></div>
            <p className="text-gray-400 mt-2">Поиск...</p>
          </div>
        )}

        {/* Search Results */}
        {searchResults.length > 0 && !isLoading && (
          <div className="max-w-6xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Результаты поиска ({searchResults.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((part, index) => (
                <div
                  key={part.code}
                  className="bg-white/95 backdrop-blur-sm rounded-xl p-6 border-2 border-gray-300 hover:border-[#144374] transition-all duration-300 transform hover:-translate-y-2 shadow-lg"
                >
                  {/* Availability and Quantity */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      part.availability === 'В наличии'
                        ? 'bg-green-500/20 text-green-700'
                        : 'bg-yellow-500/20 text-yellow-700'
                    }`}>
                      {part.availability}
                    </span>
                    {part.qty && (
                      <span className="bg-blue-500/20 text-blue-700 px-3 py-1 rounded-full text-sm font-bold">
                        Кол-во: {part.qty}
                      </span>
                    )}
                  </div>

                  {/* Part Info */}
                  <h4 className="text-lg font-bold text-gray-900 mb-2">{part.name}</h4>
                  <p className="text-gray-700 text-sm mb-4 font-medium">{part.code}</p>

                  {part.description && part.description !== part.name && (
                    <p className="text-gray-800 text-sm mb-4 leading-relaxed">
                      {part.description}
                    </p>
                  )}

                  {/* Price and Weight */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-green-700">
                      <span className="font-bold text-lg">{formatPrice(part.price)}</span>
                    </div>
                    {part.weight && (
                      <div className="flex items-center text-gray-700">
                        <Weight className="w-4 h-4 mr-1" />
                        <span className="text-sm">{part.weight}</span>
                      </div>
                    )}
                  </div>

                  {/* Quantity Input */}
                  <div className="mb-3">
                    <label className="block text-gray-800 text-sm mb-1 font-medium">Количество:</label>
                    <input
                      type="number"
                      min="1"
                      max={parseInt(part.qty || '999999')}
                      value={partQuantities[part.code] || ''}
                      placeholder="0"
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 0;
                        const maxQty = parseInt(part.qty || '999999');
                        if (value > maxQty) {
                          showQuantityWarning(part.code, `Максимальное количество: ${maxQty}`);
                          setPartQuantities(prev => ({ ...prev, [part.code]: maxQty }));
                        } else {
                          setPartQuantities(prev => ({ ...prev, [part.code]: value >= 0 ? value : 0 }));
                        }
                      }}
                      className="w-full px-3 py-2 bg-white border-2 border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500"
                    />

                    {/* Warning Message */}
                    {quantityWarnings[part.code] && (
                      <div className={`mt-2 px-3 py-2 rounded-lg text-sm font-medium animate-pulse ${
                        quantityWarnings[part.code].includes('✓')
                          ? 'bg-green-100 text-green-800 border border-green-300'
                          : quantityWarnings[part.code].includes('Ошибка')
                          ? 'bg-red-100 text-red-800 border border-red-300'
                          : 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                      }`}>
                        {quantityWarnings[part.code]}
                      </div>
                    )}
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => addToCart(part)}
                    disabled={!partQuantities[part.code] || partQuantities[part.code] <= 0}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Добавить в корзину</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {searchTerm && searchResults.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-400 mb-2">Ничего не найдено</h3>
            <p className="text-gray-500">
              Попробуйте изменить поисковый запрос или проверьте правильность кода запчасти
            </p>
          </div>
        )}

        {/* Instructions */}
        {!searchTerm && totalParts > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="bg-[#144374] p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Search className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Поиск по коду</h3>
                <p className="text-gray-800">
                  Введите код запчасти для быстрого поиска
                </p>
              </div>
              <div className="text-center">
                <div className="bg-[#144374] p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Info className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Подробная информация</h3>
                <p className="text-gray-800">
                  Цены, наличие и характеристики
                </p>
              </div>
              <div className="text-center">
                <div className="bg-[#144374] p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <ShoppingCart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Корзина</h3>
                <p className="text-gray-800">
                  Добавьте товары для быстрого заказа
                </p>
              </div>
            </div>

            {/* Payment QR Code Section */}
            <div className="mt-8 border-4 border-[#144374] rounded-2xl overflow-hidden bg-white/95 backdrop-blur-sm shadow-2xl">
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">Удобная оплата</h3>
                <p className="text-gray-800 text-center mb-6">
                  Удобная оплата через DC и Alif для вашего комфорта
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                  <div className="bg-white p-4 rounded-xl shadow-lg">
                    <h4 className="text-lg font-bold text-gray-900 mb-3 text-center">DC</h4>
                    <img
                      src="/QR Dc .jpg"
                      alt="QR код для оплаты DC"
                      className="w-full h-auto"
                      style={{ maxHeight: '300px', objectFit: 'contain' }}
                    />
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-lg">
                    <h4 className="text-lg font-bold text-gray-900 mb-3 text-center">Alif</h4>
                    <img
                      src="/qr_alif_2.jpg"
                      alt="QR код для оплаты Alif"
                      className="w-full h-auto"
                      style={{ maxHeight: '300px', objectFit: 'contain' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Empty Catalog Message - только для админов */}
        {!searchTerm && totalParts === 0 && isAdmin && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-400 mb-2">Каталог пуст</h3>
            <p className="text-gray-500 mb-6">
              Загрузите Excel файлы для заполнения каталога запчастей
            </p>
            <button
              onClick={() => setShowAdminPanel(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <Upload className="w-5 h-5 mr-2 inline" />
              Загрузить Excel файлы
            </button>
          </div>
        )}

        {/* Admin Panel */}
        {showAdminPanel && (
          <AdminPanel
            onCatalogUpdate={(data, fileNames) => {
              loadCatalogFromDatabase();
            }}
            currentCatalogSize={partsData.length}
            showAdminButton={true}
            currentFiles={[]}
            onClose={() => setShowAdminPanel(false)}
          />
        )}

        {/* Empty Catalog Message - для обычных пользователей */}
        {!searchTerm && totalParts === 0 && !isAdmin && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-400 mb-2">Каталог временно недоступен</h3>
            <p className="text-gray-500">
              Каталог запчастей обновляется. Попробуйте позже.
            </p>
          </div>
        )}
      </div>

      {/* Cart Modal */}
      <CartModal
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        items={cartItems}
        onRemoveItem={removeFromCart}
        onClearCart={clearCart}
        onUpdateQuantity={updateCartQuantity}
        selectedCurrency={selectedCurrency}
        exchangeRates={exchangeRates}
      />

      {/* Hidden File Input for Quick Upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls"
        multiple
        onChange={handleFileUpload}
        className="hidden"
      />

    </div>
  );
};