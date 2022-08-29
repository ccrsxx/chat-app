import cn from 'clsx';
import { Button } from '@components/ui/button';
import { RiDeleteBinLine, RiEditLine } from '@assets/icons';

type MessageOptionsProps = {
  goToEditMode: (() => void) | null;
  deleteMessage: () => void;
};

export function MessageOptions({
  goToEditMode,
  deleteMessage
}: MessageOptionsProps): JSX.Element {
  return (
    <div
      className='flex translate-x-4 flex-col rounded-lg text-primary/80 transition focus-within:translate-x-0
                 focus-within:bg-bubble group-hover:translate-x-0 group-hover:bg-bubble inner:!p-1.5 inner:text-sm
                 inner:opacity-0 inner:focus-within:opacity-100 inner:group-hover:opacity-100 md:inner:!p-2'
    >
      {goToEditMode && (
        <Button
          className='rounded-b-none hover:bg-blue-400'
          Icon={RiEditLine}
          onClick={goToEditMode}
        />
      )}
      <Button
        className={cn('hover:bg-red-400', goToEditMode && 'rounded-t-none')}
        Icon={RiDeleteBinLine}
        onClick={deleteMessage}
      />
    </div>
  );
}
