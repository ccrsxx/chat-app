import { createTransport } from 'nodemailer';
import { functions, regionalFunctions } from './utils';
import type { Message } from './send-notifications';

export const notifyEmail = regionalFunctions.firestore
  .document('messages/{messageId}')
  .onCreate(async (snapshot) => {
    functions.logger.info('Sending notification email.');

    const { name, text } = snapshot.data() as Message;

    const client = createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_API,
        pass: process.env.EMAIL_API_PASSWORD
      }
    });

    await client.sendMail({
      from: process.env.EMAIL_API,
      to: process.env.TARGET_EMAIL,
      subject: `Chat App - ${name} sent ${text ? 'a message' : 'an image'}`,
      text: `${text ?? 'No text provided'}\n\n- Firebase Functions`
    });

    functions.logger.info('Notification email sent.');
  });
