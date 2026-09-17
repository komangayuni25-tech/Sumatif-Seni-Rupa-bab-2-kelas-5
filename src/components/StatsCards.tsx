import React from 'react';
import { Users, Award, CheckCircle2, TrendingUp, HelpCircle } from 'lucide-react';
import { StudentRecord } from '../types';

interface StatsCardsProps {
  students: StudentRecord[];
}

export const StatsCards: React.FC<StatsCardsProps> = ({ students }) => {
  // Filter valid student rows (with at least a name or score)
  const validStudents = students.filter(
    (s) => (s.Nama && s.Nama.trim() !== '') || s.Nilai !== undefined,
  );

  const total = validStudents.length;

  const scores = validStudents
    .map((s) => Number(s.Nilai) || 0)
    .filter((n) => !isNaN(n));

  const averageScore =
    scores.length > 0
      ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)
      : '0';

  const passedCount = validStudents.filter(
    (s) =>
      s.Status?.toLowerCase() === 'lulus' ||
      (Number(s.Nilai) >= 75 && !s.Status),
  ).length;

  const passRate =
    total > 0 ? Math.round((passedCount / total) * 100) : 0;

  const highestScore = scores.length > 0 ? Math.max(...scores) : 0;
  const lowestScore = scores.length > 0 ? Math.min(...scores) : 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Total Siswa */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          <Users className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-500 truncate">Total Siswa Terdata</p>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-2xl font-bold text-slate-900">{total}</span>
            <span className="text-xs text-slate-500">Siswa</span>
          </div>
        </div>
      </div>

      {/* Rata-Rata Nilai */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <Award className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-500 truncate">Rata-Rata Nilai</p>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-2xl font-bold text-slate-900">{averageScore}</span>
            <span className="text-xs text-slate-500">/ 100</span>
          </div>
        </div>
      </div>

      {/* Tingkat Kelulusan */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-500 truncate">Tingkat Kelulusan</p>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-2xl font-bold text-slate-900">{passRate}%</span>
            <span className="text-xs text-slate-500">({passedCount} lulus)</span>
          </div>
        </div>
      </div>

      {/* Rentang Nilai Tertinggi / Terendah */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
          <TrendingUp className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-500 truncate">Nilai Max / Min</p>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-2xl font-bold text-emerald-600">{highestScore}</span>
            <span className="text-slate-300">/</span>
            <span className="text-lg font-semibold text-rose-500">{lowestScore}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
