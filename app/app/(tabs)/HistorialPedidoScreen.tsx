
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const HistorialPedidoScreen = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const id_usuario = await AsyncStorage.getItem('userId'); // Obtén el ID del usuario almacenado
        if (!id_usuario) {
          console.error('No se encontró el id_usuario');
          return;
        }

        const response = await axios.get('http://localhost:5000/historialPedido', {
          params: { id_usuario }, // Envía el id_usuario en los parámetros de la solicitud
        });

        setPedidos(response.data); // Guarda los pedidos en el estado
        setLoading(false); // Detiene el indicador de carga
      } catch (error) {
        console.error('Error al obtener pedidos:', error);
        setLoading(false);
      }
    };

    fetchPedidos(); // Llama a la función al cargar la pantalla
  }, []);

  if (loading) {
    
    return (
      <View style = {styles.loadingContainer}>
        <ActivityIndicator size = "large" color = "#00BFA6" />
      </View>
    );
  }

  return (
    <View style = {styles.container}>

      <Text style={styles.title}>Historial de Pedidos</Text>

      {pedidos.length === 0 ? (
        <Text style={styles.noPedidosText}>No tienes pedidos aún.</Text>
      ) : (

        <FlatList
          data={pedidos}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            
            <View style = {styles.pedidoItem}>
              <Text style = {styles.pedidoText}>Fecha: {item.fecha_pedido}</Text>
              <Text style = {styles.pedidoText}>Total: ${item.precio_total}</Text>
              <Text style = {styles.pedidoText}>Dirección: {item.direccion}</Text>
              <Text style = {styles.pedidoText}>Sector: {item.sector}</Text>
              <Text style = {styles.pedidoText}>Comentarios: {item.comentarios}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F2F2F2',
  },
  
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },

  noPedidosText: {
    fontSize: 18,
    color: '#A6A6A6',
    textAlign: 'center',
    marginTop: 20,
  },

  pedidoItem: {
    backgroundColor: '#00C1A5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
  },

  pedidoText: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: 'bold',
    color: 'white'
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HistorialPedidoScreen;
