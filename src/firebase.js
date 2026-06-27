// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCuvEL-CulaJx_w410-LzqQSpyQLYP_5zc",
    authDomain: "todo-app-authentification.firebaseapp.com",
    projectId: "todo-app-authentification",
    storageBucket: "todo-app-authentification.firebasestorage.app",
    messagingSenderId: "871142342677",
    appId: "1:871142342677:web:265437fc9fab6ef57ece1c"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const db = getFirestore(app);