# 🚀 FLIGHT PLAN: School Scheduler Puzzle Solver

## 1. プロジェクト構成と技術スタック
- **Frontend Framework**: React 18 + TypeScript (Viteによる高速なビルドと開発環境)
- **Styling**: Tailwind CSS (ユーティリティファーストでの設計、保守性重視)
- **State Management**: React Context API + `useReducer` (スケジュール全体のグローバル状態管理、プロップドリリング防止)
- **Drag & Drop**: `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` (堅牢でアクセシブルなD&D実装)
- **環境**: Mac OS Native / Node.js 20+

## 2. ディレクトリ構成案
```
school-scheduler-puzzle/
├── MISSION_CHARTER.md
├── FLIGHT_PLAN.md
├── .agent/
│   └── skills/
├── src/
│   ├── components/
│   │   ├── Board/          # 時間割のメインボード (Semantic HTML: <main>, <section>)
│   │   ├── Cell/           # 1コマのコンポーネント (Semantic HTML)
│   │   ├── DraggableItem/  # D&D可能な授業アイテム
│   │   └── WarningBadge/   # 制約違反の警告表示
│   ├── contexts/
│   │   └── ScheduleContext.tsx # スケジュールと制約状態の管理
│   ├── engine/
│   │   ├── constraints.ts  # 制約チェックの純粋関数群 (Scheduler Engine)
│   │   └── types.ts        # 非常勤講師や授業の型定義
│   ├── App.tsx
│   └── main.tsx
```

## 3. データ構造の定義
### 講師モデリング (Instructor)
非常勤講師の制約を保持するためのデータ構造です。「勤務日限定」の制約を満たします。
```typescript
type DayOfWeek = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri';
type Period = 1 | 2 | 3 | 4 | 5 | 6;

interface Instructor {
  id: string;
  name: string;
  isPartTime: boolean;
  // 各曜日の各時限において出勤可能かどうか。trueなら授業可能。
  // 例: availableSlots['Mon'][1] -> 月曜1限は可能か？
  availableSlots: Record<DayOfWeek, Record<Period, boolean>>; 
}
```

### 授業・コマ (Class / Session)
「習熟度別並行授業の同期」の制約を満たします。
```typescript
interface Session {
  id: string; // 授業の一意なID
  subjectId: string; // 科目ID
  instructorId: string; // 担当講師ID
  classGroupId: string; // クラスID (例: 'A組')
  isRequiredSync: boolean; // 並行授業の同期が必要か(習熟度別など)
  syncGroupId?: string; // 同期すべきグループID（このIDを持つセッションは同じ時間でなければならない）
  assignedDay?: DayOfWeek; // 配置された曜日
  assignedPeriod?: Period; // 配置された時限
}
```

## 4. 制約アルゴリズムアプローチ
D&Dで`Session`の`assignedDay`と`assignedPeriod`が変更された際、`engine/constraints.ts`のロジックが走り、スケジュール全体に対して以下の制約をチェックします。このロジックは Context API を通じてアプリケーション全体に伝播します。

1. **非常勤講師制約**: 変更後のコマが、担当講師の`availableSlots`において`true`かチェック。
2. **ダブルブッキング制約**: 同じ講師が同じ時間に別のクラスを持っていないかチェック。
3. **同期授業制約**: `isRequiredSync`が`true`の場合、同じ`syncGroupId`を持つ他のセッションが同じ曜日・時限に配置されているか確認。

違反がある場合はUIに対して「エラー配列」と「影響を受けるセッションID」を返し、関係するコマを赤くハイライト（または視覚的な警告バッジ表示）します。

## 5. ユーザー承認のお願い (Mission Control Override)
本 FLIGHT PLAN（技術スタック・ディレクトリ構成・データモデル・実装アプローチ）の方向性で実装フェーズに移行してよろしいでしょうか？  
もし特定のデータ項目（追加の制約）や、UIの振る舞いについて修正・追加のご要望があれば、お知らせください。
