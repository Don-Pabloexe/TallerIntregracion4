import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, Image, FlatList } from 'react-native';
import Cart from './Cart';
import ProductItem from './ProductItem';
import { BlurView } from 'expo-blur';
const { width: screenWidth } = Dimensions.get('window');


// Componente para el carrusel horizontal
const HorizontalProductCarousel = ({ products }) => {
  const scrollViewRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      // Avanza al siguiente producto o vuelve al primero si es el último
      const nextIndex = currentIndex === products.length - 1 ? 0 : currentIndex + 1;

      // Desliza al siguiente producto
      scrollViewRef.current?.scrollTo({
        x: nextIndex * screenWidth -30, // Multiplica por el ancho de cada tarjeta
        animated: true,
      });

      setCurrentIndex(nextIndex);
    }, 3000); // Cambia el tiempo en milisegundos según tus preferencias (3 segundos en este caso)

    return () => clearInterval(interval); // Limpia el intervalo cuando el componente se desmonta
  }, [currentIndex, products.length]);

  return (
    
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Marcas</Text>
    <ScrollView
      ref={scrollViewRef}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollViewContainer}
    >
      {products.map((item, index) => (
        <View key={index} style={styles.card}>
          {item.image && (
            <Image source={item.image} style={styles.image} />
          )}
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.price}>{item.price}</Text>
        </View>
      ))}
    </ScrollView>
    </View>
  );
};

// Componente para la lista vertical
const VerticalProductList = ({ products }) => {
  const renderItem = ({ item }) => (
    <View style={styles.verticalCard}>
      {item.image && (
        <Image source={item.image} style={styles.image} />
      )}
      <Text style={styles.title}>{item.name}</Text>
      <Text style={styles.price}>${item.price}</Text>
      <View style={styles.cartButton}>{item.cart}</View>
    </View>
  );

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Más Productos</Text>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2} // Establece el número de columnas
        contentContainerStyle={styles.flatListContainer}
      />
    </View>
  );
};

// Componente principal que muestra ambos
const ProductScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <HorizontalProductCarousel products={products} />
      <VerticalProductList products={otros} />
    </ScrollView>
  );
};

const products = [
  {
    image: require('./../../assets/images/Coca-Cola_logo.jpg'),
    name: 'Coca-Cola',
   
  },
  {
    image: require('./../../assets/images/Evercrisp_logo.webp'),
    name: 'Evercrisp',
    
  },
  {
    image: require('./../../assets/images/logo-Costa.jpg'),
    name: 'Costa',
   
  },
  {
    image: require('./../../assets/images/logo_ccu.png'),
    name: 'CCU',
    
  }
];

const otros = [
  {
    image: require('./../../assets/images/takis.jpeg'),
    name: 'Takis',
    price: 1.20,
    cart: <Cart/>
  },
  {
    image: require('./../../assets/images/ramitas.png'),
    name: 'Ramitas',
    price: 0.80,
    cart: <Cart/>
  },
  {
    image: require('./../../assets/images/coca.jpg'),
    name: 'Coca-Cola',
    price: 1.50,
    cart: <Cart/>
  },
  {
    image: require('./../../assets/images/lays.png'),
    name: 'Lays',
    price: 1.30,
    cart: <Cart/>
  },
  {
    image: require('./../../assets/images/takis.jpeg'),
    name: 'Takis',
    price: 1.20,
    cart: <Cart/>
  },
  {
    image: require('./../../assets/images/ramitas.png'),
    name: 'Ramitas',
    price: 0.80,
    cart: <Cart/>
  },
  {
    image: require('./../../assets/images/coca.jpg'),
    name: 'Coca-Cola',
    price: 1.50,
    cart: <Cart/>
  },
  {
    image: require('./../../assets/images/lays.png'),
    name: 'Lays',
    price: 1.30,
    cart: <Cart/>
  }
];

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0D5B6C',
    padding: 15,
  },
  section: {
    marginVertical:5,
    backgroundColor: '#D1F9FF',
    borderRadius: 15,
    padding: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  scrollViewContainer: {

    paddingHorizontal: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 5,
    marginBottom: 5,
    textAlign: 'center',
    textShadowColor: '#00657D',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,      
    fontFamily: 'CustomFont' 
  },
  card: {
    width: screenWidth -30, // Ajusta el ancho del card al ancho de la pantalla
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  verticalCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    margin: 0.1,
    width: 35,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 5,
  },
  image: {
    marginTop: 20,
    width: 60,
    height: 60,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  price: {
    fontSize: 16,
    color: '#888',
  },
  cartButton: {
    marginTop: 10,
  },
  flatListContainer: {
    paddingVertical: 5,
  },
});

export { ProductScreen, products, otros };
