import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging/sw';
import { getFirebaseConfig } from '../lib/firebase/config';

initializeApp(getFirebaseConfig());

getMessaging();

// eslint-disable-next-line no-console
console.info('Firebase messaging service worker is set up.');
