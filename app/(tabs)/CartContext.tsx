
import React, { createContext, useState, useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Modal, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Product {
  ID_Producto: number;  // Campo que corresponde a ID del producto
  Nombre_Producto: string;  // Campo que corresponde al nombre del producto
  Precio: number;  // Campo que corresponde al precio
  Imagen: string;  // Campo que corresponde a la imagen
  ID_Tienda: number;
}

interface CartContextType {
  items: Product[];
  addItem: (item: Product) => void;
  removeItem: (item: Product) => void; // Nueva función para remover un producto
  clearCart: () => void;
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

  // Función para limpiar el carrito al iniciar la aplicación o la pantalla
  const clearCartOnStart = async () => {
    await AsyncStorage.removeItem('cartItems'); // Elimina los productos guardados en el almacenamiento local
    setItems([]); // Limpia el estado del carrito
  };

  // Cargar carrito desde almacenamiento local
  const loadCart = async () => {
    const savedItems = await AsyncStorage.getItem('cartItems');
    if (savedItems) {
      setItems(JSON.parse(savedItems));
    }
  };

  // Guardar carrito en almacenamiento local
  const saveCart = async (cartItems: Product[]) => {
    await AsyncStorage.setItem('cartItems', JSON.stringify(cartItems));
  };

  // Efecto para limpiar el carrito al iniciar
  useEffect(() => {
    clearCartOnStart();  // Limpia el carrito cuando el componente se monta
  }, []);

  // Efecto para cargar el carrito al iniciar
  useEffect(() => {
    loadCart();  // Carga el carrito si hay productos almacenados
  }, []);

  // Efecto para guardar el carrito cuando cambian los items
  useEffect(() => {
    saveCart(items);
  }, [items]);

  // Función para agregar un ítem al carrito
  const addItem = (item: Product) => {
    setItems((prevItems) => [...prevItems, item]);
  };

  // Función para remover un ítem del carrito
  const removeItem = (item: Product) => {
    setItems((prevItems) => prevItems.filter(i => i.ID_Producto !== item.ID_Producto));
  };

  // Función para vaciar el carrito manualmente
  const clearCart = async () => {
    await AsyncStorage.removeItem('cartItems'); // Limpia también el almacenamiento local
    setItems([]);  // Limpia el carrito en el estado local
  };

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

