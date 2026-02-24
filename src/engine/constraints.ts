import type { Instructor, Session, ScheduleError } from './types';

export function validateSchedule(
    sessions: Session[],
    instructors: Instructor[]
): ScheduleError[] {
    const errors: ScheduleError[] = [];
    const instructorMap = new Map(instructors.map(i => [i.id, i]));

    // 時間帯ごとのセッションをグループ化（ダブルブッキング検知用）
    const timeSlotMap = new Map<string, Session[]>();

    // 同期IDごとのセッションをグループ化（並行授業検知用）
    const syncGroupMap = new Map<string, Session[]>();

    for (const session of sessions) {
        if (!session.assignedDay || !session.assignedPeriod) continue;

        // 1. 非常勤講師の勤務枠チェック
        const instructor = instructorMap.get(session.instructorId);
        if (instructor) {
            if (!instructor.availableSlots[session.assignedDay][session.assignedPeriod]) {
                errors.push({
                    sessionId: session.id,
                    message: `${instructor.name}先生は${session.assignedDay}曜${session.assignedPeriod}限に出勤できません。`,
                    type: 'instructor_availability'
                });
            }
        }

        // ダブルブッキング構造準備
        const timeKey = `${session.assignedDay}-${session.assignedPeriod}`;
        if (!timeSlotMap.has(timeKey)) {
            timeSlotMap.set(timeKey, []);
        }
        timeSlotMap.get(timeKey)!.push(session);

        // 同期チェック構造準備
        if (session.isRequiredSync && session.syncGroupId) {
            if (!syncGroupMap.has(session.syncGroupId)) {
                syncGroupMap.set(session.syncGroupId, []);
            }
            syncGroupMap.get(session.syncGroupId)!.push(session);
        }
    }

    // 2. ダブルブッキングチェック
    for (const [_, slotSessions] of timeSlotMap.entries()) {
        const instructorCounts = new Map<string, number>();
        for (const session of slotSessions) {
            const count = (instructorCounts.get(session.instructorId) || 0) + 1;
            instructorCounts.set(session.instructorId, count);
            if (count > 1) {
                const instructor = instructorMap.get(session.instructorId);
                errors.push({
                    sessionId: session.id,
                    message: `${instructor?.name || '講師'}が同じ時間帯に重複して授業を持っています。`,
                    type: 'double_booking'
                });
            }
        }
    }

    // 3. 並行授業の同期チェック
    for (const [_, syncSessions] of syncGroupMap.entries()) {
        if (syncSessions.length < 2) continue;

        const firstSession = syncSessions[0];
        for (let i = 1; i < syncSessions.length; i++) {
            const otherSession = syncSessions[i];
            if (
                firstSession.assignedDay !== otherSession.assignedDay ||
                firstSession.assignedPeriod !== otherSession.assignedPeriod
            ) {
                errors.push({
                    sessionId: firstSession.id,
                    message: `並行授業が同じ時間に設定されていません。`,
                    type: 'sync_mismatch'
                });
                errors.push({
                    sessionId: otherSession.id,
                    message: `並行授業が同じ時間に設定されていません。`,
                    type: 'sync_mismatch'
                });
            }
        }
    }

    return errors;
}
