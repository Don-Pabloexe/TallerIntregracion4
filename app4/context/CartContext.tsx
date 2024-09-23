import React, { createContext, useState, useContext } from 'react';
import { View, Text, TouchableOpacity, FlatList, Modal, StyleSheet, Image } from 'react-native';

interface Product {
  image: any; // O el tipo correspondiente a tu imagen
  name: string;
  price: number;
}
interface CartContextType {
  items: Product[];
  addItem: (item: Product) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<Product[]>([]);

  const addItem = (item: Product) => {
    setItems((prevItems) => [...prevItems, item]);
  };

  return (
    <CartContext.Provider value={{ items, addItem }}>
      {children}
    </CartContext.Provider>
  );
};
