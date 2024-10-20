import React, { useEffect, useState, useRef } from 'react';
import { View, ScrollView, FlatList, Text, Image, StyleSheet, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '../(tabs)/CartContext';
import axios from 'axios';

const screenWidth = Dimensions.get('window').width;

const HomeScreen = () => {
  const [products, setProducts] = useState([]);
  const { addItem } = useCart();

  // Componente del carrusel horizontal de productos
  const HorizontalProductCarousel = ({ products }) => {
    const scrollViewRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigation = useNavigation();

    useEffect(() => {
      const interval = setInterval(() => {
        // Avanza al siguiente producto o vuelve al primero si es el último
        const nextIndex = currentIndex === products.length - 1 ? 0 : currentIndex + 1;

        // Desliza al siguiente producto
        scrollViewRef.current?.scrollTo({
          x: nextIndex * screenWidth, // Multiplica por el ancho de cada tarjeta
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
            <TouchableOpacity
              key={index}
              style={styles.card}
              onPress={() => {
                // Navega a la pantalla de productos de la marca específica
                navigation.navigate('BrandProducts', { brandId: item.id });
              }}
            >
              {item.imagen && (
                <Image source={{ uri: item.imagen }} style={styles.image} />
              )}
              <Text style={styles.title}>{item.nombre}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsResponse = await axios.get('http://192.168.229.9:5000/products');
        const productsData = productsResponse.data;
        setProducts(productsData);
      } catch (error) {
        console.error('Error al obtener los productos:', error);
        Alert.alert("Error", "Error al obtener los productos.");
      }
    };

    fetchProducts();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.productCard}>
      <Image source={{ uri: item.imagen }} style={styles.image} />
      <Text style={styles.title}>{item.nombre}</Text>
      <Text style={styles.price}>${item.precio}</Text>
      <Text style={styles.price}>Tienda: {item.id_tienda}</Text>
      <TouchableOpacity
        onPress={() => {
          addItem({
            ID_Producto: item.id,
            Nombre_Producto: item.nombre,
            Precio: Number(item.precio),
            Imagen: item.imagen,
            id_tienda: item.id_tienda,
          });
        }}
        style={styles.cartButton}
      >
        <Ionicons name="add-circle-outline" size={20} color="#fff" />
        <Text style={styles.cartButtonText}>Agregar al Carrito</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Añadimos el carrusel horizontal aquí */}
      <HorizontalProductCarousel products={products} />
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.flatListContainer}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0D5B6C',
    padding: 15,
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
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
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  price: {
    fontSize: 16,
    color: '#888',
  },
  cartButton: {
    backgroundColor: '#0085A5',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
    flexDirection: 'row',
  },
  cartButtonText: {
    color: '#fff',
    marginLeft: 5,
    fontSize: 16,
  },
  flatListContainer: {
    paddingVertical: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  scrollViewContainer: {
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginRight: 10,
    width: screenWidth * 0.8, // Ajustar el tamaño de la tarjeta al 80% del ancho de la pantalla
    alignItems: 'center',
  },
});

export default HomeScreen;
