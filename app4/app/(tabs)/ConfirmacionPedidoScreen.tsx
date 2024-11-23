import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useCart } from '../(tabs)/CartContext';
import { useRouter } from 'expo-router';
import axios from 'axios';

const ConfirmacionPedidoScreen = () => {
  const { items, clearCart } = useCart();
  const router = useRouter();

  // Función para confirmar el pedido
  const handleConfirmarPedido = async () => {
    try {
      const pedido = {
        total: totalConComision,
        idUsuario: 1,
        tienda: items[0].id_tienda,
        direccion: 'Calle Falsa 123',
        idDespacho: 2  // Simula el id de despacho
      };
  
      console.log('Datos que se envían al backend:', pedido);
  
      await axios.post('http://192.168.101.6:5000/confirmarPedido', pedido);
  
      clearCart();
      router.push('/home');
    } catch (error) {
      console.error('Error al confirmar el pedido:', error.response?.data || error);
    }
  };
  

  // Cálculo del total
  const total = items.reduce((total, item) => total + item.Precio, 0);  // Total de productos
  const comisionApp = total * 0.07;  // 7% de comisión
  const totalConComision = total + comisionApp;  // Total con la comisión incluida

  // Renderización de cada producto en el carrito
  const renderItem = ({ item }) => (
    <View style={styles.productItem}>
      <Text style={styles.productText}>{item.Nombre_Producto} - ${item.Precio.toFixed(2)} *{item.id_tienda}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Confirmación de Pedido</Text>

      {/* Lista de productos */}
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />

      {/* Mostrar el total y la comisión */}
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total productos: ${total.toFixed(2)}</Text>
        <Text style={styles.totalText}>Comisión App (7%): ${comisionApp.toFixed(2)}</Text>
        <Text style={styles.totalText}>Total con comisión: ${totalConComision.toFixed(2)}</Text>
      </View>

      {/* Botón para confirmar el pedido */}
      <TouchableOpacity style={styles.payButton} onPress={handleConfirmarPedido}>
        <Text style={styles.payButtonText}>Confirmar Pedido</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#FFF',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  productItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#CCC',
  },
  productText: {
    fontSize: 16,
  },
  totalContainer: {
    marginVertical: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  totalText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
  },
  payButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  payButtonText: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default ConfirmacionPedidoScreen;
