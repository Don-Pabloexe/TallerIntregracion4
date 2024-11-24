
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, FlatList, TextInput, Animated } from 'react-native';
import axios from 'axios';

function SkeletonPlaceholder() {
  return (
    <View style = {styles.skeletonContainer}>
      <View style = {styles.skeletonBox} />
      <View style = {styles.skeletonBox} />
      <View style = { styles.skeletonBox} />
    </View>
  );
}

// Función debounce para retrasar la búsqueda
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function ProductoList() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');  
  const [noResults, setNoResults] = useState(false); 
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    if (debouncedSearch.trim() === '') {
      setProductos([]);
      setNoResults(false);
      return;
    }

    const fetchProductos = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/productosBusqueda', {
          params: { search: debouncedSearch }
        });

        if (response.data.length === 0) {
          setNoResults(true);
        } else {
          setNoResults(false);
        }

        setProductos(response.data);
      } catch (err) {
        setError('Error al obtener los productos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, [debouncedSearch]);

  return (
    <View style = {styles.body}>

      <TextInput
        style = {styles.searchInput}
        placeholder = "Buscar producto por nombre o descripción..."
        value = {search}
        onChangeText = {setSearch}
      />

      {noResults && !loading && (
        <Text style={styles.noResults}>No hemos podido encontrar el producto</Text>
      )}

      {loading ? (
        <SkeletonPlaceholder />
      ) : (

        <FlatList
          data = {productos}
          keyExtractor = {(item) => item.id_producto.toString()}
          renderItem = {({ item }) => (

            <View style = {styles.productos}>
                <View style = {styles.productoContainer}>               
                  <Text style = {styles.nombre}>{item.nombre_producto}</Text>
                  <Text style = {styles.precio}>Precio: {item.precio}</Text>               
                </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  
  body: {
    padding: 20,
  },

  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 40,
  },

  noResults: {
    textAlign: 'center',
    fontSize: 16,
    fontStyle: 'italic',
    color: '#999',
    marginTop: 20,
  },

  productos: {
    flexDirection: 'row'
  },

  productoContainer: {
    backgroundColor: '#00C1A5',
    width: '40%',
    marginBottom: 10,
    padding: 15,
    borderRadius: 10,
  },

  nombre: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  descripcion: {
    fontSize: 14,
    color: 'black',
  },

  precio: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 15
  },

  skeletonContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },

  skeletonBox: {
    height: 20,
    backgroundColor: '#ddd',
    marginBottom: 10,
    borderRadius: 5,
  },

});
