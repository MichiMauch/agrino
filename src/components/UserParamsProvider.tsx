"use client";

import { ReactNode, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

type UserParamsProviderProps = {
  children: (userId: number) => ReactNode;
  onUserIdResolved: (userId: number) => void;
};

const UserParamsProvider: React.FC<UserParamsProviderProps> = ({ children, onUserIdResolved }) => {
  const searchParams = useSearchParams();
  const userId = parseInt(searchParams?.get('user') || '1');

  useEffect(() => {
    onUserIdResolved(userId);
  }, [userId, onUserIdResolved]);

  return <>{children(userId)}</>;
};

export default UserParamsProvider;
