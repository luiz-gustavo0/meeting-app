import Image from 'next/image';

import { cn } from '@/lib/utils';

import { Dialog, DialogContent } from './ui/dialog';
import { Button } from './ui/button';

type Props = {
  isOpen: boolean;
  onClose: VoidFunction;
  title: string;
  className?: string;
  buttonText?: string;
  handleClick?: VoidFunction;
  image?: string;
  buttonIcon?: string;
  children?: React.ReactNode;
};

export const MeetingModal = ({
  isOpen,
  onClose,
  title,
  buttonIcon,
  buttonText,
  children,
  className,
  handleClick,
  image,
}: Props) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='flex w-full max-w-[520px] flex-col gap-6 border-none bg-dark-1 px-6 py-9 text-white'>
        {image && (
          <div className='flex justify-center'>
            <Image src={image} alt='' width={72} height={72} />
          </div>
        )}
        <h1 className={cn('text-3xl font-bold leading-[42px]', className)}>
          {title}
        </h1>
        {children}
        <Button
          className='bg-blue-1 focus-visible:right-0 focus-visible:ring-offset-0'
          onClick={handleClick}
        >
          {buttonIcon && (
            <Image src={buttonIcon} alt='' width={13} height={13} />
          )}
          &nbsp;
          {buttonText || 'Schedule Meeting'}
        </Button>
      </DialogContent>
    </Dialog>
  );
};
