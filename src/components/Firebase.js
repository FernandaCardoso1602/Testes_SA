import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAdLoxbRGSdizAj82kYaBDaErLWFSQOH-I",
    authDomain: "lawofdefense03.firebaseapp.com",
    projectId: "lawofdefense03",
    storageBucket: "lawofdefense03.firebasestorage.app",
    messagingSenderId: "854097917144",
    appId: "1:854097917144:web:d28767dc79758f0a7713ad",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const login = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Erro no login:", error);
  }
};

const logout = async () => {
  await signOut(auth);
};

export { auth, login, logout };
