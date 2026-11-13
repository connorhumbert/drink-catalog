import { initializeApp } from "firebase/app";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";

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

// Keep a copy of fetched drinks in IndexedDB so the app opens instantly and works without signal.
// Writes made offline are queued and sent when the device reconnects.
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
});
