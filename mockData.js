// ============================================
// DEK ALL — Centralized Mock Data
// Single source of truth for all role modules
// ============================================

export const RISK_LEVELS = {
    low: { label: 'ต่ำ', badge: 'badge-success', color: 'var(--success)' },
    medium: { label: 'ปานกลาง', badge: 'badge-warning', color: 'var(--warning)' },
    high: { label: 'สูง', badge: 'badge-danger', color: 'var(--danger)' },
};

export const users = {
    teacher: {
        id: 'U-T01',
        role: 'teacher',
        name: 'คุณครูซาราห์ เฉิน',
        email: 's.chen@dekall.edu',
        avatar: '👩‍🏫',
    },
    parent: {
        id: 'U-P01',
        role: 'parent',
        name: 'เดวิด ทอมป์สัน',
        email: 'd.thompson@email.com',
        avatar: '👨‍👦',
        childId: 'S001',
    },
    student: {
        id: 'S001',
        role: 'student',
        name: 'อเล็กซ์ ทอมป์สัน',
        email: 'alex.t@student.dekall.edu',
        avatar: '🧒',
    },
};

export const students = [
    {
        id: 'S001',
        name: 'อเล็กซ์ ทอมป์สัน',
        avatar: '🧒',
        grade: 'ชั้นประถมศึกษาปีที่ 3',
        age: 8,
        progress: 72,
        streak: 5,
        riskLevel: 'medium',
    },
    {
        id: 'S002',
        name: 'มายา พาเทล',
        avatar: '👧',
        grade: 'ชั้นประถมศึกษาปีที่ 3',
        age: 9,
        progress: 88,
        streak: 12,
        riskLevel: 'low',
    },
    {
        id: 'S003',
        name: 'จอร์แดน ลี',
        avatar: '🧑',
        grade: 'ชั้นประถมศึกษาปีที่ 4',
        age: 9,
        progress: 45,
        streak: 2,
        riskLevel: 'high',
    },
    {
        id: 'S004',
        name: 'เอ็มมา วิลสัน',
        avatar: '👩',
        grade: 'ชั้นประถมศึกษาปีที่ 3',
        age: 8,
        progress: 91,
        streak: 14,
        riskLevel: 'low',
    },
    {
        id: 'S005',
        name: 'โนอาห์ การ์เซีย',
        avatar: '👦',
        grade: 'ชั้นประถมศึกษาปีที่ 4',
        age: 10,
        progress: 58,
        streak: 3,
        riskLevel: 'medium',
    },
];

export const tasks = [
    {
        id: 'T001',
        title: 'การออกเสียง บทที่ 4 — เสียงผสม',
        type: '📖 การอ่าน',
        level: 'ป.3',
        dueDate: '2026-06-25',
        assigned: ['S001', 'S002', 'S004'],
        status: { S001: 'pending', S002: 'completed', S004: 'completed' },
    },
    {
        id: 'T002',
        title: 'ความเข้าใจเรื่องจำนวน — ค่าประจำหลัก',
        type: '🔢 คณิตศาสตร์',
        level: 'ป.3',
        dueDate: '2026-06-28',
        assigned: ['S001', 'S003', 'S005'],
        status: { S001: 'completed', S003: 'pending', S005: 'pending' },
    },
    {
        id: 'T003',
        title: 'ฝึกสมาธิ — ช่วงเวลาจดจ่อ',
        type: '🧠 การฝึกทักษะ',
        level: 'ทุกระดับ',
        dueDate: '2026-07-02',
        assigned: ['S003', 'S005'],
        status: { S003: 'pending', S005: 'pending' },
    },
    {
        id: 'T004',
        title: 'การเขียนสร้างสรรค์ — เรื่องราวฤดูร้อนของฉัน',
        type: '✏️ การเขียน',
        level: 'ป.3–4',
        dueDate: '2026-07-05',
        assigned: ['S001', 'S002', 'S003', 'S004', 'S005'],
        status: {
            S001: 'pending',
            S002: 'pending',
            S003: 'pending',
            S004: 'completed',
            S005: 'pending',
        },
    },
];

/** Progress over time for parent AI Insights line chart (linked child: S001) */
export const progressTimeline = {
    studentId: 'S001',
    labels: ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.'],
    overall: [48, 52, 58, 63, 68, 72],
    reading: [42, 48, 55, 60, 65, 70],
    math: [50, 53, 57, 62, 66, 74],
};

/** LD Screening summary for parent dashboard */
export const ldScreening = {
    studentId: 'S001',
    lastAssessed: '2026-06-12',
    overallStatus: 'review',
    confidence: 87,
    summary: 'การวิเคราะห์ด้วย AI พบว่าทักษะการประมวลผลเสียงยังมีช่องว่างเล็กน้อย ขณะที่ทักษะด้านมิติสัมพันธ์และการมองเห็นอยู่ในระดับดี',
    domains: [
        { name: 'การตระหนักรู้ด้านเสียง', score: 62, flag: 'medium', icon: '🔤' },
        { name: 'ความคล่องแคล่วในการอ่าน', score: 58, flag: 'medium', icon: '📖' },
        { name: 'ความจำใช้งาน', score: 71, flag: 'low', icon: '🧠' },
        { name: 'การใช้เหตุผลทางคณิตศาสตร์', score: 78, flag: 'low', icon: '🔢' },
        { name: 'สมาธิและการจดจ่อ', score: 55, flag: 'medium', icon: '🎯' },
    ],
    recommendations: [
        'ฝึกทักษะการออกเสียงอย่างเป็นระบบวันละ 15 นาที',
        'นัดประเมินติดตามผลอีกครั้งใน 6 สัปดาห์',
        'แบ่งปันผลการวิเคราะห์กับครูประจำชั้น',
    ],
};

/** AI insight snippets surfaced on the parent dashboard */
export const aiInsights = {
    studentId: 'S001',
    headline: 'พัฒนาการเรียนรู้โดยรวมมีแนวโน้มดีขึ้นอย่างต่อเนื่อง',
    trend: 'up',
    weeklyChange: '+4%',
    highlights: [
        { label: 'ทักษะที่โดดเด่น', value: 'การใช้เหตุผลทางคณิตศาสตร์', badge: 'badge-success' },
        { label: 'ทักษะที่ควรเน้น', value: 'ความคล่องแคล่วในการอ่าน', badge: 'badge-warning' },
        { label: 'ความต่อเนื่อง', value: 'เรียนต่อเนื่อง 5 วัน', badge: 'badge-info' },
    ],
};

/** Hybrid scan session metadata for student module */
export const scanSessions = {
    lastScan: null,
    todayCount: 0,
    dailyGoal: 3,
};

export function getStudentById(id) {
    return students.find(s => s.id === id) ?? null;
}

export function getRiskMeta(level) {
    return RISK_LEVELS[level] ?? RISK_LEVELS.low;
}

export function getTasksForStudent(studentId) {
    return tasks.filter(t => t.assigned.includes(studentId));
}
