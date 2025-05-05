
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDemoKeyForTesting123456789",
  authDomain: "demo-ocean-cleaner.firebaseapp.com",
  databaseURL: "https://demo-ocean-cleaner-default-rtdb.firebaseio.com",
  projectId: "demo-ocean-cleaner",
  storageBucket: "demo-ocean-cleaner.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890abcdef"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
