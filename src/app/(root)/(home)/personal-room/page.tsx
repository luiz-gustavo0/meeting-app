'use client';

import Image from 'next/image';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useGetCallById } from '@/hooks/useGetCallById';
import { useStreamVideoClient } from '@stream-io/video-react-sdk';

const PersonalRoomPage = () => {
  const { user } = useUser();

  const meetingId = user?.id;
  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meetingId}?personal=true`;

  const { call } = useGetCallById(meetingId!);
  const client = useStreamVideoClient();
  const router = useRouter();

  const startRomm = async () => {
    if (!client || !user) return;

    if (!call) {
      const newCall = client.call('default', user.id);

      await newCall.getOrCreate({
        data: {
          starts_at: new Date().toISOString(),
        },
      });
    }

    router.push(`/meeting/${meetingId}?personal=true`);
  };

  return (
    <section className='flex size-full flex-col gap-10 text-white'>
      <h1 className='text-3xl font-bold'>PersonalRoomPage</h1>

      <div className='flex w-full flex-col gap-8 xl:max-w-[900px]'>
        <Table title='Topic' description={`${user?.username}'s meeting room`} />
        <Table title='Meeting ID' description={meetingId!} />
        <Table title='Invite Link' description={meetingLink} />
      </div>

      <div className='flex gap-5'>
        <Button className='bg-blue-1 ' onClick={startRomm}>
          Satrt Meeting
        </Button>
        <Button
          className='bg-dark-3 '
          onClick={() => {
            navigator.clipboard.writeText(meetingLink);
            toast({ title: 'Link copied' });
          }}
        >
          <Image src='/icons/copy.svg' alt='feature' width={20} height={20} />
          &nbsp; Copy Invitation
        </Button>
      </div>
    </section>
  );
};

export default PersonalRoomPage;

type Props = {
  title: string;
  description: string;
};

const Table = ({ title, description }: Props) => {
  return (
    <div className='flex flex-col items-start gap-2 xl:flex-row'>
      <h2 className='text-base font-medium text-sky-1 lg:text-xl xl:min-w-32'>
        {title}:
      </h2>
      <span className='truncate text-sm font-bold max-sm:max-w-[320px] lg:text-xl'>
        {description}
      </span>
    </div>
  );
};
