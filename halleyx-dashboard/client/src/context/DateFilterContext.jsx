import React, { createContext, useContext, useState } from 'react';

const DateFilterContext = createContext();

export const useDateFilter = () => {
  return useContext(DateFilterContext);
};

export const DateFilterProvider = ({ children }) => {
  const [dateRange, setDateRange] = useState('ALL_TIME');

  return (
    <DateFilterContext.Provider value={{ dateRange, setDateRange }}>
      {children}
    </DateFilterContext.Provider>
  );
};
