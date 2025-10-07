import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


const firebaseConfig = {
  apiKey: "AIzaSyCRT_u9GZxF1t-x7CuCgGXXYtL4BbGt2W0",
  authDomain: "nailstudiopage-8b8fe.firebaseapp.com",
  projectId: "nailstudiopage-8b8fe",
  storageBucket: "nailstudiopage-8b8fe.firebasestorage.app",
  messagingSenderId: "257541137371",
  appId: "1:257541137371:web:c0104efb4fdb8226fa3dfe",
  measurementId: "G-785DWFKEYX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getFirestore(app);

export { db };
