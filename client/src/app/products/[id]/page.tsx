'use client';
// app/products/[id]/page.tsx
import { useParams, useRouter } from 'next/navigation';
import React from 'react';

const Cars = () => {
  const router = useRouter();
  const { id } = useParams();

  const handleClick = () => {
    router.push('/');
  };
  return (
    <>
      <h1>hihi {id}</h1>
      <button onClick={handleClick}>go back to home page</button>
    </>
  );
};

export default Cars;
