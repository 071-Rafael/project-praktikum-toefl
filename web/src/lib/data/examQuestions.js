// Data sesi ujian default
export const examSessionInfo = {
  id: 1,
  title: 'TOEFL - Sesi 1',
  subtitle: 'Ujian Bahasa Inggris',
  registrationStatus: 'Terdaftar',
  date: '12 Mei 2026',
  time: '12.00 - 13.00 WIB',
  durationMinutes: 60,
  durationText: '60 Menit',
  totalQuestions: 4
};

// Daftar Soal, Audio & Kunci Jawaban (correctAnswer)
// Taruh file MP3 kamu di dalam folder: web/public/audio/
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
    ],
    correctAnswer: 'C'
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
    ],
    correctAnswer: 'A'
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
    ],
    correctAnswer: 'C'
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
    ],
    correctAnswer: 'B'
  }
];

// Mengambil identitas unik akun yang sedang login agar data antar akun tidak tercampur
export function getCurrentUserKey() {
  try {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      const identifier = parsed.id || parsed.email || parsed.username || parsed.name;
      if (identifier) {
        return String(identifier).trim().toLowerCase().replace(/\s+/g, '_');
      }
    }
  } catch (err) {
    console.error('Gagal membaca identitas user:', err);
  }
  return 'guest';
}

// Helper membuat key localStorage spesifik per akun user
export function getUserStorageKey(baseKey) {
  const userKey = getCurrentUserKey();
  return `${baseKey}_user_${userKey}`;
}

// Mengambil sesi aktif milik akun yang sedang login
export function getActiveSessionData() {
  try {
    const saved = localStorage.getItem(getUserStorageKey('toefl_active_session'));
    if (saved) {
      const parsed = JSON.parse(saved);
      const questionsForSession = getQuestionsBySession(parsed.id ?? examSessionInfo.id);
      return {
        id: parsed.id ?? examSessionInfo.id,
        title: parsed.title ? parsed.title.replace('-', ' - ') : examSessionInfo.title,
        subtitle: parsed.subtitle || examSessionInfo.subtitle,
        registrationStatus: parsed.status || 'Terdaftar',
        date: parsed.date || examSessionInfo.date,
        time: parsed.time || examSessionInfo.time,
        durationMinutes: Number(parsed.durationMinutes) || examSessionInfo.durationMinutes,
        durationText: parsed.durationText || `${Number(parsed.durationMinutes) || 60} Menit`,
        totalQuestions: Number(parsed.totalQuestions) || questionsForSession.length || examSessionInfo.totalQuestions
      };
    }
  } catch (err) {
    console.error('Gagal membaca sesi aktif:', err);
  }
  return examSessionInfo;
}

// Mengambil daftar soal sesuai ID sesi
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

// Menghitung skor TOEFL nyata berdasarkan jawaban benar/salah user
export function calculateToeflScore(questionList, selectedAnswers = {}) {
  const sections = {
    listening: { correct: 0, total: 0 },
    structure: { correct: 0, total: 0 },
    reading: { correct: 0, total: 0 }
  };

  let totalCorrectAll = 0;
  const totalQuestionsAll = questionList.length || 1;

  for (const q of questionList) {
    const secType =
      q.type === 'listening'
        ? 'listening'
        : q.type === 'structure'
          ? 'structure'
          : 'reading';

    sections[secType].total += 1;

    const userAns = selectedAnswers[q.id];
    if (userAns && userAns === q.correctAnswer) {
      sections[secType].correct += 1;
      totalCorrectAll += 1;
    }
  }

  const overallRatio = totalCorrectAll / totalQuestionsAll;

  // Konversi rasio benar (0.0 - 1.0) ke skala nilai section TOEFL (31 - 68)
  function calcSectionScaled(secObj) {
    const ratio = secObj.total > 0 ? secObj.correct / secObj.total : overallRatio;
    return Math.round(31 + ratio * 37);
  }

  const listeningScaled = calcSectionScaled(sections.listening);
  const structureScaled = calcSectionScaled(sections.structure);
  const readingScaled = calcSectionScaled(sections.reading);

  // Rumus Skor Total TOEFL ITP: ((Listening + Structure + Reading) * 10) / 3
  const rawTotalScore = Math.round(((listeningScaled + structureScaled + readingScaled) * 10) / 3);
  const totalScore = Math.max(310, Math.min(677, rawTotalScore));

  // Standar kelulusan: >= 450 Lulus, di bawah itu Belum Lulus
  const status = totalScore >= 450 ? 'Lulus' : 'Belum Lulus';

  return {
    totalScore,
    status,
    listeningScore: `${listeningScaled}/68`,
    structureScore: `${structureScaled}/68`,
    readingScore: `${readingScaled}/68`,
    correctCount: totalCorrectAll,
    totalQuestions: totalQuestionsAll
  };
}