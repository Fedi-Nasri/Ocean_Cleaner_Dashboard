
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCdjyQBAyKzMMIZlYF8Co9Y4T1NM6_RX5w",
  authDomain: "oceancleaner-741db.firebaseapp.com",
  databaseURL: "https://oceancleaner-741db-default-rtdb.firebaseio.com",
  projectId: "oceancleaner-741db",
  storageBucket: "oceancleaner-741db.firebasestorage.app",
  messagingSenderId: "1007338556594",
  appId: "1:1007338556594:web:94523bb9961c2156ec4dab",
  measurementId: "G-E7SZRP20JH"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
