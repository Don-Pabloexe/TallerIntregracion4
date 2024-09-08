
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Pressable, ActivityIndicator, Dimensions, Image, StyleSheet, TouchableOpacity} from 'react-native';
import axios from 'axios';
import { ScrollView } from 'react-native-gesture-handler';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const App = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/data')
      .then(response => {
        console.log(response.data);
        setData(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <ActivityIndicator size="large" />;
  if (error) return <Text>Error: {error.message}</Text>;

  return (

    <View style = {styles.body}>
      
      <FlatList
        data = {data}
        keyExtractor = {(item, index) => index.toString()}
        renderItem = {({ item }) => (
          
          <View>

            <View>
              <Image style = {styles.img} source = {require('../../assets/images/mall.jpg')}></Image>

              <Text style = {styles.textoImagen1}>{item.nombre}</Text>
              <Text style = {styles.textoImagen2}>{item.ubicacion}</Text>
              <Text style = {styles.textoImagen3}>{item.categoria}</Text>  
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
                  <Text style = {{ marginTop: 5 }}>{item.telefono}</Text>
                </View>
                
              </View>

              <View style = {{ flexDirection: 'row', alignItems: 'center'}}>
                <MaterialCommunityIcons style = {{ marginRight: 10 }} name = {'map-marker'} color = {'#00bfb2'} size = {25} />
                
                <View style = {{ marginLeft: 10 }}>
                  <Text style = {{ fontSize: 18, fontWeight: 'bold', marginTop: 10 }}>Dirección</Text>
                  <Text style = {{ marginTop: 5 }}>{item.ubicacion}</Text>
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

        )}
      />

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

export default App;

