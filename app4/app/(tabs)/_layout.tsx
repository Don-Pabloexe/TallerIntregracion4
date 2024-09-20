import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
    screenOptions={{
      tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
      headerShown: false,
    }}>
    <Tabs.Screen
      name="index"
      options={{
        title: 'Home',
        tabBarIcon: ({ color, focused }) => (
          <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
        ),
      }}
    />
    <Tabs.Screen
      name="explore"
      options={{
        title: 'Explore',
        tabBarIcon: ({ color, focused }) => (
          <Ionicons name={focused ? 'planet' : 'planet-outline'} size={24} color={color} />
        ),
      }}
    />
    <Tabs.Screen
      name="register"
      options={{
        title: 'Register',
        tabBarIcon: ({ color, focused }) => (
          <Ionicons name={focused ? 'person-add' : 'person-add-outline'} size={24} color={color} />
        ),
      }}
    />
    <Tabs.Screen
      name="recuperar"
      options={{
        title: 'Recuperar',
        tabBarIcon: ({ color, focused }) => (
          <Ionicons name={focused ? 'refresh' : 'refresh-outline'} size={24} color={color} />
        ),
      }}
    />
    <Tabs.Screen
      name="Cart"
      options={{
        title: 'Carro',
        tabBarIcon: ({ color, focused }) => (
          <Ionicons name={focused ? 'cart' : 'cart-outline'} size={24} color={color} />
        ),
      }}
    />
  </Tabs>
    
  );
}
