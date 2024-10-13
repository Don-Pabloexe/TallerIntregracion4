import React from 'react';
import { View, Text, FlatList, StyleSheet, Image, Button } from 'react-native';
import { useCart } from '../(tabs)/CartContext';
import { useRouter } from 'expo-router'; // Importamos el hook de router de Expo

const CartScreen = () => {
  const { items } = useCart(); // Accede a los productos del carrito
  const router = useRouter(); // Hook para acceder a las rutas de Expo

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Productos en el Carrito</Text>
      {items.length === 0 ? (
        <Text style={styles.emptyCartText}>El carrito está vacío</Text>
      ) : (
        <>
          <FlatList
            data={items}
            renderItem={({ item }) => (
              <View style={styles.itemContainer}>
                {item.image && (
                  <Image source={item.image} style={styles.image} />
                )}
                <View style={styles.textContainer}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemPrice}>${item.price}</Text>
                </View>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
          <Button
            title="Confirmar Pedido"
            onPress={() => router.push('./ConfirmacionPedidoScreen')} // Usamos el router de Expo para navegar
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
    flex: 1, // Asegura que la pantalla ocupe todo el espacio disponible
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
    padding: 10,
    backgroundColor: '#f9f9f9',
    marginVertical: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemPrice: {
    fontSize: 16,
    color: '#333',
  },
});

export default CartScreen;
