import React, { createContext, useReducer, useContext, useEffect, type ReactNode } from 'react';
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
    | { type: 'INIT_DATA'; payload: { settings?: SchoolSettings; sessions?: Session[]; instructors: Instructor[] } }
    | { type: 'UPDATE_SETTINGS'; payload: SchoolSettings }
    | { type: 'MOVE_SESSION'; payload: { sessionId: string; day: Session['assignedDay']; period: Session['assignedPeriod'] } }
    | { type: 'LOAD_STATE'; payload: ScheduleState };

const initialState: ScheduleState = {
    settings: defaultSettings,
    sessions: [],
    instructors: [],
    errors: [],
};

function syncSessionsWithAssignments(instructors: Instructor[], currentSessions: Session[]): Session[] {
    const newSessions: Session[] = [];
    instructors.forEach(instructor => {
        (instructor.assignments || []).forEach(assignment => {
            const existingSession = currentSessions.find(s => s.id === assignment.id);
            newSessions.push({
                id: assignment.id,
                subjectId: assignment.subjectId,
                classGroupId: assignment.classGroupId,
                instructorId: instructor.id,
                isRequiredSync: assignment.isRequiredSync || false,
                syncGroupId: assignment.syncGroupId,
                assignedDay: existingSession?.assignedDay,
                assignedPeriod: existingSession?.assignedPeriod,
            });
        });
    });
    return newSessions;
}

function scheduleReducer(state: ScheduleState, action: Action): ScheduleState {
    let newState = state;

    switch (action.type) {
        case 'LOAD_STATE': {
            newState = action.payload;
            break;
        }
        case 'INIT_DATA': {
            const settings = action.payload.settings || state.settings;
            const instructors = action.payload.instructors;
            // Generate sessions automatically from assignments OR use passed sessions
            const sessions = action.payload.sessions || syncSessionsWithAssignments(instructors, state.sessions);
            const errors = validateSchedule(sessions, instructors, settings);
            newState = { settings, sessions, instructors, errors };
            break;
        }
        case 'UPDATE_SETTINGS': {
            const newSettings = action.payload;
            const errors = validateSchedule(state.sessions, state.instructors, newSettings);
            newState = { ...state, settings: newSettings, errors };
            break;
        }
        case 'MOVE_SESSION': {
            const { sessionId, day, period } = action.payload;
            const newSessions = state.sessions.map(s =>
                s.id === sessionId ? { ...s, assignedDay: day, assignedPeriod: period } : s
            );
            const errors = validateSchedule(newSessions, state.instructors, state.settings);
            newState = { ...state, sessions: newSessions, errors };
            break;
        }
        default:
            return state;
    }

    if (action.type !== 'LOAD_STATE') {
        localStorage.setItem('schoolSchedulerState', JSON.stringify(newState));
    }

    return newState;
}

interface ScheduleContextType {
    state: ScheduleState;
    dispatch: React.Dispatch<Action>;
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

export const ScheduleProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(scheduleReducer, initialState);

    useEffect(() => {
        const savedState = localStorage.getItem('schoolSchedulerState');
        if (savedState) {
            try {
                const parsedState = JSON.parse(savedState);
                dispatch({ type: 'LOAD_STATE', payload: parsedState });
            } catch (e) {
                console.error("Failed to parse saved state", e);
            }
        } else {
            // Load mock data if no state exists
            import('../engine/initialData').then(module => {
                dispatch({
                    type: 'INIT_DATA',
                    payload: {
                        instructors: module.initialInstructors,
                    }
                });
            });
        }
    }, []);

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
