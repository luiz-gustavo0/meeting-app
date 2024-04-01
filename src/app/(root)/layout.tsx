import { StreamVideoProvider } from '@/providers/stream-client';

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <StreamVideoProvider>
      <main>{children}</main>
    </StreamVideoProvider>
  );
};

export default RootLayout;
