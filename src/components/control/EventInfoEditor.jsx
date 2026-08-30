import React, { useState } from 'react';
import { useTimer } from '../../context/TimerContext';
import { FileText, Save } from 'lucide-react';

const EventInfoEditor = () => {
  const { eventInfo, updateEventInfo } = useTimer();

  const [form, setForm] = useState(eventInfo);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateEventInfo(form);
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-purple-500/30 flex flex-col gap-5 shadow-[0_0_30px_rgba(168,85,247,0.15)]">
      <div className="flex items-center justify-between border-b border-purple-500/20 pb-3">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-purple-400" />
          <h2 className="text-lg font-orbitron font-bold text-white tracking-wider">
            EVENT DETAILS
          </h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-bold text-purple-300 uppercase">EVENT TITLE</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="bg-black/60 border border-purple-500/40 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-purple-400"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-bold text-purple-300 uppercase">EDITION</label>
          <input
            type="text"
            value={form.edition}
            onChange={(e) => setForm({ ...form, edition: e.target.value })}
            className="bg-black/60 border border-purple-500/40 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-purple-400"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-bold text-purple-300 uppercase">SUBTITLE</label>
          <input
            type="text"
            value={form.subtitle}
            onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
            className="bg-black/60 border border-purple-500/40 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-purple-400"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-bold text-purple-300 uppercase">VENUE LOCATION</label>
          <input
            type="text"
            value={form.venue}
            onChange={(e) => setForm({ ...form, venue: e.target.value })}
            className="bg-black/60 border border-purple-500/40 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-purple-400"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-bold text-purple-300 uppercase">EVENT DATE</label>
          <input
            type="text"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="bg-black/60 border border-purple-500/40 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-purple-400"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-bold text-purple-300 uppercase">TIME RANGE</label>
          <input
            type="text"
            value={form.timeRange}
            onChange={(e) => setForm({ ...form, timeRange: e.target.value })}
            className="bg-black/60 border border-purple-500/40 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-purple-400"
          />
        </div>

        <div className="col-span-1 sm:col-span-2">
          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(168,85,247,0.3)]"
          >
            <Save className="w-4 h-4" />
            <span>UPDATE EVENT INFORMATION</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventInfoEditor;
