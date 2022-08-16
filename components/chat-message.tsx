import { ImageLoader } from './ui/image-loader';

type ChatItemProps = {
  uid: string;
  name: string;
  text: string;
  photoURL: string;
  createdAt: number;
  editedAt: number | null;
};

export function ChatMessage({
  uid,
  name,
  text,
  photoURL,
  editedAt,
  createdAt
}: ChatItemProps): JSX.Element {
  return (
    <li className='flex gap-4'>
      <ImageLoader
        divStyle='w-10 h-10 rounded-full mt-1'
        imageStyle='rounded-full'
        src={photoURL}
        alt={name}
      />
      <div className='flex flex-col'>
        <p className='font-medium text-primary'>{name}</p>
        <p className='whitespace-pre-line text-secondary'>{text}</p>
      </div>
    </li>
  );
}
