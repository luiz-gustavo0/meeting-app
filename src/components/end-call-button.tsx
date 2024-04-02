'use client';

import { useRouter } from 'next/navigation';
import { useCall, useCallStateHooks } from '@stream-io/video-react-sdk';

import { Button } from './ui/button';

export const EndCallButton = () => {
  const router = useRouter();
  const call = useCall();
  const { useLocalParticipant } = useCallStateHooks();
  const localParticipant = useLocalParticipant();

  const isMeetingOwner =
    localParticipant &&
    call?.state.createdBy &&
    localParticipant.userId === call.state.createdBy.id;

  const endCall = async () => {
    await call?.endCall();
    router.push('/');
  };

  if (!isMeetingOwner) return null;

  return (
    <Button onClick={endCall} className='bg-red-500'>
      End call for everyone
    </Button>
  );
};
