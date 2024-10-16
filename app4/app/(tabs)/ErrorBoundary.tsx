import React, { Component, ErrorInfo } from 'react';
import { Text, View } from 'react-native';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Actualiza el estado para que la siguiente renderización lo muestre
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Puedes enviar el error a un servicio de monitoreo aquí si lo necesitas
    console.error("Error capturado por ErrorBoundary:", error);
  }

  render() {
    if (this.state.hasError) {
      // Puedes personalizar este mensaje o cambiarlo por algo más amigable
      return (
        <View style={{ padding: 20 }}>
          <Text style={{ color: 'red' }}>Algo salió mal. Por favor, intenta más tarde.</Text>
        </View>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
