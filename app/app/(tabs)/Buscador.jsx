import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TextInput, Animated } from 'react-native';
import axios from 'axios';

import { TouchableOpacity } from 'react-native';

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
          numColumns = {2} // Divide los elementos en 2 columnas

          columnWrapperStyle = {{
            justifyContent: 'center', // Centra las tarjetas horizontalmente en la fila
          }}

          renderItem = {({ item }) => (

            <TouchableOpacity style = {styles.productos}>
              <Image
                 source = {{ uri: item.imagen }} // URL de la imagen del producto
                  style = {styles.imagen} // Estilo de la imagen
                  resizeMode = "cover" // Ajusta cómo la imagen se escala
                />
              <View style = {styles.productoContainer}>               
                <Text style = {styles.nombre}>{item.nombre_producto}</Text>
                <Text style = {styles.precio}>${item.precio}</Text>               
              </View>
            </TouchableOpacity >
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  
  body: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white'
  },

  searchInput: {
    width: '100%',
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
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',

    width: '45%',

    marginBottom: 30,
    marginHorizontal: 5,
  },

  productoContainer: {
    marginBottom: 20,
    padding: 15,
  },

  nombre: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },

  descripcion: {
    textAlign: 'center',
    color: 'black',
    fontSize: 14,
  },

  precio: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontVariant: 'italic',
    color: 'black',

    marginTop: 15,
    fontSize: 22,
  },

  imagen: {
    width: '100%', 
    height: 150,
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
