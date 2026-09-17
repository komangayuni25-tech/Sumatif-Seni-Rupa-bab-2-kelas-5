import React from 'react';
import {
  RefreshCw,
  PlusCircle,
  Settings,
  Code2,
  CheckCircle2,
  AlertCircle,
  Link,
  GraduationCap,
} from 'lucide-react';
import { EndpointConfig } from '../types';

interface HeaderProps {
  endpointConfig: EndpointConfig;
  isLoading: boolean;
  onRefresh: () => void;
  onOpenAddModal: () => void;
  onOpenSettingsModal: () => void;
  onOpenJsonModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  endpointConfig,
  isLoading,
  onRefresh,
  onOpenAddModal,
  onOpenSettingsModal,
  onOpenJsonModal,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Brand & Title */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-xs">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  SD Negeri 3 Loloan Timur
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-100 text-emerald-800">
                  Seni Rupa Kelas 5
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5 flex-wrap">
                <span className="font-medium text-slate-700">Guru: Komang Ayu, S.Pd</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500">Kepsek: Susilo Fitri Yatmoko, M.Pd</span>
                <span className="text-slate-300">•</span>
                <span className="font-mono text-[11px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                  Spreadsheet GAS
                </span>
              </p>
            </div>
          </div>

          {/* Actions & Status */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Endpoint Connection Status Indicator */}
            <button
              id="endpoint-status-badge"
              onClick={onOpenSettingsModal}
              title="Klik untuk melihat konfigurasi Endpoint Google Apps Script"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                endpointConfig.status === 'connected'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                  : endpointConfig.status === 'testing'
                  ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                  : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
              }`}
            >
              {endpointConfig.status === 'connected' ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              ) : endpointConfig.status === 'testing' ? (
                <RefreshCw className="w-3.5 h-3.5 text-amber-600 animate-spin" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
              )}
              <span className="font-semibold">
                {endpointConfig.status === 'connected'
                  ? 'GAS Aktif'
                  : endpointConfig.status === 'testing'
                  ? 'Memeriksa...'
                  : 'Gangguan'}
              </span>
              {endpointConfig.latencyMs !== undefined && (
                <span className="text-[10px] opacity-75 font-mono">
                  ({endpointConfig.latencyMs}ms)
                </span>
              )}
            </button>

            {/* Raw JSON Debug */}
            <button
              id="view-json-btn"
              onClick={onOpenJsonModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition-colors"
              title="Lihat Data Mentah JSON dari Google Apps Script"
            >
              <Code2 className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">JSON</span>
            </button>

            {/* Settings */}
            <button
              id="settings-btn"
              onClick={onOpenSettingsModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition-colors"
              title="Pengaturan URL Endpoint Google Apps Script"
            >
              <Link className="w-3.5 h-3.5 text-slate-500" />
              <span>Endpoint</span>
            </button>

            {/* Refresh Button */}
            <button
              id="refresh-data-btn"
              onClick={onRefresh}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-white hover:bg-slate-900 transition-all disabled:opacity-50 shadow-xs active:scale-95"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Memuat...' : 'Sinkron'}</span>
            </button>

            {/* Add Student Score Button */}
            <button
              id="add-student-btn"
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-xs hover:shadow-sm active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Input Nilai</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
