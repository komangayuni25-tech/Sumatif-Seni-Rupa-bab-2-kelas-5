export interface StudentRecord {
  Timestamp?: string;
  Nama: string;
  Kelas: string;
  'Nomor Absen'?: string | number;
  'Tanggal Lahir'?: string;
  Benar?: number;
  Salah?: number;
  Nilai: number;
  Status: 'Lulus' | 'Belum Lulus' | string;
  'Mata Pelajaran': string;
}

export interface GasApiResponse {
  success: boolean;
  data?: StudentRecord[];
  message?: string;
  error?: string;
  raw?: string;
  _meta?: {
    endpoint: string;
    status: number;
    responseTimeMs: number;
    timestamp: string;
  };
}

export interface StudentInputForm {
  nama: string;
  kelas: string;
  noAbsen: string;
  tglLahir: string;
  mapel: string;
  benar: number;
  salah: number;
  nilai: number;
  kkm: number;
  status: string;
}

export interface EndpointConfig {
  url: string;
  isDefault: boolean;
  lastChecked?: string;
  status: 'connected' | 'error' | 'testing' | 'idle';
  latencyMs?: number;
  errorMessage?: string;
}
