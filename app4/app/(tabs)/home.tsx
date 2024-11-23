import React, { useEffect, useState } from 'react';
import { View, ScrollView, FlatList, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../(tabs)/CartContext';
import axios from 'axios';

const HomeScreen = () => {
  const [products, setProducts] = useState([]);
  const { addItem } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsResponse = await axios.get('http://192.168.101.6:5000/products');
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
      <Text style={styles.price}>${item.id_tienda}</Text>
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
});

export default HomeScreen;
