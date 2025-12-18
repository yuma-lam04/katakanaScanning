import type { FC } from 'react';

interface HomeProps {
    onStart: () => void;
}

export const Home: FC<HomeProps> = ({ onStart }) => {
    return (
        <div className="screen">
            <h1>カタカナ認識スクリーニング</h1>

            <div className="p-4" style={{ textAlign: 'left', border: '1px solid #ccc', borderRadius: '8px', margin: '1rem 0' }}>
                <h3 className="text-danger">⚠️ 注意事項（必ずお読みください）</h3>
                <p>
                    このアプリケーションは、カタカナの読み取りにおける「形の取り違え」傾向を
                    簡易的にチェックするためのツールです。
                </p>
                <p>
                    <strong>医療的な診断を行うものではありません。</strong>
                </p>
                <p>
                    日常生活で困りごとが大きい場合は、本ツールの結果に関わらず、
                    眼科医や専門家にご相談されることをお勧めします。
                </p>
            </div>

            <div className="mt-4">
                <p>
                    各試行で、画面にカタカナや擬似単語が表示されます。<br />
                    見えた文字（または正しいと思う文字）を素早く選んでください。
                </p>
                <p className="text-small">
                    所要時間：約3〜5分
                </p>
            </div>

            <button onClick={onStart} style={{ fontSize: '1.2rem', padding: '1rem 2rem', marginTop: '2rem', backgroundColor: 'var(--color-primary)', color: 'white' }}>
                同意して開始する
            </button>
        </div>
    );
};
