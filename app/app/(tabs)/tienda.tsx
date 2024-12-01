
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Dimensions, Image, StyleSheet, TouchableOpacity} from 'react-native';
import axios from 'axios';

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
    <View>
      
      <FlatList
        data = {data}
        keyExtractor = {(item, index) => index.toString()}
        renderItem = {({ item }) => (
          
          <View>

            <TouchableOpacity style = {styles.img2}>
              <Image style = {styles.img} source = {require('../../assets/images/mall.jpg')}></Image>

              <Text style = {styles.textoimagen1}>{item.nombre}</Text>
              <Text style = {styles.textoimagen2}>{item.ubicacion}</Text>
              <Text style = {styles.textoimagen3}>{item.categoria}</Text>  
            </TouchableOpacity>
            
          </View>

        )}
      />

    </View>
  );
};

const styles = StyleSheet.create({

  img: {
    flex: 1,
    width: '100%',
    height: 250,
    opacity: 0.5
  },

  textoimagen1: {
    fontSize: 20,
    fontWeight: 'bold',
    position: 'absolute',
    bottom: 75,
    left: 10
  },

  textoimagen2: {
    fontSize: 15,
    fontStyle: 'italic',
    position: 'absolute',
    bottom: 55,
    left: 10
  },

  textoimagen3: {
    fontSize: 15,
    fontStyle: 'italic',
    position: 'absolute',
    bottom: 10,
    left: 10
  }

});

export default App;

