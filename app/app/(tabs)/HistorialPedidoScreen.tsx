
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Modal, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';

const HistorialPedidoScreen = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const router = useRouter();

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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00BFA6" />
      </View>
    );
  }
  
  if (pedidos.length === 0) {
    return (
      <View style={styles.container}>
        <Text>No se han encontrado pedidos.</Text>
      </View>
    );
  }

  const handlePress = (pedido) => {
    setPedidoSeleccionado(pedido); // Guarda el pedido seleccionado
    setModalVisible(true); // Muestra el modal
  };

  const handleEntregaDetails = (id_pedido) => {
    if (!id_pedido) {
      console.error('id_pedido es undefined o null');
      return;
    }
    console.log('Navegando a /StoreDetails/entrega/' + id_pedido);
    router.push(`/StoreDetails/entrega/${id_pedido}`);
  };

  const getCircleColor = (estado, circuloNumero) => {
    return estado >= circuloNumero ? '#00C1A5' : '#CCCCCC';
  };

  return (
    <View style = {styles.container}>
      <Text style = {styles.title}>Historial de Pedidos</Text>
      {pedidos.length === 0 ? (
        <Text style={styles.noPedidosText}>No tienes pedidos aún.</Text>
      ) : (

        <FlatList
          data = {pedidos}
          keyExtractor = {(item, index) => index.toString()}
          renderItem = {({ item }) => (

            <TouchableOpacity style = {styles.pedidoItem} onPress = {() => handlePress(item)}>
              <Text style = {styles.pedidoText}>Fecha: {item.fecha_pedido}</Text>
              <Text style = {styles.pedidoText}>Total: ${item.precio_total}</Text>
              <Text style = {styles.pedidoText}>Dirección: {item.direccion}</Text>
              <Text style = {styles.pedidoText}>Sector: {item.sector}</Text>
              <Text style = {styles.pedidoText}>Comentarios: {item.comentarios}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      <Modal
        visible = {modalVisible}
        transparent = {true}
        animationType = "slide"
        onRequestClose = {() => setModalVisible(false)}
      >
        <View style = {styles.modalContainer}>

          <View style = {styles.modalContent}>
            {pedidoSeleccionado && (
              <>
                <Text style = {styles.modalTitle}>Detalles del Pedido</Text>
                
                <View style = {styles.estadoContainer}>
                  <View style = {[styles.estadoCirculo1, { backgroundColor: getCircleColor(pedidoSeleccionado.estado, 0) }]} />
                  <View style = {[styles.linea, { backgroundColor: getCircleColor(pedidoSeleccionado.estado, 0) }]} />
                  <View style = {[styles.estadoCirculo2, { backgroundColor: getCircleColor(pedidoSeleccionado.estado, 1) }]} />
                  <View style = {[styles.linea, { backgroundColor: getCircleColor(pedidoSeleccionado.estado, 1) }]} />
                  <View style = {[styles.estadoCirculo3, { backgroundColor: getCircleColor(pedidoSeleccionado.estado, 2) }]} />
                </View>

                <View style = {styles.textoEstadoContainer1}>
                  <Text style = {styles.textoEstado1}>Preparando el pedido</Text>
                  <Text style = {styles.textoEstado2}>En despacho</Text>
                  <Text style = {styles.textoEstado3}>Entregado</Text>
                </View>

                <View style = {styles.textoEstadoContainer2}>
                  <Text style = {styles.DescripcionEstado1}>Tu pedido se esta preparando en nuestro centro de distribución</Text>
                  <Text style = {styles.DescripcionEstado2}>Tu pedido se encuentra en despacho y llegará pronto a tu dirección</Text>
                  <Text style = {styles.DescripcionEstado3}>El pedido fue entregado y recibido. Revisa aquí los datos del receptor</Text>
                </View>

                <View>

                  <FlatList
                    data = {[pedidoSeleccionado]}
                    keyExtractor={(item) => item.id_pedido.toString()}
                    renderItem = {({ item }) => (

                  <TouchableOpacity style = {[ styles.EstadoEntregaButton,

                      {
                        backgroundColor:
                          pedidoSeleccionado.estado === 0 || pedidoSeleccionado.estado === 1
                            ? '#CCCCCC' // Color gris cuando está deshabilitado
                            : getCircleColor(pedidoSeleccionado.estado, 2),
                      }
                    ]}

                    onPress = {() => {

                      if (pedidoSeleccionado.estado !== 0 && pedidoSeleccionado.estado !== 1) {
                          setModalVisible(false)
                          handleEntregaDetails(pedidoSeleccionado.id_pedido);
                        }}
                      }

                    disabled = {pedidoSeleccionado.estado === 0 || pedidoSeleccionado.estado === 1}>
                    
                    <Text style = {styles.closeButtonText}>Revisa aquí los datos de entrega</Text>
                  </TouchableOpacity>
                  )}/>
                </View>


                <View>
                  <TouchableOpacity style = {styles.closeButton} onPress = {() => setModalVisible(false)}>
                    <Text style = {styles.closeButtonText}>Cerrar</Text>
                  </TouchableOpacity>
                </View>

              </>
            )}
          </View>
        </View>
      </Modal>
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
    color: 'white',
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },

  modalTitle: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  estadoContainer: {
    flexDirection: 'row',
    alignContent: 'center',
    alignSelf: 'center',
    margin: 30,
  },

  textoEstadoContainer1: {
    flexDirection: 'row',
    alignContent: 'center',
    alignSelf: 'center',
  },

  textoEstadoContainer2: {
    flexDirection: 'row',
    alignContent: 'center',
    alignSelf: 'center',
    marginBottom: 80,
  },

  textoEstado1: {
    flexDirection: 'column',
    textAlign: 'center',
    alignSelf: 'center',
    width: 80,
    height: 80,
    marginRight: 25
  },

  textoEstado2: {
    flexDirection: 'column',
    textAlign: 'center',
    alignSelf: 'center',
    width: 80,
    height: 80,
    marginRight: 25
  },

  textoEstado3: {
    flexDirection: 'column',
    textAlign: 'center',
    alignSelf: 'center',
    width: 80,
    height: 80,
  },

  DescripcionEstado1: {
    flexDirection: 'column',
    textAlign: 'center',
    alignSelf: 'center',
    width: 80,
    height: 80,
    marginRight: 25,
    fontWeight: 'bold'
  },

  DescripcionEstado2: {
    flexDirection: 'column',
    textAlign: 'center',
    alignSelf: 'center',
    width: 80,
    height: 80,
    marginRight: 25,
    fontWeight: 'bold'
  },

  DescripcionEstado3: {
    flexDirection: 'column',
    textAlign: 'center',
    alignSelf: 'center',
    width: 80,
    height: 80,
    fontWeight: 'bold'
  },

  linea: {
    alignContent: 'center',
    alignSelf: 'center',
    width: 65,
    height: 5,
    backgroundColor: '#00C1A5',
  },

  estadoCirculo1: {
    alignContent: 'center',
    alignSelf: 'center',
    width: 35,
    height: 35,
    borderRadius: 100,
    backgroundColor: '#00C1A5',
  },

  estadoCirculo2: {
    alignContent: 'center',
    alignSelf: 'center',
    width: 35,
    height: 35,
    borderRadius: 100,
    backgroundColor: '#00C1A5',
  },

  estadoCirculo3: {
    alignContent: 'center',
    alignSelf: 'center',
    width: 35,
    height: 35,
    borderRadius: 100,
    backgroundColor: '#00C1A5',
  },

  closeButton: {
    backgroundColor: '#00C1A5',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20
  },

  entregaButton: {
    backgroundColor: '#00C1A5',
    borderRadius: 5,
    alignItems: 'center',
  },

  closeButtonText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
  },

  EstadoEntregaButton: {
    alignSelf: 'center',
    backgroundColor: '#00C1A5',
    alignItems: 'center',
    borderRadius: 50,
    width: 200,
    height: 60,
    marginVertical: 20,
    padding: 10,
  },
});

export default HistorialPedidoScreen;
