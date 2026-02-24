import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import type { DayOfWeek, Period } from '../../engine/types';
import { SessionItem } from '../DraggableItem/SessionItem';
import { useScheduleContext } from '../../contexts/ScheduleContext';

interface CellProps {
    day: DayOfWeek;
    period: Period;
}

export const Cell: React.FC<CellProps> = ({ day, period }) => {
    const { setNodeRef, isOver } = useDroppable({
        id: `cell-${day}-${period}`,
        data: { day, period },
    });

    const { state } = useScheduleContext();

    // Find sessions assigned to this day and period
    const sessionsInCell = state.sessions.filter(
        s => s.assignedDay === day && s.assignedPeriod === period
    );

    return (
        <div
            ref={setNodeRef}
            className={`min-h-[80px] p-2 border border-stone-700 bg-stone-800 transition-colors
        ${isOver ? 'bg-stone-700/80 ring-2 ring-indigo-500 rounded-md relative z-10' : ''}
        flex flex-col gap-2 relative
      `}
        >
            {sessionsInCell.map(session => (
                <SessionItem key={session.id} session={session} />
            ))}
        </div>
    );
};
