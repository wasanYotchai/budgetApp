import React from 'react';
import Link from 'next/link'; // Ensure you import Link if you're using Next.js
import { Button } from "@/components/ui/button"; // Adjust the import based on your button component

const NotFound = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen px-4 text-center bg-[#f7f2e7]'>
      <h1 className='text-8xl font-bold text-[#6b4f4f] mb-4 drop-shadow-lg'>404</h1>
      <h2 className='text-3xl font-semibold text-[#4a3c3c] mb-4'>Page Not Found</h2>
      <p className='text-[#6b4f4f] mb-8'>
        Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link href="/">
        <Button className='bg-[#e8d8c3] text-[#6b4f4f] hover:bg-[#d1c6b8] transition duration-300 rounded-lg shadow-md'>
          Return Home
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;

