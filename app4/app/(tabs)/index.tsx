import { Image, StyleSheet, Platform, View, Text } from 'react-native';
import { useState, useEffect } from 'react';
import { AppRegistry } from 'react-native';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ProductScreen} from './ProductScreen';
import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading';
import Cart from '../Cart';
import { CartProvider } from '@/context/CartContext';

const Stack = createStackNavigator();

export default function HomeScreen() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // Cargar la fuente personalizada
  const loadFonts = async () => {
    await Font.loadAsync({
      'CustomFont': require('./../../assets/fonts/ProtestGuerrilla-Regular.ttf'), // Cambia por el nombre de tu fuente
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
    
     <ProductScreen />
     
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
