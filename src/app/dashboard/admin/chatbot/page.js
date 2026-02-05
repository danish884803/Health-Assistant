'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { Save, Power } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AdminChatbotPage() {
  const { user, loading } = useAuth();
  const [config, setConfig] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'admin') return;

    fetch('/api/admin/ai-config', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setConfig(data.config));
  }, [user]);

  if (loading) return null;
  if (!user || user.role !== 'admin') return null;
  if (!config) return null;

  async function saveConfig() {
    setSaving(true);
    await fetch('/api/admin/ai-config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(config),
    });
    setSaving(false);
    alert('AI configuration saved');
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="pt-28 pb-20">
        <div className="max-w-5xl mx-auto px-6 space-y-8">

          {/* HEADER */}
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              Chatbot &{' '}
              <span className="bg-gradient-to-r from-teal-500 to-emerald-400 bg-clip-text text-transparent">
                AI Control
              </span>
            </h1>
            <p className="text-gray-500 mt-1">
              Configure OpenAI prompts, safety rules & language support
            </p>
          </div>

          {/* STATUS */}
          <div className="bg-white border rounded-2xl p-6 flex items-center justify-between">
            <div>
              <p className="font-bold text-gray-900">AI Status</p>
              <p className="text-sm text-gray-500">
                {config.isActive ? 'AI is currently enabled' : 'AI is disabled'}
              </p>
            </div>
            <button
              onClick={() => setConfig({ ...config, isActive: !config.isActive })}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-white ${
                config.isActive ? 'bg-red-500' : 'bg-teal-600'
              }`}
            >
              <Power size={16} />
              {config.isActive ? 'Disable AI' : 'Enable AI'}
            </button>
          </div>

          {/* SYSTEM PROMPT */}
          <div className="bg-white border rounded-3xl p-8 space-y-4">
            <h3 className="font-bold text-lg text-gray-900">
              System Prompt
            </h3>

            <textarea
              rows={14}
              value={config.systemPrompt}
              onChange={(e) =>
                setConfig({ ...config, systemPrompt: e.target.value })
              }
              className="w-full border rounded-xl p-4 text-sm font-mono focus:ring-2 focus:ring-teal-500 outline-none"
              placeholder="Type hospital AI rules here..."
            />

            <div className="text-xs text-gray-500">
              ⚠️ This prompt controls **what the AI is allowed to say**.
              <br />
              Medical diagnosis & treatment must be blocked here.
            </div>
          </div>

          {/* LANGUAGE */}
          <div className="bg-white border rounded-2xl p-6 space-y-4">
            <h3 className="font-bold text-lg">Supported Languages</h3>

            <div className="flex gap-6">
              {['en', 'ar'].map(lang => (
                <label key={lang} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={config.languages.includes(lang)}
                    onChange={(e) => {
                      const updated = e.target.checked
                        ? [...config.languages, lang]
                        : config.languages.filter(l => l !== lang);
                      setConfig({ ...config, languages: updated });
                    }}
                  />
                  {lang === 'en' ? 'English' : 'Arabic'}
                </label>
              ))}
            </div>
          </div>

          {/* SAVE */}
          <button
            onClick={saveConfig}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl py-4 font-bold"
          >
            <Save size={18} />
            {saving ? 'Saving...' : 'Save AI Configuration'}
          </button>

        </div>
      </main>

      <Footer />
    </div>
  );
}
