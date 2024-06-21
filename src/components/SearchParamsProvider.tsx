// components/SearchParamsProvider.tsx
"use client";

import { ReactNode } from 'react';
import { useSearchParams } from 'next/navigation';

type SearchParamsProviderProps = {
  children: ReactNode;
  onUserIdResolved: (userId: number) => void;
};

const SearchParamsProvider: React.FC<SearchParamsProviderProps> = ({ children, onUserIdResolved }) => {
  const searchParams = useSearchParams();
  const userId = parseInt(searchParams?.get('user') || '1');
  
  // Call the callback function when userId is resolved
  onUserIdResolved(userId);

  return <>{children}</>;
};

export default SearchParamsProvider;
