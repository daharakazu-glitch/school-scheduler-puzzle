---
name: Git Master
description: git status を確認し、適切な粒度でコミットを生成・実行する知識。
---
# Git Master Skill

## 責務
- 作業の節目での確実なコミット
- 意味のある日本語コミットメッセージの記述
- 差分の把握

## 運用プロトコル
- コンポーネント作成、テスト追加、バグ修正など、意味のある単位で `task_boundary` を区切りとして `git status` と `git diff` を確認。
- `git add .` および `git commit -m "feat/fix/refactor: 詳細な日本語のメッセージ"` を実行する。
