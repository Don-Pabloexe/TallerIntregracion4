from websocket_server import WebsocketServer
import time
import math

# Coordenadas iniciales y destino
start_coords = (40.748817, -73.985428)  # Ejemplo: New York
end_coords = (40.73061, -73.935242)    # Ejemplo: Brooklyn

def haversine(coord1, coord2):
    """Calcula la distancia en kilómetros entre dos puntos usando la fórmula Haversine."""
    R = 6371  # Radio de la Tierra en kilómetros
    lat1, lon1 = math.radians(coord1[0]), math.radians(coord1[1])
    lat2, lon2 = math.radians(coord2[0]), math.radians(coord2[1])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = math.sin(dlat / 2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

# Distancia total entre los puntos
total_distance = haversine(start_coords, end_coords)

def simulate_progress(server):
    current_coords = list(start_coords)
    progress = 0

    while progress < 100:
        # Simular movimiento (acercar coordenadas al destino)
        current_coords[0] += (end_coords[0] - current_coords[0]) * 0.1
        current_coords[1] += (end_coords[1] - current_coords[1]) * 0.1

        # Calcular distancia restante
        remaining_distance = haversine(current_coords, end_coords)

        # Actualizar progreso
        progress = ((total_distance - remaining_distance) / total_distance) * 100
        progress = min(progress, 100)  # Limitar a 100%

        # Enviar progreso al cliente
        server.send_message_to_all(f"{progress:.2f}")
        time.sleep(1)

    server.send_message_to_all("100.00")  # Asegurarse de llegar al 100%
    print("¡Simulación completada!")

# Manejar conexión de cliente
def new_client(client, server):
    print(f"Nuevo cliente conectado: {client['id']}")
    if len(server.clients) == 1:  # Solo inicia si es el primer cliente conectado
        simulate_progress(server)

# Iniciar servidor WebSocket
server = WebsocketServer(host="0.0.0.0", port=6000)
server.set_fn_new_client(new_client)
print("Servidor WebSocket en ejecución en el puerto 6000...")
server.run_forever()
