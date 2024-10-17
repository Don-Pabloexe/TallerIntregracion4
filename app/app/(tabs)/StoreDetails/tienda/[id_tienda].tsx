
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, Image} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ScrollView } from 'react-native-gesture-handler';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import axios from 'axios';

export default function StoreDetails() {
  const { id_tienda } = useLocalSearchParams();
  const [storeDetails, setStoreDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStoreDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/tiendaDatos`, {
          params: { id_tienda },
        });
        setStoreDetails(response.data);
      } catch (err) {
        setError('Error al obtener los detalles de la tienda');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStoreDetails();
  }, [id_tienda]);

  if (loading) {
    return <ActivityIndicator size = "large" color = "#00C1A5" />;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  if (!storeDetails) {
    return <Text>No se encontraron detalles para la tienda.</Text>;
  }

  return (

    <View style = {styles.body}>

          <View>

            <View>
              <Image style = {styles.img} source = {storeDetails.imagen}/>
              
              <Text style = {styles.textoImagen1}>{storeDetails.nombre}</Text>
              <Text style = {styles.textoImagen2}>{storeDetails.ubicacion}</Text>
              <Text style = {styles.textoImagen3}>{storeDetails.t_categoria}</Text>  
            </View>

            <View style = {styles.botonesContainer}>

              <TouchableOpacity style = {styles.boton1}>
                <Text style = {styles.textoboton}>Información</Text>
              </TouchableOpacity >

              <TouchableOpacity style = {styles.boton2}>
                <Text style = {styles.textoboton}>Productos</Text>
              </TouchableOpacity >

            </View>

            <View style = {styles.info}>

              <View style = {{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                <MaterialCommunityIcons style = {{ marginRight: 10 }} name = {'phone'} color = {'#00bfb2'} size = {25} />                
                
                <View style = {{ marginLeft: 10 }}>
                  <Text style = {{ fontSize: 18, fontWeight: 'bold' }}>Teléfono</Text>
                  <Text style = {{ marginTop: 5 }}>+569 {storeDetails.telefono}</Text>
                </View>
                
              </View>

              <View style = {{ flexDirection: 'row', alignItems: 'center'}}>
                <MaterialCommunityIcons style = {{ marginRight: 10 }} name = {'map-marker'} color = {'#00bfb2'} size = {25} />
                
                <View style = {{ marginLeft: 10 }}>
                  <Text style = {{ fontSize: 18, fontWeight: 'bold', marginTop: 10 }}>Dirección</Text>
                  <Text style = {{ marginTop: 5 }}>{storeDetails.ubicacion}</Text>
                </View>

              </View>

            </View>

            <View style = {styles.contactoContainer}>

              <View style = {styles.textoContacto}>
                <Text>¿Quieres saber mas de nosotros? Escríbenos a nuestro Whatsapp apretando en el icono</Text>
              </View>

              <TouchableOpacity style = {styles.iconoWspContainer}>
                <MaterialCommunityIcons style = {styles.iconoWsp} name = {'whatsapp'} color = {'#41c351'} size = {45} />
              </TouchableOpacity>

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
    fontSize: 20,
    fontWeight: 'bold',
    position: 'absolute',
    bottom: 75,
    left: 15
  },

  textoImagen2: {
    fontSize: 15,
    fontStyle: 'italic',
    position: 'absolute',
    bottom: 55,
    left: 15
  },

  textoImagen3: {
    fontSize: 15,
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
