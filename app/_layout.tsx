import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/config/firebase';

import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const segments = useSegments();
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('🔐 Estado de autenticación cambió:', user?.email);
      setUser(user);
      setInitializing(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (initializing) return;

    const inAuthGroup = segments[0] === 'login';

    if (user && inAuthGroup) {
      // Usuario autenticado pero en login, redirigir a dashboard
      router.replace('/dashboard');
    } else if (!user && !inAuthGroup) {
      // Usuario no autenticado y no en login, redirigir a login
      router.replace('/login');
    }
  }, [user, segments, initializing]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="dashboard" options={{ headerShown: false }} />
        <Stack.Screen name="screens/perfil" options={{ headerShown: false }} />
        <Stack.Screen name="screens/chat" options={{ headerShown: false }} />
        <Stack.Screen name="screens/reportes" options={{ headerShown: false }} />
        <Stack.Screen name="screens/mensajes" options={{ headerShown: false }} />
        <Stack.Screen name="screens/tareas" options={{ headerShown: false }} />
        <Stack.Screen name="screens/calendario" options={{ headerShown: false }} />
        <Stack.Screen name="screens/ajustes" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
