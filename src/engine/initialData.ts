import type { Instructor, SchoolSettings } from './types';

export const defaultSettings: SchoolSettings = {
    maxPeriods: 6,
    classes: ['1-A', '1-B'],
};

// 月〜金の全時限OKのテンプレート
const ALL_AVAILABLE = {
    Mon: { 1: true, 2: true, 3: true, 4: true, 5: true, 6: true },
    Tue: { 1: true, 2: true, 3: true, 4: true, 5: true, 6: true },
    Wed: { 1: true, 2: true, 3: true, 4: true, 5: true, 6: true },
    Thu: { 1: true, 2: true, 3: true, 4: true, 5: true, 6: true },
    Fri: { 1: true, 2: true, 3: true, 4: true, 5: true, 6: true },
};

// 特定曜日の午後のみなど
const PART_TIME_AVAILABLE_1 = {
    Mon: { 1: false, 2: false, 3: true, 4: true, 5: true, 6: true }, // 月午後はOK
    Tue: { 1: false, 2: false, 3: false, 4: false, 5: false, 6: false }, // 火は休み
    Wed: { 1: true, 2: true, 3: true, 4: true, 5: true, 6: true }, // 水は全OK
    Thu: { 1: false, 2: false, 3: false, 4: false, 5: false, 6: false }, // 木は休み
    Fri: { 1: true, 2: true, 3: true, 4: true, 5: true, 6: true }, // 金は全OK
};

export const initialInstructors: Instructor[] = [
    {
        id: 'inst_1',
        name: '佐藤木漏れ日(常勤)',
        isPartTime: false,
        availableSlots: ALL_AVAILABLE,
        assignments: [
            { id: 'sess_1', subjectId: '国語', classGroupId: '1-A', isRequiredSync: false },
            { id: 'sess_3', subjectId: '英語α', classGroupId: '1-A', isRequiredSync: true, syncGroupId: 'eng_level_1' }
        ]
    },
    {
        id: 'inst_2',
        name: '田中スターダスト(常勤)',
        isPartTime: false,
        availableSlots: ALL_AVAILABLE,
        assignments: [
            { id: 'sess_2', subjectId: '数学', classGroupId: '1-B', isRequiredSync: false }
        ]
    },
    {
        id: 'inst_3',
        name: '鈴木ムーンライト(非常勤)',
        isPartTime: true,
        availableSlots: PART_TIME_AVAILABLE_1,
        assignments: [
            { id: 'sess_4', subjectId: '英語β', classGroupId: '1-B', isRequiredSync: true, syncGroupId: 'eng_level_1' },
            { id: 'sess_5', subjectId: '理科', classGroupId: '1-A', isRequiredSync: false }
        ]
    },
];
