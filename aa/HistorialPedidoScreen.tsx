import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Modal, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { ProgressBarAndroid } from 'react-native';

const HistorialPedidoScreen = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [progress, setProgress] = useState(0);  // Estado para el progreso
  const router = useRouter();

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const id_usuario = await AsyncStorage.getItem('userId'); // Obtén el ID del usuario almacenado
        if (!id_usuario) {
          console.error('No se encontró el id_usuario');
          return;
        }

        const response = await axios.get('http://192.168.0.20:5000/historialPedido', {
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

  // WebSocket para la actualización de progreso
  useEffect(() => {
    const ws = new WebSocket('ws://192.168.0.20:6000'); // Cambia por la IP del servidor

    ws.onopen = () => {
      console.log('Conectado al servidor WebSocket');
    };

    ws.onmessage = (event) => {
      const progressValue = parseFloat(event.data);
      console.log(`Progreso recibido: ${progressValue}`);

      // Asegurarse de que el progreso solo avance
      setProgress((prev) => {
        if (progressValue >= prev) {
          return progressValue; // Solo actualiza si el progreso es mayor
        }
        return prev; // Si el valor es menor, no actualizar el progreso
      });

      // Actualizar el estado del pedido según el progreso
      if (progressValue >= 100) {
        setPedidoSeleccionado((prev) => ({ ...prev, estado: 3 })); // Entregado
      } else if (progressValue >= 50) {
        setPedidoSeleccionado((prev) => ({ ...prev, estado: 2 })); // En despacho
      } else if (progressValue >= 0) {
        setPedidoSeleccionado((prev) => ({ ...prev, estado: 1 })); // Preparando
      }
    };

    ws.onerror = (error) => {
      console.error('Error en WebSocket:', error);
    };

    ws.onclose = () => {
      console.log('Conexión WebSocket cerrada');
    };

    return () => {
      ws.close(); // Asegurarse de cerrar el WebSocket al desmontar
    };
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
    return estado >= circuloNumero ? '#00C1A5' : '#CCCCCC'; // Verde si está completado, gris si no
  };

  const getEstadoColor = (estado, circuloNumero) => {
    // Establecer todos los textos a negro al inicio
    let color = '#000000'; // Todos empiezan en negro
  
    // Cambiar el color dependiendo del estado del pedido
    if (estado >= circuloNumero) {
      // Fase completada (Verde)
      color = '#00C1A5'; 
    } else if (estado === circuloNumero - 1) {
      // Fase en proceso (Naranja)
      color = '#FF9900'; 
    }
    // Si el estado aún no ha llegado a la fase (por ejemplo, el tercer círculo aún está negro)
    return color;
  };
  
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial de Pedidos</Text>
      {pedidos.length === 0 ? (
        <Text style={styles.noPedidosText}>No tienes pedidos aún.</Text>
      ) : (
        <FlatList
          data={pedidos}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.pedidoItem} onPress={() => handlePress(item)}>
              <Text style={styles.pedidoText}>Fecha: {item.fecha_pedido}</Text>
              <Text style={styles.pedidoText}>Total: ${item.precio_total}</Text>
              <Text style={styles.pedidoText}>Dirección: {item.direccion}</Text>
              <Text style={styles.pedidoText}>Sector: {item.sector}</Text>
              <Text style={styles.pedidoText}>Comentarios: {item.comentarios}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Modal con detalles del pedido */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {pedidoSeleccionado && (
              <>
                <Text style={styles.modalTitle}>Detalles del Pedido</Text>

                {/* Estado del Pedido (Círculos y Descripciones) */}
                <View style={styles.estadoContainer}>
                  <View
                    style={[
                      styles.estadoCirculo1,
                      { backgroundColor: getCircleColor(pedidoSeleccionado.estado, 1) },
                    ]}
                  />
                  <View
                    style={[
                      styles.linea,
                      { backgroundColor: getCircleColor(pedidoSeleccionado.estado, 2) },
                    ]}
                  />
                  <View
                    style={[
                      styles.estadoCirculo2,
                      { backgroundColor: getCircleColor(pedidoSeleccionado.estado, 2) },
                    ]}
                  />
                  <View
                    style={[
                      styles.linea,
                      { backgroundColor: getCircleColor(pedidoSeleccionado.estado, 3) },
                    ]}
                  />
                  <View
                    style={[
                      styles.estadoCirculo3,
                      { backgroundColor: getCircleColor(pedidoSeleccionado.estado, 3) },
                    ]}
                  />
                </View>

                {/* Barra de Progreso conectada al WebSocket */}
                <Text style={styles.progressTitle}>Progreso del Pedido</Text>
                <ProgressBarAndroid
                  styleAttr="Horizontal"
                  indeterminate={false}
                  progress={progress / 100} // Conversión para ProgressBarAndroid (0-1)
                  color="#00C1A5"
                />
                <Text style={styles.progressText}>{progress.toFixed(2)}%</Text>

                {/* Descripciones de Estados */}
                <View style={styles.textoEstadoContainer2}>
                <Text style={[styles.DescripcionEstado1, { color: getEstadoColor(pedidoSeleccionado.estado, 1) }]}>
                Preparando: En centro de distribución
              </Text>
              <Text style={[styles.DescripcionEstado2, { color: getEstadoColor(pedidoSeleccionado.estado, 2) }]}>
                En despacho: En camino
              </Text>
              <Text style={[styles.DescripcionEstado3, { color: getEstadoColor(pedidoSeleccionado.estado, 3) }]}>
                Entregado: Pedido recibido
              </Text>



                </View>

                {/* Botón para cerrar el modal */}
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>Cerrar</Text>
                </TouchableOpacity>
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
    padding: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  pedidoText: {
    fontSize: 16,
    marginBottom: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxWidth: 500,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  estadoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  estadoCirculo1: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  linea: {
    width: 40,
    height: 2,
  },
  estadoCirculo2: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  estadoCirculo3: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  progressTitle: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
  progressText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
  textoEstadoContainer2: {
    marginTop: 20,
  },
  DescripcionEstado1: {
    fontSize: 14,
    color: '#00C1A5',
  },
  DescripcionEstado2: {
    fontSize: 14,
    color: '#FF9900',
  },
  DescripcionEstado3: {
    fontSize: 14,
    color: '#A6A6A6',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#00C1A5',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
});

export default HistorialPedidoScreen;

