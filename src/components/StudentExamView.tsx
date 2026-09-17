import React, { useState } from 'react';
import {
  QUESTIONS_PILIHAN_GANDA,
  QUESTIONS_PG_KOMPLEKS,
  SCHOOL_INFO,
} from '../data/questionsData';
import { submitStudentToGas } from '../config';
import {
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Send,
  User,
  Calendar,
  Award,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Check,
  X,
  BookOpen,
} from 'lucide-react';

interface StudentExamViewProps {
  onExamSubmitted: () => void;
}

export const StudentExamView: React.FC<StudentExamViewProps> = ({
  onExamSubmitted,
}) => {
  // Student Identity
  const [namaSiswa, setNamaSiswa] = useState('');
  const [kelas, setKelas] = useState(SCHOOL_INFO.kelas);
  const [noAbsen, setNoAbsen] = useState('');
  const [tanggalLahir, setTanggalLahir] = useState('2014-07-15');

  // Answers State
  // Multiple Choice answers: { [questionId: number]: 'A' | 'B' | 'C' | 'D' }
  const [answersPg, setAnswersPg] = useState<{ [id: number]: 'A' | 'B' | 'C' | 'D' }>({});

  // Complex Category answers: { [statementId: string]: boolean }
  const [answersComplex, setAnswersComplex] = useState<{ [statementId: string]: boolean }>({});

  // UI state
  const [activeQuestionNumber, setActiveQuestionNumber] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Result Modal State
  const [resultData, setResultData] = useState<{
    nama: string;
    kelas: string;
    noAbsen: string;
    benarPg: number;
    totalPg: number;
    benarComplex: number;
    totalComplexStatements: number;
    totalBenar: number;
    totalSalah: number;
    nilaiAkhir: number;
    status: string;
    gasMessage?: string;
  } | null>(null);

  // Total questions count: 25 PG + 5 Kompleks = 30
  const totalQuestions = 30;

  // Track how many questions answered
  const answeredPgCount = Object.keys(answersPg).length;
  // Each complex question has 3 statements (total 15 statements)
  const answeredComplexStatementsCount = Object.keys(answersComplex).length;
  const answeredComplexQuestionsCount = QUESTIONS_PG_KOMPLEKS.filter((q) =>
    q.pernyataanList.every((p) => answersComplex[p.id] !== undefined),
  ).length;

  const totalAnsweredCount = answeredPgCount + answeredComplexQuestionsCount;
  const progressPercent = Math.round((totalAnsweredCount / totalQuestions) * 100);

  const handlePgSelect = (questionId: number, key: 'A' | 'B' | 'C' | 'D') => {
    setAnswersPg((prev) => ({ ...prev, [questionId]: key }));
  };

  const handleComplexToggle = (statementId: string, value: boolean) => {
    setAnswersComplex((prev) => ({ ...prev, [statementId]: value }));
  };

  const isQuestionAnswered = (num: number): boolean => {
    if (num <= 25) {
      return answersPg[num] !== undefined;
    } else {
      const complexQ = QUESTIONS_PG_KOMPLEKS.find((q) => q.id === num);
      if (!complexQ) return false;
      return complexQ.pernyataanList.every(
        (stmt) => answersComplex[stmt.id] !== undefined,
      );
    }
  };

  const handleSubmitExam = async () => {
    if (!namaSiswa.trim()) {
      setValidationError('Silakan isi Nama Lengkap Siswa terlebih dahulu di bagian atas.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (totalAnsweredCount < totalQuestions) {
      const confirmSubmit = window.confirm(
        `Anda baru menjawab ${totalAnsweredCount} dari 30 soal. Apakah Anda yakin ingin mengumpulkan ujian sekarang?`,
      );
      if (!confirmSubmit) return;
    }

    setIsSubmitting(true);
    setValidationError(null);

    // 1. Calculate Score
    let pgCorrect = 0;
    QUESTIONS_PILIHAN_GANDA.forEach((q) => {
      if (answersPg[q.id] === q.jawabanBenar) {
        pgCorrect += 1;
      }
    });

    let complexStatementsCorrect = 0;
    const totalComplexStatements = 15; // 5 questions * 3 statements
    QUESTIONS_PG_KOMPLEKS.forEach((q) => {
      q.pernyataanList.forEach((stmt) => {
        if (answersComplex[stmt.id] === stmt.kunci) {
          complexStatementsCorrect += 1;
        }
      });
    });

    // Score computation:
    // 25 PG = 70% weight, 15 Complex statements = 30% weight
    // or direct point: (pgCorrect / 25) * 70 + (complexStatementsCorrect / 15) * 30
    const scorePg = (pgCorrect / 25) * 70;
    const scoreComplex = (complexStatementsCorrect / totalComplexStatements) * 30;
    const finalScore = Math.min(100, Math.round(scorePg + scoreComplex));

    // KKTP threshold is 75
    const finalStatus = finalScore >= 75 ? 'Lulus' : 'Belum Lulus';

    // Total correct / wrong questions for spreadsheet record
    const totalCorrectCount = pgCorrect + Math.round((complexStatementsCorrect / 3));
    const totalWrongCount = totalQuestions - totalCorrectCount;

    try {
      // Send directly to Google Apps Script
      const gasPayload = {
        nama: namaSiswa.trim(),
        kelas: kelas.trim() || '5',
        noAbsen: noAbsen ? Number(noAbsen) || noAbsen : '',
        tglLahir: tanggalLahir,
        benar: totalCorrectCount,
        salah: totalWrongCount,
        nilai: finalScore,
        status: finalStatus,
        mapel: SCHOOL_INFO.mataPelajaran,
      };

      const res = await submitStudentToGas(gasPayload);

      setResultData({
        nama: namaSiswa.trim(),
        kelas: kelas.trim() || '5',
        noAbsen: noAbsen || '-',
        benarPg: pgCorrect,
        totalPg: 25,
        benarComplex: complexStatementsCorrect,
        totalComplexStatements: 15,
        totalBenar: totalCorrectCount,
        totalSalah: totalWrongCount,
        nilaiAkhir: finalScore,
        status: finalStatus,
        gasMessage: res.message,
      });

      onExamSubmitted();
    } catch (err: any) {
      console.error('GAS Submit Error:', err);
      // Still show result even if network had an issue
      setResultData({
        nama: namaSiswa.trim(),
        kelas: kelas.trim() || '5',
        noAbsen: noAbsen || '-',
        benarPg: pgCorrect,
        totalPg: 25,
        benarComplex: complexStatementsCorrect,
        totalComplexStatements: 15,
        totalBenar: totalCorrectCount,
        totalSalah: totalWrongCount,
        nilaiAkhir: finalScore,
        status: finalStatus,
        gasMessage:
          'Nilai dihitung lokal, namun koneksi jaringan ke spreadsheet sedang memproses ulang.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetExam = () => {
    if (
      window.confirm(
        'Apakah Anda yakin ingin mengatur ulang semua jawaban pada lembar ujian ini?',
      )
    ) {
      setAnswersPg({});
      setAnswersComplex({});
      setResultData(null);
      setActiveQuestionNumber(1);
    }
  };

  // Find active question
  const currentPgQuestion = QUESTIONS_PILIHAN_GANDA.find(
    (q) => q.id === activeQuestionNumber,
  );
  const currentComplexQuestion = QUESTIONS_PG_KOMPLEKS.find(
    (q) => q.id === activeQuestionNumber,
  );

  return (
    <div className="space-y-6">
      {/* Student Identity Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
        <div className="flex items-center gap-2 mb-3 border-b border-slate-100 pb-2.5">
          <User className="w-5 h-5 text-emerald-600" />
          <h2 className="text-sm font-bold text-slate-800">
            Identitas Peserta Asesmen Siswa
          </h2>
          <span className="text-[11px] text-slate-400 ml-auto">
            SD Negeri 3 Loloan Timur
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Nama Siswa */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nama Lengkap Siswa <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Masukkan nama siswa..."
              value={namaSiswa}
              onChange={(e) => setNamaSiswa(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            />
          </div>

          {/* Kelas */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Kelas
            </label>
            <input
              type="text"
              value={kelas}
              onChange={(e) => setKelas(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            />
          </div>

          {/* Nomor Absen */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nomor Absen
            </label>
            <input
              type="number"
              min="1"
              max="50"
              placeholder="Contoh: 15"
              value={noAbsen}
              onChange={(e) => setNoAbsen(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            />
          </div>

          {/* Tanggal Lahir */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tanggal Lahir
            </label>
            <input
              type="date"
              value={tanggalLahir}
              onChange={(e) => setTanggalLahir(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="w-full sm:w-2/3 flex items-center gap-3">
            <span className="text-xs font-medium text-slate-600 whitespace-nowrap">
              Progres Pengerjaan:
            </span>
            <div className="flex-1 bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-xs font-bold text-emerald-700 font-mono">
              {progressPercent}%
            </span>
          </div>

          <div className="text-xs text-slate-500">
            Terjawab <strong className="text-slate-800">{totalAnsweredCount}</strong> dari{' '}
            <strong>30</strong> Soal
          </div>
        </div>
      </div>

      {validationError && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Main Examination Layout: Question Grid + Active Question */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: Number Navigator Grid */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs sticky top-20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-800">Daftar Soal</span>
              <span className="text-[11px] text-slate-400 font-mono">1 - 30</span>
            </div>

            {/* Part A: 1-25 PG */}
            <div className="mb-3">
              <p className="text-[11px] font-semibold text-emerald-700 mb-1.5 flex items-center justify-between">
                <span>Bagian I: Pilihan Ganda (25)</span>
                <span className="text-slate-400 font-normal">{answeredPgCount}/25</span>
              </p>
              <div className="grid grid-cols-5 gap-1.5">
                {QUESTIONS_PILIHAN_GANDA.map((q) => {
                  const isAnswered = answersPg[q.id] !== undefined;
                  const isActive = activeQuestionNumber === q.id;
                  return (
                    <button
                      key={q.id}
                      onClick={() => setActiveQuestionNumber(q.id)}
                      className={`h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? 'ring-2 ring-emerald-500 bg-emerald-600 text-white shadow-xs'
                          : isAnswered
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {q.id}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Part B: 26-30 PG Kompleks */}
            <div className="pt-2 border-t border-slate-100">
              <p className="text-[11px] font-semibold text-teal-700 mb-1.5 flex items-center justify-between">
                <span>Bagian II: PG Kompleks (5)</span>
                <span className="text-slate-400 font-normal">{answeredComplexQuestionsCount}/5</span>
              </p>
              <div className="grid grid-cols-5 gap-1.5">
                {QUESTIONS_PG_KOMPLEKS.map((q) => {
                  const isAnswered = q.pernyataanList.every(
                    (p) => answersComplex[p.id] !== undefined,
                  );
                  const isActive = activeQuestionNumber === q.id;
                  return (
                    <button
                      key={q.id}
                      onClick={() => setActiveQuestionNumber(q.id)}
                      className={`h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? 'ring-2 ring-teal-500 bg-teal-700 text-white shadow-xs'
                          : isAnswered
                          ? 'bg-teal-100 text-teal-800 border border-teal-300'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {q.id}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
              <button
                onClick={handleSubmitExam}
                disabled={isSubmitting}
                className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Mengirim Nilai...' : 'Kirim Jawaban Ujian'}</span>
              </button>

              <button
                onClick={handleResetExam}
                className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                <span>Reset Jawaban</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Active Question Card */}
        <div className="lg:col-span-3">
          {activeQuestionNumber <= 25 && currentPgQuestion && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
              {/* Question Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded-lg">
                    Soal No. {currentPgQuestion.id}
                  </span>
                  <span className="text-xs font-medium text-slate-500">
                    Pilihan Ganda
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  {currentPgQuestion.materi}
                </span>
              </div>

              {/* Question Text */}
              <div className="mb-5">
                <p className="text-sm font-semibold text-slate-900 leading-relaxed">
                  {currentPgQuestion.pertanyaan}
                </p>

                {/* SVG Visual illustration if available */}
                {currentPgQuestion.svgImage && (
                  <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                    <div
                      dangerouslySetInnerHTML={{ __html: currentPgQuestion.svgImage }}
                    />
                    {currentPgQuestion.imageCaption && (
                      <p className="text-center text-[11px] text-slate-500 italic mt-2">
                        {currentPgQuestion.imageCaption}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Multiple Choice Options */}
              <div className="space-y-2.5 mb-6">
                {currentPgQuestion.options.map((opt) => {
                  const isSelected = answersPg[currentPgQuestion.id] === opt.key;
                  return (
                    <button
                      key={opt.key}
                      onClick={() => handlePgSelect(currentPgQuestion.id, opt.key)}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs flex items-start gap-3 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50/70 text-emerald-950 ring-1 ring-emerald-500'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {opt.key}
                      </span>
                      <span className="leading-relaxed mt-0.5">{opt.text}</span>
                    </button>
                  );
                })}
              </div>

              {/* Navigation arrows */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  disabled={activeQuestionNumber === 1}
                  onClick={() => setActiveQuestionNumber((prev) => Math.max(1, prev - 1))}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg disabled:opacity-30 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Sebelumnya</span>
                </button>

                <span className="text-xs text-slate-400 font-mono">
                  {activeQuestionNumber} / 30
                </span>

                <button
                  onClick={() => setActiveQuestionNumber((prev) => Math.min(30, prev + 1))}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg cursor-pointer"
                >
                  <span>Selanjutnya</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Complex Category Question Component (26-30) */}
          {activeQuestionNumber > 25 && currentComplexQuestion && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
              {/* Question Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-teal-700 text-white text-xs font-bold rounded-lg">
                    Soal No. {currentComplexQuestion.id}
                  </span>
                  <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                    Pilihan Ganda Kompleks Kategori (Benar / Salah)
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-slate-500">
                  3 Pernyataan
                </span>
              </div>

              {/* Question Description */}
              <div className="mb-5">
                <p className="text-sm font-bold text-slate-900 mb-1">
                  {currentComplexQuestion.pertanyaan}
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {currentComplexQuestion.deskripsi}
                </p>

                {/* SVG Visual Illustration if any */}
                {currentComplexQuestion.svgImage && (
                  <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                    <div
                      dangerouslySetInnerHTML={{ __html: currentComplexQuestion.svgImage }}
                    />
                    {currentComplexQuestion.imageCaption && (
                      <p className="text-center text-[11px] text-slate-500 italic mt-2">
                        {currentComplexQuestion.imageCaption}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* 3 Statements with Benar / Salah Buttons */}
              <div className="space-y-3 mb-6">
                {currentComplexQuestion.pernyataanList.map((stmt, idx) => {
                  const currentValue = answersComplex[stmt.id];
                  return (
                    <div
                      key={stmt.id}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
                    >
                      <div className="flex items-start gap-2.5 flex-1">
                        <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <p className="text-xs text-slate-800 leading-relaxed">
                          {stmt.pernyataan}
                        </p>
                      </div>

                      {/* Benar / Salah Buttons */}
                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={() => handleComplexToggle(stmt.id, true)}
                          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            currentValue === true
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-white border border-slate-300 text-slate-700 hover:border-emerald-400'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Benar</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleComplexToggle(stmt.id, false)}
                          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            currentValue === false
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'bg-white border border-slate-300 text-slate-700 hover:border-rose-400'
                          }`}
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Salah</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Navigation Arrows */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  onClick={() => setActiveQuestionNumber((prev) => Math.max(1, prev - 1))}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Sebelumnya</span>
                </button>

                <span className="text-xs text-slate-400 font-mono">
                  {activeQuestionNumber} / 30
                </span>

                {activeQuestionNumber < 30 ? (
                  <button
                    onClick={() => setActiveQuestionNumber((prev) => Math.min(30, prev + 1))}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-lg cursor-pointer"
                  >
                    <span>Selanjutnya</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitExam}
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>Selesai & Kirim</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Result Modal upon Submission */}
      {resultData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white text-center">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-2">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-black tracking-tight">
                Hasil Asesmen Seni Rupa Siswa
              </h3>
              <p className="text-xs text-emerald-100 mt-0.5">
                SD Negeri 3 Loloan Timur • Kelas 5
              </p>
            </div>

            {/* Score details */}
            <div className="p-6 space-y-4">
              <div className="text-center pb-3 border-b border-slate-100">
                <p className="text-xs text-slate-500">Nilai Akhir Siswa</p>
                <div className="flex items-baseline justify-center gap-1 mt-1">
                  <span className="text-5xl font-black text-slate-900 font-mono">
                    {resultData.nilaiAkhir}
                  </span>
                  <span className="text-slate-400 text-sm">/ 100</span>
                </div>
                <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Status: {resultData.status} (KKTP: 75)</span>
                </div>
              </div>

              {/* Student Summary */}
              <div className="bg-slate-50 rounded-xl p-3.5 text-xs space-y-1.5 border border-slate-200">
                <div className="flex justify-between">
                  <span className="text-slate-500">Nama Siswa:</span>
                  <span className="font-bold text-slate-800">{resultData.nama}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Kelas / No. Absen:</span>
                  <span className="font-bold text-slate-800">
                    Kelas {resultData.kelas} (No. {resultData.noAbsen})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Pilihan Ganda (25 Soal):</span>
                  <span className="font-semibold text-emerald-700">
                    {resultData.benarPg} Benar / {resultData.totalPg - resultData.benarPg} Salah
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">PG Kompleks (15 Pernyataan):</span>
                  <span className="font-semibold text-teal-700">
                    {resultData.benarComplex} Benar /{' '}
                    {resultData.totalComplexStatements - resultData.benarComplex} Salah
                  </span>
                </div>
              </div>

              {/* Cloud Sync Notice */}
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-bold">Tersimpan ke Google Spreadsheet</p>
                  <p className="text-[11px] text-emerald-700 mt-0.5">
                    {resultData.gasMessage ||
                      'Data hasil asesmen siswa telah berhasil dicatat ke spreadsheet nilai kelas 5.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setResultData(null)}
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors text-center"
                >
                  Tutup & Lihat Rekap Nilai
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
