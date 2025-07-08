import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import html2pdf from 'html2pdf.js';

const ResultViewer = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/results/${id}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
      setLoading(false);
    };
    fetchData();
  }, [id]);

  const exportPdf = () => {
    const element = document.getElementById('diagnosis-result');
    html2pdf().from(element).save('chappy-diagnosis.pdf');
  };

  if (loading) {
    return <p className="p-6">Loading...</p>;
  }

  if (!data) {
    return <p className="p-6">Result not found.</p>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">診断結果</h1>
      <div id="diagnosis-result" className="space-y-8">
        {data.improvements?.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-2">🧠 改善提案</h2>
            {data.improvements.map((item, idx) => (
              <div key={idx} className="mb-4">
                <h3 className="font-semibold">{item.category}</h3>
                <ul className="list-disc list-inside text-gray-700">
                  {item.suggestions.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {data.sitemap?.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-2">🗂 推奨サイトマップ</h2>
            <ul className="list-decimal list-inside text-gray-700">
              {data.sitemap.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </div>
        )}

        {data.competitorAnalysis && (
          <div>
            <h2 className="text-xl font-bold mb-2">📊 競合サイト分析</h2>
            <p className="text-gray-800 whitespace-pre-wrap">
              {data.competitorAnalysis}
            </p>
          </div>
        )}
      </div>
      <button
        className="mt-6 bg-green-600 text-white px-4 py-2 rounded"
        onClick={exportPdf}
      >
        PDFで保存する
      </button>
    </div>
  );
};

export default ResultViewer;
