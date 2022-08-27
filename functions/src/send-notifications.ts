import { firestore, messaging, functions, regionalFunctions } from './utils';
import type { WriteResult, FieldValue } from 'firebase-admin/firestore';
import type {
  MessagingPayload,
  MessagingDevicesResponse
} from 'firebase-admin/messaging';

export type Message = {
  uid: string;
  name: string;
  text: string | null;
  photoURL: string;
  imageData: { src: string; alt: string } | null;
  createdAt: FieldValue;
  editedAt: FieldValue | null;
};

export const sendNotifications = regionalFunctions.firestore
  .document('messages/{messageId}')
  .onCreate(async (snapshot) => {
    functions.logger.info('New message created.');

    const { uid, name, text, photoURL } = snapshot.data() as Message;

    const payload: MessagingPayload = {
      notification: {
        title: `${name} sent ${text ? 'a message' : 'an image'}`,
        body: text ?? '',
        icon: photoURL,
        clickAction: 'https://chat-app-ccrsxx.vercel.app'
      }
    };

    functions.logger.info('Notification payload:', payload);

    const allTokens = await firestore()
      .collection('tokens')
      .where('uid', '!=', uid)
      .get();

    const tokensId = allTokens.docs.map(({ id }) => id);

    if (tokensId.length) {
      const response = await messaging().sendToDevice(tokensId, payload);
      await cleanupTokens(response, tokensId);

      functions.logger.info(
        'Notifications have been sent and tokens cleaned up.'
      );
    }
  });

function cleanupTokens(
  response: MessagingDevicesResponse,
  tokens: string[]
): Promise<WriteResult[]> {
  const tokensToDelete: Promise<WriteResult>[] = [];

  response.results.forEach((result, index) => {
    const { error } = result;
    if (error) {
      functions.logger.error(
        'Failure sending notification to',
        tokens[index],
        error
      );
      if (
        error.code === 'messaging/invalid-registration-token' ||
        error.code === 'messaging/registration-token-not-registered'
      ) {
        const deleteTask = firestore()
          .collection('tokens')
          .doc(tokens[index])
          .delete();

        tokensToDelete.push(deleteTask);
      }
    }
  });

  return Promise.all(tokensToDelete);
}
