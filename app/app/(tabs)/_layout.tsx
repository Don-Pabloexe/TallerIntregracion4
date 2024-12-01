
import { Tabs } from 'expo-router';
import React from 'react';

import { MaterialCommunityIcons } from 'react-native-vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions = {{
        headerShown: true,

        tabBarStyle: {
          backgroundColor: '#00bfb2',
          height: 100,
        },

        headerTitleAlign: 'center',

        headerStyle: {
          backgroundColor: '#00bfb2',
        },

        headerTitleStyle: {
          color: 'white',
          fontWeight: 'bold'
        },

        tabBarLabelPosition: 'below-icon'
      }}>

      <Tabs.Screen
        name = "tienda"
        options = {{
          tabBarLabel: 'Tiendas',
          headerTitle: 'Tienda',

          tabBarLabelStyle: {
            color: 'white',
            fontSize: 14,
            fontWeight: 'bold',
            marginBottom: 20
          },

          tabBarIconStyle: {
            marginBottom: -24
          },

          tabBarIcon: ({ color, focused, size }) => (
            <MaterialCommunityIcons name = {focused ? 'shopping' : 'shopping-outline'} color = {'white'} size = {25} />
          ),
        }}
      />
      
      <Tabs.Screen
        name = "producto"
        options = {{
          tabBarLabel: 'Productos',
          headerTitle: 'Productos',

          tabBarLabelStyle: {
            color: 'white',
            fontSize: 14,
            fontWeight: 'bold',
            marginBottom: 20
          },

          tabBarIconStyle: {
            marginBottom: -24
          },

          tabBarIcon: ({ color, focused, size }) => (
            <MaterialCommunityIcons name = {focused ? 'store' : 'store-outline'} color = {'white'} size = {27} />
          ),
        }}

      />
    </Tabs>
  );
}
