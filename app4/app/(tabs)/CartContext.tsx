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
  clearCart: () => void; // Añadimos la función clearCart al contexto
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

  // Función para agregar un ítem al carrito
  const addItem = (item: Product) => {
    setItems((prevItems) => [...prevItems, item]);
  };

  // Función para vaciar el carrito
  const clearCart = () => {
    setItems([]);  // Establece el carrito como un arreglo vacío
  };

  return (
    <CartContext.Provider value={{ items, addItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
