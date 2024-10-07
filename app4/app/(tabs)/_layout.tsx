import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      initialRouteName="index" // Establece "explore" como la pantalla inicial
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false, // Oculta el header (barra de navegación superior)
        tabBarStyle: { display: 'none' }, // Oculta la barra de pestañas si lo deseas
      }}>
     
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="register"
        options={{
          title: 'Register',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'person-add' : 'person-add-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="recuperar"
        options={{
          title: 'Recuperar',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'person-add' : 'person-add-outline'} color={color} />
          ),
        }}
      />
    </Tabs>

<Tabs.Screen
name="Profile"
component={UserProfile}
options={{
  title: 'Perfil',
  tabBarIcon: ({ color, focused }) => (
    <TabBarIcon name={focused ? 'ios-person' : 'ios-person-outline'} color={color} />
  ),
}}
/>

  );
  
}
