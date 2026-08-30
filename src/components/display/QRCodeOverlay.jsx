import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode, ExternalLink, Sparkles } from 'lucide-react';

const QRCodeOverlay = ({ qrCode, isSpotlight = false }) => {
  if (!qrCode || !qrCode.active) return null;

  return (
    <div className={`w-full flex flex-col items-center justify-center transition-all duration-500 ${
      isSpotlight ? 'h-full p-4' : 'fixed bottom-6 right-6 z-50'
    }`}>
      <div className={`bg-black/90 backdrop-blur-2xl border border-purple-500/60 rounded-3xl p-6 md:p-8 shadow-[0_0_60px_rgba(168,85,247,0.5)] flex flex-col items-center text-center max-w-md w-full animate-in fade-in zoom-in-95 duration-300`}>
        {/* Header Tag */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/90 border border-purple-400 text-purple-300 text-xs font-extrabold tracking-widest uppercase mb-4 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
          <QrCode className="w-4 h-4 text-purple-400 animate-pulse" />
          <span>{qrCode.title || 'SCAN QR CODE'}</span>
        </div>

        {/* Large Crisp QR Code Box */}
        <div className="p-4 bg-white rounded-2xl shadow-2xl mb-5 hover:scale-105 transition-transform duration-300">
          <QRCodeSVG
            value={qrCode.url || 'https://vit.ac.in'}
            size={isSpotlight ? 220 : 170}
            bgColor="#FFFFFF"
            fgColor="#000000"
            level="H"
            includeMargin={false}
          />
        </div>

        {/* Instructions / Description */}
        <p className="text-sm md:text-base text-gray-100 font-semibold leading-relaxed mb-3">
          {qrCode.description || 'Scan using your mobile phone camera to open.'}
        </p>

        {/* Direct Link */}
        <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-purple-950/60 border border-purple-500/30 text-xs font-mono text-purple-300 truncate max-w-full w-full">
          <ExternalLink className="w-4 h-4 shrink-0 text-purple-400" />
          <span className="truncate">{qrCode.url}</span>
        </div>
      </div>
    </div>
  );
};

export default QRCodeOverlay;
