/* eslint-disable no-console */

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
import {
  ref,
  getStorage,
  getDownloadURL,
  uploadBytesResumable
} from 'firebase/storage';
import { getFirebaseConfig } from './config';
import { messageConverter } from './converter';
import type { DocumentReference, DocumentData } from 'firebase/firestore';

initializeApp(getFirebaseConfig());

export const db = getFirestore();
export const storage = getStorage();
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

export async function sendMessage(
  text: string | null
): Promise<DocumentReference<DocumentData>> {
  const {
    displayName: name,
    photoURL,
    uid
  } = auth.currentUser as {
    displayName: string;
    photoURL: string;
    uid: string;
  };

  return addDoc(messagesRef, {
    name,
    text,
    photoURL,
    imageData: null,
    createdAt: serverTimestamp(),
    editedAt: null,
    uid
  });
}

export function deleteMessage(docId: string): void {
  const docRef = doc(messagesRef, docId);
  void deleteDoc(docRef);
}

export function editMessage(docId: string, text: string): void {
  const docRef = doc(messagesRef, docId);
  void updateDoc(docRef, {
    text,
    editedAt: serverTimestamp()
  });
}

type MessageImage = {
  messageRef: DocumentReference<DocumentData>;
  image: File;
}[];

export async function sendImages(
  inputValue: string,
  selectedImages: File[]
): Promise<void> {
  const messagesRef: MessageImage = [];

  try {
    for (const image of selectedImages) {
      const messageRef = await sendMessage(null);
      messagesRef.push({ messageRef, image });
    }

    if (inputValue) await sendMessage(inputValue);

    await Promise.all(
      messagesRef.map(async ({ messageRef, image }) => {
        const imageName = image.name;

        const filepath = `images/${imageName}`;
        const imageRef = ref(storage, filepath);

        let publicImageUrl: string;

        try {
          publicImageUrl = await getDownloadURL(imageRef);
        } catch (error) {
          console.error(error);
          await uploadBytesResumable(imageRef, image);
          publicImageUrl = await getDownloadURL(imageRef);
        }

        await updateDoc(messageRef, {
          imageData: {
            url: publicImageUrl,
            name: imageName
          }
        });
      })
    );
  } catch (error) {
    console.error(
      'There was an error sending the images to the server:',
      error
    );
  }
}
