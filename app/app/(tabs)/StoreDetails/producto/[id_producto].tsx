
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, Image, FlatList} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ScrollView } from 'react-native-gesture-handler';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import axios from 'axios';

export default function ProductoDetails() {
  const { id_producto } = useLocalSearchParams();
  const [productoDetails, setProductoDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProductoDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/productoDatos`, {
          params: { id_producto },
        });
        setProductoDetails(response.data);
      
      } catch (err) {
        setError('Error al obtener los detalles del producto');
        console.error(err);
      
      } finally {
        setLoading(false);
      }
    };

    fetchProductoDetails();
  }, [id_producto]);

  if (loading) {
    return <ActivityIndicator size = "large" color = "#00C1A5" />;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  if (!ProductoDetails) {
    return <Text>No se encontraron detalles para la tienda.</Text>;
  }

  return (

    <View style = {styles.body}>
          
      <View>

        <View>
          <Image style = {styles.img} source = {productoDetails.imagen}/>

          <Text style = {styles.textoImagen1}>{productoDetails.nombre_producto}</Text>
          <Text style = {styles.textoImagen2}>{productoDetails.categoria}</Text>  
        </View>

        <View style = {styles.botonesContainer}>

          <TouchableOpacity style = {styles.boton1}>
            <Text style = {styles.textoboton}>Información</Text>
          </TouchableOpacity >

          <TouchableOpacity style = {styles.boton2}>
            <Text style = {styles.textoboton}>Ofertas</Text>
          </TouchableOpacity >

          </View>

            <View style = {styles.info}>

              <View style = {{ flexDirection: 'row', alignItems: 'center'}}>
                <MaterialCommunityIcons style = {{ marginRight: 10 }} name = {'information'} color = {'#00bfb2'} size = {25} />
                
                <View style = {{ marginLeft: 10 }}>
                  <Text style = {{ fontSize: 18, fontWeight: 'bold', marginTop: 5 }}>Descripción</Text>
                  <Text style = {{ marginTop: 5 }}>{productoDetails.descripcion}</Text>
                </View>

              </View>

              <View style = {{ flexDirection: 'row', alignItems: 'center'}}>
                <MaterialCommunityIcons style = {{ marginRight: 10, marginTop: 30 }} name = {'weight'} color = {'#00bfb2'} size = {25} />
                
                <View style = {{ marginLeft: 10 }}>
                  <Text style = {{ fontSize: 18, fontWeight: 'bold', marginTop: 25 }}>Peso</Text>
                  <Text style = {{ marginTop: 5 }}>{productoDetails.peso}kg</Text>
                </View>

              </View>

              <View style = {{ flexDirection: 'row', alignItems: 'center'}}>
                <MaterialCommunityIcons style = {{ marginRight: 10, marginTop: 30 }} name = {'numeric'} color = {'#00bfb2'} size = {25} />
                
                <View style = {{ marginLeft: 10 }}>
                  <Text style = {{ fontSize: 18, fontWeight: 'bold', marginTop: 25 }}>Existencias</Text>
                  <Text style = {{ marginTop: 5 }}>{productoDetails.existencias}</Text>
                </View>

              </View>

              <View style = {{ flexDirection: 'row', alignItems: 'center'}}>
                <MaterialCommunityIcons style = {{ marginRight: 10, marginTop: 30 }} name = {'shape'} color = {'#00bfb2'} size = {25} />
                
                <View style = {{ marginLeft: 10 }}>
                  <Text style = {{ fontSize: 18, fontWeight: 'bold', marginTop: 25 }}>Categoria</Text>
                  <Text style = {{ marginTop: 5 }}>{productoDetails.categoria}</Text>
                </View>

              </View>
              

            </View>

          </View>

    </View>
  );
};

const styles = StyleSheet.create({

  body: {
    flex: 1,
    backgroundColor: '#e6e1e1'
  },

  img: {
    flex: 1,
    width: '100%',
    height: 250,
    opacity: 0.45
  },

  textoImagen1: {
    fontSize: 25,
    fontWeight: 'bold',
    position: 'absolute',
    bottom: 45,
    left: 15
  },

  textoImagen2: {
    fontSize: 17,
    fontStyle: 'italic',
    position: 'absolute',
    bottom: 10,
    left: 15
  },

  botonesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30
  },

  boton1: {
    width: '25%',
    height: '100%',
    alignItems: 'center',
    backgroundColor: '#00bfb2',
    borderRadius: 100,
    
    padding: 10,
    marginRight: 20
  },

  boton2: {
    width: '25%',
    height: '100%',
    alignItems: 'center',
    backgroundColor: '#00bfb2',
    borderRadius: 100,

    padding: 10,
  },

  textoboton: {
    color: 'white'
  },

  info: {
    marginTop: '10%',
    marginLeft: 50
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
    width: '30%',
  }

});