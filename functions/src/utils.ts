import * as functions from 'firebase-functions';

const regionalFunctions = functions.region('asia-southeast2');

export { firestore, messaging } from 'firebase-admin';
export { functions, regionalFunctions };
