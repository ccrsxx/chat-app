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
  setDoc,
  getDocs,
  orderBy,
  updateDoc,
  deleteDoc,
  collection,
  limitToLast,
  getFirestore,
  serverTimestamp
} from 'firebase/firestore';
import {
  ref,
  getStorage,
  getDownloadURL,
  uploadBytesResumable
} from 'firebase/storage';
import { getToken, getMessaging } from 'firebase/messaging';
import { getFirebaseConfig } from './config';
import { messageConverter } from './converter';
import type { Message } from './converter';
import type {
  Query,
  DocumentData,
  DocumentReference
} from 'firebase/firestore';

initializeApp(getFirebaseConfig());

export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();

export const messagesRef = collection(db, 'messages');
export const tokensRef = collection(db, 'tokens');

export function signIn(): void {
  const provider = new GoogleAuthProvider();
  void signInWithPopup(auth, provider);
}

export function signOut(): void {
  void signOutAuth(auth);
}

export function getMessagesQuery(many: number): Query<Message> {
  return query(
    messagesRef,
    orderBy('createdAt', 'asc'),
    limitToLast(many)
  ).withConverter(messageConverter);
}

export async function getMessagesSize(): Promise<number> {
  const messages = await getDocs(messagesRef);
  return messages.size;
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

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const filepath = `images/${auth.currentUser!.uid}/${imageName}`;
        const imageRef = ref(storage, filepath);

        let publicImageUrl: string;

        try {
          publicImageUrl = await getDownloadURL(imageRef);
        } catch {
          await uploadBytesResumable(imageRef, image);
          publicImageUrl = await getDownloadURL(imageRef);
        }

        await updateDoc(messageRef, {
          imageData: {
            src: publicImageUrl,
            alt: imageName
          }
        });
      })
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(
      'There was an error sending the images to the server:',
      error
    );
  }
}

export async function deleteAllMessages(): Promise<void> {
  const docsRef = await getDocs(messagesRef);
  await Promise.all(docsRef.docs.map(({ id }) => deleteMessage(id)));
}

export async function saveMessagingDeviceToken(): Promise<void> {
  try {
    const currentToken = await getToken(getMessaging());

    if (currentToken) {
      console.info('Got FCM device token:', currentToken);

      const tokenRef = doc(tokensRef, currentToken);

      await setDoc(tokenRef, {
        name: auth.currentUser?.displayName,
        uid: auth.currentUser?.uid
      });
    } else void requestNotificationsPermissions();
  } catch (error) {
    console.error('Unable to get messaging token.', error);
  }
}

async function requestNotificationsPermissions(): Promise<void> {
  console.info('Requesting notifications permission...');
  const permission = await Notification.requestPermission();

  if (permission === 'granted') {
    console.info('Notification permission granted.');
    await saveMessagingDeviceToken();
  } else console.error('Unable to get permission to notify.');
}
