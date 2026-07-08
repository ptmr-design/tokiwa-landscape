# CLAUDE.md

## プロジェクト概要

Figmaデザインを元にした工務店向け企業サイト実装。
採用ポートフォリオとしてコード品質・設計品質も評価対象。

複数ページ構成の静的サイト。
フレームワークなしのVanilla HTML/CSS/JSで実装する。

Figmaファイル: `eMV6n20EDNtmmKaEfUOsOk`(05中級Ex-青牡丹工務店\_new)
Figma内の「仕様」フレーム(node 23:5)が実装要件書。実装判断に迷ったら必ず参照する。
Figma上にコメントは残さない(全員にメール通知が飛ぶ)。

ページ構成(Figma仕様書のURL仕様に準拠):

- TOPページ: /
- 私達について: /about
- 事業内容: /service
- お問い合わせ: /contact
- 送信完了: /thanks

※ 施工事例の独立ページは無い。施工事例カードは事業内容ページ内に埋め込み。

レイアウト基本構造:

- PC: 固定左サイドバー(幅280px、スクロール追従)+ メインコンテンツ
- SP: 上部ヘッダーバー + ハンバーガーメニュー(全画面オーバーレイナビ)
- SPデザインはTOPとナビのみ存在。下層ページのSPはTOPのトーンを踏襲して設計する

レスポンシブ対応。
モバイルファーストで設計し、PC表示まで対応する。

---

## デザイントークン(Figma解析で確定)

Figmaファイルに変数定義は無い(直値デザイン)ため、実装側でトークン化する。

カラー:

- --color-primary: #4282b8(プライマリブルー)
- --color-primary-pale: #b1c6dc(白抜き英字見出しのアウトライン)
- --color-bg-gray: #f8f8f8(背景グレー)
- --color-text: #000
- --color-white: #fff

フォント(Google Fonts):

- 和文: Zen Kaku Gothic New(Regular / Bold)
- 英字見出し・番号: Kanit(Regular / Bold)

フォントサイズ:

- Figma上の使用値: 10 / 12 / 14 / 16 / 20 / 24 / 32 / 40 / 64 / 128 / 168px
- remに変換して段階変数化する(基準16px)
- 128px / 168pxの装飾英字はclamp()でSP時に縮小する

ブレークポイント(min-width、モバイルファースト):

- 768px: タブレット
- 1024px: サイドバー表示への切り替え

---

## CSS設計方針: 軽量FLOCSS + BEM

FLOCSSの考え方を3層に簡略化して採用する。

### レイヤー構成

- Foundation: css/foundation/
  - \_reset.css
  - \_variables.css
  - ブラウザ差分のリセット、CSS変数管理
  - 色・余白・フォントサイズは必ずCSS変数(カスタムプロパティ)として定義する
  - コンポーネント側で直値を書かない

- Layout: css/layout/
  - \_sidebar.css(PC固定サイドバー + SPヘッダーバー/ハンバーガー)
  - \_footer.css
  - \_section.css(コンテンツ幅1120px、白カード+角丸の大枠)
  - プレフィックス `l-`
  - ページ全体の大枠構造のみを担当
  - 装飾的なスタイルは書かない

- Object/Component: css/object/component/
  - プレフィックス `c-`
  - 再利用可能なUIパーツを管理する
  - 新規クラスを作成する前に既存Componentで流用できないか必ず確認する

  Component一覧(Figma解析に基づく):

  全ページ横断:
  - c-button(白地+黒枠+右ドットが基本形。--primaryで青地。ホバーで反転)
  - c-anchor-button(下層ページ冒頭の下矢印付きアンカーボタン)
  - c-section-heading(日本語小ラベル + 大型白抜き英字。Kanit + text-stroke)
  - c-contact-banner(フッター直前の問い合わせ導線)
  - c-tel(電話番号+営業時間の組)

  ページ固有:
  - c-news-item(カテゴリタグ+日付+タイトル+矢印。クリックでモーダル)
  - c-tag(「イベント情報」「更新情報」のカテゴリラベル)
  - c-modal(お知らせモーダル。長文は内部スクロール)
  - c-service-block(01〜03の番号+写真+見出し+テキスト+ボタン)
  - c-works-card(施工事例: 写真+物件名+施工年月/構造キャプション)
  - c-page-header(下層共通: ヒーロー画像+h1+リード+イラスト)
  - c-step(フォームのステップインジケーター。contact/thanksで再利用)
  - c-form-field / c-form-radio / c-form-check(ラベル+必須バッジ+入力欄)
  - c-loading(初回アクセス時のみのローディング画面)

- Object/Utility: css/object/utility/
  - プレフィックス `u-`
  - 1クラス1役割
  - 複数のCSSプロパティを持たせない

---

## BEM命名規則

- Block: c-card
- Element: c-card\_\_title
- Modifier: c-card--large

ルール:

- ネストはBlock直下1階層まで
- 孫要素も同じBlockのElementとして命名する
- 装飾違いはModifierで対応する

例:

正:
c-card\_\_title

誤:
c-card\_\_title-text

---

## JS用フック

JavaScript操作用クラスはCSSクラスと分離する。

- JS操作用には `js-` プレフィックスを使用
- CSSではjs-クラスにスタイルを当てない

想定フック:

- js-loading(初回のみローディング。sessionStorageで制御)
- js-toggle-menu(SPハンバーガー開閉)
- js-accordion(サイドバーのメニュー開閉)
- js-modal-open / js-modal-close(お知らせモーダル)
- js-smooth-scroll(アンカーボタンのページ内スクロール)
- js-form(必須入力が揃うまで送信ボタン無効化)

---

## ディレクトリ構成

css/
├── foundation/
│ ├── \_reset.css
│ └── \_variables.css
│
├── layout/
│ ├── \_sidebar.css
│ ├── \_footer.css
│ └── \_section.css
│
├── object/
│ ├── component/
│ │ ├── \_button.css
│ │ ├── \_section-heading.css
│ │ ├── \_contact-banner.css
│ │ └── ほかComponent一覧に対応
│ │
│ └── utility/
│ ├── \_spacing.css
│ └── \_text.css
│
└── style.css

style.cssで各CSSを@importして管理する。

---

## ページ構成

複数ページサイトとして以下の構成で管理する。

/
├── index.html
│
├── about/
│ └── index.html
│
├── service/
│ └── index.html
│
├── contact/
│ └── index.html
│
├── thanks/
│ └── index.html
│
├── assets/
│ ├── img/
│ ├── svg/
│ ├── favicon/
│ └── fonts/
│
├── css/
│
├── js/
│
└── CLAUDE.md

---

## 実装要件(Figma仕様書フレームより)

- meta title: 青牡丹工務店 | 大阪市北区の住宅建築・リフォーム・公共事業なら青牡丹工務店
- meta description: 仕様書指定の文言を使用する
- headにnoindexを付与し、Basic認証をつける(Basic認証はデプロイ先確定後に対応)
- ローディング画面: ロゴ活用、初回アクセス時のみ表示(sessionStorage)
- サイドバーの「私達について」「事業内容」はホバーで開閉。デフォルト閉+アイコン
  (TOPのデザインカンプは開いた状態で描かれているが、閉が正)
- TOPのみ: FVコピー・見出しをふわっと出現アニメーション
- 画像横並び部分はグレー背景内で滑らかな無限自動スライダー
- お知らせはモーダル表示。本文3件は仕様書内に用意済み(画像news01〜03)
- 下層ページのアンカーボタンは該当セクションへスムーススクロール
- フォーム: 必須項目が全て入力されるまで送信ボタン無効化、
  適切なautocomplete属性(family-name / given-name / email / tel / street-address)、
  送信後は/thanksへ遷移(送信機能自体は任意)
- 画像素材はアイソメラボ様の許可取得済み(https://isome-lab.com/)

---

## 実装ルール

- 新しいセクションを実装する前に、既存Componentで使い回せるパーツがないか必ず確認する
- pxはFigmaの数値をそのまま使用せずremへ変換する(基準16px)
- レスポンシブはモバイルファーストで記述する
- ブレークポイントはmin-widthで追加する
- 色・余白・フォントサイズの直値使用は禁止
- 必ずvar(--xxx)を使用する
- HTMLはセマンティックなタグを使用する
- SEOを意識した見出し構造(h1〜h3)を設計する
- 共通パーツはページ間で再利用する

実装順序:

1. 基盤構築(reset / variables / ディレクトリ構成)
2. サイドバー・フッター(全ページ共通パーツ)
3. TOPページ
4. 下層ページ(about → service → contact → thanks)

---

## Gitルール

- コミットは機能単位で行う
- コミットメッセージは日本語でOK

例:

TOPページのヒーローセクション実装
施工事例一覧ページ追加
お問い合わせフォーム実装
