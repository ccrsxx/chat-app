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
  getFirestore,
  serverTimestamp
} from 'firebase/firestore';
import {
  ref,
  getStorage,
  getDownloadURL,
  uploadBytesResumable
} from 'firebase/storage';
import { getToken, getMessaging, onMessage } from 'firebase/messaging';
import { getFirebaseConfig } from './config';
import { messageConverter } from './converter';
import type { DocumentReference, DocumentData } from 'firebase/firestore';

initializeApp(getFirebaseConfig());

export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();

export const messagesRef = collection(db, 'messages');
export const tokensRef = collection(db, 'tokens');

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
  const messaging = getMessaging();

  try {
    const currentToken = await getToken(messaging);
    if (currentToken) {
      console.info('Got FCM device token:', currentToken);

      const tokenRef = doc(tokensRef, currentToken);
      await setDoc(tokenRef, { uid: auth?.currentUser?.uid });

      // This will fire when a message is received while the app is in the foreground.
      // When the app is in the background, firebase-messaging-sw.js will receive the message instead.
      onMessage(messaging, (message) => {
        console.info(
          'New foreground notification from Firebase Messaging!',
          message.notification
        );
      });
    }
    // Need to request permissions to show notifications.
    else void requestNotificationsPermissions();
  } catch (error) {
    console.error('Unable to get messaging token.', error);
  }
}

async function requestNotificationsPermissions(): Promise<void> {
  console.info('Requesting notifications permission...');
  const permission = await Notification.requestPermission();

  if (permission === 'granted') {
    console.info('Notification permission granted.');
    // Notification permission granted.
    await saveMessagingDeviceToken();
  } else console.error('Unable to get permission to notify.');
}
