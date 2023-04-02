import Image from 'next/image';

export const InkBlotBG = () => {
  return (
    <>
      <video
        preload='auto'
        playsInline
        autoPlay
        muted
        loop
        className='bg-dark invisible fixed left-0 top-0 -z-[1] h-full w-full object-contain object-top sm:visible sm:object-center'
      >
        <source src='/video/inkblot1080.webm' type='video/webm' />
        <source src='/video/inkblot1080.mp4' type='video/mp4; codecs=hvc1' />
      </video>
      <div className='bg-dark visible fixed left-0 top-0 -z-[1] h-screen w-full pt-10 sm:invisible'>
        <Image
          src='/images/inkblot_logo.png'
          alt='inkblot'
          width='3133'
          height='1304'
          className='h-full w-full object-contain object-top'
        />
      </div>
    </>
  );
};
