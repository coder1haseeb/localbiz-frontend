'use client';

import { createContext, useContext, useState } from 'react';

const Context = createContext(null);

export default function BusinessRegistrationProvider({ children }) {
  const [ownerData, setOwnerData] = useState(null);
  return <Context.Provider value={{ ownerData, setOwnerData }}>{children}</Context.Provider>;
}

export function useBusinessRegistration() {
  const value = useContext(Context);
  if (!value) throw new Error('Business registration provider is missing');
  return value;
}
