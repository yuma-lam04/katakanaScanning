import seedrandom from 'seedrandom';
import type { Stimulus, TestConfig, VocabularyLevel } from '../types';

interface WordEntry {
    word: string;
    level: VocabularyLevel;
}

// Expanded Katakana Word List
const RAW_WORDS: WordEntry[] = [
    // --- EASY (Daily items, concrete nouns) ---
    // Short (3-5)
    { word: 'バナナ', level: 'easy' }, { word: 'カメラ', level: 'easy' }, { word: 'テレビ', level: 'easy' },
    { word: 'ラジオ', level: 'easy' }, { word: 'ノート', level: 'easy' }, { word: 'ペン', level: 'easy' },
    { word: 'コップ', level: 'easy' }, { word: 'ドア', level: 'easy' }, { word: 'バス', level: 'easy' },
    { word: 'テスト', level: 'easy' }, { word: 'スマホ', level: 'easy' }, { word: 'ゲーム', level: 'easy' },
    { word: 'ネット', level: 'easy' }, { word: 'ニュース', level: 'easy' }, { word: 'メール', level: 'easy' },
    { word: 'データ', level: 'easy' }, { word: 'アプリ', level: 'easy' }, { word: 'サイト', level: 'easy' },
    { word: 'コード', level: 'easy' }, { word: 'ピアノ', level: 'easy' }, { word: 'ギター', level: 'easy' },
    { word: 'ドラム', level: 'easy' }, { word: 'マイク', level: 'easy' }, { word: 'ステージ', level: 'easy' },
    { word: 'ライブ', level: 'easy' }, { word: 'バンド', level: 'easy' }, { word: 'トマト', level: 'easy' },
    { word: 'レタス', level: 'easy' }, { word: 'パン', level: 'easy' }, { word: 'ライス', level: 'easy' },
    { word: 'カレー', level: 'easy' }, { word: 'スープ', level: 'easy' }, { word: 'ケーキ', level: 'easy' },
    { word: 'チョコ', level: 'easy' }, { word: 'シャツ', level: 'easy' }, { word: 'コート', level: 'easy' },
    { word: 'マスク', level: 'easy' },
    // Medium (5-7)
    { word: 'カレンダー', level: 'easy' }, { word: 'キッチン', level: 'easy' }, { word: 'ボールペン', level: 'easy' },
    { word: 'エアコン', level: 'easy' }, { word: 'リモコン', level: 'easy' }, { word: 'パソコン', level: 'easy' },
    { word: 'テーブル', level: 'easy' }, { word: 'ソファ', level: 'easy' }, { word: 'カーテン', level: 'easy' },
    { word: 'トイレ', level: 'easy' }, { word: 'シャワー', level: 'easy' }, { word: 'タオル', level: 'easy' },
    // More Easy Medium/Long for padding (Fix for bug where 'Medium' + 'Easy' had few words)
    { word: 'オレンジ', level: 'easy' }, { word: 'ストロベリー', level: 'easy' }, { word: 'パイナップル', level: 'easy' },
    { word: 'チョコレート', level: 'easy' }, { word: 'ハンバーグ', level: 'easy' }, { word: 'スパゲッティ', level: 'easy' },
    { word: 'サンドイッチ', level: 'easy' }, { word: 'アイスクリーム', level: 'easy' }, { word: 'スニーカー', level: 'easy' },
    { word: 'ネックレス', level: 'easy' }, { word: 'マンション', level: 'easy' }, { word: 'マヨネーズ', level: 'easy' },
    { word: 'ケチャップ', level: 'easy' }, { word: 'フライパン', level: 'easy' }, { word: 'オムライス', level: 'easy' },
    { word: 'プラスチック', level: 'easy' }, { word: 'エレベーター', level: 'easy' },
    // Long (7-10)
    { word: 'エスカレーター', level: 'easy' }, { word: 'エレベーター', level: 'easy' }, { word: 'ハンバーガー', level: 'easy' },
    { word: 'サンドイッチ', level: 'easy' }, { word: 'スーパーマーケット', level: 'easy' }, { word: 'コンビニエンス', level: 'easy' },

    // --- NORMAL (Business, Tech, Abstract + Demoted Hard words) ---
    // From Original Normal
    { word: 'シェア', level: 'normal' }, { word: 'リスク', level: 'normal' }, { word: 'コスト', level: 'normal' },
    { word: 'タスク', level: 'normal' }, { word: 'ゴール', level: 'normal' }, { word: 'ルール', level: 'normal' },
    { word: 'モデル', level: 'normal' }, { word: 'リズム', level: 'normal' }, { word: 'レベル', level: 'normal' },
    { word: 'エラー', level: 'normal' }, { word: 'ログ', level: 'normal' }, { word: 'タイプ', level: 'normal' },
    { word: 'リンク', level: 'normal' }, { word: 'リスト', level: 'normal' }, { word: 'ファイル', level: 'normal' },
    { word: 'システム', level: 'normal' }, { word: 'デザイン', level: 'normal' }, { word: 'プロジェクト', level: 'normal' },
    { word: 'サービス', level: 'normal' }, { word: 'ウイルス', level: 'normal' }, { word: 'ログイン', level: 'normal' },
    { word: 'インストール', level: 'normal' }, { word: 'ダウンロード', level: 'normal' }, { word: 'アップデート', level: 'normal' },
    { word: 'アカウント', level: 'normal' }, { word: 'プロフィール', level: 'normal' }, { word: 'カテゴリ', level: 'normal' },
    { word: 'メッセージ', level: 'normal' }, { word: 'コメント', level: 'normal' }, { word: 'ネットワーク', level: 'normal' },
    { word: 'アプリケーション', level: 'normal' }, { word: 'コミュニケーション', level: 'normal' }, { word: 'セキュリティ', level: 'normal' },
    { word: 'マーケティング', level: 'normal' }, { word: 'プレゼンテーション', level: 'normal' }, { word: 'パフォーマンス', level: 'normal' },
    { word: 'ドキュメント', level: 'normal' }, { word: 'スケジュール', level: 'normal' }, { word: 'シミュレーション', level: 'normal' },
    // Demoted from Hard
    { word: 'エゴ', level: 'normal' }, { word: 'イド', level: 'normal' }, { word: 'ミーム', level: 'normal' },
    { word: 'テーゼ', level: 'normal' }, { word: 'メタ', level: 'normal' }, { word: 'ベタ', level: 'normal' },
    { word: 'カオス', level: 'normal' }, { word: 'コア', level: 'normal' }, { word: 'ノム', level: 'normal' },
    { word: 'ハブ', level: 'normal' }, { word: 'ラフ', level: 'normal' }, { word: 'レア', level: 'normal' },
    { word: 'シナジー', level: 'normal' }, { word: 'メソッド', level: 'normal' }, { word: 'ロジック', level: 'normal' },
    { word: 'スキーム', level: 'normal' }, { word: 'フェーズ', level: 'normal' }, { word: 'リソース', level: 'normal' },
    { word: 'エビデンス', level: 'normal' }, { word: 'アジェンダ', level: 'normal' }, { word: 'バッファ', level: 'normal' },
    { word: 'モジュール', level: 'normal' }, { word: 'プロトコル', level: 'normal' }, { word: 'セグメント', level: 'normal' },
    { word: 'パラメータ', level: 'normal' }, { word: 'アルゴリズム', level: 'normal' },
    { word: 'イニシアチブ', level: 'normal' }, { word: 'コンプライアンス', level: 'normal' }, { word: 'アカウンタビリティ', level: 'normal' },
    { word: 'アイデンティティ', level: 'normal' }, { word: 'イノベーション', level: 'normal' }, { word: 'サステナビリティ', level: 'normal' },
    { word: 'ダイバーシティ', level: 'normal' }, { word: 'インクルージョン', level: 'normal' }, { word: 'デジタルトランス', level: 'normal' },
    { word: 'パラダイムシフト', level: 'normal' }, { word: 'エッセンシャル', level: 'normal' }, { word: 'オーソリティ', level: 'normal' },

    // --- HARD (Scientific, Physics, Math, Biology) ---
    { word: 'フォノン', level: 'hard' }, { word: 'マグノン', level: 'hard' }, { word: 'プラズモン', level: 'hard' },
    { word: 'エキシトン', level: 'hard' }, { word: 'ポラリトン', level: 'hard' }, { word: 'スピノン', level: 'hard' },
    { word: 'ソリトン', level: 'hard' }, { word: 'グルーオン', level: 'hard' }, { word: 'フェルミオン', level: 'hard' },
    { word: 'ボソン', level: 'hard' }, { word: 'バリオン', level: 'hard' }, { word: 'メソン', level: 'hard' },
    { word: 'レプトン', level: 'hard' }, { word: 'ハドロン', level: 'hard' }, { word: 'タキオン', level: 'hard' },
    { word: 'ヘリシティ', level: 'hard' }, { word: 'エニオン', level: 'hard' }, { word: 'モノイド', level: 'hard' },
    { word: 'セミリング', level: 'hard' }, { word: 'トポス', level: 'hard' }, { word: 'スキーム', level: 'hard' },
    { word: 'シンプレクス', level: 'hard' }, { word: 'ホモトピー', level: 'hard' }, { word: 'コホモロジー', level: 'hard' },
    { word: 'ファンクタ', level: 'hard' }, { word: 'アジョイント', level: 'hard' }, { word: 'エンドモルフィズム', level: 'hard' },
    { word: 'イソモルフィズム', level: 'hard' }, { word: 'フィルトレーション', level: 'hard' }, { word: 'スペクトルシーケンス', level: 'hard' },
    { word: 'チェルン', level: 'hard' }, { word: 'ポアンカレ', level: 'hard' }, { word: 'グロタンディーク', level: 'hard' },
    { word: 'エタール', level: 'hard' }, { word: 'モジュライ', level: 'hard' }, { word: 'ボロノイ', level: 'hard' },
    { word: 'ドロネー', level: 'hard' }, { word: 'クラインボトル', level: 'hard' }, { word: 'ホロノミー', level: 'hard' },
    { word: 'アフィン', level: 'hard' }, { word: 'アーベル', level: 'hard' }, { word: 'テータ', level: 'hard' },
    { word: 'スピンコネクション', level: 'hard' }, { word: 'モノドロミー', level: 'hard' }, { word: 'エナンチオマー', level: 'hard' },
    { word: 'ラセミック', level: 'hard' }, { word: 'ロタキサン', level: 'hard' }, { word: 'カテナン', level: 'hard' },
    { word: 'デンドリマー', level: 'hard' }, { word: 'ポルフィリン', level: 'hard' }, { word: 'フラビン', level: 'hard' },
    { word: 'ペロブスカイト', level: 'hard' }, { word: 'スピネル', level: 'hard' }, { word: 'ジルコニア', level: 'hard' },
    { word: 'シリサイド', level: 'hard' }, { word: 'ナイトライド', level: 'hard' }, { word: 'ペプチドグリカン', level: 'hard' },
    { word: 'インフラマソーム', level: 'hard' }, { word: 'エキソソーム', level: 'hard' }, { word: 'エンドソーム', level: 'hard' },
    { word: 'ペルオキシソーム', level: 'hard' }, { word: 'ヌクレオソーム', level: 'hard' }, { word: 'ヘテロクロマチン', level: 'hard' },
    { word: 'ユークロマチン', level: 'hard' }, { word: 'トランスクリプトーム', level: 'hard' }, { word: 'メタボローム', level: 'hard' },
    { word: 'プロテオーム', level: 'hard' }, { word: 'リボザイム', level: 'hard' }, { word: 'アポトーシス', level: 'hard' },
    { word: 'オートファジー', level: 'hard' }, { word: 'オペロン', level: 'hard' }, { word: 'シグナルペプチド', level: 'hard' },
    { word: 'シャペロン', level: 'hard' }, { word: 'ユビキチン', level: 'hard' }, { word: 'アクアポリン', level: 'hard' },
    { word: 'クラトリン', level: 'hard' }, { word: 'カベオラ', level: 'hard' }, { word: 'シナプトタグミン', level: 'hard' },
    { word: 'ニューロピリン', level: 'hard' }, { word: 'アストロサイト', level: 'hard' }, { word: 'ミクログリア', level: 'hard' },
    { word: 'オリゴデンドロサイト', level: 'hard' }, { word: 'ガングリオシド', level: 'hard' }, { word: 'グリコカリックス', level: 'hard' },
    { word: 'サルコメア', level: 'hard' }, { word: 'オフィオライト', level: 'hard' }, { word: 'エクロジャイト', level: 'hard' },
    { word: 'アンフィボライト', level: 'hard' }, { word: 'グラニュライト', level: 'hard' }, { word: 'ミグマタイト', level: 'hard' },
    { word: 'ストロマトライト', level: 'hard' }, { word: 'アイソスタシー', level: 'hard' }, { word: 'オロジェニー', level: 'hard' },
    { word: 'テフラ', level: 'hard' }, { word: 'ダイアピル', level: 'hard' }, { word: 'シュリーレン', level: 'hard' },
    { word: 'コロナグラフ', level: 'hard' }, { word: 'スペクトログラフ', level: 'hard' }, { word: 'ハミルトニアン', level: 'hard' },
    { word: 'ラグランジアン', level: 'hard' },
    // --- NEWLY ADDED HARD WORDS ---
    { word: 'ブリルアンゾーン', level: 'hard' }, { word: 'デコヒーレンス', level: 'hard' }, { word: 'エンタングルメント', level: 'hard' },
    { word: 'アクシオン', level: 'hard' }, { word: 'スフェイラー', level: 'hard' }, { word: 'カラビヤウ', level: 'hard' },
    { word: 'レヴィチビタ', level: 'hard' }, { word: 'クリストッフェル', level: 'hard' }, { word: 'リッチフロー', level: 'hard' },
    { word: 'ヤンミルズ', level: 'hard' }, { word: 'ウィルソンループ', level: 'hard' }, { word: 'リノーマリゼーション', level: 'hard' },
    { word: 'カイラリティ', level: 'hard' }, { word: 'アノマリー', level: 'hard' }, { word: 'クォータニオン', level: 'hard' },
    { word: 'オクタニオン', level: 'hard' }, { word: 'クラインゴルドン', level: 'hard' }, { word: 'シュレーディンガー', level: 'hard' },
    { word: 'ハイゼンベルク', level: 'hard' }, { word: 'ボルツマン', level: 'hard' }, { word: 'リウヴィル', level: 'hard' },
    { word: 'エルゴード', level: 'hard' }, { word: 'アトラクター', level: 'hard' }, { word: 'リャプノフ', level: 'hard' },
    { word: 'ビフルケーション', level: 'hard' }, { word: 'モンテカルロ', level: 'hard' }, { word: 'メトロポリス', level: 'hard' },
    { word: 'ギブスサンプリング', level: 'hard' }, { word: 'マルコフチェーン', level: 'hard' }, { word: 'ベイズファクター', level: 'hard' },
    // { word: 'エビデンス', level: 'hard' }, // Exists in Normal
    { word: 'ラプラスメソッド', level: 'hard' }, { word: 'サドルポイント', level: 'hard' }, { word: 'ミンコフスキー', level: 'hard' },
    { word: 'ローレンツ', level: 'hard' }, { word: 'ノイマン', level: 'hard' }, { word: 'ゲーデル', level: 'hard' },
    { word: 'チューリング', level: 'hard' }, { word: 'チャーチ', level: 'hard' }, { word: 'ラムダカリキュラス', level: 'hard' },
    { word: 'コンビナトリクス', level: 'hard' }, { word: 'グラフカラーリング', level: 'hard' }, { word: 'サティスファイアビリティ', level: 'hard' },
    { word: 'リダクション', level: 'hard' }, { word: 'トポロジー', level: 'hard' }, { word: 'チェインコンプレックス', level: 'hard' },
    { word: 'カスパーゼ', level: 'hard' }, { word: 'インテグロン', level: 'hard' }, { word: 'トランスポゾン', level: 'hard' },
    { word: 'リボスイッチ', level: 'hard' }, { word: 'エピトープ', level: 'hard' }, { word: 'パラトープ', level: 'hard' },
    { word: 'アフィニティ', level: 'hard' }, { word: 'アビディティ', level: 'hard' }, { word: 'ケモカイン', level: 'hard' },
    { word: 'オプソニン', level: 'hard' }, { word: 'アロステリック', level: 'hard' }, { word: 'コンフォメーション', level: 'hard' },
    { word: 'プロトンポンプ', level: 'hard' }, { word: 'シトクロム', level: 'hard' }, { word: 'フラジェリン', level: 'hard' },
    { word: 'クオラムセンシング', level: 'hard' }, { word: 'バクテリオファージ', level: 'hard' }, { word: 'エピジェネティクス', level: 'hard' },
    { word: 'メチローム', level: 'hard' }, { word: 'ゼオライト', level: 'hard' }, { word: 'モルデナイト', level: 'hard' },
    { word: 'ハイドロゲル', level: 'hard' }, { word: 'ソルボサーマル', level: 'hard' }, { word: 'ヒドロサーマル', level: 'hard' },
    { word: 'スパッタリング', level: 'hard' }, { word: 'エピタキシー', level: 'hard' }, { word: 'フォトリソグラフィ', level: 'hard' },
    { word: 'ショットキーバリア', level: 'hard' }, { word: 'アバランシェ', level: 'hard' }, { word: 'トンネルダイオード', level: 'hard' },
    { word: 'プラズマエッチング', level: 'hard' }, { word: 'スピントロニクス', level: 'hard' }, { word: 'マイクロキャビティ', level: 'hard' },
    { word: 'メタマテリアル', level: 'hard' }, { word: 'ミロナイト', level: 'hard' }, { word: 'カタクラサイト', level: 'hard' },
    { word: 'シュードタキライト', level: 'hard' }, { word: 'ブルーシスト', level: 'hard' }, { word: 'グリーンシスト', level: 'hard' },
    { word: 'ハルツバージャイト', level: 'hard' }, { word: 'レールゾライト', level: 'hard' }, { word: 'キンバーライト', level: 'hard' },
    { word: 'アノーソサイト', level: 'hard' }, { word: 'トーナライト', level: 'hard' }, { word: 'トロンダイマイト', level: 'hard' },
    { word: 'ダクタイル', level: 'hard' }, { word: 'プロソディ', level: 'hard' }, { word: 'アロフォン', level: 'hard' },
    { word: 'アロモルフ', level: 'hard' }, { word: 'レキシコン', level: 'hard' }, { word: 'パラダイム', level: 'hard' },
    // --- SUPER LONG ADDITIONS (Easy/Normal/Hard mixed usage) ---
    // EASY (11+)
    { word: 'コンビニエンスストア', level: 'easy' }, { word: 'アミューズメントパーク', level: 'easy' }, { word: 'ファミリーレストラン', level: 'easy' },
    { word: 'ショッピングセンター', level: 'easy' }, { word: 'ディスカウントストア', level: 'easy' }, { word: 'インフォメーションセンター', level: 'easy' },
    { word: 'エアコンディショナー', level: 'easy' }, { word: 'キャビンアテンダント', level: 'easy' }, { word: 'クリーニングサービス', level: 'easy' },
    { word: 'ビデオゲームキャラクター', level: 'easy' }, { word: '大型コインランドリー', level: 'easy' }, { word: 'コミュニケーションツール', level: 'easy' },
    { word: 'コンタクトレンズケース', level: 'easy' }, { word: '高速道路サービスエリア', level: 'easy' }, { word: 'ソフトウェアエンジニア', level: 'easy' },
    { word: 'スマートフォンアプリ', level: 'easy' }, { word: 'ネットスーパーマーケット', level: 'easy' }, { word: 'スポーツインストラクター', level: 'easy' },
    { word: 'インターネットセキュリティー', level: 'easy' }, { word: 'タッチパネルディスプレイ', level: 'easy' }, { word: 'テーマパークスタッフ', level: 'easy' },
    { word: 'トイレットペーパーホルダー', level: 'easy' }, { word: 'ドライクリーニングサービス', level: 'easy' }, { word: 'ノートパソコンケース', level: 'easy' },
    { word: 'パーソナルコンピューター', level: 'easy' }, { word: 'ハロウィンパーティー', level: 'easy' }, { word: 'バイキングレストラン', level: 'easy' },
    { word: 'プロフェッショナルカメラマン', level: 'easy' }, { word: 'ファッションデザイナー', level: 'easy' }, { word: 'プロジェクションマッピング', level: 'easy' },

    // NORMAL (11+)
    { word: 'デジタルトランスフォーメーション', level: 'normal' }, { word: 'クラウドファンディング', level: 'normal' }, { word: 'ベンチャーキャピタル', level: 'normal' },
    { word: 'ブレインストーミング', level: 'normal' }, { word: 'アプリケーションソフトウェア', level: 'normal' }, { word: 'ユーザーインターフェース', level: 'normal' },
    { word: 'ソーシャルネットワーキング', level: 'normal' }, { word: 'グローバルスタンダード', level: 'normal' }, { word: 'コーポレートガバナンス', level: 'normal' },
    { word: 'サプライチェーンマネジメント', level: 'normal' }, { word: 'ダイバーシティインクルージョン', level: 'normal' }, { word: 'ワークライフバランス', level: 'normal' },
    { word: 'ビデオカンファレンス', level: 'normal' }, { word: 'オンラインミーティング', level: 'normal' }, { word: 'デジタルマーケティング', level: 'normal' },
    { word: 'コンテンツマーケティング', level: 'normal' }, { word: 'インフルエンサーマーケティング', level: 'normal' }, { word: 'ナレッジマネジメント', level: 'normal' },
    { word: 'クライシスマネジメント', level: 'normal' }, { word: 'コンプライアンスマニュアル', level: 'normal' }, { word: 'システムアーキテクチャ', level: 'normal' },
    { word: 'インフラストラクチャー', level: 'normal' }, { word: 'デジタルプラットフォーム', level: 'normal' }, { word: 'トータルソリューション', level: 'normal' },
    { word: 'ソーシャルアカウンタビリティ', level: 'normal' },

    // HARD (11+ additions beyond previous list)
    { word: 'シュレーディンガーキャット', level: 'hard' }, { word: 'ショットキーバリアダイオード', level: 'hard' }, { word: 'アバランシェフォトダイオード', level: 'hard' },
    { word: 'モンテカルロシミュレーション', level: 'hard' }, { word: 'クリストッフェルシンボル', level: 'hard' }, { word: 'リノーマリゼーショングループ', level: 'hard' },
    { word: 'カノニカルアンサンブル', level: 'hard' }, { word: 'グランドカノニカルアンサンブル', level: 'hard' }, { word: 'マイクロカノニカルアンサンブル', level: 'hard' },
    { word: 'リアプノフエクスポネント', level: 'hard' }, { word: 'ストレンジアトラクター', level: 'hard' }, { word: 'ハウスドルフディメンション', level: 'hard' },
    { word: 'コルモゴロフコンプレキシティ', level: 'hard' }, { word: 'マルコフチェーンモンテカルロ', level: 'hard' }, { word: 'メトロポリスヘイスティングス', level: 'hard' },
    { word: 'ボースアインシュタイン', level: 'hard' }, { word: 'プランクディストリビューション', level: 'hard' }, { word: 'マクスウェルボルツマン', level: 'hard' },
    { word: 'シュワルツシルトラディウス', level: 'hard' }, { word: 'エントロピープロダクション', level: 'hard' }, { word: 'アンチドジッタースペース', level: 'hard' },
    { word: 'クラインゴルドンイクエーション', level: 'hard' }, { word: 'ディラックオペレーター', level: 'hard' }, { word: 'リギドヒルベルトスペース', level: 'hard' },
    { word: 'ホモロジカルアルジェブラ', level: 'hard' }, { word: 'ハイヤーカテゴリーセオリー', level: 'hard' }, { word: 'サティスファイアビリティ', level: 'hard' },

    // --- INFO (IT / Network / Security) ---
    { word: 'アルゴリズム', level: 'info' }, { word: 'データストラクチャ', level: 'info' }, { word: 'ハッシュ', level: 'info' },
    { word: 'ソルト', level: 'info' }, { word: 'エンクリプション', level: 'info' }, { word: 'デクリプト', level: 'info' },
    { word: 'シグネチャ', level: 'info' }, { word: 'サーバー', level: 'info' }, { word: 'クライアント', level: 'info' },
    { word: 'ブラウザ', level: 'info' }, { word: 'ネットワーク', level: 'info' }, { word: 'ルーター', level: 'info' },
    { word: 'スイッチ', level: 'info' }, { word: 'ハブ', level: 'info' }, { word: 'ブリッジ', level: 'info' },
    { word: 'リピーター', level: 'info' }, { word: 'ゲートウェイ', level: 'info' }, { word: 'プロキシ', level: 'info' },
    { word: 'ファイアウォール', level: 'info' }, { word: 'ロードバランサー', level: 'info' }, { word: 'パケット', level: 'info' },
    { word: 'フレーム', level: 'info' }, { word: 'ポート', level: 'info' }, { word: 'ソケット', level: 'info' },
    { word: 'ルーティング', level: 'info' }, { word: 'サブネット', level: 'info' }, { word: 'サブネットマスク', level: 'info' },
    { word: 'セグメント', level: 'info' }, { word: 'トポロジー', level: 'info' }, { word: 'ブロードキャスト', level: 'info' },
    { word: 'マルチキャスト', level: 'info' }, { word: 'ユニキャスト', level: 'info' }, { word: 'スループット', level: 'info' },
    { word: 'レイテンシー', level: 'info' }, { word: 'ジッター', level: 'info' }, { word: 'バンドウィズ', level: 'info' },
    { word: 'タイムアウト', level: 'info' }, { word: 'リトライ', level: 'info' }, { word: 'ティーシーピー', level: 'info' },
    { word: 'ユーディーピー', level: 'info' }, { word: 'アイピーブイフォー', level: 'info' }, { word: 'アイピーブイシックス', level: 'info' },
    { word: 'ディーエヌエス', level: 'info' }, { word: 'ディーエイチシーピー', level: 'info' }, { word: 'エイチティーティーピー', level: 'info' },
    { word: 'エイチティーティーピーエス', level: 'info' }, { word: 'エスエスエル', level: 'info' }, { word: 'ティーエルエス', level: 'info' },
    { word: 'エスエスエイチ', level: 'info' }, { word: 'エフティーピー', level: 'info' }, { word: 'エスエフティーピー', level: 'info' },
    { word: 'エスエムティーピー', level: 'info' }, { word: 'ポップスリー', level: 'info' }, { word: 'アイエムエーピー', level: 'info' },
    { word: 'エヌティーピー', level: 'info' }, { word: 'エスエヌエムピー', level: 'info' }, { word: 'アイシーエムピー', level: 'info' },
    { word: 'エーアールピー', level: 'info' }, { word: 'ビージーピー', level: 'info' }, { word: 'オーエスピーエフ', level: 'info' },
    { word: 'マルウェア', level: 'info' }, { word: 'ウイルス', level: 'info' }, { word: 'ワーム', level: 'info' },
    { word: 'トロイジャン', level: 'info' }, { word: 'ランサムウェア', level: 'info' }, { word: 'ボットネット', level: 'info' },
    { word: 'フィッシング', level: 'info' }, { word: 'スパム', level: 'info' }, { word: 'スプーフィング', level: 'info' },
    { word: 'スニッフィング', level: 'info' }, { word: 'ブルートフォース', level: 'info' }, { word: 'パスワード', level: 'info' },
    { word: 'パスフレーズ', level: 'info' }, { word: 'トークン', level: 'info' }, { word: 'セッション', level: 'info' },
    { word: 'クッキー', level: 'info' }, { word: 'サンドボックス', level: 'info' }, { word: 'パッチ', level: 'info' },
    { word: 'アップデート', level: 'info' }, { word: 'バックアップ', level: 'info' }, { word: 'リストア', level: 'info' },
    { word: 'データベース', level: 'info' }, { word: 'リレーショナル', level: 'info' }, { word: 'ノーマライゼーション', level: 'info' },
    { word: 'スキーマ', level: 'info' }, { word: 'テーブル', level: 'info' }, { word: 'レコード', level: 'info' },
    { word: 'フィールド', level: 'info' }, { word: 'インデックス', level: 'info' }, { word: 'ビュー', level: 'info' },
    { word: 'クエリ', level: 'info' }, { word: 'トランザクション', level: 'info' }, { word: 'ロック', level: 'info' },
    { word: 'デッドロック', level: 'info' }, { word: 'コミット', level: 'info' }, { word: 'ロールバック', level: 'info' },
    { word: 'レプリケーション', level: 'info' }, { word: 'キャッシュ', level: 'info' }, { word: 'メモリ', level: 'info' },
    { word: 'ストレージ', level: 'info' }, { word: 'ソフトウェア', level: 'info' }, { word: 'ハードウェア', level: 'info' },
    { word: 'ファームウェア', level: 'info' }, { word: 'ミドルウェア', level: 'info' }, { word: 'オペレーティングシステム', level: 'info' },
    { word: 'カーネル', level: 'info' }, { word: 'シェル', level: 'info' }, { word: 'ドライバー', level: 'info' },
    { word: 'ブートローダー', level: 'info' }, { word: 'バイオス', level: 'info' }, { word: 'ユーフィーアイ', level: 'info' },
    { word: 'プロセッサ', level: 'info' }, { word: 'マルチコア', level: 'info' }, { word: 'スレッド', level: 'info' },
    { word: 'プロセス', level: 'info' }, { word: 'スケジューラ', level: 'info' }, { word: 'コンテキストスイッチ', level: 'info' },
    { word: 'マルチタスク', level: 'info' }, { word: 'パイプライン', level: 'info' }, { word: 'キャッシュメモリ', level: 'info' },
    { word: 'バス', level: 'info' }, { word: 'チップセット', level: 'info' }, { word: 'ペリフェラル', level: 'info' },
    { word: 'インタフェース', level: 'info' }, { word: 'ユーザーインタフェース', level: 'info' }, { word: 'グラフィカルユーザーインタフェース', level: 'info' },
    { word: 'コマンドライン', level: 'info' }, { word: 'エーピーアイ', level: 'info' }, { word: 'エスディーケー', level: 'info' },
    { word: 'ライブラリ', level: 'info' }, { word: 'フレームワーク', level: 'info' }, { word: 'ランタイム', level: 'info' },
    { word: 'コンパイラ', level: 'info' }, { word: 'インタプリタ', level: 'info' }, { word: 'アセンブラ', level: 'info' },
    { word: 'リンカー', level: 'info' }, { word: 'ローダー', level: 'info' }, { word: 'デバッガ', level: 'info' },
    { word: 'プロファイラ', level: 'info' }, { word: 'ロギング', level: 'info' }, { word: 'モニタリング', level: 'info' },
    { word: 'トレーシング', level: 'info' }, { word: 'メトリクス', level: 'info' }, { word: 'アラート', level: 'info' },
    { word: 'ダッシュボード', level: 'info' }, { word: 'オブザーバビリティ', level: 'info' }, { word: 'バージョンコントロール', level: 'info' },
    { word: 'リポジトリ', level: 'info' }, { word: 'ブランチ', level: 'info' }, { word: 'プルリクエスト', level: 'info' },
    { word: 'マージリクエスト', level: 'info' }, { word: 'イシュー', level: 'info' }, { word: 'チケット', level: 'info' },
    { word: 'コードレビュー', level: 'info' }, { word: 'リファクタリング', level: 'info' }, { word: 'デプロイメント', level: 'info' },
    { word: 'ロールアウト', level: 'info' }, { word: 'カナリアリリース', level: 'info' }, { word: 'ブルーグリーンデプロイメント', level: 'info' },
    { word: 'コンティニュアスインテグレーション', level: 'info' }, { word: 'コンティニュアスデリバリー', level: 'info' }, { word: 'アジャイル', level: 'info' },
    { word: 'スクラム', level: 'info' }, { word: 'スプリント', level: 'info' }, { word: 'バックログ', level: 'info' },
    { word: 'カンバン', level: 'info' }, { word: 'デブオプス', level: 'info' }, { word: 'コンテナ', level: 'info' },
    { word: 'ドッカー', level: 'info' }, { word: 'クバネティス', level: 'info' }, { word: 'オーケストレーション', level: 'info' },
    { word: 'スケーリング', level: 'info' }, { word: 'オートスケーリング', level: 'info' }, { word: 'サーバーレス', level: 'info' },
    { word: 'マイクロサービス', level: 'info' }, { word: 'モノリス', level: 'info' }, { word: 'クラウド', level: 'info' },
    { word: 'バーチャルマシン', level: 'info' }, { word: 'ハイパーバイザー', level: 'info' }, { word: 'イーサネット', level: 'info' },
    { word: 'ワイファイ', level: 'info' }, { word: 'ブルートゥース', level: 'info' }, { word: 'アクセスポイント', level: 'info' },
    { word: 'エスエスアイディー', level: 'info' }, { word: 'バーチャルプライベートネットワーク', level: 'info' }, { word: 'パブリックキー', level: 'info' },
    { word: 'プライベートキー', level: 'info' }, { word: 'オーセンティケーション', level: 'info' }, { word: 'オーソリゼーション', level: 'info' },
    { word: 'シングルサインオン', level: 'info' }, { word: 'マルチファクター', level: 'info' }, { word: 'バイオメトリクス', level: 'info' },
    { word: 'ワンタイムパスワード', level: 'info' }, { word: 'ゼロトラスト', level: 'info' }, { word: 'フォレンジック', level: 'info' },
    { word: 'ペネトレーションテスト', level: 'info' }, { word: 'ノーエスキューエル', level: 'info' }, { word: 'データウェアハウス', level: 'info' },
    { word: 'データレイク', level: 'info' }, { word: 'メッセージキュー', level: 'info' }
];

export class TrialGenerator {
    private rng: seedrandom.PRNG;

    constructor(seed: string) {
        this.rng = seedrandom(seed);
    }

    private shuffle<T>(array: T[]): T[] {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(this.rng() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    generateSession(config: TestConfig): Stimulus[] {
        const stimuli: Stimulus[] = [];

        // 1. Filter by Vocabulary Level
        let levelWords = RAW_WORDS.filter(w => w.level === config.vocabularyLevel);
        // If we run out of words for the exact level, maybe fallback? For now, assume sufficient.

        // 2. Filter by Length
        let minLen = 0;
        let maxLen = 0;

        switch (config.wordLengthLevel) {
            case 'short': minLen = 3; maxLen = 5; break;
            case 'medium': minLen = 5; maxLen = 7; break;
            case 'long': minLen = 7; maxLen = 10; break;
            case 'super-long': minLen = 11; maxLen = 30; break;
            default: minLen = 3; maxLen = 30;
        }

        const eligibleWords = levelWords.filter(w => w.word.length >= minLen && w.word.length <= maxLen);

        // Fallback logic: If intersection is empty, try to relax length constraint but keep vocab level
        // If still empty, relax vocab constraint.
        let pool = eligibleWords;
        if (pool.length === 0) {
            console.warn(`No words found for Level=${config.vocabularyLevel}, Length=${config.wordLengthLevel}. Relaxing length.`);
            pool = levelWords; // Relax length
        }
        if (pool.length === 0) {
            console.warn(`No words found for Level=${config.vocabularyLevel}. Using all.`);
            pool = RAW_WORDS; // Relax difficulty
        }

        const shuffled = this.shuffle(pool);
        const selected = shuffled.slice(0, config.questionCount); // Use requested count

        selected.forEach(item => {
            stimuli.push({
                id: this.rng().toString(36).substr(2, 9),
                word: item.word,
                displayString: item.word
            });
        });

        return stimuli;
    }

    generatePractice(): Stimulus[] {
        const practiceWords = ['テスト', 'レンシュウ', 'カタカナ', 'スタート', 'オワリ'];
        const stimuli: Stimulus[] = [];

        practiceWords.forEach(word => {
            stimuli.push({
                id: this.rng().toString(36).substr(2, 9),
                word: word,
                displayString: word
            });
        });

        return this.shuffle(stimuli);
    }
}
