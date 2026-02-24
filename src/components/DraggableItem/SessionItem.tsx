import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import type { Session } from '../../engine/types';
import { useScheduleContext } from '../../contexts/ScheduleContext';
import { AlertCircle } from 'lucide-react';

interface SessionItemProps {
    session: Session;
}

export const SessionItem: React.FC<SessionItemProps> = ({ session }) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: session.id,
        data: { session },
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 999,
    } : undefined;

    const { state } = useScheduleContext();

    // Find errors related to this session
    const sessionErrors = state.errors.filter(e => e.sessionId === session.id);
    const hasError = sessionErrors.length > 0;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={`
        p-2 text-sm rounded shadow-sm border cursor-grab active:cursor-grabbing select-none
        ${isDragging ? 'opacity-50 !shadow-lg scale-105' : ''}
        ${hasError ? 'bg-red-900/40 border-red-500 text-red-100' : 'bg-stone-700 border-stone-600 text-stone-200 hover:border-stone-500'}
        transition-all duration-200
      `}
        >
            <div className="flex justify-between items-start">
                <div className="font-semibold text-indigo-400">{session.classGroupId}</div>
                {hasError && (
                    <div className="group relative">
                        <AlertCircle className="w-4 h-4 text-red-400" />
                        <div className="absolute hidden group-hover:block bottom-full right-0 mb-2 w-48 p-2 bg-stone-900 text-xs text-red-200 rounded shadow-xl border border-red-900/50 z-50">
                            {sessionErrors.map((e, idx) => (
                                <div key={idx} className="mb-1 last:mb-0">• {e.message}</div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <div className="font-bold my-0.5">{session.subjectId}</div>
            <div className="text-xs opacity-75 truncate" title={state.instructors.find(i => i.id === session.instructorId)?.name}>
                {state.instructors.find(i => i.id === session.instructorId)?.name || '講師未定'}
            </div>
        </div>
    );
};
