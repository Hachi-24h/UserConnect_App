// src/utils/firebaseConfig.ts
import { initializeApp, getApps } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyAM9EtJU_ghypcuiapZizS-9QdMJfBMgXk",
  authDomain: "pulse-59b53.firebaseapp.com",
  projectId: "pulse-59b53",
  storageBucket: "pulse-59b53.appspot.com",
  messagingSenderId: "815132723211",
  appId: "1:815132723211:android:e29f2b35b2984fb9e41f0e"
};

if (getApps().length === 0) {
  initializeApp(firebaseConfig);
}
