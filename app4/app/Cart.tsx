import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Modal, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '@/context/CartContext'; // Asegúrate de que la ruta sea correcta

const Cart = () => {
  const { items, addItem } = useCart(); // Usa el contexto del carrito
  const [modalVisible, setModalVisible] = useState(false);

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={item.image} style={styles.image} /> {/* Muestra la imagen */}
      <Text>{item.name}</Text> {/* Muestra el nombre */}
      <Text>${item.price}</Text> {/* Muestra el precio */}
    </View>
  );

  return (
    <View style={{ padding: 20 }}>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Carrito de Compras</Text>

            <FlatList
              data={items}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
              style={{ marginTop: 20 }}
            />

            
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  addButton: {
    backgroundColor: '#0085A5', // Un color visible y contrastante
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff', // Asegúrate de que el texto sea visible
    fontSize: 16,
  },
  
  cartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#FF6347',
    borderRadius: 20
  },
  itemContainer: {
    padding: 10,
    backgroundColor: '#f9f9f9',
    marginVertical: 5
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  closeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#0085A5',
    borderRadius: 20,
    marginTop: 20,
    alignSelf: 'center'
  },
  image: {
    width: '100%', // O ajusta a un ancho específico
    height: 150, // Altura de la imagen
    resizeMode: 'cover', // Ajusta el modo de la imagen (cover, contain, etc.)
    borderRadius: 10, // Esquinas redondeadas
    marginBottom: 10, // Espacio debajo de la imagen
  },
});

export default Cart;

