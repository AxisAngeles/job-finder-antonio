import React, { useState } from 'react';

export default function JobFinder() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('jobs');
  const [generatingCV, setGeneratingCV] = useState(null);
  const [searchStats, setSearchStats] = useState(null);
  const [error, setError] = useState(null);

  const searchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/search-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: 'Mexico City',
          keywords: ['Revenue Analyst', 'FP&A', 'Pricing Analyst', 'Finance Analyst', 'Business Intelligence']
        })
      });

      const data = await response.json();
      if (data.success) {
        setJobs(data.jobs || []);
        setSearchStats(data.skills || {});
      } else {
        setError(data.message || 'Error al buscar empleos');
      }
    } catch (err) {
      setError('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateDocuments = async (job) => {
    setGeneratingCV(job.jobId);
    try {
      const response = await fetch('/api/generate-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job })
      });

      const data = await response.json();
      if (data.success) {
        const cvBlob = new Blob([data.cv], { type: 'text/plain;charset=utf-8' });
        const cvLink = document.createElement('a');
        cvLink.href = URL.createObjectURL(cvBlob);
        cvLink.download = `CV_${job.jobTitle.replace(/\s/g, '_')}.txt`;
        document.body.appendChild(cvLink);
        cvLink.click();
        document.body.removeChild(cvLink);

        setTimeout(() => {
          const letterBlob = new Blob([data.letter], { type: 'text/plain;charset=utf-8' });
          const letterLink = document.createElement('a');
          letterLink.href = URL.createObjectURL(letterBlob);
          letterLink.download = `Carta_${job.jobTitle.replace(/\s/g, '_')}.txt`;
          document.body.appendChild(letterLink);
          letterLink.click();
          document.body.removeChild(letterLink);
        }, 300);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingCV(null);
    }
  };

  const getAffinityColor = (affinity) => {
    if (affinity >= 80) return 'bg-emerald-100 text-emerald-800';
    if (affinity >= 60) return 'bg-blue-100 text-blue-800';
    if (affinity >= 40) return 'bg-yellow-100 text-yellow-800';
    return 'bg-orange-100 text-orange-800';
  };

  const getDaysAgo = (date) => {
    const days = Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Hoy';
    if (days === 1) return 'Ayer';
    return `Hace ${days} días`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="bg-gradient-to-r from-blue-700 via-purple-700 to-indigo-700 text-white py-10 px-6 shadow-2xl">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-bold mb-2">💼 Job Finder Pro</h1>
          <p className="text-lg opacity-95">Antonio Álvarez Ramírez</p>
          <p className="text-sm opacity-80">Especialista en Revenue, Finanzas Comerciales & Business Intelligence</p>
          <p className="text-xs opacity-70 mt-2">📍 Ciudad de México | Zona Metropolitana | Remote/Híbrido</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="flex gap-3 mb-8 flex-wrap">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'jobs' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'
            }`}
          >
            📋 Empleos ({jobs.length})
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'skills' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'
            }`}
          >
            📊 Habilidades
          </button>
        </div>

        <button
          onClick={searchJobs}
          disabled={loading}
          className="mb-8 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg hover:from-green-600 hover:to-emerald-700 transition disabled:opacity-50 shadow-lg text-lg"
        >
          {loading ? '🔄 Buscando empleos...' : '🔍 Buscar Empleos Ahora'}
        </button>

        {error && (
          <div className="mb-8 p-4 bg-red-900 text-red-100 rounded-lg border border-red-700">
            ⚠️ {error}
          </div>
        )}

        {activeTab === 'jobs' && (
          <div className="space-y-4">
            {jobs.length === 0 && !loading && (
              <div className="text-center py-16 bg-slate-800 rounded-xl border-2 border-slate-700">
                <p className="text-4xl mb-4">📁</p>
                <p className="text-slate-300 text-xl font-semibold">Presiona el botón para buscar empleos</p>
              </div>
            )}
            {jobs.map((job) => (
              <div key={job.jobId} className={`bg-slate-800 rounded-xl p-6 hover:bg-slate-700 transition shadow-lg border-l-4 ${job.affinity >= 80 ? 'border-emerald-500' : job.affinity >= 60 ? 'border-blue-500' : 'border-yellow-500'}`}>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
                  <div className="lg:col-span-2">
                    <h3 className="text-2xl font-bold text-white mb-2">{job.jobTitle}</h3>
                    <p className="text-slate-200 font-semibold">{job.company}</p>
                    <p className="text-slate-400 text-sm">📍 {job.location}</p>
                    <p className="text-slate-400 text-sm">⏰ {getDaysAgo(job.postedDate)}</p>
                  </div>
                  <div className="lg:col-span-2 flex flex-col justify-between">
                    <div className={`px-4 py-3 rounded-lg font-bold text-center ${getAffinityColor(job.affinity)}`}>
                      ❤️ {job.affinity}% Afinidad
                    </div>
                    <div className="text-green-400 font-bold text-lg mt-2">
                      💰 {job.salary}
                    </div>
                  </div>
                </div>

                <p className="text-slate-300 mb-5">{job.jobDescription}</p>

                <div className="flex gap-3 flex-wrap">
                  <button
                    onClick={() => window.open(job.applyUrl, '_blank')}
                    className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                  >
                    👀 Ver Empleo
                  </button>
                  <button
                    onClick={() => generateDocuments(job)}
                    disabled={generatingCV === job.jobId}
                    className="px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold disabled:opacity-50"
                  >
                    📄 Personalizar CV
                  </button>
                  <button
                    onClick={() => window.open(job.applyUrl, '_blank')}
                    className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
                  >
                    ✨ Aplicar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="bg-slate-800 rounded-xl p-10 shadow-lg">
            <h2 className="text-3xl font-bold text-white mb-10">📈 Habilidades Más Demandadas</h2>
            {Object.keys(searchStats).length > 0 ? (
              <div className="flex flex-wrap gap-4 justify-center">
                {Object.entries(searchStats)
                  .sort((a, b) => b[1] - a[1])
                  .map(([skill, freq]) => {
                    const maxFreq = Math.max(...Object.values(searchStats));
                    const size = 14 + (freq / maxFreq) * 16;
                    return (
                      <div
                        key={skill}
                        className="bg-gradient-to-br from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg text-center shadow-lg"
                        style={{ fontSize: `${size}px`, fontWeight: 'bold' }}
                      >
                        {skill} ({freq})
                      </div>
                    );
                  })}
              </div>
            ) : (
              <p className="text-slate-400 text-center">Presiona "Buscar Empleos" para ver habilidades</p>
            )}
          </div>
        )}
      </div>

      <div className="bg-slate-950 text-slate-500 py-6 px-6 mt-12 border-t border-slate-800 text-center text-sm">
        <p>Job Finder Pro v1.0</p>
        <p>Para Antonio Álvarez | 📧 Antonio.Alv.Ram81@gmail.com</p>
      </div>
    </div>
  );
}
