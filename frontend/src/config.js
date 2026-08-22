import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth/cordova";

const firebaseConfig = {
  apiKey: "AIzaSyC9yLr1E3F0SMV9NwYZCmXoDMyH6ZEf6Hw",
  authDomain: "bulkmail-30d8d.firebaseapp.com",
  projectId: "bulkmail-30d8d",
  storageBucket: "bulkmail-30d8d.firebasestorage.app",
  messagingSenderId: "569813641928",
  appId: "1:569813641928:web:fbe624fd2622ff5a7e53fd",
  measurementId: "G-596JCWL55K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth =getAuth(app);

export default auth;