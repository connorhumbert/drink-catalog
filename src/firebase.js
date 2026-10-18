import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDaLOZVSlzrSjfcrTyQDRmecriS6ptVS1g",
  authDomain: "drink-catalog-54690.firebaseapp.com",
  projectId: "drink-catalog-54690",
  storageBucket: "drink-catalog-54690.firebasestorage.app",
  messagingSenderId: "22221968802",
  appId: "1:22221968802:web:50c76e6da2c71aaa990efb"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
