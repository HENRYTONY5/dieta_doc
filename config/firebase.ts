import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyARIaUO_xfvAPTZnWMP9hhgJgQgDs4FaA8",
  authDomain: "ia-diet.firebaseapp.com",
  projectId: "ia-diet",
  storageBucket: "ia-diet.firebasestorage.app",
  messagingSenderId: "471061490649",
  appId: "1:471061490649:android:3ea6310dbe793202b3c7c8"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Configurar Auth
export const auth = getAuth(app);

// Configurar Firestore
export const db = getFirestore(app);
