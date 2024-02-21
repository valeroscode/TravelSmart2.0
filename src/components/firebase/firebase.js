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
  apiKey: `AIzaSyDWO6HLLc9RoUOp8TWAe67UtuXhYGvhhPI`,
  authDomain: `maps-api-c3a7a.firebaseapp.com`,
  projectId: `maps-api-c3a7a`,
  storageBucket: `maps-api-c3a7a.appspot.com`,
  messagingSenderId: `821736278520`,
  appId: `821736278520:web:83f7e32f63110c09d6ae0d`,
  measurementId: `8Z3ETEL3BD`,
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
