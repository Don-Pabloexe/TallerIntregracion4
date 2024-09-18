
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

              <Text style = {styles.textoImagen1}>Papas Granel Nativas</Text>
              <Text style = {styles.textoImagen2}>Desde $666 el Kilo</Text>  
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
                <MaterialCommunityIcons style = {{ marginRight: 10 }} name = {'account'} color = {'#00bfb2'} size = {25} />
                
                <View style = {{ marginLeft: 10 }}>
                  <Text style = {{ fontSize: 18, fontWeight: 'bold', marginTop: 5 }}>Productor</Text>
                  <Text style = {{ marginTop: 5 }}>Vista Verde S.A</Text>
                </View>

              </View>

              <View style = {{ flexDirection: 'row', alignItems: 'center'}}>
                <MaterialCommunityIcons style = {{ marginRight: 10, marginTop: 30 }} name = {'shape'} color = {'#00bfb2'} size = {25} />
                
                <View style = {{ marginLeft: 10 }}>
                  <Text style = {{ fontSize: 18, fontWeight: 'bold', marginTop: 25 }}>Categoria</Text>
                  <Text style = {{ marginTop: 5 }}>Verduras</Text>
                </View>

              </View>
              

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

export default App;