import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, AlertCircle, Calculator, Send } from 'lucide-react';
import { submitStudentToGas } from '../config';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddStudentModal: React.FC<AddStudentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [nama, setNama] = useState('');
  const [kelas, setKelas] = useState('5');
  const [noAbsen, setNoAbsen] = useState('');
  const [tglLahir, setTglLahir] = useState('2014-05-10');
  const [mapel, setMapel] = useState('SENI RUPA');
  const [benar, setBenar] = useState<number>(26);
  const [salah, setSalah] = useState<number>(4);
  const [kkm, setKkm] = useState<number>(75);
  const [nilaiManual, setNilaiManual] = useState<string>('');
  const [isManualScore, setIsManualScore] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Calculate score automatically
  const totalQuestions = (Number(benar) || 0) + (Number(salah) || 0);
  const calculatedNilai =
    totalQuestions > 0
      ? Math.round(((Number(benar) || 0) / totalQuestions) * 100)
      : 0;

  const finalNilai = isManualScore
    ? Number(nilaiManual) || 0
    : calculatedNilai;

  const finalStatus = finalNilai >= kkm ? 'Lulus' : 'Belum Lulus';

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setErrorMsg(null);
      setSuccessMsg(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim()) {
      setErrorMsg('Silakan masukkan nama siswa terlebih dahulu.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const payload = {
        nama: nama.trim(),
        kelas: kelas.trim() || 'VI',
        noAbsen: noAbsen ? Number(noAbsen) || noAbsen : '',
        tglLahir: tglLahir || '',
        benar: Number(benar) || 0,
        salah: Number(salah) || 0,
        nilai: finalNilai,
        status: finalStatus,
        mapel: mapel.trim() || 'MATEMATIKA',
      };

      const res = await submitStudentToGas(payload);

      if (res.success) {
        setSuccessMsg(res.message || 'Nilai siswa berhasil disimpan ke Google Sheets!');
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1200);
      } else {
        setErrorMsg(res.message || 'Gagal menyimpan nilai siswa.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan saat mengirim ke Google Apps Script.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Input Nilai & Hasil Tes Siswa
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Data langsung disimpan ke Google Spreadsheet via Apps Script
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Nama Siswa */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nama Lengkap Siswa <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Ni Kadek Ayu Lestari"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Kelas & Nomor Absen */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kelas
              </label>
              <select
                value={kelas}
                onChange={(e) => setKelas(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="5">Kelas 5</option>
                <option value="5 A">Kelas 5 A</option>
                <option value="5 B">Kelas 5 B</option>
                <option value="V">Kelas V</option>
                <option value="6">Kelas 6</option>
                <option value="4">Kelas 4</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nomor Absen
              </label>
              <input
                type="number"
                placeholder="Contoh: 12"
                min="1"
                max="60"
                value={noAbsen}
                onChange={(e) => setNoAbsen(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Tanggal Lahir & Mata Pelajaran */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tanggal Lahir
              </label>
              <input
                type="date"
                value={tglLahir}
                onChange={(e) => setTglLahir(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mata Pelajaran
              </label>
              <select
                value={mapel}
                onChange={(e) => setMapel(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="SENI RUPA">SENI RUPA</option>
                <option value="MATEMATIKA">MATEMATIKA</option>
                <option value="BAHASA INDONESIA">BAHASA INDONESIA</option>
                <option value="IPAS">IPAS</option>
                <option value="PENDIDIKAN PANCASILA">PENDIDIKAN PANCASILA</option>
                <option value="BAHASA INGGRIS">BAHASA INGGRIS</option>
              </select>
            </div>
          </div>

          {/* Jumlah Benar & Salah */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span className="flex items-center gap-1.5">
                <Calculator className="w-3.5 h-3.5 text-emerald-600" />
                Penghitungan Nilai & Soal
              </span>
              <button
                type="button"
                onClick={() => setIsManualScore(!isManualScore)}
                className="text-[11px] text-emerald-700 hover:underline font-normal cursor-pointer"
              >
                {isManualScore ? 'Gunakan Hitung Otomatis' : 'Input Nilai Manual'}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-emerald-700 mb-1">
                  Jumlah Benar
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={benar}
                  onChange={(e) => setBenar(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs border border-emerald-300 bg-white rounded-lg text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-rose-700 mb-1">
                  Jumlah Salah
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={salah}
                  onChange={(e) => setSalah(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs border border-rose-300 bg-white rounded-lg text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Score & Status Preview */}
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-500">Nilai Akhir: </span>
                {isManualScore ? (
                  <input
                    type="number"
                    placeholder="Nilai"
                    min="0"
                    max="100"
                    value={nilaiManual}
                    onChange={(e) => setNilaiManual(e.target.value)}
                    className="w-16 px-2 py-0.5 text-xs font-bold border border-slate-300 rounded ml-1"
                  />
                ) : (
                  <span className="font-mono text-base font-extrabold text-slate-900">
                    {finalNilai}
                  </span>
                )}
                <span className="text-[10px] text-slate-400 ml-1">/ 100</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-500">
                  KKM: {kkm}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    finalStatus === 'Lulus'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {finalStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg transition-colors shadow-xs disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Menyimpan...' : 'Simpan ke Spreadsheet'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
