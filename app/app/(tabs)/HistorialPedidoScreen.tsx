import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';

const HistorialPedidoScreen = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const router = useRouter();
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const id_usuario = await AsyncStorage.getItem('userId');
        if (!id_usuario) {
          console.error('No se encontró el id_usuario');
          return;
        }

        const response = await axios.get('http://192.168.101.6:5000/historialPedido', {
          params: { id_usuario },
        });

        const pedidosOrdenados = response.data.sort((a, b) => new Date(b.fecha_pedido) - new Date(a.fecha_pedido));

        const pedidosConEstado = pedidosOrdenados.map((pedido, index) => ({
          ...pedido,
          progress: index === 0 ? 0 : 100, // Progreso dinámico solo para el más reciente
          estado: index === 0 ? 'En preparación' : 'Entregado',
          esReciente: index === 0,
        }));

        setPedidos(pedidosConEstado);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener pedidos:', error);
        setLoading(false);
      }
    };

    fetchPedidos();
  }, []);

  const handlePress = (pedido) => {
    // Si el pedido no es el más reciente, no abre WebSocket
    if (!pedido.esReciente) {
      setPedidoSeleccionado({ ...pedido, progress: 100, estado: 'Entregado' });
      setModalVisible(true);
      return;
    }
  
    // Si ya existe un WebSocket para el pedido más reciente, no creamos uno nuevo
    if (ws) {
      console.log('Reutilizando la conexión WebSocket existente.');
      setPedidoSeleccionado(pedido);
      setModalVisible(true);
      return;
    }
  
    // Crear una nueva conexión WebSocket solo si no existe
    const newWs = new WebSocket('ws://192.168.101.6:5002');
    setWs(newWs);
  
    newWs.onopen = () => {
      console.log(`Conectado al servidor WebSocket para el pedido ${pedido.id_pedido}`);
      // Envía el ID del pedido al servidor para iniciar seguimiento del progreso
      newWs.send(JSON.stringify({ id_pedido: pedido.id_pedido }));
    };
  
    newWs.onmessage = (event) => {
      const progressValue = parseFloat(event.data);
      console.log(`Progreso recibido para el pedido ${pedido.id_pedido}: ${progressValue}`);
  
      // Actualizar progreso dinámico en el estado global
      const pedidosActualizados = pedidos.map((p) => {
        if (p.id_pedido === pedido.id_pedido) {
          return {
            ...p,
            progress: progressValue,
            estado: progressValue < 50 ? 'En preparación' : progressValue < 100 ? 'En camino' : 'Entregado',
          };
        }
        return p;
      });
  
      setPedidos(pedidosActualizados);
  
      // Si el progreso llega al 100%, cerramos el WebSocket
      if (progressValue >= 100) {
        console.log('Progreso completado. Cerrando WebSocket.');
        newWs.close();
        setWs(null); // Liberamos la referencia al WebSocket
      }
    };
  
    newWs.onerror = (error) => {
      console.error('Error en WebSocket:', error);
    };
  
    newWs.onclose = () => {
      console.log('Conexión WebSocket cerrada');
    };
  
    // Configurar el modal con el pedido seleccionado
    setPedidoSeleccionado(pedido);
    setModalVisible(true);
  }; 

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00BFA6" />
      </View>
    );
  }

  const handleEntregaDetails = (id_pedido) => {
    if (!id_pedido) {
      console.error('id_pedido es undefined o null');
      return;
    }
    console.log('Navegando a /StoreDetails/entrega/' + id_pedido);
    router.push(`/StoreDetails/entrega/${id_pedido}`);
  };

  const ProgressBar = ({ progress }) => (
    <View style={styles.progressBarContainer}>
      <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
    </View>
  );

  const getCircleColor = (estado, circuloNumero) => {
    return estado >= circuloNumero ? '#00C1A5' : '#CCCCCC';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial de Pedidos</Text>
      {pedidos.length === 0 ? (
        <Text style={styles.noPedidosText}>No tienes pedidos aún.</Text>
      ) : (
        <FlatList
          data={pedidos}
          keyExtractor={(item) => item.id_pedido.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.pedidoItem} onPress={() => handlePress(item)}>
              <Text style={styles.pedidoText}>Fecha: {item.fecha_pedido}</Text>
              <Text style={styles.pedidoText}>Total: ${item.precio_total}</Text>
              <Text style={styles.pedidoText}>Hora: {item.hora_pedido}</Text>
              <Text style={styles.pedidoText}>Comentarios: {item.comentarios}</Text>
              <Text style={styles.pedidoText}>Estado: {item.estado}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Modal para mostrar el progreso del pedido */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {pedidoSeleccionado && (
              <>
                <Text style={styles.modalTitle}>Progreso del Pedido</Text>
                {/* Barra de progreso */}
                <ProgressBar progress={pedidoSeleccionado.progress} />
                <Text style={styles.progressText}>{pedidoSeleccionado.progress.toFixed(2)}%</Text>
                <Text style={styles.progressText}>Estado: {pedidoSeleccionado.estado}</Text>
                
                <TouchableOpacity
                  style = {[
                    styles.EstadoEntregaButton,
                    {
                      backgroundColor: pedidoSeleccionado.estado === 100 ? '#00C1A5' : 'gray', // Verde si estado es 2, gris en otro caso
                    },
                  ]}
                  onPress = {() => {
                    setModalVisible(false);
                    handleEntregaDetails(pedidoSeleccionado.id_pedido);
                  }}
                  disabled = {pedidoSeleccionado.estado < 50} // Deshabilitar si estado es menor a 2
                >
                  <Text style={styles.closeButtonText}>Revisa aquí los datos de entrega</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style = {styles.closeButton}
                  onPress = {() => setModalVisible(false)}
                >
                  <Text style = {styles.closeButtonText}>Cerrar</Text>
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
    backgroundColor: '#F3F4F6', // Fondo general más limpio
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#1F2937', // Texto más oscuro
  },
  noPedidosText: {
    fontSize: 18,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 20,
  },
  pedidoItem: {
    padding: 20,
    backgroundColor: '#34D399', // Fondo verde claro agua
    marginBottom: 15,
    borderRadius: 15, // Bordes redondeados
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    flexDirection: 'column',
  },
  pedidoText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#FFFFFF', // Texto blanco para contrastar con el verde
    fontWeight: '600', // Letras más gruesas
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Fondo más oscuro para resaltar el modal
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    padding: 25,
    borderRadius: 15,
    width: '85%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#111827',
    textAlign: 'center',
  },
  progressText: {
    fontSize: 16,
    marginVertical: 10,
    color: '#6B7280',
  },
  progressBarContainer: {
    width: '100%',
    height: 20,
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 10,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#10B981', // Verde más vibrante
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#10B981', // Verde vibrante
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  closeButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  EstadoEntregaButton: {
    alignSelf: 'center',
    backgroundColor: '#2563EB', // Azul vibrante
    alignItems: 'center',
    borderRadius: 15,
    width: '80%',
    height: 50,
    justifyContent: 'center',
    marginVertical: 20,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
  },
  EstadoEntregaButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});



export default HistorialPedidoScreen;