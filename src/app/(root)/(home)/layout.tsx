const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className='relative min-h-screen flex flex-col'>
      Navbar
      <div className='flex flex-1'>
        Sidebar
        <section className='flex flex-1 flex-col px-6 pb-6 pt-28 max-md:pb-14 sm:px-14'>
          <div className='w-full'>{children}</div>
        </section>
      </div>
    </main>
  );
};

export default HomeLayout;
