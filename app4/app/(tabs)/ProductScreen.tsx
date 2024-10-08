import React, { useEffect, useState, useRef } from 'react';
import { View, ScrollView, FlatList, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '@/context/CartContext';

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
      {item.imagen && (
        <Image source={{ uri: item.imagen }} style={styles.image} />
      )}
      {/* Asegúrate de envolver los nombres y precios dentro de <Text> */}
      <Text style={styles.title}>{item.nombre}</Text>
      <Text style={styles.price}>${item.precio}</Text>
    </View>
  ))}
</ScrollView>

      </View>
    );
  };

// Componente para la lista vertical
const VerticalProductList = ({ products }) => {
  const { addItem } = useCart();

  const renderItem = ({ item }) => (
    <View style={styles.verticalCard}>
      <Image source={{ uri: item.imagen }} style={styles.image} />
      {/* Asegúrate de envolver los nombres y precios dentro de <Text> */}
      <Text style={styles.title}>{item.nombre}</Text>
      <Text style={styles.price}>${item.precio}</Text>
      <TouchableOpacity
        onPress={() => addItem({ image: item.imagen, name: item.nombre, price: item.precio })}
        style={styles.cartButton}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="add-circle-outline" size={20} color="#fff" />
          {/* El texto dentro de un botón debe estar dentro de <Text> */}
          <Text style={{ color: '#fff', marginLeft: 5 }}>Agregar</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
  

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Más Productos</Text>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        contentContainerStyle={styles.flatListContainer}
      />
    </View>
  );
};

const ProductScreen = () => {
  const [products, setProducts] = useState([]);
  const [otros, setOtros] = useState([]);

  useEffect(() => {
    // Función para obtener productos desde el backend
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://192.168.163.9:3000/products');
        const data = await response.json();
        setProducts(data);
        setOtros(data); // Puedes ajustar esto según el tipo de productos
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <HorizontalProductCarousel products={products} />
      <VerticalProductList products={otros} />
    </ScrollView>
  );
};

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
      backgroundColor: '#0085A5', // Color de fondo para hacer el botón más visible
      padding: 10,
      borderRadius: 5,
      marginTop: 10,
      alignItems: 'center',
    },
    flatListContainer: {
      paddingVertical: 5,
    },
  });

export { ProductScreen };
