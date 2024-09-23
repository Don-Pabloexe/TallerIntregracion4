// CartScreen.tsx
import React from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
import { useCart } from '@/context/CartContext';

const CartScreen = () => {
  const { items } = useCart(); // Accede a los productos del carrito

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Productos en el Carrito</Text>
      {items.length === 0 ? (
        <Text style={styles.emptyCartText}>El carrito está vacío</Text>
      ) : (
        <FlatList
          data={items}
          renderItem={({ item }) => (
            <View style={{ padding: 10, backgroundColor: '#f9f9f9', marginVertical: 5, flexDirection: 'row', alignItems: 'center' }}>
              {item.image && (
                <Image source={item.image} style={{ width: 40, height: 40, marginRight: 10 }} />
              )}
              <View>
                <Text>{item.name}</Text>
                <Text>${item.price}</Text>
              </View>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
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
    flexDirection: 'row', // Para alinear la imagen y el texto
    padding: 10,
    backgroundColor: '#f9f9f9',
    marginVertical: 5,
    borderRadius: 5,
    alignItems: 'center', // Centra verticalmente los elementos
  },
  image: {
    width: 50, // Ajusta el ancho de la imagen
    height: 50, // Ajusta la altura de la imagen
    borderRadius: 5, // Esquinas redondeadas para la imagen
    marginRight: 10, // Espacio entre la imagen y el texto
  },
  textContainer: {
    flex: 1, // Ocupa el espacio restante
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

