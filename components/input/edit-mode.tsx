import { motion } from 'framer-motion';
import { Button } from '@components/ui/button';
import { RiCloseLine } from '@assets/icons';

type ExitModeProps = {
  isDisabled: boolean;
  addWithIcon: () => void;
  exitEditMode: () => void;
};

export function EditMode({
  isDisabled,
  addWithIcon,
  exitEditMode
}: ExitModeProps): JSX.Element {
  return (
    <motion.div
      className='flex items-center justify-between text-primary/80'
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0, transition: { duration: 0.2 } }}
    >
      <div className='flex gap-2'>
        <p className='font-medium'>Editing mode</p>
        <span>|</span>
        <div className='flex items-center gap-1 text-sm text-secondary'>
          <p>
            <button
              className='smooth-tab text-blue-400 decoration-transparent underline-offset-2
                         hover:underline hover:decoration-blue-400 hover:brightness-110'
              type='button'
              onClick={exitEditMode}
            >
              escape
            </button>{' '}
            to cancel
          </p>
          <span>•</span>
          <p>
            <button
              className='smooth-tab text-blue-400 decoration-transparent underline-offset-2 
                         hover:underline hover:decoration-blue-400 hover:brightness-110
                         disabled:cursor-not-allowed'
              type='button'
              onClick={addWithIcon}
              disabled={isDisabled}
            >
              enter
            </button>{' '}
            to save
          </p>
        </div>
      </div>
      <Button
        className='bg-neutral-800 hover:bg-red-400 hover:brightness-110'
        Icon={RiCloseLine}
        onClick={exitEditMode}
      />
    </motion.div>
  );
}
