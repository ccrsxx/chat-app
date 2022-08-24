import * as functions from 'firebase-functions';
import { firestore } from './db';

export const welcomeMessage = functions
  .region('asia-southeast2')
  .auth.user()
  .onCreate(async (user) => {
    functions.logger.log('A new user signed in for the first time.');

    const fullName = user.displayName ?? 'Anonymous';

    await firestore()
      .collection('messages')
      .add({
        name: 'Firebase Bot',
        text: `${fullName} signed in for the first time! Welcome!`,
        photoURL: '/images/firebase-logo.png',
        imageData: null,
        createdAt: firestore.FieldValue.serverTimestamp(),
        editedAt: null,
        uid: 'firebase-bot'
      });

    functions.logger.log('Welcome message written to database.');
  });
