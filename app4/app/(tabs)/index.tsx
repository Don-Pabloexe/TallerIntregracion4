import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/explore'); // Redirige automáticamente a explore
  }, []);

  return null; // Evita que se renderice algo en esta pantalla
}
