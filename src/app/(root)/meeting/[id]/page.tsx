'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { StreamCall, StreamTheme } from '@stream-io/video-react-sdk';

import { MeetingRoom } from '@/components/meeting-room';
import { MeetingSetup } from '@/components/meeting-setup';
import { useGetCallById } from '@/hooks/useGetCallById';
import { Loader } from '@/components/loader';

type Props = {
  params: { id: string };
};

const MeetingPage = ({ params }: Props) => {
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const { user, isLoaded } = useUser();
  const { call, isCallLoading } = useGetCallById(params.id);

  if (!isLoaded || isCallLoading) {
    return <Loader />;
  }

  return (
    <div className='h-screen w-full'>
      <StreamCall call={call}>
        <StreamTheme>
          {!isSetupComplete ? (
            <MeetingSetup setIsSetupComplete={setIsSetupComplete} />
          ) : (
            <MeetingRoom />
          )}
        </StreamTheme>
      </StreamCall>
    </div>
  );
};

export default MeetingPage;
