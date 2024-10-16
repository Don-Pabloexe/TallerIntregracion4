
import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { CartProvider } from '../(tabs)/CartContext'; // Importa tu CartProvider

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <CartProvider>
      <Tabs
        initialRouteName = "index" // Establece "index" como la pantalla inicial
        
        screenOptions = {{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        }}
      >
        {/* Pantalla de Home (index), aquí la barra de navegación estará habilitada */}
        <Tabs.Screen
          name = "home"
          options = {{
            title: 'Home',
            tabBarStyle: { display: 'flex' }, // Muestra la barra de navegación
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'home' : 'home-outline'} color = {color} />
            ),
          }}
        />

        <Tabs.Screen
          name = "ConfirmacionPedidoScreen"
          options = {{
            title: 'Carrito',
            tabBarStyle: { display: 'flex' }, // Muestra la barra de navegación
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name = {focused ? 'cart' : 'cart-outline'} color={color} />

            ),
          }}
        />

        <Tabs.Screen
          name = "HistorialPedidoScreen"
          options = {{
            title: 'Pedidos',
            tabBarStyle: { display: 'flex' }, // Muestra la barra de navegación
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name = {focused ? 'history' : 'history-outline'} color = {color} />

            ),
          }}
        />

        {/* Pantalla de Registro, aquí la barra de navegación estará deshabilitada */}
        
        {/* Pantalla de Recuperar Contraseña, aquí también estará deshabilitada */}
        
      </Tabs>
    </CartProvider>
  );
}
