import { Image, StyleSheet, View, Text } from 'react-native';
import { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading';
import { HelloWave } from '@/components/HelloWave'; // Asegúrate de que HelloWave sea un componente válido
import { ProductScreen } from './ProductScreen';
import { BrandScreen } from './BrandScreen.tsx';
import { CartProvider } from '@/context/CartContext';
import 'react-native-gesture-handler';
import CartScreen from './CartScreen';

const Stack = createStackNavigator();

export default function HomeScreen() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // Cargar la fuente personalizada
  const loadFonts = async () => {
    await Font.loadAsync({
      'CustomFont': require('./../../assets/fonts/ProtestGuerrilla-Regular.ttf'),
    });
    setFontsLoaded(true);
  };

  useEffect(() => {
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
        <Stack.Navigator initialRouteName="Products">
          <Stack.Screen name="Products" component={ProductScreen} />
          <Stack.Screen name="BrandProducts" component={BrandScreen} />
          <Stack.Screen name="Cart" component={CartScreen} />
        </Stack.Navigator>
    
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  image: {
    width: '100%',
    height: 150,
    resizeMode: 'contain',
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  customText: {
    fontFamily: 'CustomFont', // Fuente personalizada
    fontSize: 18,
    color: '#333',
  },
});
