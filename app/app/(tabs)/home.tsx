import React, { useEffect, useState, useRef } from 'react';
import { View, ScrollView, FlatList, Text, Image, StyleSheet, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../(tabs)/CartContext';
import { useRouter } from 'expo-router';
import axios from "axios"; 

interface Product {
  id: number;  // El id del producto
  nombre: string;  // El nombre del producto
  precio: number;  // El precio del producto
  imagen: string;
  id_tienda: number;
}

interface Marca {
  id: number;
  nombre: string;
  imagen: string;
}

const { width: screenWidth } = Dimensions.get('window');

// Componente para el carrusel horizontal (Marcas)
const HorizontalBrandCarousel: React.FC<{ marcas: Marca[] }> = ({ marcas }) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = currentIndex === marcas.length - 1 ? 0 : currentIndex + 1;
      scrollViewRef.current?.scrollTo({
        x: nextIndex * screenWidth - 30,
        animated: true,
      });
      setCurrentIndex(nextIndex);
    }, 3000);
    return () => clearInterval(interval);
  }, [currentIndex, marcas.length]);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Tiendas</Text>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContainer}
      >
        {marcas.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            onPress={() => {
              router.push(`./BrandProducts/${item.id}`);
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

// Componente para la lista vertical de productos
const VerticalProductList: React.FC<{ products: Product[] }> = ({ products }) => {
  const { addItem } = useCart();

  const renderItem = ({ item }: { item: Product }) => (
    <View style={styles.verticalCard}>
      <Image source={{ uri: item.imagen }} style={styles.image} />
      <Text style={styles.title}>{item.nombre}</Text>
      <Text style={styles.price}>
        {/* Asegúrate de que `precio` sea convertido a número antes de usar `toFixed` */}
        {item.precio !== undefined && item.precio !== null && !isNaN(Number(item.precio))
          ? `$${Number(item.precio).toFixed(2)}`
          : 'Precio no disponible'}
      </Text>
      <TouchableOpacity
        onPress={() => {
          addItem({
            ID_Producto: item.id,
            Nombre_Producto: item.nombre,
            Precio: Number(item.precio),  // Asegúrate de convertir el precio
            Imagen: item.imagen,
            ID_Tienda: item.id_tienda,

          });
        }}
        style={styles.cartButton}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="add-circle-outline" size={20} color="#fff" />
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

// Componente principal
export default function HomeScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [marcas, setMarcas] = useState<Marca[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const marcasResponse = await axios.get('http://localhost:5000/marcas');
        const marcasData: Marca[] = marcasResponse.data;
        setMarcas(marcasData);

        const productsResponse = await axios.get('http://localhost:5000/products');
        const productsData = productsResponse.data;
        console.log("Datos de productos:", productsData);  // Verifica qué datos están llegando
        setProducts(productsData);

        console.log("Productos y tiendas obtenidos:", { productsData, marcasData });
      } catch (error: any) {
        console.error('Error al obtener los productos o tiendas:', error);
        Alert.alert("Error", error.response?.data?.message || "Error al obtener los productos o tiendas");
      }
    };

    fetchData();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <HorizontalBrandCarousel marcas={marcas} />  {/* Muestra las tiendas */}
      <VerticalProductList products={products} />  {/* Muestra los productos */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0D5B6C',
    padding: 15,
  },
  section: {
    marginVertical: 5,
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
  },
  card: {
    width: screenWidth - 30,
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
    backgroundColor: '#0085A5',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  flatListContainer: {
    paddingVertical: 5,
  },
});
