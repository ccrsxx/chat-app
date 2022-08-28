import { motion } from 'framer-motion';
import cn from 'clsx';
import { Button } from '@components/ui/button';
import { RiCloseLine } from '@assets/icons';

type ExitModeProps = {
  isDisabled: boolean;
  isMobile: boolean;
  addWithIcon: () => void;
  exitEditMode: () => void;
};

export const variants = {
  initial: { height: 0, opacity: 0 },
  animate: { height: 'auto', opacity: 1 },
  exit: { height: 0, opacity: 0, transition: { duration: 0.2 } }
};

export function EditMode({
  isMobile,
  isDisabled,
  addWithIcon,
  exitEditMode
}: ExitModeProps): JSX.Element {
  return (
    <motion.div
      className={cn(
        'flex items-center gap-2 text-primary/80',
        isMobile && 'justify-between'
      )}
      variants={variants}
      initial='initial'
      animate='animate'
      exit='exit'
    >
      <p className='font-medium'>Editing mode</p>
      {isMobile ? (
        <Button
          className='mr-14 bg-neutral-800 !p-1 hover:bg-red-400'
          Icon={RiCloseLine}
          onClick={exitEditMode}
        />
      ) : (
        <>
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
        </>
      )}
    </motion.div>
  );
}
