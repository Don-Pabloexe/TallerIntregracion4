import React from 'react';
import { View, Text, FlatList, StyleSheet, Button, Alert } from 'react-native';
import { useCart } from '../(tabs)/CartContext';  // Ajustar según la ubicación
import { useRouter } from 'expo-router'; // Importar useRouter para Expo Router

const ConfirmacionPedidoScreen = () => {
  const { items, clearCart } = useCart(); // Accede a los productos del carrito y la función para limpiar el carrito
  const router = useRouter(); // Usar el hook useRouter para navegar

  const handleConfirmarPedido = () => {
    // Aquí puedes realizar cualquier lógica para confirmar el pedido, por ejemplo, una llamada a la API
    Alert.alert("Pedido Confirmado", "Tu pedido ha sido confirmado con éxito.");
    
    // Vaciar el carrito después de confirmar el pedido
    clearCart();

    // Redirigir al usuario a la pantalla de inicio
    router.push('/home'); // Aquí debes colocar la ruta correspondiente a la pantalla de inicio
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirmación de Pedido</Text>
      {items.length === 0 ? (
        <Text style={styles.emptyCartText}>No hay productos en el carrito</Text>
      ) : (
        <>
          <FlatList
            data={items}
            renderItem={({ item }) => (
              <View style={styles.itemContainer}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>${item.price}</Text>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
          />

          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>
              Total: $
              {items.reduce((total, item) => total + item.price, 0).toFixed(2)}
            </Text>
          </View>

          <Button
            title="Confirmar Pedido"
            onPress={handleConfirmarPedido} // Llamada para confirmar el pedido
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emptyCartText: {
    fontSize: 16,
    color: '#888',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#f9f9f9',
    marginVertical: 5,
    borderRadius: 5,
  },
  itemName: {
    fontSize: 18,
  },
  itemPrice: {
    fontSize: 16,
    color: '#333',
  },
  totalContainer: {
    marginTop: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'right',
  },
});

export default ConfirmacionPedidoScreen;
