import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Modal, FlatList, Image } from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from './axiosConfig';

const PaymentScreen = () => {
  const [monto, setMonto] = useState(null);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cvv, setCvv] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('01');
  const [expiryYear, setExpiryYear] = useState('2024');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isMonthModalVisible, setIsMonthModalVisible] = useState(false);
  const [isYearModalVisible, setIsYearModalVisible] = useState(false);

  const router = useRouter();
  const navigation = useNavigation();

  // Listener para recargar datos al enfocar la pantalla
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      try {
        setIsLoading(true); // Muestra un indicador de carga mientras se obtienen los datos
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) {
          setError('No se pudo identificar al usuario.');
          setMonto(null);
          setIsLoading(false);
          return;
        }

        // Realiza la consulta al backend para obtener el monto más reciente
        const response = await axios.get(`http://192.168.101.6:5000/pedido/monto_reciente/${userId}`);
        if (!response.data || response.data.monto === undefined) {
          setError('No se pudo cargar el monto.');
          setMonto(null);
        } else {
          setMonto(response.data.monto); // Guarda el monto en el estado
          setError(''); // Limpia cualquier error previo
        }
      } catch (err) {
        console.error('Error al obtener el monto reciente:', err);
        setError('Hubo un problema al cargar el monto.');
      } finally {
        setIsLoading(false); // Finaliza el indicador de carga
      }
    });

    return unsubscribe; // Limpia el listener al desmontar el componente
  }, [navigation]);

  const handlePayment = async () => {
    if (!cardNumber || !cardName || !cvv || !expiryMonth || !expiryYear) {
      Alert.alert('Error', 'Por favor completa todos los campos del formulario.');
      return;
    }

    setIsProcessing(true); // Muestra un indicador de procesamiento

    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert('Error', 'No se pudo identificar al usuario.');
        return;
      }

      // Enviar los datos al backend para procesar el pago
      const response = await axios.post('http://192.168.101.6:5000/pagar', {
        userId,
        monto,
        tarjeta: {
          numero: cardNumber,
          nombre: cardName,
          fecha_expiracion: `${expiryMonth}/${expiryYear}`,
          cvv,
        },
      });

      // Verifica la respuesta del backend
      if (response.status === 200 && response.data.estado === 'aprobado') {
        Alert.alert('Éxito', response.data.mensaje);
        router.push('/SuccessScreen');
      } else {
        Alert.alert('Error', 'Hubo un problema al procesar el pago. Intenta de nuevo.');
      }
    } catch (err) {
      console.error('Error al procesar el pago:', err);
      Alert.alert('Error', 'Hubo un problema al procesar el pago. Intenta nuevamente.');
    } finally {
      setIsProcessing(false); // Oculta el indicador de procesamiento
    }
  };

  const renderModal = (data, onSelect, closeModal) => (
    <Modal transparent visible>
      <View style={styles.modalContainer}>
        <FlatList
          data={data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.modalItem}
              onPress={() => {
                onSelect(item);
                closeModal();
              }}
            >
              <Text>{item}</Text>
            </TouchableOpacity>
          )}
        />
        <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
          <Text style={styles.closeButtonText}>Cerrar</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );

  const months = Array.from({ length: 12 }, (_, i) => `${i + 1 < 10 ? '0' : ''}${i + 1}`);
  const years = Array.from({ length: 10 }, (_, i) => `${2024 + i}`);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Monto a pagar: ${monto}</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre del Titular"
        value={cardName}
        onChangeText={setCardName}
      />

      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.rowItem]}
          placeholder="Número de Tarjeta"
          keyboardType="numeric"
          value={cardNumber}
          onChangeText={setCardNumber}
          maxLength={16}
        />
        <TextInput
          style={[styles.input, styles.rowItem]}
          placeholder="CVV"
          keyboardType="numeric"
          value={cvv}
          onChangeText={setCvv}
          maxLength={3}
          secureTextEntry
        />
      </View>

      <View style={styles.iconsRow}>
        <Image
          source={{ uri: 'https://handsonbanking.org/wp-content/uploads/2021/02/debitcard_front_blue.png' }}
          style={styles.cardIcon}
        />
        <Image
          source={{ uri: 'https://w7.pngwing.com/pngs/49/82/png-transparent-credit-card-visa-logo-mastercard-bank-mastercard-blue-text-rectangle.png' }}
          style={styles.cardIcon}
        />
        <Image
          source={{ uri: 'https://w1.pngwing.com/pngs/191/339/png-transparent-visa-mastercard-logo-credit-card-yellow-text-line-area-circle.png' }}
          style={styles.cardIcon}
        />
      </View>

      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.pickerContainer, styles.rowItem]}
          onPress={() => setIsMonthModalVisible(true)}
        >
          <Text>{expiryMonth}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.pickerContainer, styles.rowItem]}
          onPress={() => setIsYearModalVisible(true)}
        >
          <Text>{expiryYear}</Text>
        </TouchableOpacity>
      </View>

      {isMonthModalVisible &&
        renderModal(months, setExpiryMonth, () => setIsMonthModalVisible(false))}
      {isYearModalVisible &&
        renderModal(years, setExpiryYear, () => setIsYearModalVisible(false))}

      <TouchableOpacity
        style={[styles.payButton, isProcessing && styles.payButtonDisabled]}
        onPress={handlePayment}
        disabled={isProcessing}
      >
        <Text style={styles.payButtonText}>
          {isProcessing ? 'Procesando...' : 'Pagar'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  rowItem: {
    flex: 1,
    marginHorizontal: 5,
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },
  payButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
  payButtonDisabled: {
    backgroundColor: '#ccc',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
  iconsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  cardIcon: {
    width: 50,
    height: 30,
    resizeMode: 'contain',
    marginHorizontal: 5,
  },
});

export default PaymentScreen;
