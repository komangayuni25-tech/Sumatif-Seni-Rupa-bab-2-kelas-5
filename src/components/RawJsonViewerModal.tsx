import React, { useState } from 'react';
import { X, Copy, Check, Code2 } from 'lucide-react';

interface RawJsonViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  jsonData: any;
}

export const RawJsonViewerModal: React.FC<RawJsonViewerModalProps> = ({
  isOpen,
  onClose,
  jsonData,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const jsonString = JSON.stringify(jsonData, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Respon Raw JSON (Google Apps Script)
              </h3>
              <p className="text-[11px] text-slate-500">
                Output data langsung dari Web App Apps Script
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-mono">
              Payload size: {jsonString.length} bytes
            </span>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Salin JSON</span>
                </>
              )}
            </button>
          </div>

          <div className="flex-1 overflow-auto bg-slate-900 rounded-xl p-4 text-emerald-400 font-mono text-xs leading-relaxed border border-slate-800">
            <pre className="whitespace-pre">{jsonString}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};
