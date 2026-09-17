export interface SchoolMetadata {
  namaSekolah: string;
  namaKepalaSekolah: string;
  nipKepalaSekolah: string;
  namaGuru: string;
  nipppk: string;
  kelas: string;
  mataPelajaran: string;
  kktp: string[];
  lingkupMateri: string[];
  tahunAjaran: string;
  semester: string;
  alokasiWaktu: string;
}

export const SCHOOL_INFO: SchoolMetadata = {
  namaSekolah: 'SD Negeri 3 Loloan Timur',
  namaKepalaSekolah: 'Susilo Fitri Yatmoko, M.Pd',
  nipKepalaSekolah: '19880521 201101 1 010',
  namaGuru: 'Komang Ayu, S.Pd',
  nipppk: '198605022022212030',
  kelas: '5',
  mataPelajaran: 'Seni Rupa',
  kktp: [
    'Peserta didik memahami pengertian prinsip ritme dalam seni rupa.',
    'Peserta didik mampu menggambar dengan menerapkan prinsip ritme.',
  ],
  lingkupMateri: [
    'Unsur seni rupa yang membentuk ritme',
    'Menemukan ritme di lingkungan sekitar',
    'Membandingkan ritme dalam berbagai objek',
    'Menggambar ritme pola repetisi',
    'Cara menggambar dengan menerapkan prinsip ritme',
  ],
  tahunAjaran: '2025/2026',
  semester: 'Genap',
  alokasiWaktu: '60 Menit',
};

export interface QuestionMultipleChoice {
  id: number;
  type: 'pilihan_ganda';
  materi: string;
  pertanyaan: string;
  options: { key: 'A' | 'B' | 'C' | 'D'; text: string }[];
  jawabanBenar: 'A' | 'B' | 'C' | 'D';
  pembahasan: string;
  svgImage?: string;
  imageCaption?: string;
}

export interface StatementItem {
  id: string;
  pernyataan: string;
  kunci: boolean; // true: Benar, false: Salah
  penjelasan: string;
}

export interface QuestionComplexCategory {
  id: number;
  type: 'pg_kompleks';
  materi: string;
  pertanyaan: string;
  deskripsi: string;
  pernyataanList: StatementItem[];
  svgImage?: string;
  imageCaption?: string;
}

export type QuestionItem = QuestionMultipleChoice | QuestionComplexCategory;

// SVG Visual Assets for Art Rhythm Questions
export const RHYTHM_SVGS = {
  // 1. Natural Rhythm: Fern / Palm Leaf repetition
  leafPattern: `
    <svg viewBox="0 0 320 120" class="w-full h-auto max-h-36 mx-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#059669" />
          <stop offset="100%" stop-color="#10b981" />
        </linearGradient>
      </defs>
      <rect width="320" height="120" fill="#f8fafc" rx="8" />
      <path d="M 20 60 Q 160 55 300 60" stroke="#047857" stroke-width="4" fill="none" stroke-linecap="round" />
      <!-- Repeated Leaf Pairs -->
      <g stroke="#047857" stroke-width="1.5" fill="url(#leafGrad)">
        <path d="M 50 59 Q 45 35 60 25 Q 68 40 54 59 Z" />
        <path d="M 50 61 Q 45 85 60 95 Q 68 80 54 61 Z" />
        <path d="M 90 59 Q 85 35 100 25 Q 108 40 94 59 Z" />
        <path d="M 90 61 Q 85 85 100 95 Q 108 80 94 61 Z" />
        <path d="M 130 59 Q 125 35 140 25 Q 148 40 134 59 Z" />
        <path d="M 130 61 Q 125 85 140 95 Q 148 80 134 61 Z" />
        <path d="M 170 59 Q 165 35 180 25 Q 188 40 174 59 Z" />
        <path d="M 170 61 Q 165 85 180 95 Q 188 80 174 61 Z" />
        <path d="M 210 59 Q 205 35 220 25 Q 228 40 214 59 Z" />
        <path d="M 210 61 Q 205 85 220 95 Q 228 80 214 61 Z" />
        <path d="M 250 59 Q 245 35 260 25 Q 268 40 254 59 Z" />
        <path d="M 250 61 Q 245 85 260 95 Q 268 80 254 61 Z" />
      </g>
    </svg>
  `,

  // 2. Pure Repetition: Identical squares with equal spacing
  pureRepetition: `
    <svg viewBox="0 0 320 100" class="w-full h-auto max-h-32 mx-auto" xmlns="http://www.w3.org/2000/svg">
      <rect width="320" height="100" fill="#f8fafc" rx="8" />
      <g fill="#3b82f6" stroke="#1d4ed8" stroke-width="2">
        <rect x="25" y="30" width="40" height="40" rx="4" />
        <rect x="85" y="30" width="40" height="40" rx="4" />
        <rect x="145" y="30" width="40" height="40" rx="4" />
        <rect x="205" y="30" width="40" height="40" rx="4" />
        <rect x="265" y="30" width="40" height="40" rx="4" />
      </g>
    </svg>
  `,

  // 3. Alternative Rhythm: Alternating Circle and Triangle (selang-seling)
  alternativeRhythm: `
    <svg viewBox="0 0 320 100" class="w-full h-auto max-h-32 mx-auto" xmlns="http://www.w3.org/2000/svg">
      <rect width="320" height="100" fill="#f8fafc" rx="8" />
      <!-- Circle 1 -->
      <circle cx="45" cy="50" r="22" fill="#ef4444" stroke="#b91c1c" stroke-width="2" />
      <!-- Triangle 1 -->
      <polygon points="105,25 85,72 125,72" fill="#eab308" stroke="#a16207" stroke-width="2" />
      <!-- Circle 2 -->
      <circle cx="165" cy="50" r="22" fill="#ef4444" stroke="#b91c1c" stroke-width="2" />
      <!-- Triangle 2 -->
      <polygon points="225,25 205,72 245,72" fill="#eab308" stroke="#a16207" stroke-width="2" />
      <!-- Circle 3 -->
      <circle cx="285" cy="50" r="22" fill="#ef4444" stroke="#b91c1c" stroke-width="2" />
    </svg>
  `,

  // 4. Progressive Rhythm: Circle size graduating from small to large
  progressiveRhythm: `
    <svg viewBox="0 0 320 110" class="w-full h-auto max-h-32 mx-auto" xmlns="http://www.w3.org/2000/svg">
      <rect width="320" height="110" fill="#f8fafc" rx="8" />
      <circle cx="35" cy="55" r="10" fill="#8b5cf6" stroke="#6d28d9" stroke-width="2" />
      <circle cx="85" cy="55" r="16" fill="#8b5cf6" stroke="#6d28d9" stroke-width="2" />
      <circle cx="150" cy="55" r="23" fill="#8b5cf6" stroke="#6d28d9" stroke-width="2" />
      <circle cx="225" cy="55" r="31" fill="#8b5cf6" stroke="#6d28d9" stroke-width="2" />
      <circle cx="310" cy="55" r="40" fill="#8b5cf6" stroke="#6d28d9" stroke-width="2" />
    </svg>
  `,

  // 5. Flowing / Wave Rhythm: Dynamic curves
  flowingRhythm: `
    <svg viewBox="0 0 320 100" class="w-full h-auto max-h-32 mx-auto" xmlns="http://www.w3.org/2000/svg">
      <rect width="320" height="100" fill="#f8fafc" rx="8" />
      <path d="M 10 65 Q 45 20 85 65 T 160 65 T 235 65 T 310 65" fill="none" stroke="#0284c7" stroke-width="5" stroke-linecap="round" />
      <path d="M 10 75 Q 45 30 85 75 T 160 75 T 235 75 T 310 75" fill="none" stroke="#38bdf8" stroke-width="3" stroke-linecap="round" />
      <path d="M 10 55 Q 45 10 85 55 T 160 55 T 235 55 T 310 55" fill="none" stroke="#bae6fd" stroke-width="2" stroke-linecap="round" />
    </svg>
  `,

  // 6. Traditional Motif: Batik Kawung repetition
  kawungMotif: `
    <svg viewBox="0 0 320 120" class="w-full h-auto max-h-36 mx-auto" xmlns="http://www.w3.org/2000/svg">
      <rect width="320" height="120" fill="#fef3c7" rx="8" />
      <defs>
        <g id="kawungUnit">
          <!-- 4 overlapping ellipses centered at 0,0 -->
          <ellipse cx="0" cy="-18" rx="10" ry="16" fill="#b45309" opacity="0.85" />
          <ellipse cx="0" cy="18" rx="10" ry="16" fill="#b45309" opacity="0.85" />
          <ellipse cx="-18" cy="0" rx="16" ry="10" fill="#b45309" opacity="0.85" />
          <ellipse cx="18" cy="0" rx="16" ry="10" fill="#b45309" opacity="0.85" />
          <circle cx="0" cy="0" r="5" fill="#f59e0b" />
        </g>
      </defs>
      <use href="#kawungUnit" x="60" y="60" />
      <use href="#kawungUnit" x="140" y="60" />
      <use href="#kawungUnit" x="220" y="60" />
      <use href="#kawungUnit" x="300" y="60" />
    </svg>
  `,

  // 7. Architectural Rhythm: Fence / Pagar teratur
  fenceRhythm: `
    <svg viewBox="0 0 320 110" class="w-full h-auto max-h-32 mx-auto" xmlns="http://www.w3.org/2000/svg">
      <rect width="320" height="110" fill="#f8fafc" rx="8" />
      <!-- Rails -->
      <rect x="15" y="45" width="290" height="8" fill="#d97706" rx="2" />
      <rect x="15" y="75" width="290" height="8" fill="#d97706" rx="2" />
      <!-- Pickets -->
      <g fill="#f59e0b" stroke="#b45309" stroke-width="1.5">
        <polygon points="30,20 20,35 20,95 40,95 40,35" />
        <polygon points="65,20 55,35 55,95 75,95 75,35" />
        <polygon points="100,20 90,35 90,95 110,95 110,35" />
        <polygon points="135,20 125,35 125,95 145,95 145,35" />
        <polygon points="170,20 160,35 160,95 180,95 180,35" />
        <polygon points="205,20 195,35 195,95 215,95 215,35" />
        <polygon points="240,20 230,35 230,95 250,95 250,35" />
        <polygon points="275,20 265,35 265,95 285,95 285,35" />
      </g>
    </svg>
  `,

  // 8. Grid Helper for drawing rhythm
  gridGuide: `
    <svg viewBox="0 0 320 110" class="w-full h-auto max-h-32 mx-auto" xmlns="http://www.w3.org/2000/svg">
      <rect width="320" height="110" fill="#ffffff" stroke="#cbd5e1" stroke-width="2" rx="8" />
      <!-- Grid lines -->
      <g stroke="#94a3b8" stroke-width="1" stroke-dasharray="4 3">
        <line x1="80" y1="0" x2="80" y2="110" />
        <line x1="160" y1="0" x2="160" y2="110" />
        <line x1="240" y1="0" x2="240" y2="110" />
        <line x1="0" y1="55" x2="320" y2="55" />
      </g>
      <!-- Base Motif centered in each grid -->
      <circle cx="40" cy="55" r="18" fill="#10b981" />
      <circle cx="120" cy="55" r="18" fill="#10b981" />
      <circle cx="200" cy="55" r="18" fill="#10b981" />
      <circle cx="280" cy="55" r="18" fill="#10b981" />
    </svg>
  `,
};

// 25 Soal Pilihan Ganda (Seni Rupa Kelas 5 - Prinsip Ritme)
export const QUESTIONS_PILIHAN_GANDA: QuestionMultipleChoice[] = [
  {
    id: 1,
    type: 'pilihan_ganda',
    materi: 'pengertian prinsip ritme dalam seni rupa',
    pertanyaan:
      'Dalam seni rupa, apa yang dimaksud dengan prinsip ritme (irama)?',
    options: [
      { key: 'A', text: 'Pengulangan satu atau lebih unsur seni rupa secara teratur dan berkesinambungan' },
      { key: 'B', text: 'Perpaduan warna yang saling bertabrakan tanpa aturan yang jelas' },
      { key: 'C', text: 'Kesan gelap dan terang pada suatu bidang gambar yang tidak teratur' },
      { key: 'D', text: 'Teknik menggambar objek menggunakan cat air saja' },
    ],
    jawabanBenar: 'A',
    pembahasan:
      'Prinsip ritme (irama) dalam seni rupa adalah pengulangan satu atau lebih unsur rupa (seperti garis, bentuk, atau warna) secara teratur sehingga menciptakan kesan gerak dan keharmonisan.',
  },
  {
    id: 2,
    type: 'pilihan_ganda',
    materi: 'unsur seni rupa yang membentuk ritme',
    pertanyaan:
      'Unsur-unsur seni rupa berikut ini yang paling sering digunakan untuk membentuk pola ritme pada gambar adalah...',
    options: [
      { key: 'A', text: 'Garis, bidang, bentuk, dan warna' },
      { key: 'B', text: 'Bunyi, nada, dan ketukan tempo' },
      { key: 'C', text: 'Kertas gambar, kuas, dan palet' },
      { key: 'D', text: 'Pencahayaan lampu dan suhu ruangan' },
    ],
    jawabanBenar: 'A',
    pembahasan:
      'Unsur visual pembentuk ritme dalam seni rupa meliputi garis, bidang, bentuk, warna, serta tekstur yang diulang dengan pola tertentu.',
  },
  {
    id: 3,
    type: 'pilihan_ganda',
    materi: 'menemukan ritme dilingkungan sekitar',
    pertanyaan:
      'Perhatikan gambar pola daun berikut! Pola susunan helai daun yang berjejer rapi di kanan dan kiri tangkai menunjukkan contoh ritme yang bersumber dari...',
    svgImage: RHYTHM_SVGS.leafPattern,
    imageCaption: 'Gambar susunan daun alami pada ranting',
    options: [
      { key: 'A', text: 'Lingkungan alam ciptaan Tuhan' },
      { key: 'B', text: 'Pabrik mesin tekstil' },
      { key: 'C', text: 'Bangunan gedung modern' },
      { key: 'D', text: 'Alat musik elektronik' },
    ],
    jawabanBenar: 'A',
    pembahasan:
      'Susunan helai daun pakis atau daun kelapa merupakan contoh nyata ritme alami yang dapat kita temukan di lingkungan sekitar kita.',
  },
  {
    id: 4,
    type: 'pilihan_ganda',
    materi: 'menemukan ritme dilingkungan sekitar',
    pertanyaan:
      'Manakah di antara benda-benda di sekitar sekolah berikut yang menerapkan prinsip ritme buatan manusia?',
    options: [
      { key: 'A', text: 'Susunan ubin keramik lantai dan susunan pagar bambu yang berjajar teratur' },
      { key: 'B', text: 'Sebongkah batu sungai yang bentuknya tidak beraturan' },
      { key: 'C', text: 'Tumpukan sampah plastik yang berserakan' },
      { key: 'D', text: 'Coretan cat sembarangan di dinding' },
    ],
    jawabanBenar: 'A',
    pembahasan:
      'Susunan keramik lantai dan pagar bambu memiliki jarak dan bentuk yang diulang secara teratur, sehingga menerapkan prinsip ritme.',
  },
  {
    id: 5,
    type: 'pilihan_ganda',
    materi: 'menggambar ritme pola repetisi',
    pertanyaan:
      'Perhatikan gambar di bawah ini! Jenis pengulangan bentuk kotak dengan ukuran dan jarak yang selalu sama disebut ritme...',
    svgImage: RHYTHM_SVGS.pureRepetition,
    imageCaption: 'Pola pengulangan kotak berukuran sama',
    options: [
      { key: 'A', text: 'Repetisi murni (pengulangan tetap)' },
      { key: 'B', text: 'Gradasi atau progresi' },
      { key: 'C', text: 'Ritme acak tanpa arah' },
      { key: 'D', text: 'Ritme berlawanan arah' },
    ],
    jawabanBenar: 'A',
    pembahasan:
      'Ritme repetisi murni adalah pengulangan bentuk atau objek dengan ukuran, warna, dan jarak yang sama secara konstan.',
  },
  {
    id: 6,
    type: 'pilihan_ganda',
    materi: 'membandingkan ritme dalam berbagai objek',
    pertanyaan:
      'Pengulangan unsur seni rupa yang dilakukan dengan menyelingi dua atau lebih bentuk secara bergantian disebut ritme...',
    options: [
      { key: 'A', text: 'Alternatif (selang-seling)' },
      { key: 'B', text: 'Repetisi statis' },
      { key: 'C', text: 'Gradasi warna' },
      { key: 'D', text: 'Kontras ekstrem' },
    ],
    jawabanBenar: 'A',
    pembahasan:
      'Ritme alternatif merupakan irama visual yang tercipta dari pengulangan dua unsur atau lebih secara bergantian (misalnya: lingkaran, segitiga, lingkaran, segitiga).',
  },
  {
    id: 7,
    type: 'pilihan_ganda',
    materi: 'membandingkan ritme dalam berbagai objek',
    pertanyaan:
      'Perhatikan gambar di bawah! Urutan pola: Lingkaran Merah - Segitiga Kuning - Lingkaran Merah - Segitiga Kuning merupakan contoh ritme...',
    svgImage: RHYTHM_SVGS.alternativeRhythm,
    imageCaption: 'Pola bentuk selang-seling',
    options: [
      { key: 'A', text: 'Alternatif (bergantian)' },
      { key: 'B', text: 'Progresi membesar' },
      { key: 'C', text: 'Mengalun ombak' },
      { key: 'D', text: 'Acak' },
    ],
    jawabanBenar: 'A',
    pembahasan:
      'Pola pada gambar secara jelas menunjukkan pengulangan dua bentuk dan warna secara bergantian (alternatif).',
  },
  {
    id: 8,
    type: 'pilihan_ganda',
    materi: 'membandingkan ritme dalam berbagai objek',
    pertanyaan:
      'Ritme progresi (gradasi) pada karya seni rupa dapat kita kenali melalui ciri-ciri...',
    options: [
      { key: 'A', text: 'Perubahan bentuk atau warna secara bertahap dari kecil ke besar atau terang ke gelap' },
      { key: 'B', text: 'Bentuk yang sama persis tanpa ada perubahan ukuran sama sekali' },
      { key: 'C', text: 'Garis yang terputus-putus tanpa pola yang jelas' },
      { key: 'D', text: 'Penggunaan warna hitam putih secara acak' },
    ],
    jawabanBenar: 'A',
    pembahasan:
      'Ritme progresi atau gradasi ditandai dengan perubahan bertahap dan teratur, misalnya dari ukuran kecil ke besar, atau dari warna terang ke pekat.',
  },
  {
    id: 9,
    type: 'pilihan_ganda',
    materi: 'membandingkan ritme dalam berbagai objek',
    pertanyaan:
      'Perhatikan susunan lingkaran berikut! Susunan bentuk lingkaran dari yang paling kecil hingga membesar ke kanan menunjukkan ritme...',
    svgImage: RHYTHM_SVGS.progressiveRhythm,
    imageCaption: 'Pola lingkaran dengan perubahan ukuran bertahap',
    options: [
      { key: 'A', text: 'Progresi (gradasi ukuran)' },
      { key: 'B', text: 'Repetisi murni' },
      { key: 'C', text: 'Alternatif' },
      { key: 'D', text: 'Simetris kaku' },
    ],
    jawabanBenar: 'A',
    pembahasan:
      'Ukuran lingkaran yang berubah dari kecil secara bertahap menjadi besar menghasilkan ritme progresi ukuran.',
  },
  {
    id: 10,
    type: 'pilihan_ganda',
    materi: 'pengertian prinsip ritme dalam seni rupa',
    pertanyaan:
      'Garis bergelombang yang dibuat berulang kali seperti gerakan ombak laut menciptakan kesan irama yang disebut...',
    options: [
      { key: 'A', text: 'Ritme mengalun (flowing rhythm)' },
      { key: 'B', text: 'Ritme patah-patah' },
      { key: 'C', text: 'Ritme kaku diam' },
      { key: 'D', text: 'Ritme kontradiksi' },
    ],
    jawabanBenar: 'A',
    pembahasan:
      'Ritme mengalun (flowing rhythm) dihasilkan dari garis-garis lengkung atau bergelombang yang berulang secara luwes dan dinamis.',
  },
  {
    id: 11,
    type: 'pilihan_ganda',
    materi: 'menemukan ritme dilingkungan sekitar',
    pertanyaan:
      'Perhatikan gambar garis lengkung di bawah ini! Gambar tersebut mencerminkan ritme gerak dari fenomena alam yaitu...',
    svgImage: RHYTHM_SVGS.flowingRhythm,
    imageCaption: 'Garis lengkung ritmis dinamis',
    options: [
      { key: 'A', text: 'Gulungan ombak di lautan atau riak aliran sungai' },
      { key: 'B', text: 'Tiang listrik yang kokoh berdiri' },
      { key: 'C', text: 'Batu karang yang tajam' },
      { key: 'D', text: 'Pagar tembok sekolah' },
    ],
    jawabanBenar: 'A',
    pembahasan:
      'Garis bergelombang pada gambar mengilustrasikan gerak dinamis ombak air di laut atau aliran sungai.',
  },
  {
    id: 12,
    type: 'pilihan_ganda',
    materi: 'membandingkan ritme dalam berbagai objek',
    pertanyaan:
      'Karya seni kriya tradisional Indonesia berikut ini yang paling kental menerapkan prinsip ritme repetisi motif adalah...',
    options: [
      { key: 'A', text: 'Batik motif kawung atau parang' },
      { key: 'B', text: 'Patung abstrak dari tanah liat' },
      { key: 'C', text: 'Lukisan pemandangan acak' },
      { key: 'D', text: 'Topeng kayu dengan ukiran tunggal' },
    ],
    jawabanBenar: 'A',
    pembahasan:
      'Batik motif kawung dan parang tersusun dari modul motif ornamen yang diulang-ulang secara teratur ke seluruh bidang kain.',
  },
  {
    id: 13,
    type: 'pilihan_ganda',
    materi: 'menggambar ritme pola repetisi',
    pertanyaan:
      'Perhatikan gambar motif di bawah ini! Motif batik tradisional tersebut adalah motif...',
    svgImage: RHYTHM_SVGS.kawungMotif,
    imageCaption: 'Motif batik dengan 4 elips teratur',
    options: [
      { key: 'A', text: 'Batik Kawung' },
      { key: 'B', text: 'Batik Megamendung' },
      { key: 'C', text: 'Batik Parang Rusak' },
      { key: 'D', text: 'Batik Tumpal' },
    ],
    jawabanBenar: 'A',
    pembahasan:
      'Motif batik kawung menyerupai buah kolang-kaling yang tersusun 4 bidang elips membentuk lingkaran berulang.',
  },
  {
    id: 14,
    type: 'pilihan_ganda',
    materi: 'unsur seni rupa yang membentuk ritme',
    pertanyaan:
      'Bagaimana cara menghasilkan ritme menggunakan unsur warna pada bidang gambar?',
    options: [
      { key: 'A', text: 'Mengulang susunan warna tertentu secara teratur, misalnya merah-kuning-merah-kuning' },
      { key: 'B', text: 'Mencampur semua warna hingga menjadi warna hitam keruh' },
      { key: 'C', text: 'Mewarnai seluruh kertas hanya dengan satu sapuan warna abu-abu' },
      { key: 'D', text: 'Menghindari pemakaian warna pada seluruh bidang gambar' },
    ],
    jawabanBenar: 'A',
    pembahasan:
      'Ritme warna terbentuk apabila warna-warna tertentu disusun dan diulang dengan pola teratur secara harmonis.',
  },
  {
    id: 15,
    type: 'pilihan_ganda',
    materi: 'pengertian prinsip ritme dalam seni rupa',
    pertanyaan:
      'Apa fungsi utama dari penerapan prinsip ritme dalam sebuah karya seni lukis atau gambar?',
    options: [
      { key: 'A', text: 'Membimbing arah pandang mata penikmat seni dan menciptakan kesan gerak yang harmonis' },
      { key: 'B', text: 'Membuat gambar terlihat membingungkan dan tidak beraturan' },
      { key: 'C', text: 'Menghemat penggunaan pensil dan krayon' },
      { key: 'D', text: 'Mempercepat waktu pengerjaan tugas gambar' },
    ],
    jawabanBenar: 'A',
    pembahasan:
      'Ritme berfungsi mengarahkan pandangan mata secara mengalir, memberikan rasa dinamika, dan menyatukan komposisi karya seni.',
  },
  {
    id: 16,
    type: 'pilihan_ganda',
    materi: 'cara menggambar dengan menerapkan prinsip ritme',
    pertanyaan:
      'Sebelum mulai menggambar pola ritme repetisi yang rumit, langkah persiapan yang paling tepat dilakukan adalah...',
    options: [
      { key: 'A', text: 'Membuat garis bantu atau petak kotak-kotak (grid) tipis menggunakan pensil dan penggaris' },
      { key: 'B', text: 'Langsung mewarnai kertas dengan spidol permanen tebal' },
      { key: 'C', text: 'Membasahi seluruh kertas dengan air' },
      { key: 'D', text: 'Menempelkan kertas gambar ke dinding tanpa sketsa' },
    ],
    jawabanBenar: 'A',
    pembahasan:
      'Garis bantu grid tipis sangat membantu menjaga ukuran modul dan jarak antar motif agar tetap presisi dan teratur.',
  },
  {
    id: 17,
    type: 'pilihan_ganda',
    materi: 'cara menggambar dengan menerapkan prinsip ritme',
    pertanyaan:
      'Perhatikan gambar di bawah ini! Garis putus-putus yang membagi bidang kertas menjadi kolom dan baris sama besar berfungsi sebagai...',
    svgImage: RHYTHM_SVGS.gridGuide,
    imageCaption: 'Sketsa garis grid bantu menggambar pola ritme',
    options: [
      { key: 'A', text: 'Garis bantu (grid) agar posisi dan ukuran bentuk yang digambar teratur' },
      { key: 'B', text: 'Garis lipatan untuk merobek kertas' },
      { key: 'C', text: 'Hiasan akhir gambar' },
      { key: 'D', text: 'Batas pemotong kertas' },
    ],
    jawabanBenar: 'A',
    pembahasan:
      'Garis kotak putus-putus pada gambar adalah garis bantu (grid) untuk memandu penempatan motif dasar secara konsisten.',
  },
  {
    id: 18,
    type: 'pilihan_ganda',
    materi: 'cara menggambar dengan menerapkan prinsip ritme',
    pertanyaan:
      'Bentuk dasar tunggal yang kemudian digambar berulang-ulang untuk menghasilkan pola ritme disebut...',
    options: [
      { key: 'A', text: 'Modul atau unit dasar' },
      { key: 'B', text: 'Frame atau bingkai' },
      { key: 'C', text: 'Palet warna' },
      { key: 'D', text: 'Tekstur semu' },
    ],
    jawabanBenar: 'A',
    pembahasan:
      'Dalam desain pola dan seni rupa, bentuk tunggal yang diulang-ulang disebut modul (unit motif dasar).',
  },
  {
    id: 19,
    type: 'pilihan_ganda',
    materi: 'menemukan ritme dilingkungan sekitar',
    pertanyaan:
      'Perhatikan gambar susunan pagar di bawah! Ritme pada pagar tersebut terbentuk berkat adanya pengulangan...',
    svgImage: RHYTHM_SVGS.fenceRhythm,
    imageCaption: 'Pagar kayu berjajar rapi',
    options: [
      { key: 'A', text: 'Bilah kayu tegak dengan jarak dan bentuk yang teratur' },
      { key: 'B', text: 'Warna cat yang berbeda-beda secara sembarangan' },
      { key: 'C', text: 'Tali pengikat yang kusut' },
      { key: 'D', text: 'Paku yang berkarat' },
    ],
    jawabanBenar: 'A',
    pembahasan:
      'Bilah kayu tegak berulang dengan jarak teratur menciptakan ritme repetisi pada arsitektur pagar.',
  },
  {
    id: 20,
    type: 'pilihan_ganda',
    materi: 'membandingkan ritme dalam berbagai objek',
    pertanyaan:
      'Perbedaan utama antara karya seni yang memiliki ritme dengan karya seni yang tidak memiliki ritme terletak pada...',
    options: [
      { key: 'A', text: 'Ada tidaknya keteraturan pengulangan unsur visual' },
      { key: 'B', text: 'Harga cat dan kuas yang digunakan' },
      { key: 'C', text: 'Ketebalan kertas yang dipakai' },
      { key: 'D', text: 'Ukuran tanda tangan pembuat karya' },
    ],
    jawabanBenar: 'A',
    pembahasan:
      'Kunci utama ritme adalah adanya pengulangan yang teratur dan harmonis, sedangkan karya tanpa ritme penempatan unsurnya bersifat acak.',
  },
  {
    id: 21,
    type: 'pilihan_ganda',
    materi: 'menemukan ritme dilingkungan sekitar',
    pertanyaan:
      'Susunan batu bata pada dinding rumah yang dipasang bersilangan secara teratur merupakan contoh penerapan ritme dalam bidang...',
    options: [
      { key: 'A', text: 'Arsitektur dan bangunan' },
      { key: 'B', text: 'Seni musik vokal' },
      { key: 'C', text: 'Seni tari tradisional' },
      { key: 'D', text: 'Seni teater panggung' },
    ],
    jawabanBenar: 'A',
    pembahasan:
      'Pemasangan batu bata pada dinding merupakan contoh penerapan ritme visual pada bidang arsitektur lingkungan sekitar.',
  },
  {
    id: 22,
    type: 'pilihan_ganda',
    materi: 'unsur seni rupa yang membentuk ritme',
    pertanyaan:
      'Pengulangan garis-garis lurus vertikal sejajar yang rapat dan berjarak sama akan menghasilkan kesan...',
    options: [
      { key: 'A', text: 'Rapi, kokoh, stabil, dan teratur' },
      { key: 'B', text: 'Goyah, berantakan, dan membingungkan' },
      { key: 'C', text: 'Basah dan licin' },
      { key: 'D', text: 'Gelap gulita' },
    ],
    jawabanBenar: 'A',
    pembahasan:
      'Garis vertikal sejajar berulang memberikan ritme yang rapi, kokoh, serta terkesan stabil dan teratur.',
  },
  {
    id: 23,
    type: 'pilihan_ganda',
    materi: 'cara menggambar dengan menerapkan prinsip ritme',
    pertanyaan:
      'Jika Komang ingin menggambar pola ritme yang memberi kesan ceria dan bersemangat, kombinasi warna yang paling tepat diulang adalah...',
    options: [
      { key: 'A', text: 'Warna-warna cerah seperti kuning, oranye, dan merah menyala' },
      { key: 'B', text: 'Warna hitam dan abu-abu gelap' },
      { key: 'C', text: 'Warna putih saja tanpa gradasi' },
      { key: 'D', text: 'Warna cokelat pudar' },
    ],
    jawabanBenar: 'A',
    pembahasan:
      'Warna cerah hangat (kuning, oranye, merah) yang diulang secara ritmis memancarkan energi ceria dan semangat dalam karya seni.',
  },
  {
    id: 24,
    type: 'pilihan_ganda',
    materi: 'cara menggambar dengan menerapkan prinsip ritme',
    pertanyaan:
      'Setelah modul gambar selesai dibuat di seluruh petak bidang gambar, langkah berikutnya untuk menyempurnakan gambar ritme adalah...',
    options: [
      { key: 'A', text: 'Mewarnai pola dengan konsisten dan menghapus garis bantu grid yang tidak diperlukan' },
      { key: 'B', text: 'Merobek bagian pinggir kertas agar artistik' },
      { key: 'C', text: 'Menutup seluruh gambar dengan cat hitam pekat' },
      { key: 'D', text: 'Melipat kertas menjadi empat bagian' },
    ],
    jawabanBenar: 'A',
    pembahasan:
      'Finishing yang baik mencakup pemberian warna yang konsisten dan pembersihan garis-garis sketsa bantu (grid) agar karya tampak rapi.',
  },
  {
    id: 25,
    type: 'pilihan_ganda',
    materi: 'membandingkan ritme dalam berbagai objek',
    pertanyaan:
      'Garis-garis yang memancar keluar dari satu titik pusat seperti kelopak bunga matahari mekar atau pancaran sinar matahari menunjukkan pola ritme...',
    options: [
      { key: 'A', text: 'Ritme radial (memancar dari pusat)' },
      { key: 'B', text: 'Ritme horizontal datar' },
      { key: 'C', text: 'Ritme vertikal tegak' },
      { key: 'D', text: 'Ritme diagonal miring' },
    ],
    jawabanBenar: 'A',
    pembahasan:
      'Ritme radial (memancar) adalah susunan unsur rupa yang bergerak atau menyebar keluar dari satu titik pusat.',
  },
];

// 5 Soal Pilihan Ganda Kompleks Kategori (Benar / Salah, tiap soal memiliki 3 deskripsi)
export const QUESTIONS_PG_KOMPLEKS: QuestionComplexCategory[] = [
  {
    id: 26,
    type: 'pg_kompleks',
    materi: 'unsur seni rupa yang membentuk ritme',
    pertanyaan:
      'Soal Pilihan Ganda Kompleks 1: Analisis Unsur Pembentuk Ritme',
    deskripsi:
      'Bacalah setiap pernyataan mengenai unsur seni rupa pembentuk ritme berikut ini dengan cermat, kemudian tentukan apakah pernyataan tersebut Benar atau Salah!',
    pernyataanList: [
      {
        id: '26_1',
        pernyataan:
          'Ritme hanya dapat dibentuk menggunakan satu jenis warna saja tanpa adanya unsur garis maupun bentuk.',
        kunci: false,
        penjelasan:
          'Salah, ritme dapat dibentuk dari berbagai unsur visual seperti garis, bentuk, bidang, dan tekstur, tidak terbatas pada warna saja.',
      },
      {
        id: '26_2',
        pernyataan:
          'Pengulangan bentuk geometris seperti lingkaran, segitiga, atau bujur sangkar secara teratur dapat menghasilkan ritme visual.',
        kunci: true,
        penjelasan:
          'Benar, bentuk geometris yang diulang secara konsisten merupakan dasar pembentukan ritme visual.',
      },
      {
        id: '26_3',
        pernyataan:
          'Variasi ketebalan garis yang berulang secara berkala (garis tebal-tipis-tebal-tipis) dapat menciptakan kesan dinamika ritme pada gambar.',
        kunci: true,
        penjelasan:
          'Benar, perbedaan ketebalan garis yang berulang menghasilkan variasi ritme garis yang dinamis.',
      },
    ],
  },
  {
    id: 27,
    type: 'pg_kompleks',
    materi: 'menemukan ritme dilingkungan sekitar',
    pertanyaan:
      'Soal Pilihan Ganda Kompleks 2: Menemukan dan Mengamati Ritme di Sekitar',
    deskripsi:
      'Amati pernyataan mengenai penemuan ritme pada lingkungan sekitar berikut, lalu tentukan respon Benar atau Salah untuk setiap pernyataan!',
    svgImage: RHYTHM_SVGS.fenceRhythm,
    imageCaption: 'Ilustrasi susunan pagar dan objek lingkungan',
    pernyataanList: [
      {
        id: '27_1',
        pernyataan:
          'Susunan anak tangga di sekolah yang memiliki tinggi dan lebar sama dari bawah ke atas merupakan contoh ritme repetisi di lingkungan sekitar.',
        kunci: true,
        penjelasan:
          'Benar, anak tangga memiliki jarak dan bentuk berulang yang konsisten sehingga mencerminkan ritme repetisi.',
      },
      {
        id: '27_2',
        pernyataan:
          'Guguran daun kering di halaman sekolah yang berserakan acak ditiup angin merupakan contoh ritme yang teratur.',
        kunci: false,
        penjelasan:
          'Salah, dedaunan yang berserakan secara acak tidak memiliki pola keteraturan pengulangan, sehingga tidak membentuk ritme teratur.',
      },
      {
        id: '27_3',
        pernyataan:
          'Gerakan gulungan ombak laut di pesisir pantai yang datang susul-menyusul mencerminkan prinsip ritme mengalun (flowing rhythm).',
        kunci: true,
        penjelasan:
          'Benar, ombak laut yang bergulung secara berkesinambungan adalah contoh ritme mengalun di alam bebas.',
      },
    ],
  },
  {
    id: 28,
    type: 'pg_kompleks',
    materi: 'membandingkan ritme dalam berbagai objek',
    pertanyaan:
      'Soal Pilihan Ganda Kompleks 3: Membandingkan Jenis-Jenis Ritme',
    deskripsi:
      'Tentukan apakah pernyataan mengenai perbandingan jenis ritme visual berikut ini Benar atau Salah!',
    svgImage: RHYTHM_SVGS.kawungMotif,
    imageCaption: 'Ilustrasi motif ornamen ritmis',
    pernyataanList: [
      {
        id: '28_1',
        pernyataan:
          'Pada ritme repetisi murni, bentuk dan ukuran objek yang diulang harus selalu diubah-ubah secara bebas tanpa aturan.',
        kunci: false,
        penjelasan:
          'Salah, pada repetisi murni bentuk, ukuran, dan jarak objek harus tetap dan sama persis.',
      },
      {
        id: '28_2',
        pernyataan:
          'Motif batik kawung dan motif kain tenun tradisional menerapkan prinsip ritme pengulangan motif secara teratur.',
        kunci: true,
        penjelasan:
          'Benar, batik kawung dan tenun tradisional menggunakan modul motif yang diulang secara beraturan pada seluruh bidang kain.',
      },
      {
        id: '28_3',
        pernyataan:
          'Ritme alternatif dapat dibuat dengan mengulang dua motif yang berbeda (misalnya bentuk bintang dan bulan) secara bergantian.',
        kunci: true,
        penjelasan:
          'Benar, ritme alternatif adalah pengulangan dua unsur atau lebih secara selang-seling.',
      },
    ],
  },
  {
    id: 29,
    type: 'pg_kompleks',
    materi: 'cara menggambar dengan menerapkan prinsip ritme',
    pertanyaan:
      'Soal Pilihan Ganda Kompleks 4: Prosedur dan Teknik Menggambar Ritme',
    deskripsi:
      'Evaluasi langkah-langkah menggambar dengan menerapkan prinsip ritme berikut, lalu tentukan Benar atau Salah!',
    svgImage: RHYTHM_SVGS.gridGuide,
    imageCaption: 'Ilustrasi penggunaan grid dalam menggambar ritme',
    pernyataanList: [
      {
        id: '29_1',
        pernyataan:
          'Membuat garis bantu kotak-kotak (grid) dengan pensil membantu menjaga jarak dan ukuran modul gambar agar tetap seimbang dan rapi.',
        kunci: true,
        penjelasan:
          'Benar, grid adalah pedoman teknis paling efektif untuk menjaga keteraturan bentuk berulang.',
      },
      {
        id: '29_2',
        pernyataan:
          'Saat menggambar ritme progresi ukuran, besar kecilnya objek yang digambar harus sama persis dari awal hingga akhir petak.',
        kunci: false,
        penjelasan:
          'Salah, ritme progresi justru memerlukan perubahan ukuran bertahap (misalnya dari kecil ke besar).',
      },
      {
        id: '29_3',
        pernyataan:
          'Menggunakan alat bantu seperti penggaris atau cetakan bentuk dasar di awal membuat gambar pola ritme menjadi lebih presisi.',
        kunci: true,
        penjelasan:
          'Benar, penggaris dan cetakan modul membantu menghasilkan pola pengulangan yang rapi dan presisi.',
      },
    ],
  },
  {
    id: 30,
    type: 'pg_kompleks',
    materi: 'pengertian prinsip ritme dalam seni rupa',
    pertanyaan:
      'Soal Pilihan Ganda Kompleks 5: Nilai Estetika dan Pemahaman Ritme',
    deskripsi:
      'Tentukan apakah pernyataan mengenai fungsi dan penghayatan ritme dalam karya seni rupa berikut ini Benar atau Salah!',
    pernyataanList: [
      {
        id: '30_1',
        pernyataan:
          'Keberadaan ritme dalam karya seni rupa dapat menuntun pandangan mata orang yang melihatnya agar menjelajahi seluruh bagian gambar.',
        kunci: true,
        penjelasan:
          'Benar, ritme menciptakan alur gerak visual yang mengarahkan mata penikmat seni secara menyenangkan.',
      },
      {
        id: '30_2',
        pernyataan:
          'Susunan karya seni yang memiliki ritme harmonis memberikan perasaan keteraturan, keindahan, dan ketenangan bagi yang melihatnya.',
        kunci: true,
        penjelasan:
          'Benar, ritme harmonis menghadirkan rasa keteraturan dan kenikmatan estetika visual.',
      },
      {
        id: '30_3',
        pernyataan:
          'Prinsip ritme dalam seni rupa hanya bisa dirasakan lewat indra pendengaran sebagaimana irama pada lagu atau musik.',
        kunci: false,
        penjelasan:
          'Salah, ritme dalam seni rupa dinikmati melalui indra penglihatan (visual), bukan pendengaran.',
      },
    ],
  },
];
