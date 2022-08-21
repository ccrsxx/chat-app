import { Button } from '@components/ui/button';
import { RiDeleteBinLine, RiEditLine } from '@assets/icons';

type MessageOptionsProps = {
  goToEditMode: () => void;
  deleteMessage: () => void;
};

export function MessageOptions({
  goToEditMode,
  deleteMessage
}: MessageOptionsProps): JSX.Element {
  return (
    <div
      className='flex translate-x-4 flex-col rounded-lg transition
                 group-hover:translate-x-0 group-hover:bg-bubble 
                 inner:opacity-0 inner:group-hover:opacity-100'
    >
      <Button
        className='rounded-b-none !p-2 text-sm text-primary/80 hover:bg-blue-400'
        Icon={RiEditLine}
        onClick={goToEditMode}
      />
      <Button
        className='rounded-t-none !p-2 text-sm text-primary/80 hover:bg-red-400'
        Icon={RiDeleteBinLine}
        onClick={deleteMessage}
      />
    </div>
  );
}
