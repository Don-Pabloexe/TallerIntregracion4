
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native';
import { useCart } from '../(tabs)/CartContext';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';  
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importa AsyncStorage

const ConfirmacionPedidoScreen = () => {
  const { items, clearCart } = useCart();  
  const router = useRouter();
  
  // Estado para manejar el modal y los datos del formulario
  const [isModalVisible, setModalVisible] = useState(false);
  const [direccion, setDireccion] = useState('');
  const [sector, setSector] = useState('');
  const [comentario, setComentario] = useState('');
  const [error, setError] = useState(''); // Estado para mostrar errores
  const [userId, setUserId] = useState(null); // Estado para almacenar el ID del usuario

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const id = await AsyncStorage.getItem('userId'); // Recupera el ID del usuario
        if (id) {
          setUserId(id); // Almacena el ID en el estado
        } else {
          console.log('No se encontró el ID de usuario.');
        }
      } catch (error) {
        console.error('Error al obtener el ID de usuario:', error);
      }
    };

    fetchUserId();
  }, []);

  const handleConfirmarPedido = async () => {
    // Validación simple
    if (!direccion || !sector) {
      setError('Por favor, completa todos los campos obligatorios.');
      return;
    }
    
    try {
      const pedido = {
        total: totalConComision,
        idUsuario: userId, // Utiliza el ID del usuario recuperado
        tienda: items[0]?.ID_Tienda,
        direccion: direccion,
        sector: sector,
        comentario: comentario
      };

      await axios.post('http://localhost:5000/confirmarPedido', pedido);
      clearCart();
      setModalVisible(false); // Cerrar el modal solo después de que se confirme el pedido
      router.push('/home');
    } catch (error) {
      console.error('Error al confirmar el pedido:', error);
      setError('Hubo un problema al confirmar el pedido. Intenta de nuevo.');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.productItem}>
      <Image style={styles.productImage} source={{ uri: item.Imagen || 'https://via.placeholder.com/50' }} />
      <View style={styles.productDetails}>
        <Text style={styles.productName}>{item.Nombre_Producto}</Text>
        <Text style={styles.productStore}>Tienda #{item.ID_Tienda}</Text>
      </View>
      <Text style={styles.productPrice}>
        {item.Precio !== undefined && item.Precio !== null && !isNaN(Number(item.Precio)) 
          ? `$${Number(item.Precio).toFixed(2)}`
          : 'Precio no disponible'}
      </Text>
    </View>
  );

  const total = items.reduce((total, item) => total + item.Precio, 0);
  const comisionApp = total * 0.07; 
  const totalConComision = total + comisionApp; 

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="arrow-back-outline" size={24} color="#fff" onPress={() => router.back()} />
        <Text style={styles.headerText}>Carro</Text>
        <Ionicons name="menu-outline" size={28} color="#fff" />
      </View>

      <View style={styles.subheader}>
        <Text style={styles.subheaderText}>{items.length} Productos</Text>
      </View>

      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.list}
      />

      <View style={styles.totalContainer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalText}>Comisión App</Text>
          <Text style={styles.totalText}>+ 7% (${comisionApp.toFixed(2)})</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalTextBold}>Total</Text>
          <Text style={styles.totalTextBold}>${totalConComision.toFixed(2)}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.payButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.payButtonText}>Pagar</Text>
      </TouchableOpacity>

      {/* Modal para ingresar dirección */}
      <Modal isVisible={isModalVisible} onBackdropPress={() => setModalVisible(false)}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Ingresa tu Dirección</Text>
          
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TextInput
            style={styles.input}
            placeholder="Dirección"
            value={direccion}
            onChangeText={setDireccion}
          />

          <TextInput
            style={styles.input}
            placeholder="Sector"
            value={sector}
            onChangeText={setSector}
          />

          <TextInput
            style={styles.input}
            placeholder="Comentarios"
            value={comentario}
            onChangeText={setComentario}
          />
          
          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmarPedido}>
            <Text style={styles.confirmButtonText}>Confirmar Pedido</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#00C1A5',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },

  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },

  subheader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },

  subheaderText: {
    fontSize: 14,
    color: '#333',
  },

  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },

  productImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
  },

  productDetails: {
    flex: 1,
    paddingHorizontal: 10,
  },

  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },

  productStore: {
    fontSize: 14,
    color: '#888',
  },

  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },

  totalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 10,
    marginHorizontal: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },

  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },

  totalText: {
    fontSize: 16,
    color: '#666',
  },

  totalTextBold: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },

  payButton: {
    backgroundColor: '#00C1A5',
    paddingVertical: 15,
    borderRadius: 10,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  payButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },

  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },

  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },

  confirmButton: {
    backgroundColor: '#00C1A5',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },

  confirmButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default ConfirmacionPedidoScreen;
