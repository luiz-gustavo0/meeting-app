import { SignUp } from '@clerk/nextjs';

const SignUpPage = () => {
  return (
    <main className='h-screen flex items-center justify-center'>
      <SignUp />
    </main>
  );
};

export default SignUpPage;
