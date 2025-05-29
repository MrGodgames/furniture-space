import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart должен использоваться внутри CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [items, setItems] = useState([]);

    // Загружаем корзину из localStorage при инициализации
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart));
            } catch (error) {
                console.error('Ошибка при загрузке корзины:', error);
                localStorage.removeItem('cart');
            }
        }
    }, []);

    // Сохраняем корзину в localStorage при изменении
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(items));
    }, [items]);

    // Добавить товар в корзину
    const addToCart = (product, quantity = 1) => {
        setItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === product.id);
            
            if (existingItem) {
                // Если товар уже есть в корзине, увеличиваем количество
                return prevItems.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                // Если товара нет в корзине, добавляем новый
                return [...prevItems, { ...product, quantity }];
            }
        });
    };

    // Удалить товар из корзины
    const removeFromCart = (productId) => {
        setItems(prevItems => prevItems.filter(item => item.id !== productId));
    };

    // Обновить количество товара
    const updateQuantity = (productId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }

        setItems(prevItems =>
            prevItems.map(item =>
                item.id === productId
                    ? { ...item, quantity }
                    : item
            )
        );
    };

    // Очистить корзину
    const clearCart = () => {
        setItems([]);
    };

    // Получить общее количество товаров
    const getTotalItems = () => {
        return items.reduce((total, item) => total + item.quantity, 0);
    };

    // Получить общую стоимость
    const getTotalPrice = () => {
        return items.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    // Проверить, есть ли товар в корзине
    const isInCart = (productId) => {
        return items.some(item => item.id === productId);
    };

    // Получить количество конкретного товара в корзине
    const getItemQuantity = (productId) => {
        const item = items.find(item => item.id === productId);
        return item ? item.quantity : 0;
    };

    const value = {
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
        isInCart,
        getItemQuantity
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}; 