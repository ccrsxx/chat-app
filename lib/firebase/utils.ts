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
  deleteDoc,
  collection,
  limitToLast,
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

export async function deleteMessage(docId: string): Promise<void> {
  const docRef = doc(messagesRef, docId);
  await deleteDoc(docRef);
}
