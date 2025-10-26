// OOH広告の料金データベース（1面・1週間あたりの基本料金）
const mediaPricing = {
    billboard: {
        name: "大型看板",
        baseCost: 500000,
        impressionsPerWeek: 150000,
        areaPricing: {
            shibuya: 1.5,
            shinjuku: 1.4,
            ginza: 1.6,
            ikebukuro: 1.3,
            yokohama: 1.2,
            suburb: 0.8
        }
    },
    digital: {
        name: "デジタルサイネージ",
        baseCost: 800000,
        impressionsPerWeek: 250000,
        areaPricing: {
            shibuya: 1.6,
            shinjuku: 1.5,
            ginza: 1.7,
            ikebukuro: 1.4,
            yokohama: 1.3,
            suburb: 0.9
        }
    },
    station: {
        name: "駅広告（ポスター）",
        baseCost: 300000,
        impressionsPerWeek: 200000,
        areaPricing: {
            shibuya: 1.5,
            shinjuku: 1.4,
            ginza: 1.5,
            ikebukuro: 1.3,
            yokohama: 1.2,
            suburb: 0.7
        }
    },
    bus: {
        name: "バス広告",
        baseCost: 200000,
        impressionsPerWeek: 80000,
        areaPricing: {
            shibuya: 1.3,
            shinjuku: 1.2,
            ginza: 1.4,
            ikebukuro: 1.2,
            yokohama: 1.1,
            suburb: 0.8
        }
    },
    taxi: {
        name: "タクシー広告",
        baseCost: 150000,
        impressionsPerWeek: 50000,
        areaPricing: {
            shibuya: 1.4,
            shinjuku: 1.3,
            ginza: 1.5,
            ikebukuro: 1.2,
            yokohama: 1.1,
            suburb: 0.9
        }
    }
};

// エリア名のマッピング
const areaNames = {
    shibuya: "渋谷・原宿",
    shinjuku: "新宿",
    ginza: "銀座・丸の内",
    ikebukuro: "池袋",
    yokohama: "横浜",
    suburb: "郊外エリア"
};

// 数値をフォーマットする関数
function formatNumber(num) {
    return new Intl.NumberFormat('ja-JP').format(Math.round(num));
}

// 金額をフォーマットする関数
function formatCurrency(num) {
    return '¥' + formatNumber(num);
}

// 計算処理
function calculatePlan() {
    const mediaType = document.getElementById('mediaType').value;
    const area = document.getElementById('area').value;
    const period = parseInt(document.getElementById('period').value);
    const quantity = parseInt(document.getElementById('quantity').value);

    // 選択された媒体のデータ
    const media = mediaPricing[mediaType];
    const areaPriceMultiplier = media.areaPricing[area];

    // 総費用の計算
    const costPerFacePerWeek = media.baseCost * areaPriceMultiplier;
    const totalCost = costPerFacePerWeek * period * quantity;

    // インプレッションの計算
    const impressionsPerFace = media.impressionsPerWeek * period;
    const totalImpressions = impressionsPerFace * quantity;

    // CPMの計算（Cost Per Mille = 1000インプレッションあたりのコスト）
    const cpm = (totalCost / totalImpressions) * 1000;

    // 週あたり平均リーチ
    const weeklyReach = (totalImpressions / period);

    // 結果を表示
    document.getElementById('totalCost').textContent = formatCurrency(totalCost);
    document.getElementById('impressions').textContent = formatNumber(totalImpressions);
    document.getElementById('cpm').textContent = formatCurrency(cpm);
    document.getElementById('weeklyReach').textContent = formatNumber(weeklyReach) + '人';

    // プラン詳細を表示
    const planDetails = document.getElementById('planDetails');
    planDetails.innerHTML = `
        <p><strong>媒体種別：</strong>${media.name}</p>
        <p><strong>エリア：</strong>${areaNames[area]}</p>
        <p><strong>掲出期間：</strong>${period}週間</p>
        <p><strong>面数：</strong>${quantity}面</p>
        <p><strong>1面・1週間あたり単価：</strong>${formatCurrency(costPerFacePerWeek)}</p>
        <p><strong>1面あたり推定インプレッション：</strong>${formatNumber(impressionsPerFace)}</p>
    `;

    // 結果セクションをハイライト
    const resultSection = document.querySelector('.result-section');
    resultSection.style.animation = 'none';
    setTimeout(() => {
        resultSection.style.animation = 'fadeIn 0.5s ease-in';
    }, 10);
}

// ページ読み込み時の初期設定
document.addEventListener('DOMContentLoaded', function() {
    // 計算ボタンのイベントリスナー
    document.getElementById('calculateBtn').addEventListener('click', calculatePlan);

    // 入力値変更時の自動計算（オプション）
    const inputs = ['mediaType', 'area', 'period', 'quantity'];
    inputs.forEach(id => {
        document.getElementById(id).addEventListener('change', calculatePlan);
    });

    // 初回計算を実行
    calculatePlan();
});

// アニメーション用のCSSを追加
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0.5;
            transform: scale(0.98);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
`;
document.head.appendChild(style);
