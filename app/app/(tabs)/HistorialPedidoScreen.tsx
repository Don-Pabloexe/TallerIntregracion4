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

const HistorialPedidoScreen = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const id_usuario = await AsyncStorage.getItem('userId');
        if (!id_usuario) {
          console.error('No se encontró el id_usuario');
          return;
        }

        const response = await axios.get('http://localhost:5000/historialPedido', {
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
    const newWs = new WebSocket('ws://127.0.0.1:5002');
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

  const ProgressBar = ({ progress }) => (
    <View style={styles.progressBarContainer}>
      <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
    </View>
  );

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
  container: { flex: 1, padding: 16, backgroundColor: '#F2F2F2' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  noPedidosText: { fontSize: 18, color: '#A6A6A6', textAlign: 'center', marginTop: 20 },
  pedidoItem: { padding: 16, backgroundColor: '#FFFFFF', marginBottom: 10, borderRadius: 8 },
  pedidoText: { fontSize: 16, marginBottom: 8 },
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
    alignItems: 'center',
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  progressText: { fontSize: 16, marginTop: 10 },
  progressBarContainer: {
    width: '100%',
    height: 20,
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#00C1A5',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#00C1A5',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: { fontSize: 16, color: '#FFFFFF' },
});

export default HistorialPedidoScreen;
