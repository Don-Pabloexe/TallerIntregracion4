import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useCart } from '../(tabs)/CartContext';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';  // Si necesitas hacer peticiones al backend
import ErrorBoundary from './ErrorBoundary';

const ConfirmacionPedidoScreen = () => {
  const { items, clearCart } = useCart();  // Obtener los productos en el carrito y la función para limpiarlo
  const router = useRouter();

  // Función para confirmar el pedido
  const handleConfirmarPedido = async () => {
    try {
      // Prepara los datos del pedido
      const pedido = {
        total: totalConComision,  // El total del pedido
        idUsuario: 1,  // Ejemplo, deberías obtenerlo del estado global o sesión
        tienda: items[0]?.ID_Tienda,  // Suponiendo que todos los productos provienen de una misma tienda
        direccion: 'Calle Falsa 123'  // Deberías obtener la dirección del usuario
      };
  
      // Enviar la solicitud POST al servidor para registrar el pedido
      await axios.post('http://localhost:5000/confirmarPedido', pedido);
  
      // Limpiar el carrito después de confirmar el pedido
      clearCart();
  
      // Redirigir al usuario al Home
      router.push('/home');
    } catch (error) {
      console.error('Error al confirmar el pedido:', error);
    }
  };
  
  
  // Renderizado de cada producto en el carrito
  const renderItem = ({ item }) => (
    <View style={styles.productItem}>
      <Image style={styles.productImage} source={{ uri: item.Imagen || 'https://via.placeholder.com/50' }} />
      <View style={styles.productDetails}>
        <Text style={styles.productName}>{item.Nombre_Producto}</Text>
        <Text style={styles.productStore}>Tienda #{item.ID_Tienda}</Text> {/* Mostrar el ID o nombre de la tienda */}
      </View>
      <Text style={styles.productPrice}>
        {item.Precio !== undefined && item.Precio !== null && !isNaN(Number(item.Precio)) 
          ? `$${Number(item.Precio).toFixed(2)}`
          : 'Precio no disponible'}
      </Text>
    </View>
  );

  // Calcular el total del pedido
  const total = items.reduce((total, item) => total + item.Precio, 0); // Calcula el total basado en `Precio`
  const comisionApp = total * 0.07; // 7% comisión
  const totalConComision = total + comisionApp; // Total con comisión

  return (
    <ErrorBoundary>  {/* Aquí envolvemos con ErrorBoundary */}
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="arrow-back-outline" size={24} color="#fff" onPress={() => router.back()} />
          <Text style={styles.headerText}>Carro</Text>
          <Ionicons name="menu-outline" size={28} color="#fff" />
        </View>

        {/* Subheader */}
        <View style={styles.subheader}>
          <Text style={styles.subheaderText}>{items.length} Productos</Text>
          <Text style={styles.subheaderText}>1 Tienda</Text> {/* Ajusta si manejas múltiples tiendas */}
        </View>

        {/* Lista de productos */}
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.list}
        />

        {/* Total y comisión */}
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

        {/* Botón de pago */}
        <TouchableOpacity style={styles.payButton} onPress={handleConfirmarPedido}>
          <Text style={styles.payButtonText}>Pagar</Text>
        </TouchableOpacity>
        
      </View>
    </ErrorBoundary>
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
});

export default ConfirmacionPedidoScreen;
