import { firestore, functions, regionalFunctions } from './utils';

export const welcomeMessage = regionalFunctions.auth
  .user()
  .onCreate(async (user) => {
    functions.logger.info('A new user signed in for the first time.');

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

    functions.logger.info('Welcome message written to database.');
  });
