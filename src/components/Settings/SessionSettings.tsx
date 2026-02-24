import React, { useState } from 'react';
import { useScheduleContext } from '../../contexts/ScheduleContext';
import type { Session } from '../../engine/types';

export const SessionSettings: React.FC = () => {
    const { state, dispatch } = useScheduleContext();
    const [sessions, setSessions] = useState<Session[]>(state.sessions);

    const handleAddSession = () => {
        const newSession: Session = {
            id: `session-${Date.now()}`,
            subjectId: '新規授業',
            classGroupId: state.settings.classes[0] || '1-A',
            instructorId: state.instructors[0]?.id || '',
            isRequiredSync: false,
        };
        setSessions([...sessions, newSession]);
    };

    const handleRemoveSession = (id: string) => {
        setSessions(sessions.filter(s => s.id !== id));
    };

    const updateSession = (id: string, field: keyof Session, value: any) => {
        setSessions(sessions.map(s => s.id === id ? { ...s, [field]: value } : s));
    };

    const handleSave = () => {
        dispatch({
            type: 'INIT_DATA',
            payload: { ...state, sessions }
        });
        alert('授業データを保存しました。');
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-stone-900 rounded-xl border border-stone-800 shadow-2xl mt-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-indigo-300">📚 授業一覧設定</h2>
                <button
                    onClick={handleAddSession}
                    className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg transition-colors text-sm"
                >
                    + 授業を追加
                </button>
            </div>

            <div className="space-y-4">
                {sessions.map((session) => (
                    <div key={session.id} className="bg-[#1a1a1a] p-4 rounded-lg border border-stone-800 flex flex-wrap items-center gap-4">

                        <div className="flex-1 min-w-[150px]">
                            <label className="block text-xs font-medium text-stone-400 mb-1">科目名</label>
                            <input
                                type="text"
                                value={session.subjectId}
                                onChange={(e) => updateSession(session.id, 'subjectId', e.target.value)}
                                className="w-full bg-stone-900 border border-stone-700 rounded p-2 text-stone-200 focus:ring-1 focus:ring-indigo-500 outline-none text-sm"
                            />
                        </div>

                        <div className="w-40">
                            <label className="block text-xs font-medium text-stone-400 mb-1">対象クラス</label>
                            <select
                                value={session.classGroupId}
                                onChange={(e) => updateSession(session.id, 'classGroupId', e.target.value)}
                                className="w-full bg-stone-900 border border-stone-700 rounded p-2 text-stone-200 focus:ring-1 focus:ring-indigo-500 outline-none text-sm"
                            >
                                {state.settings.classes.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>

                        <div className="w-48">
                            <label className="block text-xs font-medium text-stone-400 mb-1">担当教諭</label>
                            <select
                                value={session.instructorId}
                                onChange={(e) => updateSession(session.id, 'instructorId', e.target.value)}
                                className="w-full bg-stone-900 border border-stone-700 rounded p-2 text-stone-200 focus:ring-1 focus:ring-indigo-500 outline-none text-sm"
                            >
                                <option value="">未設定</option>
                                {state.instructors.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                            </select>
                        </div>

                        <div className="flex items-center pt-5">
                            <label className="flex items-center gap-2 cursor-pointer text-sm text-stone-300">
                                <input
                                    type="checkbox"
                                    checked={session.isRequiredSync || false}
                                    onChange={(e) => updateSession(session.id, 'isRequiredSync', e.target.checked)}
                                    className="w-4 h-4 text-indigo-600 bg-stone-900 border-stone-700 rounded"
                                />
                                並行授業
                            </label>
                        </div>

                        {session.isRequiredSync && (
                            <div className="w-32">
                                <label className="block text-xs font-medium text-stone-400 mb-1">同期グループID</label>
                                <input
                                    type="text"
                                    value={session.syncGroupId || ''}
                                    onChange={(e) => updateSession(session.id, 'syncGroupId', e.target.value)}
                                    placeholder="例: math-group-1"
                                    className="w-full bg-stone-900 border border-stone-700 rounded p-2 text-stone-200 focus:ring-1 focus:ring-indigo-500 outline-none text-sm"
                                />
                            </div>
                        )}

                        <div className="pt-5 pl-2 ml-auto">
                            <button
                                onClick={() => handleRemoveSession(session.id)}
                                className="text-stone-500 hover:text-red-400 transition-colors p-2"
                                title="削除"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                ))}

                <div className="pt-4 border-t border-stone-800 flex justify-end">
                    <button
                        onClick={handleSave}
                        className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors shadow-lg"
                    >
                        授業データを保存
                    </button>
                </div>
            </div>
        </div>
    );
};
