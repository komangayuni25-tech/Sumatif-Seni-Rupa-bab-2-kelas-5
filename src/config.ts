import { GasApiResponse, StudentRecord } from './types';

// The installed Google Apps Script endpoint requested by the user
export const INSTALLED_GAS_ENDPOINT_URL =
  'https://script.google.com/macros/s/AKfycbz6bOHZteqsUnm8NhstL45sAhMzEE3KHUchm2AlEbXOVM6IjZKlFexVZdcPqkYMe0XC/exec';

const STORAGE_KEY = 'custom_gas_endpoint_url';

export function getActiveEndpointUrl(): string {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && saved.trim()) {
      return saved.trim();
    }
  }
  return INSTALLED_GAS_ENDPOINT_URL;
}

export function setActiveEndpointUrl(url: string): void {
  if (typeof window !== 'undefined') {
    if (!url || url.trim() === INSTALLED_GAS_ENDPOINT_URL) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, url.trim());
    }
  }
}

export function resetToDefaultEndpoint(): string {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
  return INSTALLED_GAS_ENDPOINT_URL;
}

/**
 * Fetch records from Google Apps Script.
 * Uses /api/gas proxy first to avoid CORS / redirect issues.
 * Falls back to direct fetch if proxy is not accessible.
 */
export async function fetchStudentsFromGas(endpointUrl?: string): Promise<{
  data: StudentRecord[];
  meta: { responseTimeMs: number; raw?: any };
}> {
  const targetUrl = endpointUrl || getActiveEndpointUrl();
  const startTime = Date.now();

  try {
    // 1. Try server proxy
    const proxyUrl = `/api/gas?url=${encodeURIComponent(targetUrl)}&t=${Date.now()}`;
    const res = await fetch(proxyUrl, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });

    if (res.ok) {
      const json: GasApiResponse = await res.json();
      const latency = json._meta?.responseTimeMs ?? (Date.now() - startTime);

      if (json.success && Array.isArray(json.data)) {
        return {
          data: json.data,
          meta: { responseTimeMs: latency, raw: json },
        };
      }
      if (Array.isArray(json.data)) {
        return {
          data: json.data,
          meta: { responseTimeMs: latency, raw: json },
        };
      }
    }
  } catch (proxyError) {
    console.warn('Proxy request error, attempting direct fetch...', proxyError);
  }

  // 2. Fallback direct fetch
  try {
    const directRes = await fetch(targetUrl, {
      method: 'GET',
      redirect: 'follow',
      headers: { Accept: 'application/json' },
    });
    const latency = Date.now() - startTime;
    const json = await directRes.json();
    return {
      data: Array.isArray(json.data) ? json.data : [],
      meta: { responseTimeMs: latency, raw: json },
    };
  } catch (directError: any) {
    throw new Error(
      directError.message || 'Gagal mengambil data dari Google Apps Script.',
    );
  }
}

/**
 * Send student assessment payload to Google Apps Script.
 * Sends payload to both proxy and maps redundant key casing
 * (e.g. nama, Nama, noAbsen, Nomor Absen, etc.) for maximum compatibility.
 */
export async function submitStudentToGas(
  payload: {
    nama: string;
    kelas: string;
    noAbsen: string | number;
    tglLahir: string;
    benar: number;
    salah: number;
    nilai: number;
    status: string;
    mapel: string;
  },
  endpointUrl?: string,
): Promise<{ success: boolean; message: string; raw?: any }> {
  const targetUrl = endpointUrl || getActiveEndpointUrl();

  const formattedPayload = {
    // Multi-casing keys to guarantee Google Apps Script picks up all columns
    nama: payload.nama,
    Nama: payload.nama,
    namaSiswa: payload.nama,
    kelas: payload.kelas,
    Kelas: payload.kelas,
    absen: payload.noAbsen,
    noAbsen: payload.noAbsen,
    nomorAbsen: payload.noAbsen,
    'Nomor Absen': payload.noAbsen,
    tglLahir: payload.tglLahir,
    tanggalLahir: payload.tglLahir,
    'Tanggal Lahir': payload.tglLahir,
    benar: payload.benar,
    Benar: payload.benar,
    salah: payload.salah,
    Salah: payload.salah,
    nilai: payload.nilai,
    Nilai: payload.nilai,
    status: payload.status,
    Status: payload.status,
    mapel: payload.mapel,
    mataPelajaran: payload.mapel,
    'Mata Pelajaran': payload.mapel,
  };

  try {
    // 1. Try server proxy
    const proxyUrl = `/api/gas?url=${encodeURIComponent(targetUrl)}`;
    const res = await fetch(proxyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formattedPayload),
    });

    if (res.ok) {
      const json = await res.json();
      return {
        success: json.success ?? true,
        message:
          json.message || 'Hasil tes siswa berhasil disimpan ke Google Sheets!',
        raw: json,
      };
    }
  } catch (err) {
    console.warn('Proxy POST error, trying direct POST fallback...', err);
  }

  // 2. Direct fallback
  const directRes = await fetch(targetUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formattedPayload),
    redirect: 'follow',
  });

  const text = await directRes.text();
  try {
    const json = JSON.parse(text);
    return {
      success: json.success ?? true,
      message:
        json.message || 'Hasil tes siswa berhasil disimpan ke Google Sheets!',
      raw: json,
    };
  } catch {
    return {
      success: directRes.ok,
      message:
        directRes.ok
          ? 'Data berhasil terkirim ke Google Sheets!'
          : 'Terjadi respon dari server: ' + text.slice(0, 100),
    };
  }
}
