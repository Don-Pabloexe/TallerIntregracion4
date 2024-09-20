import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Cart = () => {
  const addItem = (item: string) => {
    // Lógica para agregar el item
    console.log('Item agregado:', item);
  };

  return (
    <View>
      <TouchableOpacity 
        onPress={() => addItem('')} 
        style={{
          flexDirection: 'row', 
          alignItems: 'center', 
          padding: 10, 
          backgroundColor: '#0085A5', // Puedes personalizar el color
          borderRadius: 20
        }}
      >
        <Ionicons name="cart-outline" size={24} color="white" />
        <Text style={{ color: 'white', marginLeft: 10 }}>Agregar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Cart;
