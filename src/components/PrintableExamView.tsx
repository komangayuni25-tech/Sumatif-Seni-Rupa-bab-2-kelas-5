import React, { useState } from 'react';
import {
  QUESTIONS_PILIHAN_GANDA,
  QUESTIONS_PG_KOMPLEKS,
  SCHOOL_INFO,
} from '../data/questionsData';
import { Printer, Eye, EyeOff, FileText, CheckCircle2, Download } from 'lucide-react';

export const PrintableExamView: React.FC = () => {
  const [showAnswerKey, setShowAnswerKey] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Control bar (hidden during print) */}
      <div className="print:hidden bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <FileText className="w-5 h-5 text-emerald-600" />
          <div>
            <h3 className="text-xs font-bold text-slate-900">
              Format Lembar Asesmen Cetak (Print / PDF)
            </h3>
            <p className="text-[11px] text-slate-500">
              Disusun sesuai Kurikulum Merdeka • Kelas 5 SD Negeri 3 Loloan Timur
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAnswerKey(!showAnswerKey)}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            {showAnswerKey ? (
              <>
                <EyeOff className="w-4 h-4" />
                <span>Sembunyikan Kunci</span>
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                <span>Tampilkan Kunci Jawaban</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Dokumen (Print)</span>
          </button>
        </div>
      </div>

      {/* Printable Sheet Container */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-xs max-w-4xl mx-auto print:border-none print:shadow-none print:p-0 print:m-0 text-slate-900 font-sans">
        {/* Kop Resmi Sekolah */}
        <div className="border-b-2 border-slate-900 pb-4 mb-6 text-center">
          <div className="text-xs font-bold tracking-wider uppercase text-slate-600">
            Pemerintah Kabupaten Jembrana • Dinas Pendidikan Kepemudaan dan Olahraga
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight mt-0.5">
            {SCHOOL_INFO.namaSekolah}
          </h1>
          <p className="text-xs text-slate-600 italic">
            Alamat: Kelurahan Loloan Timur, Kecamatan Negara, Kabupaten Jembrana, Bali
          </p>
          <div className="border-t border-slate-400 mt-2 pt-2 text-xs font-bold uppercase tracking-wide">
            ASESMEN FORMATIF / SUMATIF SEMESTER {SCHOOL_INFO.semester.toUpperCase()} TAHUN AJARAN {SCHOOL_INFO.tahunAjaran}
          </div>
        </div>

        {/* Identitas Ujian & Siswa */}
        <div className="grid grid-cols-2 gap-4 text-xs mb-6 border border-slate-300 rounded-lg p-3.5 bg-slate-50/50">
          <div className="space-y-1">
            <div className="flex">
              <span className="w-32 font-semibold text-slate-700">Mata Pelajaran:</span>
              <span className="font-bold text-slate-900">{SCHOOL_INFO.mataPelajaran}</span>
            </div>
            <div className="flex">
              <span className="w-32 font-semibold text-slate-700">Kelas / Semester:</span>
              <span className="text-slate-900">{SCHOOL_INFO.kelas} (Lima) / {SCHOOL_INFO.semester}</span>
            </div>
            <div className="flex">
              <span className="w-32 font-semibold text-slate-700">Alokasi Waktu:</span>
              <span className="text-slate-900">{SCHOOL_INFO.alokasiWaktu}</span>
            </div>
            <div className="flex">
              <span className="w-32 font-semibold text-slate-700">Materi Pokok:</span>
              <span className="text-slate-900">Prinsip Ritme dalam Seni Rupa</span>
            </div>
          </div>

          <div className="space-y-1 border-l border-slate-200 pl-4">
            <div className="flex">
              <span className="w-28 font-semibold text-slate-700">Nama Siswa:</span>
              <span className="border-b border-dotted border-slate-400 flex-1">&nbsp;</span>
            </div>
            <div className="flex">
              <span className="w-28 font-semibold text-slate-700">Nomor Absen:</span>
              <span className="border-b border-dotted border-slate-400 flex-1">&nbsp;</span>
            </div>
            <div className="flex">
              <span className="w-28 font-semibold text-slate-700">Hari, Tanggal:</span>
              <span className="border-b border-dotted border-slate-400 flex-1">&nbsp;</span>
            </div>
            <div className="flex">
              <span className="w-28 font-semibold text-slate-700">Nilai / Paraf:</span>
              <span className="border-b border-dotted border-slate-400 flex-1">&nbsp;</span>
            </div>
          </div>
        </div>

        {/* Petunjuk Umum */}
        <div className="mb-6 p-3 bg-slate-100 rounded-lg text-xs space-y-1">
          <p className="font-bold text-slate-800">Petunjuk Pengerjaan:</p>
          <ol className="list-decimal list-inside text-slate-700 space-y-0.5">
            <li>Tuliskan nama lengkap, kelas, dan nomor absen Anda pada tempat yang disediakan.</li>
            <li>Bacalah setiap butir soal dengan cermat dan teliti sebelum menentukan jawaban.</li>
            <li>Untuk Bagian I (Pilihan Ganda), berilah tanda silang (X) pada huruf A, B, C, atau D yang paling tepat.</li>
            <li>Untuk Bagian II (Pilihan Ganda Kompleks Kategori), berilah tanda centang (✓) pada kolom Benar atau Salah pada setiap pernyataan.</li>
          </ol>
        </div>

        {/* BAGIAN I: SOAL PILIHAN GANDA (1 - 25) */}
        <div className="mb-8">
          <div className="bg-slate-800 text-white px-3 py-1.5 rounded-md font-bold text-xs uppercase tracking-wide mb-4">
            BAGIAN I: PILIHAN GANDA (25 SOAL)
          </div>

          <div className="space-y-6">
            {QUESTIONS_PILIHAN_GANDA.map((q) => (
              <div key={q.id} className="text-xs break-inside-avoid">
                <div className="flex items-start gap-2 font-medium">
                  <span className="font-bold shrink-0">{q.id}.</span>
                  <div className="flex-1">
                    <p className="leading-relaxed text-slate-900 font-semibold">
                      {q.pertanyaan}
                    </p>

                    {/* SVG Image Illustration */}
                    {q.svgImage && (
                      <div className="my-2 p-2 bg-slate-50 border border-slate-200 rounded-lg max-w-sm">
                        <div dangerouslySetInnerHTML={{ __html: q.svgImage }} />
                        {q.imageCaption && (
                          <p className="text-[10px] text-center text-slate-500 italic mt-1">
                            {q.imageCaption}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Options A, B, C, D */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mt-2 ml-1">
                      {q.options.map((opt) => {
                        const isCorrect = opt.key === q.jawabanBenar;
                        return (
                          <div
                            key={opt.key}
                            className={`flex items-start gap-1.5 p-1 rounded ${
                              showAnswerKey && isCorrect
                                ? 'bg-emerald-100 font-bold text-emerald-900'
                                : 'text-slate-800'
                            }`}
                          >
                            <span className="font-bold">{opt.key}.</span>
                            <span>{opt.text}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Teacher Answer Key Note */}
                    {showAnswerKey && (
                      <div className="mt-2 p-2 bg-emerald-50 border border-emerald-200 rounded text-[11px] text-emerald-900">
                        <strong>Kunci: {q.jawabanBenar}</strong> — {q.pembahasan}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BAGIAN II: PILIHAN GANDA KOMPLEKS KATEGORI (26 - 30) */}
        <div className="mb-8">
          <div className="bg-slate-800 text-white px-3 py-1.5 rounded-md font-bold text-xs uppercase tracking-wide mb-4">
            BAGIAN II: PILIHAN GANDA KOMPLEKS KATEGORI (BENAR / SALAH)
          </div>

          <div className="space-y-6">
            {QUESTIONS_PG_KOMPLEKS.map((q) => (
              <div key={q.id} className="text-xs break-inside-avoid">
                <div className="flex items-start gap-2 font-medium mb-2">
                  <span className="font-bold shrink-0">{q.id}.</span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900">{q.pertanyaan}</p>
                    <p className="text-slate-700 italic text-[11px] mt-0.5">
                      {q.deskripsi}
                    </p>

                    {q.svgImage && (
                      <div className="my-2 p-2 bg-slate-50 border border-slate-200 rounded-lg max-w-sm">
                        <div dangerouslySetInnerHTML={{ __html: q.svgImage }} />
                        {q.imageCaption && (
                          <p className="text-[10px] text-center text-slate-500 italic mt-1">
                            {q.imageCaption}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Table Statements */}
                <table className="w-full border-collapse border border-slate-300 text-xs mt-2 ml-4 max-w-2xl">
                  <thead>
                    <tr className="bg-slate-100 text-slate-800">
                      <th className="border border-slate-300 p-2 w-8 text-center">No</th>
                      <th className="border border-slate-300 p-2 text-left">Pernyataan Deskriptif</th>
                      <th className="border border-slate-300 p-2 w-20 text-center">Benar</th>
                      <th className="border border-slate-300 p-2 w-20 text-center">Salah</th>
                    </tr>
                  </thead>
                  <tbody>
                    {q.pernyataanList.map((stmt, idx) => (
                      <tr key={stmt.id} className="hover:bg-slate-50">
                        <td className="border border-slate-300 p-2 text-center">{idx + 1}</td>
                        <td className="border border-slate-300 p-2 leading-relaxed">
                          {stmt.pernyataan}
                          {showAnswerKey && (
                            <span className="block text-[10px] text-emerald-700 italic mt-0.5">
                              Kunci: {stmt.kunci ? 'BENAR' : 'SALAH'} ({stmt.penjelasan})
                            </span>
                          )}
                        </td>
                        <td className="border border-slate-300 p-2 text-center">
                          {showAnswerKey && stmt.kunci ? (
                            <span className="font-bold text-emerald-700">✓</span>
                          ) : (
                            <span className="inline-block w-4 h-4 border border-slate-400 rounded-xs"></span>
                          )}
                        </td>
                        <td className="border border-slate-300 p-2 text-center">
                          {showAnswerKey && !stmt.kunci ? (
                            <span className="font-bold text-rose-700">✓</span>
                          ) : (
                            <span className="inline-block w-4 h-4 border border-slate-400 rounded-xs"></span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>

        {/* Lembar Jawaban Siswa Ringkas */}
        <div className="mb-8 pt-4 border-t-2 border-slate-800 break-inside-avoid">
          <h4 className="font-bold text-xs uppercase mb-2 text-center">
            LEMBAR JAWABAN SISWA (LJS)
          </h4>
          <div className="grid grid-cols-5 gap-2 text-[11px]">
            {Array.from({ length: 25 }, (_, i) => i + 1).map((n) => (
              <div key={n} className="flex items-center gap-1 border border-slate-200 p-1 rounded">
                <span className="w-5 font-bold">{n}.</span>
                <span className="text-slate-400">[ A ] [ B ] [ C ] [ D ]</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tanda Tangan Pengesahan Guru & Kepala Sekolah */}
        <div className="pt-8 border-t border-slate-300 grid grid-cols-2 text-xs text-center break-inside-avoid">
          <div>
            <p>Mengetahui,</p>
            <p className="font-semibold text-slate-800">Kepala SD Negeri 3 Loloan Timur</p>
            <div className="h-16"></div>
            <p className="font-bold text-slate-900 underline">
              {SCHOOL_INFO.namaKepalaSekolah}
            </p>
            <p className="text-slate-600 font-mono text-[11px]">
              NIP. {SCHOOL_INFO.nipKepalaSekolah}
            </p>
          </div>

          <div>
            <p>Loloan Timur, .............................. 2026</p>
            <p className="font-semibold text-slate-800">Guru Kelas V</p>
            <div className="h-16"></div>
            <p className="font-bold text-slate-900 underline">
              {SCHOOL_INFO.namaGuru}
            </p>
            <p className="text-slate-600 font-mono text-[11px]">
              NIPPPK. {SCHOOL_INFO.nipppk}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
