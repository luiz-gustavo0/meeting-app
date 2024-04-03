'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';
import ReactDatePicker from 'react-datepicker';

import { useToast } from './ui/use-toast';
import { HomeCard } from './home-card';
import { MeetingModal } from './meeting-modal';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';

type MeetingState =
  | 'isScheduleMeeting'
  | 'isJoiningMeeting'
  | 'isInstantMeeting'
  | undefined;

export const MeetingTypeList = () => {
  const [meetingState, setMeetingState] = useState<MeetingState>();
  const [values, setValues] = useState({
    dateTime: new Date(),
    description: '',
    link: '',
  });
  const [callDetails, setCallDetails] = useState<Call>();
  const router = useRouter();

  const user = useUser();
  const videoClient = useStreamVideoClient();
  const { toast } = useToast();

  const createMeeting = async () => {
    if (!videoClient || !user) return;

    try {
      if (!values.dateTime) {
        toast({ title: 'Please select a date and time' });
        return;
      }

      const id = crypto.randomUUID();
      const call = videoClient.call('default', id);

      if (!call) throw new Error('Failed to create call');

      const startsAt =
        values.dateTime.toISOString() || new Date(Date.now()).toISOString();
      const description = values.description || 'Instant meeting';

      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            description,
          },
        },
      });

      setCallDetails(call);

      if (!values.description) {
        router.push(`/meeting/${call.id}`);
      }

      toast({ title: 'Meeting created' });
    } catch (error) {
      console.log(error);
      toast({
        title: 'Failed to create meeting',
      });
    }
  };

  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`;

  return (
    <section className='grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4'>
      <HomeCard
        img='/icons/add-meeting.svg'
        title='New Meeting'
        description='Start an instant meeting'
        handleClick={() => setMeetingState('isInstantMeeting')}
      />
      <HomeCard
        img='/icons/join-meeting.svg'
        title='Join Meeting'
        description='via invitation link'
        className='bg-blue-1'
        handleClick={() => setMeetingState('isJoiningMeeting')}
      />
      <HomeCard
        img='/icons/schedule.svg'
        title='Schedule Meeting'
        description='Plan your meeting'
        className='bg-purple-1'
        handleClick={() => setMeetingState('isScheduleMeeting')}
      />
      <HomeCard
        img='/icons/recordings.svg'
        title='View Recordings'
        description='Meeting Recordings'
        className='bg-yellow-1'
        handleClick={() => router.push('/recordings')}
      />

      {!callDetails ? (
        <MeetingModal
          isOpen={meetingState === 'isScheduleMeeting'}
          onClose={() => setMeetingState(undefined)}
          title='Create Meeting'
          handleClick={createMeeting}
        >
          <div className='flex flex-col gap-2.5'>
            <label className='text-base font-normal leading-[22px] text-sky-2'>
              Add a descripiton
            </label>
            <Textarea
              className='border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0'
              onChange={(e) =>
                setValues({ ...values, description: e.target.value })
              }
            />
          </div>
          <div className='flex w-full flex-col  gap-2.5'>
            <label className='text-base font-normal leading-[22px] text-sky-2'>
              Select Date and Time
            </label>

            <ReactDatePicker
              selected={values.dateTime}
              onChange={(date) => setValues({ ...values, dateTime: date! })}
              showTimeSelect
              timeFormat='HH::mm'
              timeIntervals={15}
              timeCaption='time'
              dateFormat='MMMM d, yyyy h:mm aa'
              className='w-full rounded bg-dark-3 p-2 focus:outline-none'
            />
          </div>
        </MeetingModal>
      ) : (
        <MeetingModal
          isOpen={meetingState === 'isScheduleMeeting'}
          onClose={() => setMeetingState(undefined)}
          title='Meeting created'
          className='text-center'
          handleClick={() => {
            navigator.clipboard.writeText(meetingLink);
            toast({ title: 'Link copied' });
          }}
          image='/icons/checked.svg'
          buttonIcon='/icons/copy.svg'
          buttonText='Copy Metting Link'
        />
      )}

      <MeetingModal
        isOpen={meetingState === 'isInstantMeeting'}
        onClose={() => setMeetingState(undefined)}
        title='Start an Instant Meeting'
        className='text-center'
        buttonText='Start Metting'
        handleClick={createMeeting}
      />

      <MeetingModal
        isOpen={meetingState === 'isJoiningMeeting'}
        onClose={() => setMeetingState(undefined)}
        title='Type the link here'
        className='text-center'
        buttonText='Join Metting'
        handleClick={() => router.push(values.link)}
      >
        <Input
          placeholder='Meeting link'
          className='border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0'
          onChange={(e) => setValues({ ...values, link: e.target.value })}
        />
      </MeetingModal>
    </section>
  );
};
