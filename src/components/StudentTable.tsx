import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Download,
  Printer,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  BookOpen,
  Calendar,
  AlertCircle,
  PlusCircle,
} from 'lucide-react';
import { StudentRecord } from '../types';

interface StudentTableProps {
  students: StudentRecord[];
  isLoading: boolean;
  onOpenAddModal: () => void;
}

type SortField = 'Timestamp' | 'Nama' | 'Nomor Absen' | 'Nilai' | 'Kelas';
type SortOrder = 'asc' | 'desc';

export const StudentTable: React.FC<StudentTableProps> = ({
  students,
  isLoading,
  onOpenAddModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');

  const [sortField, setSortField] = useState<SortField>('Timestamp');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Extract unique classes and subjects
  const classOptions = useMemo(() => {
    const set = new Set<string>();
    students.forEach((s) => {
      if (s.Kelas && s.Kelas.trim()) set.add(s.Kelas.trim());
    });
    return Array.from(set);
  }, [students]);

  const subjectOptions = useMemo(() => {
    const set = new Set<string>();
    students.forEach((s) => {
      const mapel = s['Mata Pelajaran'];
      if (mapel && mapel.trim()) set.add(mapel.trim());
    });
    return Array.from(set);
  }, [students]);

  // Filtered and sorted students
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      // Exclude completely blank rows
      if (!s.Nama && !s.Kelas && s.Nilai === undefined) return false;

      // Search match
      const query = searchTerm.toLowerCase();
      const nameMatch = s.Nama ? s.Nama.toLowerCase().includes(query) : false;
      const absenMatch = s['Nomor Absen']
        ? String(s['Nomor Absen']).toLowerCase().includes(query)
        : false;
      const classMatch = s.Kelas ? s.Kelas.toLowerCase().includes(query) : false;

      if (searchTerm && !nameMatch && !absenMatch && !classMatch) {
        return false;
      }

      // Class filter
      if (selectedClass !== 'all' && s.Kelas !== selectedClass) {
        return false;
      }

      // Status filter
      if (selectedStatus !== 'all') {
        const studentStatus = (s.Status || '').toLowerCase();
        if (selectedStatus === 'lulus' && studentStatus !== 'lulus') return false;
        if (selectedStatus === 'belum' && studentStatus === 'lulus') return false;
      }

      // Subject filter
      if (
        selectedSubject !== 'all' &&
        s['Mata Pelajaran'] !== selectedSubject
      ) {
        return false;
      }

      return true;
    });
  }, [students, searchTerm, selectedClass, selectedStatus, selectedSubject]);

  const sortedStudents = useMemo(() => {
    return [...filteredStudents].sort((a, b) => {
      let valA: any = a[sortField];
      let valB: any = b[sortField];

      if (sortField === 'Nilai') {
        valA = Number(valA) || 0;
        valB = Number(valB) || 0;
      } else if (sortField === 'Nomor Absen') {
        valA = Number(valA) || 0;
        valB = Number(valB) || 0;
      } else if (sortField === 'Timestamp') {
        valA = new Date(valA || 0).getTime();
        valB = new Date(valB || 0).getTime();
      } else {
        valA = String(valA || '').toLowerCase();
        valB = String(valB || '').toLowerCase();
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredStudents, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder(field === 'Nilai' ? 'desc' : 'asc');
    }
  };

  const handleExportCsv = () => {
    if (sortedStudents.length === 0) return;

    const headers = [
      'No',
      'Waktu',
      'Nama Siswa',
      'Kelas',
      'Nomor Absen',
      'Tanggal Lahir',
      'Benar',
      'Salah',
      'Nilai',
      'Status',
      'Mata Pelajaran',
    ];

    const rows = sortedStudents.map((s, idx) => [
      idx + 1,
      s.Timestamp ? new Date(s.Timestamp).toLocaleString('id-ID') : '-',
      `"${(s.Nama || '').replace(/"/g, '""')}"`,
      `"${s.Kelas || ''}"`,
      s['Nomor Absen'] ?? '-',
      s['Tanggal Lahir']
        ? new Date(s['Tanggal Lahir']).toISOString().split('T')[0]
        : '-',
      s.Benar ?? 0,
      s.Salah ?? 0,
      s.Nilai ?? 0,
      s.Status || (Number(s.Nilai) >= 75 ? 'Lulus' : 'Belum Lulus'),
      `"${s['Mata Pelajaran'] || ''}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `rekap_nilai_siswa_${new Date().toISOString().split('T')[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const formatDateTime = (dateStr?: string) => {
    if (!dateStr) return '-';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Table Toolbar / Filters */}
      <div className="p-4 border-b border-slate-200 bg-slate-50/50">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama siswa, nomor absen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white text-xs border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Filter options */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Class Filter */}
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-3 py-2 bg-white text-xs border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="all">Semua Kelas</option>
              {classOptions.map((c) => (
                <option key={c} value={c}>
                  Kelas {c}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 bg-white text-xs border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="all">Semua Status</option>
              <option value="lulus">Lulus</option>
              <option value="belum">Belum Lulus</option>
            </select>

            {/* Subject Filter */}
            {subjectOptions.length > 0 && (
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="px-3 py-2 bg-white text-xs border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="all">Semua Mapel</option>
                {subjectOptions.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            )}

            {/* Export Actions */}
            <div className="flex items-center gap-1.5 ml-auto md:ml-0">
              <button
                onClick={handleExportCsv}
                disabled={sortedStudents.length === 0}
                className="inline-flex items-center gap-1 px-3 py-2 bg-white text-xs font-medium text-slate-700 hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors disabled:opacity-40"
                title="Download Data sebagai file CSV"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">CSV</span>
              </button>

              <button
                onClick={handlePrint}
                disabled={sortedStudents.length === 0}
                className="inline-flex items-center gap-1 px-3 py-2 bg-white text-xs font-medium text-slate-700 hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors disabled:opacity-40"
                title="Cetak Rekap Nilai"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Cetak</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table Data */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-100/75 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-3 px-3 w-12 text-center">No</th>
              <th
                onClick={() => handleSort('Timestamp')}
                className="py-3 px-3 cursor-pointer hover:bg-slate-200/60 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Waktu Input</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('Nama')}
                className="py-3 px-4 cursor-pointer hover:bg-slate-200/60 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Nama Siswa</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('Kelas')}
                className="py-3 px-3 cursor-pointer hover:bg-slate-200/60 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Kelas</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('Nomor Absen')}
                className="py-3 px-3 text-center cursor-pointer hover:bg-slate-200/60 transition-colors"
              >
                <div className="flex items-center justify-center gap-1">
                  <span>Absen</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-3">Tgl Lahir</th>
              <th className="py-3 px-3">Mata Pelajaran</th>
              <th className="py-3 px-3 text-center">B / S</th>
              <th
                onClick={() => handleSort('Nilai')}
                className="py-3 px-3 text-center cursor-pointer hover:bg-slate-200/60 transition-colors"
              >
                <div className="flex items-center justify-center gap-1">
                  <span>Nilai</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td colSpan={10} className="py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-xs font-medium">
                      Mengambil data langsung dari Google Spreadsheet...
                    </span>
                  </div>
                </td>
              </tr>
            ) : sortedStudents.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2 max-w-md mx-auto">
                    <AlertCircle className="w-8 h-8 text-slate-300" />
                    <p className="text-sm font-semibold text-slate-700">
                      {searchTerm || selectedClass !== 'all' || selectedStatus !== 'all'
                        ? 'Tidak ada data siswa yang cocok dengan filter.'
                        : 'Belum ada data nilai di spreadsheet.'}
                    </p>
                    <p className="text-xs text-slate-400">
                      Data disimpan otomatis melalui Google Apps Script terpasang.
                    </p>
                    <button
                      onClick={onOpenAddModal}
                      className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-xs"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>Input Nilai Siswa Pertama</span>
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              sortedStudents.map((student, index) => {
                const nilaiNum = Number(student.Nilai) || 0;
                const isLulus =
                  (student.Status || '').toLowerCase() === 'lulus' ||
                  (!student.Status && nilaiNum >= 75);

                return (
                  <tr
                    key={index}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="py-3 px-3 text-center font-mono text-slate-400 text-xs">
                      {index + 1}
                    </td>
                    <td className="py-3 px-3 text-slate-500 text-[11px] whitespace-nowrap">
                      {formatDateTime(student.Timestamp)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">
                        {student.Nama || <span className="italic text-slate-400">Tanpa Nama</span>}
                      </div>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-800 border border-slate-200">
                        {student.Kelas || 'VI'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-medium text-slate-700">
                      {student['Nomor Absen'] ?? '-'}
                    </td>
                    <td className="py-3 px-3 text-slate-500 whitespace-nowrap text-[11px]">
                      {formatDate(student['Tanggal Lahir'])}
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-700">
                        <BookOpen className="w-3 h-3 text-slate-400" />
                        {student['Mata Pelajaran'] || 'MATEMATIKA'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center text-slate-600 font-mono text-[11px]">
                      <span className="text-emerald-600 font-semibold">{student.Benar ?? 0}</span>
                      <span className="text-slate-300 mx-1">/</span>
                      <span className="text-rose-500 font-semibold">{student.Salah ?? 0}</span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block font-mono font-bold text-sm px-2 py-0.5 rounded-md ${
                          nilaiNum >= 85
                            ? 'bg-emerald-50 text-emerald-700'
                            : nilaiNum >= 75
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {nilaiNum}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          isLulus
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {isLulus ? 'Lulus' : 'Belum Lulus'}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer Summary */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div>
          Menampilkan <span className="font-semibold text-slate-800">{sortedStudents.length}</span> dari{' '}
          <span className="font-semibold text-slate-800">{students.length}</span> total riwayat penilaian
        </div>
        <div className="text-[11px] text-slate-400">
          Sinkronisasi langsung dengan endpoint Google Apps Script
        </div>
      </div>
    </div>
  );
};
