import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as signOutAuth
} from 'firebase/auth';
import {
  query,
  addDoc,
  orderBy,
  collection,
  limitToLast,
  getFirestore,
  serverTimestamp
} from 'firebase/firestore';
import { getFirebaseConfig } from './firebase-config';
import { messageConverter } from './query-converter';

initializeApp(getFirebaseConfig());

export const db = getFirestore();
export const auth = getAuth();

export const messagesRef = collection(db, 'messages');

export const messagesQuery = query(
  messagesRef,
  orderBy('createdAt', 'asc'),
  limitToLast(20)
).withConverter(messageConverter);

export function signIn(): void {
  const provider = new GoogleAuthProvider();
  void signInWithPopup(auth, provider);
}

export function signOut(): void {
  void signOutAuth(auth);
}

export async function sendMessage(text: string): Promise<void> {
  const {
    displayName: name,
    photoURL,
    uid
  } = auth.currentUser as {
    displayName: string;
    photoURL: string;
    uid: string;
  };

  await addDoc(messagesRef, {
    name,
    text,
    photoURL,
    createdAt: serverTimestamp(),
    editedAt: null,
    uid
  });
}
