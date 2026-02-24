import type { Instructor, Session } from './types';

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
    { id: 'inst_1', name: '佐藤木漏れ日(常勤)', isPartTime: false, availableSlots: ALL_AVAILABLE },
    { id: 'inst_2', name: '田中スターダスト(常勤)', isPartTime: false, availableSlots: ALL_AVAILABLE },
    { id: 'inst_3', name: '鈴木ムーンライト(非常勤)', isPartTime: true, availableSlots: PART_TIME_AVAILABLE_1 },
];

export const initialSessions: Session[] = [
    { id: 'sess_1', subjectId: '国語', instructorId: 'inst_1', classGroupId: '1-A', isRequiredSync: false },
    { id: 'sess_2', subjectId: '数学', instructorId: 'inst_2', classGroupId: '1-B', isRequiredSync: false },
    // 習熟度別授業（必須同期）
    { id: 'sess_3', subjectId: '英語α', instructorId: 'inst_1', classGroupId: '1-A', isRequiredSync: true, syncGroupId: 'eng_level_1' },
    { id: 'sess_4', subjectId: '英語β', instructorId: 'inst_3', classGroupId: '1-B', isRequiredSync: true, syncGroupId: 'eng_level_1' },
    // 他の授業
    { id: 'sess_5', subjectId: '理科', instructorId: 'inst_3', classGroupId: '1-A', isRequiredSync: false },
];
