import { getAnalytics } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import { ReCaptchaV3Provider, initializeAppCheck } from 'firebase/app-check';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getPerformance } from 'firebase/performance';

export const config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

export const app = initializeApp(config);
export const db = getFirestore(app);
export const auth = getAuth(app);

const recaptchaPubKey = process.env.REACT_APP_RECAPTCHA_PUB_KEY;
if (global?.document && recaptchaPubKey) {
  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(recaptchaPubKey),
    isTokenAutoRefreshEnabled: true
  });
}

getPerformance(app);
getAnalytics(app);
