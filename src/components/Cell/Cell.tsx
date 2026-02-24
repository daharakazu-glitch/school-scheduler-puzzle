import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import type { DayOfWeek, Period } from '../../engine/types';
import { useScheduleContext } from '../../contexts/ScheduleContext';
import { SessionItem } from '../DraggableItem/SessionItem';

interface CellProps {
    day: DayOfWeek;
    period: Period;
    classGroupId: string;
}

export const Cell: React.FC<CellProps> = ({ day, period, classGroupId }) => {
    const { state } = useScheduleContext();

    const { isOver, setNodeRef, active } = useDroppable({
        id: `cell-${classGroupId}-${day}-${period}`,
        data: { day, period, classGroupId },
    });

    // Get sessions assigned to this specific cell (day, period, AND class)
    const sessionsInCell = state.sessions.filter(s =>
        s.assignedDay === day &&
        s.assignedPeriod === period &&
        s.classGroupId === classGroupId
    );

    // Determine if the currently dragged item is allowed in this cell
    let canDrop = true;
    if (active && active.data.current) {
        const draggedSession = active.data.current.session;
        if (draggedSession && draggedSession.classGroupId !== classGroupId) {
            canDrop = false;
        }
    }

    const bgColor = isOver
        ? (canDrop ? 'bg-indigo-900/40' : 'bg-red-900/40')
        : 'bg-transparent';

    return (
        <div
            ref={setNodeRef}
            className={`min-h-[80px] h-full w-full rounded border border-dashed border-stone-800 transition-colors ${bgColor} p-1 flex flex-col gap-1`}
        >
            {sessionsInCell.map(session => (
                <SessionItem key={session.id} session={session} />
            ))}
        </div>
    );
};
