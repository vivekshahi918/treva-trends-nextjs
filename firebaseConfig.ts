import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCVM3wwT1VlFEDHFXHyE9ZmHmHiq-4XoyY",
  authDomain: "treva-trends-nextjs.firebaseapp.com",
  projectId: "treva-trends-nextjs",
  storageBucket: "treva-trends-nextjs.appspot.com",
  messagingSenderId: "14221948356",
  appId: "1:14221948356:web:38838a16abec6c1be46091",
  measurementId: "G-7DW0JK01HH"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);