import { useEffect, useState } from 'react';

export const BSOD = ({ message }: { message: string }) => {
  const [typed, setTyped] = useState('');
  const [continue_, setContinue] = useState(false);
  const [_rocked, kickRocks] = useState(false);
  useEffect(() => {
    // type chars into state at random intervals
    const chars = message.split('');
    let lastChar = '';
    const type = () => {
      lastChar = chars.shift() || '';
      setTyped((prev) => prev + lastChar);
      if (chars.length === 0) return setTimeout(() => setContinue(true), 1000);
      if (lastChar === '.') {
        chars.unshift('\n\n');
        setTimeout(type, 2000);
      } else {
        setTimeout(type, Math.random() * 300);
      }
    };
    type();
  }, [message]);

  useEffect(() => {
    if (!continue_) return;
    const send = () => {
      kickRocks(true);

      window.location.href =
        'https://zora.co/collect/0xd0c4c3c6297f5bff0ff358d66483f8481a184236';
    };
    window.addEventListener('keydown', send);
    window.addEventListener('touch', send);
  }, [continue_]);

  // if (rocked) {
  //   return (
  //     <>
  //       <NewWindow url='https://www.youtube.com/watch?v=n4QSYx4wVQg' />
  //     </>
  //   );
  // }

  return (
    <div className='flex h-screen w-full flex-col items-center justify-center bg-[#0000EE] text-center text-white'>
      <h1 className='mb-10 bg-white px-2 text-[#0000EE]'>PC69 Fatal Error</h1>
      <h1 className='mb-10 whitespace-pre-line'>
        {typed}
        <span className='ml-[1px] animate-ping text-xl'>|</span>
      </h1>
      {continue_ && (
        <>
          <h1>Press any key to continue _</h1>
          <iframe src='/api/auth/logout' className='h-0 w-0 opacity-0'></iframe>
        </>
      )}
    </div>
  );
};
