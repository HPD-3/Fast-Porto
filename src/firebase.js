import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyADHPuxWWAPKi8nBo3vTzLO4zWIf4e0gjs',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'hafidhportofolio-0.firebaseapp.com',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'hafidhportofolio-0',
    storageBucket:
        import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'hafidhportofolio-0.firebasestorage.app',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '448225278116',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:448225278116:web:b8928567476c19661a8e31',
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const auth = getAuth(app)

export { app, db, auth }
