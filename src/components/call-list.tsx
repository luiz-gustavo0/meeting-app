'use client';

import { useEffect, useState } from 'react';
import { Call, CallRecording } from '@stream-io/video-react-sdk';
import { useRouter } from 'next/navigation';

import { useGetCall } from '@/hooks/useGetCall';
import { MeetingCard } from './meeting-card';
import { Loader } from './loader';
import { toast } from './ui/use-toast';

type CallListProps = {
  type: 'ended' | 'upcoming' | 'recordings';
};

export const CallList = ({ type }: CallListProps) => {
  const [recordings, setRecordings] = useState<CallRecording[]>([]);
  const { callRecordings, endedCalls, isLoading, upcomingCalls } = useGetCall();
  const router = useRouter();

  const getCalls = () => {
    switch (type) {
      case 'ended':
        return endedCalls;
      case 'recordings':
        return recordings;
      case 'upcoming':
        return upcomingCalls;
      default:
        return [];
    }
  };

  const getNoCallsMessages = () => {
    switch (type) {
      case 'ended':
        return 'No previous calls';
      case 'recordings':
        return 'No recordings';
      case 'upcoming':
        return 'No upcoming calls';
      default:
        return '';
    }
  };

  useEffect(() => {
    const fetchRecordings = async () => {
      try {
        const callData = await Promise.all(
          callRecordings.map((meeting) => meeting.queryRecordings()) ?? []
        );
        const recordingsData = callData
          .filter((call) => call.recordings.length > 0)
          .flatMap((call) => call.recordings);

        setRecordings(recordingsData);
      } catch (error) {
        toast({ title: 'Try again later' });
      }
    };

    if (type === 'recordings') {
      fetchRecordings();
    }
  }, [callRecordings, type]);

  const calls = getCalls();
  const noCallsMessage = getNoCallsMessages();

  if (isLoading) return <Loader />;

  return (
    <div className='grid grid-cols-1 gap-5 xl:grid-cols-2'>
      {calls && calls.length > 0 ? (
        calls.map((meeting: Call | CallRecording) => (
          <MeetingCard
            key={(meeting as Call).id}
            icon={
              type === 'ended'
                ? '/icons/previous.svg'
                : type === 'upcoming'
                ? '/icons/upcoming.svg'
                : '/icons/recordings.svg'
            }
            title={
              (meeting as Call).state?.custom?.description ||
              (meeting as CallRecording).filename?.substring(0, 20) ||
              'No Description'
            }
            date={
              (meeting as Call).state?.startsAt?.toLocaleString() ||
              (meeting as CallRecording).start_time?.toLocaleString()
            }
            isPreviousMeeting={type === 'ended'}
            link={
              type === 'recordings'
                ? (meeting as CallRecording).url
                : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${
                    (meeting as Call).id
                  }`
            }
            buttonIcon1={type === 'recordings' ? '/icons/play.svg' : undefined}
            buttonText={type === 'recordings' ? 'Play' : 'Start'}
            handleClick={
              type === 'recordings'
                ? () => router.push(`${(meeting as CallRecording).url}`)
                : () => router.push(`/meeting/${(meeting as Call).id}`)
            }
          />
        ))
      ) : (
        <h1 className='text-2xl font-bold text-white'>{noCallsMessage}</h1>
      )}
    </div>
  );
};
