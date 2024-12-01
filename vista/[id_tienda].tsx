import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, Image, Modal, FlatList, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native'; // Importa useRoute
import { useCart } from '../../(tabs)/CartContext'; // Importa el contexto del carrito
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

interface Product {
  ID_Producto: number;
  Nombre_Producto: string;
  Precio: number;
  Imagen: string;
  id_Tienda: number;
}

export default function StoreDetails() {
  const route = useRoute();
  const { id_tienda } = route.params; // Obtén el id_tienda desde los parámetros
  const { addItem } = useCart(); // Desestructura addItem del contexto
  const [storeDetails, setStoreDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchStoreDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/tiendaDatos`, {
          params: { id_tienda },
        });
        setStoreDetails(response.data);
      } catch (err) {
        setError('Error al obtener los detalles de la tienda');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const fetchStoreProducts = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/marcas/${id_tienda}/products`);
        setProducts(response.data);
      } catch (error) {
        Alert.alert('Error', 'Error al obtener los productos de la tienda');
      }
    };

    fetchStoreDetails();
    fetchStoreProducts();
  }, [id_tienda]);

  const renderItem = ({ item }: { item: Product }) => (
    <View style={styles.verticalCard}>
      <TouchableOpacity
        onPress={() => {
          // Si se desea redirigir al detalle del producto, aquí puedes agregar la lógica de navegación
        }}
      >
        <Image source={{ uri: item.imagen }} style={styles.image} />
        <Text style={styles.title}>{item.nombre}</Text>
        <Text style={styles.price}>
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
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#00C1A5" />;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  if (!storeDetails) {
    return <Text>No se encontraron detalles para la tienda.</Text>;
  }

  return (
    <View style={styles.body}>
      <View>
        <Image style={styles.img} source={{ uri: storeDetails.imagen }} />
        <Text style={styles.textoImagen1}>{storeDetails.nombre}</Text>
        <Text style={styles.textoImagen2}>{storeDetails.ubicacion}</Text>
        <Text style={styles.textoImagen3}>{storeDetails.t_categoria}</Text>
      </View>

      <View style={styles.botonesContainer}>
        <TouchableOpacity style={styles.boton1}>
          <Text style={styles.textoboton}>Información</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.boton2}
          onPress={() => {
            setModalVisible(true); // Abrir el modal
          }}
        >
          <Text style={styles.textoboton}>Productos</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.info}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
          <MaterialCommunityIcons style={{ marginRight: 10 }} name={'phone'} color={'#00bfb2'} size={25} />
          <View style={{ marginLeft: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Teléfono</Text>
            <Text style={{ marginTop: 5 }}>+569 {storeDetails.telefono}</Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <MaterialCommunityIcons style={{ marginRight: 10 }} name={'map-marker'} color={'#00bfb2'} size={25} />
          <View style={{ marginLeft: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 10 }}>Dirección</Text>
            <Text style={{ marginTop: 5 }}>{storeDetails.ubicacion}</Text>
          </View>
        </View>
      </View>

      <View style={styles.contactoContainer}>
        <View style={styles.textoContacto}>
          <Text>¿Quieres saber más de nosotros? Escríbenos a nuestro Whatsapp apretando en el icono</Text>
        </View>

        <TouchableOpacity style={styles.iconoWspContainer}>
          <MaterialCommunityIcons style={styles.iconoWsp} name={'whatsapp'} color={'#41c351'} size={45} />
        </TouchableOpacity>
      </View>

      {/* Modal para mostrar los productos */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)} // Cerrar el modal al presionar el botón de "Atrás"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Productos de {storeDetails.nombre}</Text>

            {/* Mostrar la lista de productos */}
            <FlatList
              data={products}
              renderItem={renderItem}
              keyExtractor={(item) => item.ID_Producto ? item.ID_Producto.toString() : 'defaultKey'}
              numColumns={2} // Mostrar los productos en dos columnas
              columnWrapperStyle={styles.columnWrapper} // Separación entre columnas
            />

            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: '#e6e1e1',
  },
  img: {
    width: '100%',
    height: 250,
    opacity: 0.45,
  },
  textoImagen1: {
    fontSize: 20,
    fontWeight: 'bold',
    position: 'absolute',
    bottom: 75,
    left: 15,
  },
  textoImagen2: {
    fontSize: 15,
    fontStyle: 'italic',
    position: 'absolute',
    bottom: 55,
    left: 15,
  },
  textoImagen3: {
    fontSize: 15,
    fontWeight: 'bold',
    position: 'absolute',
    bottom: 35,
    left: 15,
  },
  botonesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 20,
  },
  boton1: {
    backgroundColor: '#00bfb2',
    padding: 15,
    borderRadius: 5,
    flex: 0.48,
  },
  boton2: {
    backgroundColor: '#00bfb2',
    padding: 15,
    borderRadius: 5,
    flex: 0.48,
  },
  textoboton: {
    color: 'white',
    textAlign: 'center',
  },
  info: {
    padding: 20,
  },
  contactoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  textoContacto: {
    width: '80%',
  },
  iconoWspContainer: {
    backgroundColor: 'white',
    borderRadius: 50,
    padding: 10,
  },
  iconoWsp: {
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semitransparente
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: '#00bfb2',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  closeButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  verticalCard: {
    marginBottom: 20,
    marginHorizontal: 10,
    width: '45%',
  },
  image: {
    width: '100%',
    height: 150,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
  price: {
    fontSize: 14,
    marginTop: 5,
    textAlign: 'center',
  },
  cartButton: {
    backgroundColor: '#00bfb2',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
