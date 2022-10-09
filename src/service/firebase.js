import { initializeApp } from "firebase/app"
import {getFirestore} from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyDtVdsh3VCaE9klsnURKH9zUgW2aeYMT8s",
    authDomain: "despedida-ap.firebaseapp.com",
    projectId: "despedida-ap",
    storageBucket: "despedida-ap.appspot.com",
    messagingSenderId: "381264971295",
    appId: "1:381264971295:web:9b19beb834d912e76d772a"
};

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export {db};