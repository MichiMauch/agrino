"use client";

import { ReactNode, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

type SearchParamsProviderProps = {
  children: (userId: number) => ReactNode;
};

const SearchParamsProvider: React.FC<SearchParamsProviderProps> = ({ children }) => {
  const searchParams = useSearchParams();
  const userId = parseInt(searchParams?.get('user') || '1');

  useEffect(() => {
    console.log(`UserId resolved: ${userId}`);
  }, [userId]);

  return <>{children(userId)}</>;
};

export default SearchParamsProvider;
