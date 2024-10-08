import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, Image, StyleSheet } from 'react-native';

const BrandScreen = ({ route }) => {
  const { brandId } = route.params; // Obtén el ID de la marca desde los parámetros de navegación
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchBrandProducts = async () => {
      try {
        const response = await fetch(`http://192.168.163.9:3000/marcas/${brandId}/products`);
        const textResponse = await response.text(); // Obtener la respuesta como texto
        console.log('Raw response:', textResponse); // Mostrar la respuesta original
        const data = JSON.parse(textResponse); // Intentar convertir a JSON
        setProducts(data);
      } catch (error) {
        console.error('Error fetching brand products:', error);
      }
    };
  
    fetchBrandProducts();
  }, [brandId]);

  const renderItem = ({ item }) => (
    <View style={styles.productCard}>
      <Image source={{ uri: item.imagen }} style={styles.image} />
      <Text style={styles.title}>{item.nombre}</Text>
      <Text style={styles.price}>${item.precio}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  productCard: {
    backgroundColor: '#f8f8f8',
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  price: {
    fontSize: 14,
    color: '#888',
  },
});

export { BrandScreen };
