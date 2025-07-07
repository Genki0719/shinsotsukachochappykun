import React, { useState, useEffect } from 'react';
import html2pdf from 'html2pdf.js';

const ChappyAiDiagnosis = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    currentUrl: '',
    competitorUrl: '',
    businessArea: '',
    companyDescription: '',
    currentIssues: '',
    renewalPurpose: ''
  });

  const [improvements, setImprovements] = useState([]);
  const [sitemap, setSitemap] = useState([]);
  const [competitorAnalysis, setCompetitorAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [shareLink, setShareLink] = useState('');

  const callOpenAI = async (prompt) => {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7
      })
    });
    const data = await response.json();
    return data.choices[0].message.content;
  };

  const generateAll = async () => {
    setLoading(true);
    const baseInfo = `\n【会社説明】${formData.companyDescription}\n【課題】${formData.currentIssues}\n【目的】${formData.renewalPurpose}`;

    const improvementPrompt = `以下の情報に基づき、6カテゴリごとにWeb改善提案を3つずつ日本語でJSON形式で出力：\n${baseInfo}`;
    const improvementRes = await callOpenAI(improvementPrompt);
    try {
      const parsed = JSON.parse(improvementRes.slice(improvementRes.indexOf('[')));
      setImprovements(parsed);
    } catch (e) {
      setImprovements([]);
    }

    const sitemapPrompt = `以下の情報に基づき、会社にふさわしいWebサイト構成（ページリスト）を日本語で配列形式で出力：\n${baseInfo}`;
    const sitemapRes = await callOpenAI(sitemapPrompt);
    try {
      const parsed = JSON.parse(sitemapRes.slice(sitemapRes.indexOf('[')));
      setSitemap(parsed);
    } catch (e) {
      setSitemap([]);
    }

    if (formData.competitorUrl) {
      const competitorPrompt = `以下の競合サイトURLを確認し、あなたの会社にとって参考になるポイントと差別化ポイントを日本語でまとめてください。\n\n競合URL: ${formData.competitorUrl}`;
      const analysis = await callOpenAI(competitorPrompt);
      setCompetitorAnalysis(analysis);
    }

    setLoading(false);
  };

  const exportPdf = () => {
    const element = document.getElementById('diagnosis-result');
    html2pdf().from(element).save('chappy-diagnosis.pdf');
  };

  const createShareLink = async () => {
    const res = await fetch('/results', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ improvements, sitemap, competitorAnalysis }),
    });
    if (res.ok) {
      const data = await res.json();
      setShareLink(`${window.location.origin}/result/${data.id}`);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">新卒課長チャッピーくん - AI診断</h1>

      <div className="grid grid-cols-2 gap-4">
        <input
          className="p-2 border rounded"
          placeholder="会社名"
          onChange={e => setFormData({ ...formData, companyName: e.target.value })}
        />
        <input
          className="p-2 border rounded"
          placeholder="現在のURL（任意）"
          onChange={e => setFormData({ ...formData, currentUrl: e.target.value })}
        />
        <input
          className="p-2 border rounded"
          placeholder="競合URL（任意）"
          onChange={e => setFormData({ ...formData, competitorUrl: e.target.value })}
        />
        <input
          className="p-2 border rounded"
          placeholder="商圏"
          onChange={e => setFormData({ ...formData, businessArea: e.target.value })}
        />
        <textarea
          className="col-span-2 p-2 border rounded"
          placeholder="会社説明"
          onChange={e => setFormData({ ...formData, companyDescription: e.target.value })}
        />
        <textarea
          className="col-span-2 p-2 border rounded"
          placeholder="現状の課題"
          onChange={e => setFormData({ ...formData, currentIssues: e.target.value })}
        />
        <textarea
          className="col-span-2 p-2 border rounded"
          placeholder="HPリニューアルの目的"
          onChange={e => setFormData({ ...formData, renewalPurpose: e.target.value })}
        />
      </div>

      <button className="mt-6 bg-blue-600 text-white px-4 py-2 rounded" onClick={generateAll}>AI診断スタート</button>

      {loading && <p className="mt-4 text-blue-500">AI診断中です...</p>}

      <div id="diagnosis-result" className="mt-10 space-y-8">
        {improvements.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-2">🧠 改善提案</h2>
            {improvements.map((item, idx) => (
              <div key={idx} className="mb-4">
                <h3 className="font-semibold">{item.category}</h3>
                <ul className="list-disc list-inside text-gray-700">
                  {item.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
            ))}
          </div>
        )}

        {sitemap.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-2">🗂 推奨サイトマップ</h2>
            <ul className="list-decimal list-inside text-gray-700">
              {sitemap.map((p, i) => <li key={i}>{p}</li>)}
            </ul>
          </div>
        )}

        {competitorAnalysis && (
          <div>
            <h2 className="text-xl font-bold mb-2">📊 競合サイト分析</h2>
            <p className="text-gray-800 whitespace-pre-wrap">{competitorAnalysis}</p>
          </div>
        )}
      </div>

      {(improvements.length > 0 || sitemap.length > 0 || competitorAnalysis) && (
        <div className="mt-6 flex flex-wrap gap-4">
          {!shareLink && (
            <button className="bg-purple-600 text-white px-4 py-2 rounded" onClick={createShareLink}>
              共有リンクを作成
            </button>
          )}
          <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={exportPdf}>
            PDFで保存する
          </button>
        </div>
      )}

      {shareLink && (
        <p className="mt-4">共有リンク: <a className="text-blue-600 break-all" href={shareLink}>{shareLink}</a></p>
      )}
    </div>
  );
};

export default ChappyAiDiagnosis;
