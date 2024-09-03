import { Tabs } from 'expo-router';
import React from 'react';

import { MaterialCommunityIcons } from 'react-native-vector-icons';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions = {{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,

        tabBarStyle: {
          backgroundColor: '#01bfb3',
          height: 100,
        },

        tabBarLabelPosition: 'below-icon'
      }}>

      <Tabs.Screen
        name = "index"
        options = {{
          tabBarLabel: 'Tiendas',

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
        name = "explore"
        options = {{
          tabBarLabel: 'Productos',

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
