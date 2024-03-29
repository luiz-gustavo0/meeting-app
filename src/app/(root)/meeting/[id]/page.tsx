type Props = {
  params: { id: string };
};

const MeetingPage = ({ params }: Props) => {
  return <div>MeetingIdPage #{params.id}</div>;
};

export default MeetingPage;
