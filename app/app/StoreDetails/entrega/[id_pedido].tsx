
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, Image, FlatList} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ScrollView } from 'react-native-gesture-handler';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import axios from 'axios';

export default function pedidoDetails() {
  const { id_pedido } = useLocalSearchParams();
  const [pedidoDetails, setpedidoDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchpedidoDetails = async () => {
      try {
        const response = await axios.get(`http://192.168.101.6:5000/DatosEntregaPedido`, {
          params: { id_pedido },
        });
        setpedidoDetails(response.data);
      
      } catch (err) {
        setError('Error al obtener los detalles del producto');
        console.error(err);
      
      } finally {
        setLoading(false);
      }
    };

    fetchpedidoDetails();
  }, [id_pedido]);

  if (loading) {
    return <ActivityIndicator size = "large" color = "#00C1A5" />;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  if (!pedidoDetails) {
    return <Text>No se encontraron detalles para la tienda.</Text>;
  }

  return (

    <View style = {styles.body}>
          
      <View>

        <View style = {styles.info}>

          <View style = {{ flexDirection: 'row', alignItems: 'center'}}>
            <MaterialCommunityIcons style = {{ marginRight: 38 }} name = {'account'} color = {'#00bfb2'} size = {50} />
                
            <View style = {{ marginLeft: 10 }}>
              <Text style = {{ fontSize: 18, fontWeight: 'bold', marginTop: 5 }}>Nombre del Receptor</Text>
              <Text style = {{ marginTop: 15, fontStyle: 'italic' }}>{pedidoDetails.nombre_receptor}</Text>
            </View>

          </View>

          <View style = {{ flexDirection: 'row', alignItems: 'center', marginTop: 35}}>
            <MaterialCommunityIcons style = {{ marginRight: 38 }} name = {'card-account-details'} color = {'#00bfb2'} size = {50} />
                
            <View style = {{ marginLeft: 10 }}>
              <Text style = {{ fontSize: 18, fontWeight: 'bold', marginTop: 5 }}>Rut del Receptor</Text>
              <Text style = {{ marginTop: 15, fontStyle: 'italic' }}>{pedidoDetails.rut_receptor}</Text>
            </View>

          </View>

          <View style = {{ flexDirection: 'row', alignItems: 'center', marginTop: 35}}>
            <MaterialCommunityIcons style = {{ marginRight: 38 }} name = {'shopping'} color = {'#00bfb2'} size = {50} />
                
            <View style = {{ marginLeft: 10 }}>
              <Text style = {{ fontSize: 18, fontWeight: 'bold', marginTop: 5 }}>Numero de Pedido</Text>
              <Text style = {{ marginTop: 15, fontStyle: 'italic' }}>{pedidoDetails.id_pedido}</Text>
            </View>

          </View>

        </View>

          <Text style = {{ marginTop: 30, textAlign: 'center' }}>
            El pedido fue entregado con éxito a las{' '} 
            <Text style = {{ fontWeight: 'bold' }}>{pedidoDetails.hora_pedido}</Text>
            <Text>{'\n'}el día{' '}</Text><Text style = {{ fontWeight: 'bold' }}>{pedidoDetails.fecha_pedido}</Text>
          </Text>
      
      </View>
    </View>
  );
};

const styles = StyleSheet.create({

  body: {
    flex: 1,
    backgroundColor: '#e6e1e1'
  },

  botonesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30
  },

  textoboton: {
    color: 'white'
  },

  info: {
    marginTop: '40%',
    alignSelf: 'center'
  },

  contactoContainer: {
    flexDirection: 'row',
    marginLeft: 50,
    marginTop: 120,
  },

  textoContacto: {
    width: '45%'
  },

  iconoWspContainer: {
    alignSelf: 'center',
    marginLeft: 10
  },

  iconoWsp: {
    width: '100%',
  }

});