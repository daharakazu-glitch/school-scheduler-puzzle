import React, { createContext, useReducer, useContext, type ReactNode } from 'react';
import type { Session, Instructor, ScheduleError, SchoolSettings } from '../engine/types';
import { validateSchedule } from '../engine/constraints';
import { defaultSettings } from '../engine/initialData';

interface ScheduleState {
    settings: SchoolSettings;
    sessions: Session[];
    instructors: Instructor[];
    errors: ScheduleError[];
}

type Action =
    | { type: 'INIT_DATA'; payload: { settings: SchoolSettings; sessions: Session[]; instructors: Instructor[] } }
    | { type: 'UPDATE_SETTINGS'; payload: SchoolSettings }
    | { type: 'MOVE_SESSION'; payload: { sessionId: string; day: Session['assignedDay']; period: Session['assignedPeriod'] } };

const initialState: ScheduleState = {
    settings: defaultSettings,
    sessions: [],
    instructors: [],
    errors: [],
};

function scheduleReducer(state: ScheduleState, action: Action): ScheduleState {
    switch (action.type) {
        case 'INIT_DATA': {
            const { settings, sessions, instructors } = action.payload;
            const errors = validateSchedule(sessions, instructors, settings);
            return { settings, sessions, instructors, errors };
        }
        case 'UPDATE_SETTINGS': {
            const newSettings = action.payload;
            const errors = validateSchedule(state.sessions, state.instructors, newSettings);
            return { ...state, settings: newSettings, errors };
        }
        case 'MOVE_SESSION': {
            const { sessionId, day, period } = action.payload;
            const newSessions = state.sessions.map(s =>
                s.id === sessionId ? { ...s, assignedDay: day, assignedPeriod: period } : s
            );
            const errors = validateSchedule(newSessions, state.instructors, state.settings);
            return { ...state, sessions: newSessions, errors };
        }
        default:
            return state;
    }
}

interface ScheduleContextType {
    state: ScheduleState;
    dispatch: React.Dispatch<Action>;
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

export const ScheduleProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(scheduleReducer, initialState);

    return (
        <ScheduleContext.Provider value={{ state, dispatch }}>
            {children}
        </ScheduleContext.Provider>
    );
};

export const useScheduleContext = () => {
    const context = useContext(ScheduleContext);
    if (!context) {
        throw new Error('useScheduleContext must be used within a ScheduleProvider');
    }
    return context;
};
