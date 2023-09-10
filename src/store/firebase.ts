// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics"
import { initializeApp } from "firebase/app"
import { getAuth, connectAuthEmulator } from "firebase/auth"
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore"
import { getStorage, connectStorageEmulator } from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAMCY0E5mkohEQ40IOeJ2qpRN6xDcJaD8Q",
  authDomain: "civa-master-inventory.firebaseapp.com",
  projectId: "civa-master-inventory",
  storageBucket: "civa-master-inventory.appspot.com",
  messagingSenderId: "367870428566",
  appId: "1:367870428566:web:4e9c6f1bd3d68892aa89b7"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

export const analytics = getAnalytics(app)
export const db = getFirestore()
export const auth = getAuth()
export const storage = getStorage(app)

if (process.env.NODE_ENV !== 'production') {
  connectFirestoreEmulator(db, 'localhost', 8080)
  connectAuthEmulator(auth, "http://localhost:9099")
  connectStorageEmulator(storage, 'localhost', 9199)
}