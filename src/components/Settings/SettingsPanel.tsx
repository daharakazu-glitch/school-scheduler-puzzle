import React, { useState } from 'react';
import { useScheduleContext } from '../../contexts/ScheduleContext';
import { InstructorSettings } from './InstructorSettings';
import { SessionSettings } from './SessionSettings';

export const SettingsPanel: React.FC = () => {
    const { state, dispatch } = useScheduleContext();
    const [maxPeriods, setMaxPeriods] = useState(state.settings.maxPeriods);
    const [classesText, setClassesText] = useState(state.settings.classes.join(', '));

    const handleSave = () => {
        const newClasses = classesText
            .split(',')
            .map(c => c.trim())
            .filter(c => c.length > 0);

        dispatch({
            type: 'UPDATE_SETTINGS',
            payload: { maxPeriods, classes: newClasses }
        });
        alert('基本設定を保存しました。');
    };

    return (
        <div className="pb-16">
            <div className="max-w-4xl mx-auto p-6 bg-stone-900 rounded-xl border border-stone-800 shadow-2xl mt-8">
                <h2 className="text-2xl font-bold mb-6 text-indigo-300">🏫 学校基本設定</h2>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-stone-300 mb-2">
                            1日の最大時限数
                        </label>
                        <input
                            type="number"
                            min={1}
                            max={12}
                            value={maxPeriods}
                            onChange={(e) => setMaxPeriods(Number(e.target.value))}
                            className="w-full bg-[#1a1a1a] border border-stone-700 rounded-lg p-3 text-stone-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        />
                        <p className="mt-1 text-xs text-stone-500">※変更すると時間割ボードの行数が自動的に変動します。</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-stone-300 mb-2">
                            クラス一覧 (カンマ区切り)
                        </label>
                        <textarea
                            rows={3}
                            value={classesText}
                            onChange={(e) => setClassesText(e.target.value)}
                            placeholder="例: 1-A, 1-B, 2-A, 2-B"
                            className="w-full bg-[#1a1a1a] border border-stone-700 rounded-lg p-3 text-stone-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                        />
                    </div>

                    <div className="pt-4 border-t border-stone-800 flex justify-end">
                        <button
                            onClick={handleSave}
                            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors shadow-lg"
                        >
                            基本設定を保存
                        </button>
                    </div>
                </div>
            </div>

            <InstructorSettings />
            <SessionSettings />
        </div>
    );
};
