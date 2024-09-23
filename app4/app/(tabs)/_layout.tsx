import { Tabs } from 'expo-router';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';

export default function Layout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={20} color={color} />,
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Explore',
            tabBarIcon: ({ color }) => <Ionicons name="search-outline" size={20} color={color} />,
          }}
        />
        <Tabs.Screen
          name="register"
          options={{
            title: 'Register',
            tabBarIcon: ({ color }) => <Ionicons name="person-add-outline" size={20} color={color} />,
          }}
        />
        <Tabs.Screen
          name="recuperar"
          options={{
            title: 'Recuperar',
            tabBarIcon: ({ color }) => <Ionicons name="key-outline" size={20} color={color} />,
          }}
        />
        <Tabs.Screen
          name="CartScreen"
          options={{
            title: 'Carro',
            tabBarIcon: ({ color }) => <Ionicons name="cart-outline" size={20} color={color} />,
          }}
        />
      </Tabs>
    </ThemeProvider>
  );
}