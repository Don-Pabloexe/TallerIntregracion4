import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useCart } from '../(tabs)/CartContext';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const ConfirmacionPedidoScreen = () => {
  const { items, clearCart } = useCart();
  const router = useRouter();

  const handleConfirmarPedido = () => {
    clearCart();
    router.push('/home');
  };

  const renderItem = ({ item }) => (
    <View style={styles.productItem}>
      <Image style={styles.productImage} source={{ uri: item.image || 'https://via.placeholder.com/50' }} />
      <View style={styles.productDetails}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productStore}>Mall Chino Deluxe</Text> {/* Placeholder for store name */}
      </View>
      <Text style={styles.productPrice}>${item.price}</Text>
      
    </View>
    
  );

  const total = items.reduce((total, item) => total + item.price, 0);
  console.log(items.precio);
  const comisionApp = total * 0.07; // 7% comisión
  const totalConComision = total + comisionApp;
  


  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="arrow-back-outline" size={24} color="#fff" />
        <Text style={styles.headerText}>Carro</Text>
        <Ionicons name="menu-outline" size={28} color="#fff" />
      </View>

      {/* Subheader */}
      <View style={styles.subheader}>
        <Text style={styles.subheaderText}>{items.length} Productos</Text>
        <Text style={styles.subheaderText}>1 Tienda</Text>
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
