import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  RotateCcw,
  Activity,
  Globe,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { INSTALLED_GAS_ENDPOINT_URL, getActiveEndpointUrl, setActiveEndpointUrl, resetToDefaultEndpoint } from '../config';
import { EndpointConfig } from '../types';

interface EndpointSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: EndpointConfig;
  onEndpointUpdated: (newUrl: string) => void;
  onTestPing: () => Promise<void>;
}

export const EndpointSettingsModal: React.FC<EndpointSettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onEndpointUpdated,
  onTestPing,
}) => {
  const [urlInput, setUrlInput] = useState(getActiveEndpointUrl());
  const [copied, setCopied] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(urlInput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    setActiveEndpointUrl(trimmed);
    onEndpointUpdated(trimmed);
    setTestResult({
      success: true,
      message: 'URL endpoint Google Apps Script berhasil diperbarui!',
    });
  };

  const handleReset = () => {
    const defaultUrl = resetToDefaultEndpoint();
    setUrlInput(defaultUrl);
    onEndpointUpdated(defaultUrl);
    setTestResult({
      success: true,
      message: 'URL endpoint dikembalikan ke URL terpasang.',
    });
  };

  const handleRunTest = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      await onTestPing();
      setTestResult({
        success: true,
        message: 'Koneksi ke Google Apps Script berhasil terhubung (200 OK)!',
      });
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || 'Gagal menghubungi Google Apps Script.',
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Konfigurasi Endpoint Google Apps Script
              </h3>
              <p className="text-[11px] text-slate-500">
                Pengaturan URL Web App Google Sheets
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

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {/* Status Indicator */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-3 h-3 rounded-full ${
                  config.status === 'connected'
                    ? 'bg-emerald-500 animate-pulse'
                    : config.status === 'testing'
                    ? 'bg-amber-500 animate-spin'
                    : 'bg-rose-500'
                }`}
              />
              <div>
                <p className="text-xs font-semibold text-slate-800">
                  Status Endpoint:{' '}
                  <span
                    className={
                      config.status === 'connected'
                        ? 'text-emerald-600'
                        : config.status === 'testing'
                        ? 'text-amber-600'
                        : 'text-rose-600'
                    }
                  >
                    {config.status === 'connected'
                      ? 'Terhubung (Online)'
                      : config.status === 'testing'
                      ? 'Menguji Koneksi...'
                      : 'Terputus / Error'}
                  </span>
                </p>
                <p className="text-[11px] text-slate-500 font-mono">
                  {config.latencyMs !== undefined
                    ? `Waktu respon: ${config.latencyMs}ms`
                    : 'Waktu respon belum diuji'}
                </p>
              </div>
            </div>

            <button
              onClick={handleRunTest}
              disabled={isTesting}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs"
            >
              <Activity className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isTesting ? 'Menguji...' : 'Tes Ping'}</span>
            </button>
          </div>

          {testResult && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-start gap-2 ${
                testResult.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <span>{testResult.message}</span>
            </div>
          )}

          {/* URL Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700">
                URL Endpoint Google Apps Script (Web App /exec)
              </label>
              {urlInput !== INSTALLED_GAS_ENDPOINT_URL && (
                <span className="text-[10px] text-amber-600 font-medium">
                  Menggunakan URL Kustom
                </span>
              )}
            </div>

            <div className="relative">
              <textarea
                rows={3}
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="w-full p-3 font-mono text-[11px] border border-slate-300 rounded-lg text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 break-all leading-relaxed"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>Salin URL</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleReset}
                title="Kembalikan ke URL bawaan yang diminta"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>Reset Bawaan</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-1.5 text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg transition-colors shadow-xs"
            >
              Terapkan URL
            </button>
          </div>

          {/* Technical Info Box */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-[11px] text-slate-600">
            <div className="font-semibold text-slate-800 flex items-center gap-1">
              <span>Informasi Integrasi Spreadsheet:</span>
            </div>
            <p>
              • <strong>GET:</strong> Mengambil seluruh data penilaian siswa dari Google Spreadsheet.
            </p>
            <p>
              • <strong>POST:</strong> Menyimpan rekaman baru siswa (Nama, Kelas, Absen, Tanggal Lahir, Nilai, Status, Mapel).
            </p>
            <p>
              • <strong>URL Terpasang:</strong>{' '}
              <span className="font-mono text-[10px] text-slate-800 break-all">
                {INSTALLED_GAS_ENDPOINT_URL}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
