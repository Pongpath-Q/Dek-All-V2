// ============================================
// DEK ALL — App Router & Shared State
// ============================================
import {
    users,
    students,
    tasks,
    progressTimeline,
    ldScreening,
    aiInsights,
    scanSessions,
} from './mockData.js';
import { renderTeacherDashboard } from './modules/teacher.js';
import { renderParentDashboard } from './modules/parent.js';
import { renderStudentDashboard } from './modules/student.js';
import { renderLogin } from './login.js';

function getSavedSession() {
    try {
        const session = JSON.parse(sessionStorage.getItem('dekall-session'));
        return session && users[session.role] ? session : null;
    } catch {
        return null;
    }
}

const savedSession = getSavedSession();

export const AppState = {
    isAuthenticated: Boolean(savedSession),
    currentRole: savedSession?.role ?? 'teacher',
    currentUser: { ...users[savedSession?.role ?? 'teacher'] },
    students: [...students],
    tasks: [...tasks],
    progressTimeline: { ...progressTimeline },
    ldScreening: { ...ldScreening, domains: [...ldScreening.domains], recommendations: [...ldScreening.recommendations] },
    aiInsights: { ...aiInsights, highlights: [...aiInsights.highlights] },
    scanSessions: { ...scanSessions },
};

const ROLE_DEFAULTS = {
    teacher: 'teacher',
    parent: 'parent',
    student: 'student',
};

const ROLE_RENDERERS = {
    teacher: renderTeacherDashboard,
    parent: renderParentDashboard,
    student: renderStudentDashboard,
};

/** Teacher-only tabs that map to teacher renderer */
const TEACHER_TABS = new Set(['teacher', 'tasks', 'shared', 'my-class', 'reports', 'library']);
const PARENT_TABS = new Set(['parent', 'screening', 'progress', 'shared', 'messages']);
const STUDENT_TABS = new Set(['student', 'tasks', 'rewards', 'profile']);

let activeRoute = savedSession?.role ?? 'teacher';

export function navigate(route) {
    if (ROLE_DEFAULTS[route]) {
        AppState.currentRole = route;
        AppState.currentUser = { ...users[route] };
        activeRoute = ROLE_DEFAULTS[route];
    } else {
        activeRoute = route;
    }
    render();
}

function resolveTab() {
    const role = AppState.currentRole;
    if (role === 'teacher' && !TEACHER_TABS.has(activeRoute)) activeRoute = 'teacher';
    if (role === 'parent' && !PARENT_TABS.has(activeRoute)) activeRoute = 'parent';
    if (role === 'student' && !STUDENT_TABS.has(activeRoute)) activeRoute = 'student';
    return activeRoute;
}

function render() {
    const container = document.getElementById('app');
    if (!container) return;

    if (!AppState.isAuthenticated) {
        renderLogin(container, login);
        return;
    }

    const tab = resolveTab();
    const renderer = ROLE_RENDERERS[AppState.currentRole];
    if (renderer) renderer(container, tab);
}

function login(role) {
    AppState.isAuthenticated = true;
    AppState.currentRole = role;
    AppState.currentUser = { ...users[role] };
    activeRoute = ROLE_DEFAULTS[role];
    render();
}

function logout() {
    sessionStorage.removeItem('dekall-session');
    AppState.isAuthenticated = false;
    activeRoute = 'teacher';
    render();
}

window.addEventListener('dekall-navigate', (e) => navigate(e.detail));
window.addEventListener('dekall-logout', logout);
document.addEventListener('DOMContentLoaded', () => render());
