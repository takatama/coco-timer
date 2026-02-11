# BrewSteps Specification (HIG + Material Design)

## 1. Purpose / Goals
- Hario Switch向け「新しいハイブリッドメソッド」に特化したシンプルなタイマー体験を提供する
- 画面を見なくても操作が分かるガイダンス（視覚・触覚・音声）を提供する
- AndroidではMaterial Design、iOS的な体験品質はHIGの考え方で補強する
- 次のステップの5秒前に通知・提示し、迷わず次へ進める体験にする
- アニメーションで次の操作を直感的に理解できる体験を提供する

## 2. Product Name
- BrewSteps

## 3. Target Users / Context
- 手動抽出を行うユーザー（Hario Switch）
- キッチンや作業中に「手順を忘れやすい」環境
- 画面注視が難しいため、音声/バイブ通知が重要

## 4. Design Principles
### HIG
- 明確な階層と焦点：今やることを最優先表示
- 直接操作感：触れる対象が明確（タップ可能/状態が見える）
- フィードバックの一貫性：視覚・触覚・音声を統合

### Material Design
- 一貫したコンポーネント構成（AppBar / Card / Stepper / Dialog / Snackbar）
- 明確なレイアウトグリッドとタイポグラフィ階層
- 状態変化はモーションで補助（過剰にならない）

### Focus
- 抽出中は「今やること」だけを表示
- 思考が必要な情報は抽出前/完了後に回す
- 「次のステップ5秒前通知」と「今のステップの明確化」を最優先

## 5. Scope
### In Scope
- 新しいハイブリッドメソッドのみ（単一レシピ）
- タイマー、手順表示、次の操作ガイド、設定画面
- HIG+MDに適合するUI構造・状態管理

### Out of Scope
- 複数レシピ対応
- ソーシャル/共有/ランキング
- ユーザーアカウント

## 6. Information Architecture
- Intro（初回のみ）
- Setup（Beans + Flavor）
- Home（Main Timer）
  - Top App Bar
  - Recipe Summary
  - Work Instruction Card
  - Animation Card (temporary)
  - Controls
  - Timeline (reference)
- Settings

## 7. Core Screens
### 7.0 Setup Screen (Screen 1)
**Primary focus**
- 豆量の調整（- / +）
- 味わい選択（Sweet / Balance / Sour）

**Sections**
- App Bar: BrewSteps
- Beans Amount Control
- Flavor Selection
- Start Button（タイマー画面へ遷移）
- Step Water Card（ステップごとの湯量、開始ボタンの下）
- Recipe Details（折りたたみ、画像・説明・YouTube）

### 7.0.1 Intro Screen (First-time only)
- 画像、レシピ説明、YouTubeを表示
- 「始める」「スキップ」でSetupへ遷移

### 7.1 Main Timer Screen
**Primary focus**
- 今やること（動詞）を最上部カードで強調

**Sections**
- App Bar: BrewSteps + Settings
- Summary Card: レシピ名、豆量、味わい、抽出量（抽出前/参照用）
- Work Instruction Card: STEP X / N、動詞、注湯/待機、残り時間、進捗バー
- Animation Card: 次の操作アニメーションを一時表示（メインカード直下）
- Controls: Play / Pause / Reset
- Timeline: 参照専用（低優先度、横数直線）

### 7.2 Settings Screen
- 言語、通知（音/バイブ/なし）、音声（男性/女性）
- デバッグ（x5倍速）

## 8. UI Components (MD Mapping)
- AppBar + Toolbar: 画面階層の明示
- Card: Work Instruction / Summary / Animation
- Timeline (horizontal number line): 手順表示（参照専用）
- Snackbar: 画面維持や短い通知
- Lottie: 次のステップのアニメーション表示（カード内）

## 9. Interaction & Feedback
- 次のステップの5秒前：
  - 視覚：Work Instruction Cardに「次の操作」を提示、必要最小の強調
  - 触覚：バイブ
  - 音声：5秒カウントダウン（SSMLから生成したwav）
  - アニメーション：次の操作をLottieで提示（カード内、0秒まで表示）
- 次のステップ移行時：
  - 視覚：Work Instruction Card更新
  - 触覚：バイブ
  - 音声：短い完了/次ステップ案内
- 途中停止・再開：
  - タイマー状態は保持
  - Guidanceは中断して再開可能

## 10. Accessibility
- コントラスト比 4.5:1 以上
- VoiceOver / TalkBack に必要なラベル
- タップ領域 44px 以上
- 言語切替（日/英）

## 11. Non-functional Requirements
- オフライン動作（PWA）
- 低遅延のタイマー通知
- 省電力・画面維持設定

## 12. Audio Assets (SSML -> wav)
- 2種類のみ使用
  - "5,4,3,2,1,次のステップです"
  - "5,4,3,2,1,美味しいコーヒーができました"
- 音声再生はwavファイルを利用
- 具体的な生成方法は別途定義
 - ファイル配置: public/audio/{lang}-{voice}-{type}.wav

## 13. Key Metrics (Priority)
- どこまで注ぐか（Pour until XXXg）
- 残り時間（次のステップまで）
- 完了時のみ抽出量を提示

## 14. Assets
- Lottie animations: src/assets/lottie/*.json
- Recipe image: public/assets/images/*

## 15. Open Questions
- 音声wavファイルの配置パスと読み込み方法
- 5秒前通知のUI表現（カード強調/軽いモーション/色）
