import React, { createContext, useContext, useCallback, useMemo } from 'react';
import { Schedule } from './types.ts';
import dummyScheduleMap from './dummyScheduleMap.ts';

interface ScheduleContextType {
  getSchedules: (tableId: string) => Schedule[];
  updateSchedule: (tableId: string, index: number, newSchedule: Schedule) => void;
  addSchedule: (tableId: string, schedule: Schedule) => void;
  removeSchedule: (tableId: string, index: number) => void;
  getTableIds: () => string[];
  addTable: () => void;
  removeTable: (tableId: string) => void;
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

export const useScheduleContext = () => {
  const context = useContext(ScheduleContext);
  if (context === undefined) {
    throw new Error('useSchedule must be used within a ScheduleProvider');
  }
  return context;
};

export const ScheduleProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [schedulesMap, setSchedulesMap] = React.useState<Record<string, Schedule[]>>(dummyScheduleMap);

  const getSchedules = useCallback((tableId: string) => schedulesMap[tableId] || [], [schedulesMap]);

  const updateSchedule = useCallback((tableId: string, index: number, newSchedule: Schedule) => {
    setSchedulesMap(prev => ({
      ...prev,
      [tableId]: prev[tableId].map((schedule, i) => i === index ? newSchedule : schedule)
    }));
  }, []);

  const addSchedule = useCallback((tableId: string, schedule: Schedule) => {
    setSchedulesMap(prev => ({
      ...prev,
      [tableId]: [...prev[tableId], schedule]
    }));
  }, []);

  const removeSchedule = useCallback((tableId: string, index: number) => {
    setSchedulesMap(prev => ({
      ...prev,
      [tableId]: prev[tableId].filter((_, i) => i !== index)
    }));
  }, []);

  const getTableIds = useCallback(() => Object.keys(schedulesMap), [schedulesMap]);

  const addTable = useCallback(() => {
    const newTableId = `schedule-${Date.now()}`;
    setSchedulesMap(prev => ({
      ...prev,
      [newTableId]: []
    }));
  }, []);

  const removeTable = useCallback((tableId: string) => {
    setSchedulesMap(prev => {
      const newMap = { ...prev };
      delete newMap[tableId];
      return newMap;
    });
  }, []);

  const contextValue = useMemo(() => ({
    getSchedules,
    updateSchedule,
    addSchedule,
    removeSchedule,
    getTableIds,
    addTable,
    removeTable
  }), [getSchedules, updateSchedule, addSchedule, removeSchedule, getTableIds, addTable, removeTable]);

  return (
    <ScheduleContext.Provider value={contextValue}>
      {children}
    </ScheduleContext.Provider>
  );
};