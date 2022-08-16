import type {
  Timestamp,
  DocumentData,
  WithFieldValue,
  SnapshotOptions,
  QueryDocumentSnapshot,
  FirestoreDataConverter
} from 'firebase/firestore';

export type Message = {
  id: string;
  name: string;
  text: string;
  photoURL: string;
  createdAt: number;
  editedAt: number | null;
  uid: string;
};

export type Messages = Message[];

export const messageConverter: FirestoreDataConverter<Message> = {
  toFirestore({
    name,
    text,
    photoURL,
    createdAt,
    editedAt,
    uid
  }: WithFieldValue<Message>): DocumentData {
    return {
      name,
      text,
      photoURL,
      createdAt,
      editedAt,
      uid
    };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Message {
    const { id } = snapshot;
    const { name, text, photoURL, createdAt, editedAt, uid } = snapshot.data(
      options
    ) as Omit<Message, 'createdAt' | 'editedAt'> & {
      createdAt: Timestamp;
      editedAt: Timestamp | null;
    };

    return {
      id,
      name,
      text,
      photoURL,
      createdAt: createdAt?.toMillis() ?? null,
      editedAt: editedAt?.toMillis() ?? null,
      uid
    };
  }
};
