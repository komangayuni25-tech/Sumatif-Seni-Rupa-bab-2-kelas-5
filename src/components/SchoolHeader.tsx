import React from 'react';
import { SCHOOL_INFO } from '../data/questionsData';
import {
  School,
  UserCheck,
  Award,
  BookOpen,
  Layers,
  CheckCircle2,
  Calendar,
  Clock,
} from 'lucide-react';
import { EndpointConfig } from '../types';

interface SchoolHeaderProps {
  endpointConfig: EndpointConfig;
  activeTab: 'ujian' | 'cetak' | 'rekap';
  setActiveTab: (tab: 'ujian' | 'cetak' | 'rekap') => void;
  onOpenSettingsModal: () => void;
  onRefreshGas: () => void;
  isGasLoading: boolean;
}

export const SchoolHeader: React.FC<SchoolHeaderProps> = ({
  endpointConfig,
  activeTab,
  setActiveTab,
  onOpenSettingsModal,
  onRefreshGas,
  isGasLoading,
}) => {
  return (
    <div className="bg-white border-b border-slate-200 shadow-2xs">
      {/* Top Banner / Kop Sekolah */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 border-b border-slate-100 pb-5">
          {/* Logo & School Name */}
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center shadow-md shrink-0">
              <School className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {SCHOOL_INFO.namaSekolah}
                </h1>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  Kurikulum Merdeka
                </span>
              </div>
              <p className="text-sm font-semibold text-emerald-700 mt-0.5 flex items-center gap-1.5">
                <Award className="w-4 h-4" />
                <span>
                  Asesmen Formatif / Sumatif: Mata Pelajaran {SCHOOL_INFO.mataPelajaran} • Kelas {SCHOOL_INFO.kelas}
                </span>
              </p>
              <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-500 mt-1.5">
                <span>
                  Kepala Sekolah:{' '}
                  <strong className="text-slate-700 font-medium">
                    {SCHOOL_INFO.namaKepalaSekolah}
                  </strong>{' '}
                  <span className="text-slate-400 font-mono">(NIP. {SCHOOL_INFO.nipKepalaSekolah})</span>
                </span>
                <span className="text-slate-300">•</span>
                <span>
                  Guru Pengampu:{' '}
                  <strong className="text-slate-700 font-medium">
                    {SCHOOL_INFO.namaGuru}
                  </strong>{' '}
                  <span className="text-slate-400 font-mono">(NIPPPK. {SCHOOL_INFO.nipppk})</span>
                </span>
              </div>
            </div>
          </div>

          {/* GAS Endpoint Status Chip */}
          <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-center">
            <button
              onClick={onOpenSettingsModal}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-700 transition-colors cursor-pointer"
              title="Periksa konfigurasi endpoint Google Apps Script terpasang"
            >
              <span className="flex h-2 w-2 relative">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                    endpointConfig.status === 'connected' ? 'bg-emerald-400 opacity-75' : 'bg-amber-400 opacity-75'
                  }`}
                />
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    endpointConfig.status === 'connected' ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                />
              </span>
              <span className="font-semibold">Spreadsheet GAS:</span>
              <span className="font-mono text-[11px] text-slate-500">
                {endpointConfig.status === 'connected' ? 'Aktif' : 'Memeriksa'}
              </span>
            </button>
          </div>
        </div>

        {/* KKTP & Lingkup Materi Information Card */}
        <div className="mt-4 p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {/* KKTP */}
          <div className="space-y-1">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Kriteria Ketercapaian Tujuan Pembelajaran (KKTP):
            </span>
            <ul className="list-disc list-inside text-slate-600 space-y-0.5 pl-1">
              {SCHOOL_INFO.kktp.map((k, idx) => (
                <li key={idx} className="leading-relaxed">
                  {k}
                </li>
              ))}
            </ul>
          </div>

          {/* Lingkup Materi */}
          <div className="space-y-1">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-teal-600" />
              Lingkup Materi Pembelajaran:
            </span>
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {SCHOOL_INFO.lingkupMateri.map((m, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 text-[11px] font-medium shadow-2xs"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mt-4 pt-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('ujian')}
            className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'ujian'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Mulai Ujian Interaktif (Siswa)</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                activeTab === 'ujian' ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              30 Soal
            </span>
          </button>

          <button
            onClick={() => setActiveTab('cetak')}
            className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'cetak'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Lembar Soal Cetak & Kunci Jawaban</span>
          </button>

          <button
            onClick={() => setActiveTab('rekap')}
            className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'rekap'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Rekap Nilai Siswa (Google Sheets)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
