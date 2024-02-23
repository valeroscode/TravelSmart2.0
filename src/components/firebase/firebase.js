import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  setDoc,
  Timestamp,
  updateDoc,
  doc,
  getDoc,
  FieldValue,
} from "firebase/firestore/lite";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJ_ID,
  storageBucket: process.env.REACT_APP_BUCKET,
  messagingSenderId: process.env.REACT_APP_SENDER_ID,
  appId: process.env.REACT_APP_APPID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
const db = getFirestore(app);
let userData;

export const docMethods = {
  newDoc: async (first, last, id) => {
    const data = {
      name: first,
      lastName: last,
      favorites: [],
      trips: {},
    };
    await setDoc(doc(db, "users", id), data);
  },
  getUserData: async (id) => {
    await getDoc(doc(db, "users", id)).then((doc) => {
      userData = {
        name: doc.data().name,
        lastName: doc.data().lastName,
        favorites: doc.data().favorites,
        trips: doc.data().Trips,
      };
    });
    return userData;
  },
  updateFavorites: async (id, place) => {
    await updateDoc(doc(db, "users", id), {
      favorites: place,
    });
  },
  updateTrips: async (id, trips) => {
    await updateDoc(doc(db, "users", id), {
      Trips: trips,
    });
  },
  getTripInfo: async (id, tripname) => {
    let tripData;
    await getDoc(doc(db, "users", id)).then((doc) => {
      tripData = doc.data()[tripname];
    });
    return tripData;
  },
  updateBudget: async (id, budget) => {
    await updateDoc(doc(db, "users", id), {
      Expenses: budget,
    });
  },
};

export default app;
