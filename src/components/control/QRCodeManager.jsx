import React, { useState } from 'react';
import { useTimer } from '../../context/TimerContext';
import { QrCode, Plus, Eye, EyeOff, Trash2 } from 'lucide-react';

const QRCodeManager = () => {
  const { qrCodes, addOrUpdateQRCode, toggleQRCodeActive, deleteQRCode } = useTimer();

  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');

  const handleAddQR = (e) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;

    addOrUpdateQRCode({
      title: title.trim(),
      url: url.trim(),
      description: description.trim() || 'Scan to view details'
    });

    setTitle('');
    setUrl('');
    setDescription('');
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-purple-500/30 flex flex-col gap-5 shadow-[0_0_30px_rgba(168,85,247,0.15)]">
      <div className="flex items-center gap-2 border-b border-purple-500/20 pb-3">
        <QrCode className="w-5 h-5 text-purple-400" />
        <h2 className="text-lg font-orbitron font-bold text-white tracking-wider">
          QR CODE BROADCASTER
        </h2>
      </div>

      {/* New QR Form */}
      <form onSubmit={handleAddQR} className="flex flex-col gap-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-purple-300 uppercase">LABEL / TITLE</label>
            <input
              type="text"
              placeholder="e.g., SUBMISSION PORTAL"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-black/60 border border-purple-500/40 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-purple-400"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-purple-300 uppercase">TARGET URL</label>
            <input
              type="url"
              placeholder="https://hackatronics.devpost.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="bg-black/60 border border-purple-500/40 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-purple-400"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-bold text-purple-300 uppercase">INSTRUCTION / DESCRIPTION</label>
          <input
            type="text"
            placeholder="e.g., Scan to upload final presentation deck before 8:00 AM."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-black/60 border border-purple-500/40 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-purple-400"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(168,85,247,0.3)]"
        >
          <Plus className="w-4 h-4" />
          <span>ADD NEW QR CODE</span>
        </button>
      </form>

      {/* QR List */}
      <div className="flex flex-col gap-2 pt-3 border-t border-purple-500/20">
        <span className="text-xs font-bold tracking-wider text-purple-300/80 uppercase">
          AVAILABLE QR CODES ({qrCodes.length})
        </span>

        <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
          {qrCodes.map((qr) => (
            <div
              key={qr.id}
              className={`flex items-center justify-between p-3 rounded-xl border text-xs ${
                qr.active
                  ? 'bg-purple-950/50 border-purple-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                  : 'bg-black/40 border-gray-800 text-gray-400'
              }`}
            >
              <div className="flex flex-col overflow-hidden mr-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold uppercase tracking-wider text-purple-200">{qr.title}</span>
                  {qr.active && (
                    <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-purple-500 font-bold text-white animate-pulse">
                      ON DISPLAY
                    </span>
                  )}
                </div>
                <p className="text-[11px] font-mono text-purple-300/80 truncate mt-0.5">{qr.url}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => toggleQRCodeActive(qr.id)}
                  title={qr.active ? 'Hide from Display' : 'Show on Display'}
                  className={`p-2 rounded-lg border font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                    qr.active
                      ? 'bg-purple-600 border-purple-400 text-white'
                      : 'bg-gray-800 border-gray-700 text-gray-300 hover:text-white'
                  }`}
                >
                  {qr.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  <span>{qr.active ? 'VISIBLE' : 'SHOW'}</span>
                </button>

                <button
                  onClick={() => deleteQRCode(qr.id)}
                  title="Delete QR Code"
                  className="p-2 rounded-lg bg-red-950/60 border border-red-500/40 text-red-400 hover:text-red-200 transition-all cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QRCodeManager;
