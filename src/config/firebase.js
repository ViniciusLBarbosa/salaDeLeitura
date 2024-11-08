import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBmPnFPjRU0Cc17S3km-wO1Og_UzLyc3l0",
    authDomain: "sala-de-leitura-a832f.firebaseapp.com",
    projectId: "sala-de-leitura-a832f",
    storageBucket: "sala-de-leitura-a832f.firebasestorage.app",
    messagingSenderId: "172503261689",
    appId: "1:172503261689:web:340e57b33d18b970ea9d28",
    measurementId: "G-7T50S7RFQR"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);