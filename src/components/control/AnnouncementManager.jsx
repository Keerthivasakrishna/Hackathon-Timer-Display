import React, { useState } from 'react';
import { useTimer } from '../../context/TimerContext';
import { Megaphone, Send, Eye, EyeOff, Trash2 } from 'lucide-react';

const AnnouncementManager = () => {
  const { announcements, addAnnouncement, toggleAnnouncementActive, deleteAnnouncement } = useTimer();

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState('info');

  const handlePublish = (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    addAnnouncement(title.trim(), message.trim(), priority);
    setTitle('');
    setMessage('');
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-purple-500/30 flex flex-col gap-5 shadow-[0_0_30px_rgba(168,85,247,0.15)]">
      <div className="flex items-center gap-2 border-b border-purple-500/20 pb-3">
        <Megaphone className="w-5 h-5 text-purple-400" />
        <h2 className="text-lg font-orbitron font-bold text-white tracking-wider">
          LIVE ANNOUNCEMENTS
        </h2>
      </div>

      {/* Announcement Publisher Form */}
      <form onSubmit={handlePublish} className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-bold text-purple-300 uppercase">ANNOUNCEMENT TITLE</label>
          <input
            type="text"
            placeholder="e.g., LUNCH IS SERVED"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-black/60 border border-purple-500/40 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-purple-400"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-bold text-purple-300 uppercase">MESSAGE</label>
          <textarea
            rows="2"
            placeholder="e.g., Lunch packs are now available at the Food Court lobby. Please bring your QR passes."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="bg-black/60 border border-purple-500/40 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-purple-400 resize-none"
          ></textarea>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 flex flex-col gap-1">
            <label className="text-[11px] font-bold text-purple-300 uppercase">PRIORITY LEVEL</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="bg-black/60 border border-purple-500/40 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-purple-400"
            >
              <option value="info">Info (Purple Banner)</option>
              <option value="important">Important (Amber Banner)</option>
              <option value="urgent">Urgent (Red Pulsing Banner)</option>
            </select>
          </div>

          <button
            type="submit"
            className="self-end py-2.5 px-5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs tracking-wider uppercase flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(168,85,247,0.3)]"
          >
            <Send className="w-4 h-4" />
            <span>BROADCAST</span>
          </button>
        </div>
      </form>

      {/* Active Announcement List */}
      <div className="flex flex-col gap-2 pt-3 border-t border-purple-500/20">
        <span className="text-xs font-bold tracking-wider text-purple-300/80 uppercase">
          ANNOUNCEMENT HISTORY ({announcements.length})
        </span>

        <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
          {announcements.length === 0 ? (
            <p className="text-xs text-gray-500 italic py-2">No active announcements.</p>
          ) : (
            announcements.map((ann) => (
              <div
                key={ann.id}
                className={`flex items-center justify-between p-3 rounded-xl border text-xs ${
                  ann.active
                    ? 'bg-purple-950/40 border-purple-500/50 text-white'
                    : 'bg-black/40 border-gray-800 text-gray-400'
                }`}
              >
                <div className="flex flex-col overflow-hidden mr-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold uppercase tracking-wider text-purple-300">{ann.title}</span>
                    <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-purple-900/60 font-mono text-purple-200">
                      {ann.priority}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-300 truncate mt-0.5">{ann.message}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => toggleAnnouncementActive(ann.id)}
                    title={ann.active ? 'Hide on Display' : 'Show on Display'}
                    className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                      ann.active
                        ? 'bg-purple-600 border-purple-400 text-white'
                        : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white'
                    }`}
                  >
                    {ann.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => deleteAnnouncement(ann.id)}
                    title="Delete Announcement"
                    className="p-1.5 rounded-lg bg-red-950/60 border border-red-500/40 text-red-400 hover:text-red-200 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementManager;
