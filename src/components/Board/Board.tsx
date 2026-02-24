import React, { useState } from 'react';
import { DndContext, type DragEndEvent, DragOverlay, closestCenter, type DragStartEvent } from '@dnd-kit/core';
import type { DayOfWeek, Period, Session } from '../../engine/types';
import { Cell } from '../Cell/Cell';
import { useScheduleContext } from '../../contexts/ScheduleContext';
import { UnassignedPool } from './UnassignedPool';
import { SessionItem } from '../DraggableItem/SessionItem';

const DAYS: DayOfWeek[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

export const Board: React.FC = () => {
    const { state, dispatch } = useScheduleContext();
    const [activeSession, setActiveSession] = useState<Session | null>(null);

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const session = state.sessions.find(s => s.id === active.id);
        if (session) setActiveSession(session);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        setActiveSession(null);
        const { active, over } = event;
        if (!over) return;

        const sessionId = active.id as string;
        const draggedSession = state.sessions.find(s => s.id === sessionId);

        if (over.id === 'unassigned-pool') {
            dispatch({ type: 'MOVE_SESSION', payload: { sessionId, day: undefined, period: undefined } });
            return;
        }

        const { day, period, classGroupId } = over.data.current as { day: DayOfWeek; period: Period, classGroupId: string };

        // Safety net: only allow dropping into the correct class board
        if (draggedSession && draggedSession.classGroupId !== classGroupId) {
            return; // Reject drop
        }

        dispatch({ type: 'MOVE_SESSION', payload: { sessionId, day, period } });
    };

    return (
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
            <div className="flex flex-col lg:flex-row gap-6 p-6 min-h-screen bg-[#141414] text-stone-200 font-sans">

                {/* Main Calendar Boards (Multi-Class View) */}
                <main className="flex-1 overflow-x-auto flex flex-col gap-12">
                    {state.settings.classes.map(classGroup => (
                        <section key={classGroup} className="min-w-[800px] border border-stone-800 rounded-xl overflow-hidden shadow-2xl bg-stone-900/50">
                            <header className="bg-stone-900 p-4 border-b border-stone-800 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-indigo-300">🏫 {classGroup} 時間割</h2>
                            </header>

                            <div className="grid grid-cols-6 bg-stone-900/80 border-b border-stone-800">
                                <div className="p-4 font-bold text-center text-stone-400 flex items-center justify-center">時限 / 曜日</div>
                                {DAYS.map(day => (
                                    <div key={day} className="p-4 font-bold text-center border-l border-stone-800 text-stone-300">
                                        {day}曜
                                    </div>
                                ))}
                            </div>

                            {Array.from({ length: state.settings.maxPeriods }, (_, i) => i + 1).map(period => (
                                <div key={period} className="grid grid-cols-6 border-b border-stone-800 last:border-0">
                                    <div className="p-4 font-bold text-center bg-stone-900 flex items-center justify-center text-stone-400 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]">
                                        {period}限
                                    </div>
                                    {DAYS.map(day => (
                                        <div key={`${classGroup}-${day}-${period}`} className="border-l border-stone-800 bg-[#1e1e1e] p-1">
                                            <Cell day={day} period={period} classGroupId={classGroup} />
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </section>
                    ))}
                </main>

                {/* Sidebar */}
                <aside className="w-full lg:w-80 flex flex-col gap-6">
                    <UnassignedPool />
                    <section className="bg-stone-900 rounded-xl p-4 border border-stone-800 shadow-xl flex-1 flex flex-col">
                        <h2 className="text-lg font-bold mb-4 text-indigo-300">Constraints Status</h2>
                        <div className="text-sm space-y-2 flex-1 overflow-y-auto max-h-[400px]">
                            <div className="flex items-center gap-2 mb-4 p-2 bg-[#1a1a1a] rounded border border-stone-800">
                                <div className={`w-3 h-3 rounded-full shadow-[0_0_8px_currentColor] ${state.errors.length === 0 ? 'bg-green-500 text-green-500' : 'bg-red-500 text-red-500 animate-pulse'}`}></div>
                                <span className="font-semibold">{state.errors.length === 0 ? 'All Systems Nominal' : `${state.errors.length} Conflict(s) Detected`}</span>
                            </div>
                            {state.errors.map((e, idx) => (
                                <div key={idx} className="bg-red-950/40 text-red-200 p-3 rounded-lg text-xs border border-red-900/60 shadow-inner flex flex-col gap-1">
                                    <span className="font-bold text-red-400">Error [{e.type}]</span>
                                    <span>{e.message}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                </aside>

            </div>

            {/* Drag Overlay for smooth animation */}
            <DragOverlay dropAnimation={{ duration: 200, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)' }}>
                {activeSession ? <SessionItem session={activeSession} /> : null}
            </DragOverlay>
        </DndContext>
    );
};
