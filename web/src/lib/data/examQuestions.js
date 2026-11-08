// Data sesi ujian default (nantinya otomatis mengikuti sesi yang dipilih dari Jadwal Tes atau buatan Admin)
export const examSessionInfo = {
  id: 1,
  title: 'TOEFL - Sesi 1',
  subtitle: 'Ujian Bahasa Inggris',
  registrationStatus: 'Terdaftar',
  date: '12 Mei 2026',
  time: '12.00 - 13.00 WIB',
  durationMinutes: 60,
  durationText: '60 Menit',
  totalQuestions: 50
};

// Daftar Soal & Audio Default (Taruh file MP3 kamu di dalam folder: web/public/audio/)
export const examQuestions = [
  {
    id: 101,
    number: 1,
    type: 'listening', // 'listening' | 'structure' | 'reading'
    sectionTitle: 'Listening Compresion , section 1 dari 3',
    audioUrl: '/audio/listening-1.mp3',
    audioDuration: '00:00 / 1:50',
    questionText: '1. What does the women imply about the event?',
    options: [
      { label: 'A', text: 'It will be very easy.' },
      { label: 'B', text: 'It is too expensive.' },
      { label: 'C', text: 'It is likely to be canceled.' },
      { label: 'D', text: 'It will be held outdors.' }
    ]
  },
  {
    id: 102,
    number: 2,
    type: 'listening',
    sectionTitle: 'Listening Compresion , section 1 dari 3',
    audioUrl: '/audio/listening-2.mp3',
    audioDuration: '00:00 / 1:35',
    questionText: '2. Where does this conversation probably take place?',
    options: [
      { label: 'A', text: 'In a university library.' },
      { label: 'B', text: 'At a campus bookstore.' },
      { label: 'C', text: 'In the biology laboratory.' },
      { label: 'D', text: 'At the student registration office.' }
    ]
  },
  {
    id: 103,
    number: 3,
    type: 'structure',
    sectionTitle: 'Structure & Written Expression , Section 2 dari 3',
    promptLines: [
      'The student',
      'were _____________',
      'For the upcoming exam.'
    ],
    questionText: '',
    options: [
      { label: 'A', text: 'Prepare.' },
      { label: 'B', text: 'Prepares.' },
      { label: 'C', text: 'Prepared.' },
      { label: 'D', text: 'Preparing.' }
    ]
  },
  {
    id: 104,
    number: 4,
    type: 'structure',
    sectionTitle: 'Structure & Written Expression , Section 2 dari 3',
    promptLines: [
      'Neither the professor',
      'nor the assistants _____________',
      'available today.'
    ],
    questionText: '',
    options: [
      { label: 'A', text: 'Is.' },
      { label: 'B', text: 'Are.' },
      { label: 'C', text: 'Was.' },
      { label: 'D', text: 'Were.' }
    ]
  }
];

// Mengambil sesi aktif yang diklik user atau dibuat oleh Admin (dengan fallback aman jika sesi dihapus)
export function getActiveSessionData() {
  try {
    const saved = localStorage.getItem('toefl_active_session');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        id: parsed.id ?? examSessionInfo.id,
        title: parsed.title ? parsed.title.replace('-', ' - ') : examSessionInfo.title,
        subtitle: parsed.subtitle || examSessionInfo.subtitle,
        registrationStatus: parsed.status || 'Terdaftar',
        date: parsed.date || examSessionInfo.date,
        time: parsed.time || examSessionInfo.time,
        durationMinutes: Number(parsed.durationMinutes) || examSessionInfo.durationMinutes,
        durationText: parsed.durationText || `${Number(parsed.durationMinutes) || 60} Menit`,
        totalQuestions: Number(parsed.totalQuestions) || examSessionInfo.totalQuestions
      };
    }
  } catch (err) {
    console.error('Gagal membaca sesi aktif:', err);
  }
  return examSessionInfo;
}

// Mengambil daftar soal sesuai ID sesi (mendukung penambahan/pengeditan soal per sesi oleh Admin)
export function getQuestionsBySession(sessionId) {
  try {
    const customQuestions = localStorage.getItem(`toefl_questions_session_${sessionId}`);
    if (customQuestions) {
      const parsed = JSON.parse(customQuestions);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Gagal memuat soal sesi:', err);
  }
  return examQuestions;
}