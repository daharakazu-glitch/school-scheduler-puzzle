import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { useScheduleContext } from '../../contexts/ScheduleContext';
import { SessionItem } from '../DraggableItem/SessionItem';

export const UnassignedPool: React.FC = () => {
    const { state } = useScheduleContext();
    const { setNodeRef, isOver } = useDroppable({
        id: 'unassigned-pool',
    });

    const unassignedSessions = state.sessions.filter(s => !s.assignedDay || !s.assignedPeriod);

    return (
        <section
            ref={setNodeRef}
            className={`bg-stone-900 rounded-xl p-4 border shadow-xl transition-colors
        ${isOver ? 'border-indigo-500 bg-stone-800 ring-2 ring-indigo-500/50' : 'border-stone-800'}
      `}
        >
            <h2 className="text-lg font-bold mb-4 text-stone-200">未配置の授業</h2>
            <div className="flex flex-col gap-3 min-h-[150px]">
                {unassignedSessions.length === 0 && (
                    <div className="text-stone-500 text-sm text-center italic py-6">
                        すべての授業が配置されています
                    </div>
                )}
                {unassignedSessions.map(session => (
                    <SessionItem key={session.id} session={session} />
                ))}
            </div>
        </section>
    );
};
