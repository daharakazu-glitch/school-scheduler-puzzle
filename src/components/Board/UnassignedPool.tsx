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
            <h2 className="text-lg font-bold mb-4 text-stone-200">🚀 未配置の授業プール</h2>
            <div className="flex flex-col gap-6 min-h-[150px] overflow-y-auto max-h-[500px] pr-2">
                {unassignedSessions.length === 0 && (
                    <div className="text-stone-500 text-sm text-center italic py-6">
                        すべてのミッション（授業）が配置完了しました
                    </div>
                )}

                {state.settings.classes.map(classGroup => {
                    const classSessions = unassignedSessions.filter(s => s.classGroupId === classGroup);
                    if (classSessions.length === 0) return null;

                    return (
                        <div key={classGroup} className="flex flex-col gap-2">
                            <h3 className="text-sm font-semibold text-stone-400 border-b border-stone-800 pb-1">
                                🏫 {classGroup}
                            </h3>
                            <div className="flex flex-col gap-2">
                                {classSessions.map(session => (
                                    <SessionItem key={session.id} session={session} />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};
