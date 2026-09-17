import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { SchoolHeader } from './components/SchoolHeader';
import { StudentExamView } from './components/StudentExamView';
import { PrintableExamView } from './components/PrintableExamView';
import { StatsCards } from './components/StatsCards';
import { StudentTable } from './components/StudentTable';
import { AddStudentModal } from './components/AddStudentModal';
import { EndpointSettingsModal } from './components/EndpointSettingsModal';
import { RawJsonViewerModal } from './components/RawJsonViewerModal';
import {
  fetchStudentsFromGas,
  getActiveEndpointUrl,
  INSTALLED_GAS_ENDPOINT_URL,
} from './config';
import { StudentRecord, EndpointConfig } from './types';
import {
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  Database,
  BookOpen,
  Layers,
  UserCheck,
} from 'lucide-react';
import { SCHOOL_INFO } from './data/questionsData';

export default function App() {
  const [activeTab, setActiveTab] = useState<'ujian' | 'cetak' | 'rekap'>('ujian');
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [rawResponse, setRawResponse] = useState<any>(null);

  const [endpointConfig, setEndpointConfig] = useState<EndpointConfig>({
    url: getActiveEndpointUrl(),
    isDefault: getActiveEndpointUrl() === INSTALLED_GAS_ENDPOINT_URL,
    status: 'testing',
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);

  // Fetch data function
  const loadData = useCallback(async (customUrl?: string) => {
    const targetUrl = customUrl || getActiveEndpointUrl();
    setIsLoading(true);
    setError(null);
    setEndpointConfig((prev) => ({ ...prev, status: 'testing' }));

    try {
      const result = await fetchStudentsFromGas(targetUrl);
      setStudents(result.data);
      setRawResponse(result.meta.raw || result.data);
      setEndpointConfig({
        url: targetUrl,
        isDefault: targetUrl === INSTALLED_GAS_ENDPOINT_URL,
        status: 'connected',
        latencyMs: result.meta.responseTimeMs,
        lastChecked: new Date().toLocaleTimeString('id-ID'),
      });
    } catch (err: any) {
      console.error('Failed to load data:', err);
      setError(err.message || 'Gagal memuat data dari Google Apps Script');
      setEndpointConfig((prev) => ({
        ...prev,
        status: 'error',
        errorMessage: err.message,
      }));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleTestPing = async () => {
    await loadData();
  };

  const handleEndpointUpdated = (newUrl: string) => {
    setEndpointConfig({
      url: newUrl,
      isDefault: newUrl === INSTALLED_GAS_ENDPOINT_URL,
      status: 'testing',
    });
    loadData(newUrl);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-sans">
      {/* Top Navbar */}
      <Header
        endpointConfig={endpointConfig}
        isLoading={isLoading}
        onRefresh={() => loadData()}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        onOpenJsonModal={() => setIsJsonModalOpen(true)}
      />

      {/* School Kop & Navigation Tabs */}
      <SchoolHeader
        endpointConfig={endpointConfig}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        onRefreshGas={() => loadData()}
        isGasLoading={isLoading}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Banner: Installed Endpoint Confirmation */}
        <div className="mb-6 bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs print:hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-slate-900">
                    Google Apps Script Spreadsheet Terpasang:
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                    <ShieldCheck className="w-3 h-3 text-emerald-700" />
                    Terverifikasi
                  </span>
                </div>
                <p className="font-mono text-[11px] text-slate-600 break-all select-all mt-0.5">
                  {endpointConfig.url}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              <a
                href={endpointConfig.url}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors"
                title="Buka endpoint langsung di tab baru"
              >
                <span>Buka URL</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <button
                onClick={() => setIsSettingsModalOpen(true)}
                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer"
              >
                Detail
              </button>
            </div>
          </div>
        </div>

        {/* Error Notification if any */}
        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-3 print:hidden">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold text-sm">Status Endpoint Google Apps Script</p>
              <p className="mt-0.5 text-slate-700">{error}</p>
              <div className="mt-2 flex items-center gap-2">
                <button
                  onClick={() => loadData()}
                  className="px-3 py-1 bg-rose-600 text-white rounded-md font-semibold hover:bg-rose-700 transition-colors cursor-pointer"
                >
                  Coba Lagi
                </button>
                <button
                  onClick={() => setIsSettingsModalOpen(true)}
                  className="px-3 py-1 bg-white border border-rose-300 text-rose-700 rounded-md font-medium hover:bg-rose-50 cursor-pointer"
                >
                  Periksa Pengaturan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: UJIAN SISWA INTERAKTIF */}
        {activeTab === 'ujian' && (
          <StudentExamView onExamSubmitted={() => loadData()} />
        )}

        {/* TAB 2: LEMBAR SOAL CETAK & KUNCI JAWABAN */}
        {activeTab === 'cetak' && <PrintableExamView />}

        {/* TAB 3: REKAPITULASI NILAI GOOGLE SHEETS */}
        {activeTab === 'rekap' && (
          <div className="space-y-6">
            {/* Statistics Cards */}
            <StatsCards students={students} />

            {/* Main Students Table */}
            <StudentTable
              students={students}
              isLoading={isLoading}
              onOpenAddModal={() => setIsAddModalOpen(true)}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 mt-auto print:hidden">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500">
          <p>
            {SCHOOL_INFO.namaSekolah} • Mata Pelajaran {SCHOOL_INFO.mataPelajaran} Kelas {SCHOOL_INFO.kelas}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Kepala Sekolah: {SCHOOL_INFO.namaKepalaSekolah} (NIP. {SCHOOL_INFO.nipKepalaSekolah}) • Guru: {SCHOOL_INFO.namaGuru} (NIPPPK. {SCHOOL_INFO.nipppk})
          </p>
        </div>
      </footer>

      {/* Modals */}
      <AddStudentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => loadData()}
      />

      <EndpointSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        config={endpointConfig}
        onEndpointUpdated={handleEndpointUpdated}
        onTestPing={handleTestPing}
      />

      <RawJsonViewerModal
        isOpen={isJsonModalOpen}
        onClose={() => setIsJsonModalOpen(false)}
        jsonData={rawResponse || { data: students, endpoint: endpointConfig.url }}
      />
    </div>
  );
}
