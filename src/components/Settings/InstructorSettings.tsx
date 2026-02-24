import React, { useState } from 'react';
import { useScheduleContext } from '../../contexts/ScheduleContext';
import type { Instructor, DayOfWeek, InstructorAssignment } from '../../engine/types';

const DAYS: { id: DayOfWeek; label: string }[] = [
    { id: 'Mon', label: '月' },
    { id: 'Tue', label: '火' },
    { id: 'Wed', label: '水' },
    { id: 'Thu', label: '木' },
    { id: 'Fri', label: '金' },
];

export const InstructorSettings: React.FC = () => {
    const { state, dispatch } = useScheduleContext();
    const [instructors, setInstructors] = useState<Instructor[]>(state.instructors);

    // Helper to get max periods array
    const periods = Array.from({ length: state.settings.maxPeriods }, (_, i) => i + 1);

    const handleAddInstructor = () => {
        const defaultAvailability = DAYS.reduce((acc, day) => {
            acc[day.id] = periods.reduce((pAcc, p) => {
                pAcc[p] = true;
                return pAcc;
            }, {} as Record<number, boolean>);
            return acc;
        }, {} as Record<DayOfWeek, Record<number, boolean>>);

        const newInstructor: Instructor = {
            id: `inst-${Date.now()}`,
            name: '新しい教員',
            isPartTime: false,
            availableSlots: defaultAvailability
        };

        setInstructors([...instructors, newInstructor]);
    };

    const handleRemoveInstructor = (id: string) => {
        setInstructors(instructors.filter(i => i.id !== id));
    };

    const updateInstructorName = (id: string, name: string) => {
        setInstructors(instructors.map(i => i.id === id ? { ...i, name } : i));
    };

    const handleAddAssignment = (instructorId: string) => {
        setInstructors(instructors.map(i => {
            if (i.id === instructorId) {
                const newAssignment: InstructorAssignment = {
                    id: `assign-${Date.now()}`,
                    subjectId: '新しい授業',
                    classGroupId: state.settings.classes[0] || '1-A',
                    isRequiredSync: false
                };
                return { ...i, assignments: [...(i.assignments || []), newAssignment] };
            }
            return i;
        }));
    };

    const handleRemoveAssignment = (instructorId: string, assignmentId: string) => {
        setInstructors(instructors.map(i => {
            if (i.id === instructorId) {
                return { ...i, assignments: (i.assignments || []).filter(a => a.id !== assignmentId) };
            }
            return i;
        }));
    };

    const updateAssignment = (instructorId: string, assignmentId: string, field: keyof InstructorAssignment, value: any) => {
        setInstructors(instructors.map(i => {
            if (i.id === instructorId) {
                return {
                    ...i,
                    assignments: (i.assignments || []).map(a => a.id === assignmentId ? { ...a, [field]: value } : a)
                };
            }
            return i;
        }));
    };

    const toggleAvailability = (instructorId: string, day: DayOfWeek, period: number) => {
        setInstructors(instructors.map(i => {
            if (i.id === instructorId) {
                return {
                    ...i,
                    availableSlots: {
                        ...i.availableSlots,
                        [day]: {
                            ...i.availableSlots[day],
                            [period]: !i.availableSlots[day][period]
                        }
                    }
                };
            }
            return i;
        }));
    };

    const handleSave = () => {
        dispatch({
            type: 'INIT_DATA',
            payload: { ...state, instructors }
        });
        alert('教員データを保存しました。');
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-stone-900 rounded-xl border border-stone-800 shadow-2xl mt-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-indigo-300">👨‍🏫 担当教諭設定</h2>
                <button
                    onClick={handleAddInstructor}
                    className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg transition-colors text-sm"
                >
                    + 教員を追加
                </button>
            </div>

            <div className="space-y-6">
                {instructors.map((instructor) => (
                    <div key={instructor.id} className="bg-[#1a1a1a] p-4 rounded-lg border border-stone-800 relative">
                        <button
                            onClick={() => handleRemoveInstructor(instructor.id)}
                            className="absolute top-4 right-4 text-stone-500 hover:text-red-400 transition-colors"
                        >
                            削除
                        </button>
                        <div className="flex gap-4 mb-4">
                            <div className="w-64">
                                <label className="block text-xs font-medium text-stone-400 mb-1">名前</label>
                                <input
                                    type="text"
                                    value={instructor.name}
                                    onChange={(e) => updateInstructorName(instructor.id, e.target.value)}
                                    className="w-full bg-stone-900 border border-stone-700 rounded p-2 text-stone-200 focus:ring-1 focus:ring-indigo-500 outline-none"
                                />
                            </div>
                            <div className="flex items-end pb-2">
                                <label className="flex items-center gap-2 cursor-pointer text-sm text-stone-300">
                                    <input
                                        type="checkbox"
                                        checked={instructor.isPartTime || false}
                                        onChange={(e) => {
                                            setInstructors(instructors.map(i => i.id === instructor.id ? { ...i, isPartTime: e.target.checked } : i));
                                        }}
                                        className="w-4 h-4 text-indigo-600 bg-stone-900 border-stone-700 rounded"
                                    />
                                    非常勤講師として制約を適用する
                                </label>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-stone-300">
                                <thead className="text-xs text-stone-400 uppercase bg-stone-800">
                                    <tr>
                                        <th className="px-3 py-2">曜日</th>
                                        {periods.map(p => <th key={p} className="px-3 py-2 text-center">{p}限</th>)}
                                    </tr>
                                </thead>
                                <tbody>
                                    {DAYS.map(day => (
                                        <tr key={day.id} className="border-b border-stone-800 border-dashed">
                                            <td className="px-3 py-2 font-medium">{day.label}</td>
                                            {periods.map(period => (
                                                <td key={period} className="px-3 py-2 text-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={instructor.availableSlots[day.id]?.[period] ?? false}
                                                        onChange={() => toggleAvailability(instructor.id, day.id, period)}
                                                        className="w-4 h-4 text-indigo-600 bg-stone-700 border-stone-600 rounded focus:ring-indigo-500 focus:ring-2"
                                                    />
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <p className="text-xs text-stone-500 mt-2">※ チェックが入っているコマが出勤可能（授業可能）な時間です。</p>
                        </div>

                        {/* Assignments Section */}
                        <div className="mt-8 pt-6 border-t border-stone-800">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-sm font-semibold text-indigo-300">📚 担当授業リスト</h3>
                                <button
                                    onClick={() => handleAddAssignment(instructor.id)}
                                    className="px-3 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded text-xs transition-colors"
                                >
                                    + 授業を追加
                                </button>
                            </div>

                            <div className="space-y-3">
                                {(!instructor.assignments || instructor.assignments.length === 0) && (
                                    <p className="text-xs text-stone-500 italic">登録されている担当授業はありません</p>
                                )}
                                {(instructor.assignments || []).map(assignment => (
                                    <div key={assignment.id} className="flex flex-wrap items-center gap-3 bg-stone-900 border border-stone-700 rounded p-3">
                                        <div className="flex-1 min-w-[120px]">
                                            <input
                                                type="text"
                                                value={assignment.subjectId}
                                                onChange={(e) => updateAssignment(instructor.id, assignment.id, 'subjectId', e.target.value)}
                                                placeholder="科目名"
                                                className="w-full bg-[#1a1a1a] border border-stone-700 rounded px-2 py-1 text-stone-200 focus:ring-1 focus:ring-indigo-500 outline-none text-sm"
                                            />
                                        </div>
                                        <div className="w-32">
                                            <select
                                                value={assignment.classGroupId}
                                                onChange={(e) => updateAssignment(instructor.id, assignment.id, 'classGroupId', e.target.value)}
                                                className="w-full bg-[#1a1a1a] border border-stone-700 rounded px-2 py-1 text-stone-200 focus:ring-1 focus:ring-indigo-500 outline-none text-sm"
                                            >
                                                {state.settings.classes.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                        </div>
                                        <div className="flex items-center">
                                            <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-300">
                                                <input
                                                    type="checkbox"
                                                    checked={assignment.isRequiredSync || false}
                                                    onChange={(e) => updateAssignment(instructor.id, assignment.id, 'isRequiredSync', e.target.checked)}
                                                    className="w-3 h-3 text-indigo-600 bg-stone-900 border-stone-700 rounded"
                                                />
                                                並行授業
                                            </label>
                                        </div>
                                        {assignment.isRequiredSync && (
                                            <div className="w-28">
                                                <input
                                                    type="text"
                                                    value={assignment.syncGroupId || ''}
                                                    onChange={(e) => updateAssignment(instructor.id, assignment.id, 'syncGroupId', e.target.value)}
                                                    placeholder="グループID"
                                                    className="w-full bg-[#1a1a1a] border border-stone-700 rounded px-2 py-1 text-stone-200 focus:ring-1 focus:ring-indigo-500 outline-none text-xs"
                                                />
                                            </div>
                                        )}
                                        <button
                                            onClick={() => handleRemoveAssignment(instructor.id, assignment.id)}
                                            className="text-stone-500 hover:text-red-400 text-xs px-2"
                                            title="削除"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                ))}

                <div className="pt-4 border-t border-stone-800 flex justify-end">
                    <button
                        onClick={handleSave}
                        className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors shadow-lg"
                    >
                        教員データを保存
                    </button>
                </div>
            </div>
        </div>
    );
};
