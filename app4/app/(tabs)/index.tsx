import React, { useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View, Text, ScrollView, Animated } from 'react-native';
import { HelloWave } from '@/components/HelloWave';
import { ThemedText } from '@/components/ThemedText';

interface CategoryButtonProps {
  label: string;
}

const categories = [
  'Regalos y más',
  'Comida',
  'Mercados',
  'Lo que sea',
  'Algo Dulce',
  'Farmacia',
  'Recoger o Enviar'
];

const CategoryButton: React.FC<CategoryButtonProps> = ({ label }) => {
  const [scale, setScale] = useState(new Animated.Value(1));

  const onPressIn = () => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      friction: 3,
      tension: 100
    }).start();
  };

  return (
    <Animated.View style={[styles.button, { transform: [{ scale }] }]}>
      <TouchableOpacity onPressIn={onPressIn} onPressOut={onPressOut}>
        <Text style={styles.buttonText}>{label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <Image
        source={require('@/assets/images/partial-react-logo.png')}
        style={styles.headerImage}
      />
      <View style={styles.welcomeContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </View>
      <View style={styles.categoriesContainer}>
        {categories.map((category, index) => (
          <CategoryButton key={index} label={category} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  headerImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  welcomeContainer: {
    alignItems: 'center',
    padding: 20,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    padding: 20,
  },
  button: {
    backgroundColor: 'skyblue',
    borderRadius: 50,
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    elevation: 5,  // Sombra para Android
    shadowColor: '#000', // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
  }
});
