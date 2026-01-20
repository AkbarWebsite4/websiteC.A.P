import React from 'react';
import { X, Trash2, ShoppingCart, FileUp, Download } from 'lucide-react';
import * as XLSX from 'xlsx';

interface CartItem {
  id: string;
  part_code: string;
  part_name: string;
  brand: string;
  price: string;
  quantity: number;
  max_qty?: string;
}

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  selectedCurrency?: 'AED' | 'TJS' | 'USD';
  exchangeRates?: { [key: string]: number };
}

export const CartModal: React.FC<CartModalProps> = ({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onClearCart,
  onUpdateQuantity,
  selectedCurrency = 'AED',
  exchangeRates = { AED: 1, TJS: 2.89, USD: 0.2723 }
}) => {
  if (!isOpen) return null;

  const calculateTotal = (): number => {
    return items.reduce((total, item) => {
      const price = parseFloat(item.price);
      if (!isNaN(price)) {
        const rate = exchangeRates[selectedCurrency] || 1;
        return total + (price * rate * item.quantity);
      }
      return total;
    }, 0);
  };

  const formatPrice = (price: string): string => {
    const numPrice = parseFloat(price);
    if (isNaN(numPrice)) return price;
    const rate = exchangeRates[selectedCurrency] || 1;
    return (numPrice * rate).toFixed(2);
  };

  const handleWhatsAppPayment = () => {
    let message = 'Здравствуйте! Хочу оформить заказ:\n\n';
    items.forEach((item, index) => {
      message += `${index + 1}. ${item.part_name}\n`;
      message += `   Код: ${item.part_code}\n`;
      message += `   Бренд: ${item.brand}\n`;
      message += `   Цена: ${item.price}\n`;
      message += `   Количество: ${item.quantity}\n\n`;
    });
    message += `Общая сумма: ${calculateTotal().toFixed(2)} AED\n\n`;
    message += 'Оплатить через Dc - Alif';

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/971561747182?text=${encodedMessage}`, '_blank');
  };

  const handleExcelRequest = () => {
    const message = `Пожалуйста выберите Excel файл для заказа.`;
    const encodedMessage = encodeURIComponent(message);

    window.open(`https://wa.me/971561747182?text=${encodedMessage}`, '_blank');
  };

  const handleExportToExcel = () => {
    const defaultFileName = `Заказ_${new Date().toLocaleDateString('ru-RU').replace(/\./g, '-')}`;
    const userFileName = prompt('Введите название файла:', defaultFileName);

    if (!userFileName) {
      return;
    }

    const exportData = items.map((item, index) => ({
      '№': index + 1,
      'Артикул': item.part_code,
      'Описание': item.part_name,
      'Количество': item.quantity,
      [`Цена (${selectedCurrency})`]: formatPrice(item.price),
      [`Сумма (${selectedCurrency})`]: (parseFloat(formatPrice(item.price)) * item.quantity).toFixed(2)
    }));

    exportData.push({
      '№': '',
      'Артикул': '',
      'Описание': '',
      'Количество': '',
      [`Цена (${selectedCurrency})`]: 'Общая сумма:',
      [`Сумма (${selectedCurrency})`]: calculateTotal().toFixed(2)
    });

    const ws = XLSX.utils.json_to_sheet(exportData);

    const colWidths = [
      { wch: 5 },
      { wch: 20 },
      { wch: 40 },
      { wch: 12 },
      { wch: 15 },
      { wch: 15 }
    ];
    ws['!cols'] = colWidths;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Заказ');

    const fileName = userFileName.endsWith('.xlsx') ? userFileName : `${userFileName}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col border-2 border-blue-600/30">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <ShoppingCart className="w-6 h-6 text-blue-400" />
            <h2 className="text-2xl font-bold text-white">Корзина</h2>
            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
              {items.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">Корзина пуста</p>
              <p className="text-gray-500 text-sm mt-2">
                Добавьте запчасти в корзину для быстрого доступа
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 hover:border-blue-600/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-lg font-mono text-sm font-semibold">
                          {item.part_code}
                        </span>
                        <span className="text-gray-400 text-sm">{item.brand}</span>
                      </div>
                      <h3 className="text-white font-medium mb-2">{item.part_name}</h3>
                      <div className="flex items-center space-x-4">
                        <span className="text-green-400 font-semibold">
                          {formatPrice(item.price)} {selectedCurrency}
                        </span>
                        <div className="flex items-center space-x-2">
                          <label className="text-gray-500 text-sm">Количество:</label>
                          <input
                            type="number"
                            min="1"
                            max={parseInt(item.max_qty || '999999')}
                            value={item.quantity}
                            onChange={(e) => {
                              const value = parseInt(e.target.value) || 1;
                              const maxQty = parseInt(item.max_qty || '999999');
                              if (value > maxQty) {
                                alert(`Максимальное количество: ${maxQty}`);
                                onUpdateQuantity(item.id, maxQty);
                              } else {
                                onUpdateQuantity(item.id, value >= 1 ? value : 1);
                              }
                            }}
                            className="w-20 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-blue-500"
                          />
                        </div>
                      </div>
                      {item.max_qty && parseInt(item.max_qty) < 999999 && (
                        <p className="text-xs text-gray-400 mt-1">
                          Доступно: {item.max_qty} шт.
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-red-400 hover:text-red-300 transition-colors p-2 hover:bg-red-600/10 rounded-lg"
                      title="Удалить из корзины"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t border-gray-700 space-y-4">
            <div className="flex items-center justify-between bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <span className="text-gray-300 text-lg font-semibold">Общая сумма:</span>
              <span className="text-green-400 text-2xl font-bold">
                {calculateTotal().toFixed(2)} {selectedCurrency}
              </span>
            </div>

            <button
              onClick={handleExportToExcel}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
            >
              <Download className="w-5 h-5" />
              <span>Скачать Excel</span>
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                onClick={handleExcelRequest}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
              >
                <FileUp className="w-5 h-5" />
                <span>Запрос через Excel</span>
              </button>

              <button
                onClick={onClearCart}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
              >
                <Trash2 className="w-5 h-5" />
                <span>Очистить корзину</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
