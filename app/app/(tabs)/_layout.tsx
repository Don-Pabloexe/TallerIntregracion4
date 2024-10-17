
import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { CartProvider } from '../(tabs)/CartContext'; 
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <CartProvider>
      <Tabs
        initialRouteName = "index" // Establece "index" como la pantalla inicial
        
        screenOptions = {{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          
          tabBarStyle: {
            height: 80, 
            paddingBottom: 10,
            paddingTop: 10,
            backgroundColor: '#ffffff', 
            borderTopWidth: 1, 
            borderTopColor: '#ddd', 
          },

          tabBarLabelStyle: {
            fontSize: 14, 
            fontWeight: 'bold', 
            color: '#00C1A5'
          },

        }}
      >
    
        <Tabs.Screen
          name = "home"
          options = {{
            title: 'Home',
            tabBarIcon: ({ color, focused }) => (
              <MaterialCommunityIcons name = {focused ? 'home' : 'home-outline'} size = {30} color = {'#00C1A5'}/>
            ),
          }}
        />

        <Tabs.Screen
          name = "Carrito"
          options = {{
            title: 'Carrito',
            tabBarIcon: ({ color, focused }) => (
              <MaterialCommunityIcons name = {focused ? 'cart' : 'cart-outline'} size = {30} color = {'#00C1A5'}/>
            ),
          }}
        />

        <Tabs.Screen
          name = "HistorialPedidoScreen"
          options = {{
            title: 'Pedidos',
            tabBarIcon: ({ color, focused }) => (
              <MaterialCommunityIcons name = {focused ? 'package-variant' : 'package-variant-closed'} size = {30} color = {'#00C1A5'}/>
            ),
          }}
        />

        <Tabs.Screen
          name = "StoreDetails/[id_tienda]"
          options  ={{
            headerShown: false, // Oculta la barra de navegación para esta pantalla
            tabBarStyle: { display: 'none' }, // Esconde la barra de tabs
          }}
        />

      </Tabs>
    </CartProvider>
  );
}
