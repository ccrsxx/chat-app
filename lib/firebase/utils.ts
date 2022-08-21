import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as signOutAuth
} from 'firebase/auth';
import {
  doc,
  query,
  addDoc,
  orderBy,
  updateDoc,
  deleteDoc,
  collection,
  getFirestore,
  serverTimestamp
} from 'firebase/firestore';
import { getFirebaseConfig } from './config';
import { messageConverter } from './converter';

initializeApp(getFirebaseConfig());

export const db = getFirestore();
export const auth = getAuth();

export const messagesRef = collection(db, 'messages');

export const messagesQuery = query(
  messagesRef,
  orderBy('createdAt', 'asc')
).withConverter(messageConverter);

export function signIn(): void {
  const provider = new GoogleAuthProvider();
  void signInWithPopup(auth, provider);
}

export function signOut(): void {
  void signOutAuth(auth);
}

export function sendMessage(text: string): void {
  const {
    displayName: name,
    photoURL,
    uid
  } = auth.currentUser as {
    displayName: string;
    photoURL: string;
    uid: string;
  };

  void addDoc(messagesRef, {
    name,
    text,
    photoURL,
    createdAt: serverTimestamp(),
    editedAt: null,
    uid
  });
}

export function deleteMessage(docId: string): () => void {
  return (): void => {
    const docRef = doc(messagesRef, docId);
    void deleteDoc(docRef);
  };
}

export function editMessage(docId: string, text: string): void {
  const docRef = doc(messagesRef, docId);
  void updateDoc(docRef, {
    text,
    editedAt: serverTimestamp()
  });
}
