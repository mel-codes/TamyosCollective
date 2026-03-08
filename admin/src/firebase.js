// src/firebase.js
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyBOrkthWvp-RXs7-DN2XTH2ssL3o77hnQc",
  authDomain: "tamyos-admin.firebaseapp.com",
  projectId: "tamyos-admin",
  storageBucket: "tamyos-admin.firebasestorage.app",
  messagingSenderId: "407186220422",
  appId: "1:407186220422:web:114c26b4c174a3f8e73807"
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)