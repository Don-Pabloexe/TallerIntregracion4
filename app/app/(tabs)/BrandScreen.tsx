import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, Image, StyleSheet, Alert } from 'react-native';
import axios from "axios"; // Importa axios para hacer peticiones HTTP

// Define el tipo de los parámetros que estás esperando en la navegación
interface RouteParams {
  brandId: string;
}

// Define los tipos de props que recibe el componente
interface BrandScreenProps {
  route: { params: RouteParams };
}

// Define el tipo de los productos
interface Product {
  ID_Producto: number;  // El id del producto
  Nombre_Producto: string;  // El nombre del producto
  Precio: number;  // El precio del producto
  Imagen: string;  // La URL o path de la imagen del producto
  id_Tienda: number;
}

const BrandScreen: React.FC<BrandScreenProps> = ({ route }) => {
  const { brandId } = route.params; // Obtén el ID de la tienda desde los parámetros de navegación
  const [products, setProducts] = useState<Product[]>([]); // Define que products es un array de Product

  useEffect(() => {
    const fetchBrandProducts = async () => {
      try {
        // Hacer la solicitud GET al servidor para obtener los productos de una tienda específica
        const response = await axios.get(`http://localhost:5000/marcas/${brandId}/products`);
  
        // Manejar la respuesta
        const data: Product[] = response.data; // Define los datos como un array de Product
        setProducts(data); // Actualizar el estado con los productos
  
        console.log("Productos obtenidos:", data); // Mostrar los datos en la consola para ver lo que se recibió
  
      } catch (error: any) {  // Añadir `: any` para manejar el error en TypeScript
        console.error('Error al obtener los productos de la tienda:', error);
        const errorMessage = error.response?.data?.message || "Error al obtener los productos de la tienda";
        Alert.alert("Error", errorMessage);  // Usamos Alert para mostrar el mensaje de error
      }
    };
  
    fetchBrandProducts(); // Llama a la función para obtener los productos
  }, [brandId]); // El useEffect se ejecutará cuando cambie el brandId
  
  const renderItem = ({ item }: { item: Product }) => (
    <View style={styles.productCard}>
      <Image source={{ uri: item.Imagen }} style={styles.image} />
      <Text style={styles.title}>{item.Nombre_Producto}</Text>
      <Text style={styles.price}>${item.Precio}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.ID_Producto.toString()}  
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
