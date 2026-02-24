export type DayOfWeek = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri';
export type Period = number; // Dynamic period numbers (e.g., 1 to maxPeriods)

export interface SchoolSettings {
    maxPeriods: number; // e.g., 6 or 8
    classes: string[]; // e.g., ['1-A', '1-B', '2-A']
}

export interface InstructorAssignment {
    id: string; // Unique ID for the assignment rule
    subjectId: string; // e.g., '国語', '数学'
    classGroupId: string; // e.g., '1-A', 'B組'
    isRequiredSync?: boolean;
    syncGroupId?: string;
}

export interface Instructor {
    id: string;
    name: string;
    isPartTime: boolean;
    /**
     * 各曜日の各時限において出勤可能かどうか。
     * 例: availableSlots['Mon'][1] -> 月曜1限は可能か？
     */
    availableSlots: Record<DayOfWeek, Record<Period, boolean>>;
    /**
     * 担当する授業（クラスと科目のペア）のリスト
     */
    assignments?: InstructorAssignment[];
}

export interface Session {
    id: string; // 授業の一意なID
    subjectId: string; // 科目ID
    instructorId: string; // 担当講師ID
    classGroupId: string; // クラスID (例: 'A組')
    isRequiredSync: boolean; // 並行授業の同期が必要か
    syncGroupId?: string; // 同期すべきグループID
    assignedDay?: DayOfWeek; // 配置された曜日
    assignedPeriod?: Period; // 配置された時限
}

export interface ScheduleError {
    sessionId: string;
    message: string;
    type: 'instructor_availability' | 'double_booking' | 'sync_mismatch';
}
