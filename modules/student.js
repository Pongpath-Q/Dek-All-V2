// ============================================
// STUDENT DASHBOARD
// Hybrid Scanning + Task Overview + Rewards
// ============================================
import { AppState, navigate } from '../app.js';
import { buildShell } from '../utils/shell.js';
import { showToast } from '../utils/toast.js';
import { getRiskMeta, getTasksForStudent } from '../mockData.js';

const NAV = [
    { section: 'การเรียนรู้' },
    { id: 'student', icon: '📷', label: 'สแกนใบงาน' },
    { id: 'tasks', icon: '📋', label: 'งานของฉัน', badge: null },
    { section: 'ความก้าวหน้า' },
    { id: 'rewards', icon: '🏆', label: 'รางวัล' },
    { id: 'profile', icon: '👤', label: 'โปรไฟล์ของฉัน' },
];

export function renderStudentDashboard(container, activeTab = 'student') {
    const user = AppState.currentUser;
    const profile = AppState.students.find(s => s.id === user.id) ?? AppState.students[0];
    const myTasks = getTasksForStudent(profile.id);
    const pendingCount = myTasks.filter(t => t.status[profile.id] === 'pending').length;
    const completedCount = myTasks.filter(t => t.status[profile.id] === 'completed').length;
    const risk = getRiskMeta(profile.riskLevel);
    const scanMeta = AppState.scanSessions;

    // Inject live pending badge into nav
    const navItems = NAV.map(item =>
        item.id === 'tasks' ? { ...item, badge: pendingCount || null } : item
    );

    let pageTitle = 'พื้นที่สำหรับนักเรียน';
    let pageSubtitle = `สวัสดี ${profile.name.split(' ')[0]} — พร้อมเรียนรู้หรือยัง?`;
    let bodyHTML = '';

    // ──────────────────────────────────────────
    // TAB: HYBRID SCAN (home)
    // ──────────────────────────────────────────
    if (activeTab === 'student') {
        bodyHTML = `
      <!-- HERO BANNER -->
      <div class="welcome-banner anim-slide-up" style="margin-bottom:var(--space-8);">
        <div class="welcome-text">
          <h2>สแกนใบงานอัจฉริยะ 📷</h2>
          <p>วางใบงานให้อยู่ในกรอบกล้องด้านล่าง ระบบ AI จะอ่าน ตรวจคะแนน และบันทึกความก้าวหน้าให้ทันที</p>
          <div style="margin-top:var(--space-4);display:flex;gap:var(--space-3);flex-wrap:wrap;">
            <span class="badge badge-info">วันนี้สแกน ${scanMeta.todayCount}/${scanMeta.dailyGoal} ครั้ง</span>
            <span class="badge ${risk.badge}">ความก้าวหน้า ${profile.progress}%</span>
          </div>
        </div>
        <div class="welcome-emoji">📄</div>
      </div>

      <!-- SCAN INTERFACE -->
      <div class="card anim-slide-up" style="animation-delay:0.15s;max-width:560px;margin:0 auto var(--space-8);">
        <div class="card-header" style="justify-content:center;">
          <span style="font-weight:700;color:var(--navy-900);">📷 สแกนใบงานของคุณ</span>
        </div>
        <div style="padding:var(--space-6) var(--space-5);display:flex;flex-direction:column;align-items:center;gap:var(--space-6);">
          <!-- Camera Frame -->
          <div class="scan-camera-frame" id="scanFrame">
            <div class="scan-corner scan-corner-tl"></div>
            <div class="scan-corner scan-corner-tr"></div>
            <div class="scan-corner scan-corner-bl"></div>
            <div class="scan-corner scan-corner-br"></div>
            <div class="scan-line" id="scanLine"></div>
            <div class="scan-frame-inner">
              <div style="font-size:48px;opacity:0.35;margin-bottom:var(--space-3);">📄</div>
              <div style="font-size:var(--text-sm);color:var(--slate-500);text-align:center;line-height:1.5;">
                จัดใบงานให้อยู่ภายในกรอบ<br>
                <span style="font-size:var(--text-xs);color:var(--slate-400);">แสงสว่างที่เหมาะสมช่วยให้สแกนได้แม่นยำขึ้น</span>
              </div>
            </div>
            <div class="scan-status hidden" id="scanStatus">กำลังสแกน…</div>
          </div>
          <button class="btn btn-primary" id="scanBtn" style="min-width:200px;padding:var(--space-4) var(--space-8);font-size:var(--text-base);">
            📷 สแกนตอนนี้
          </button>
          <p style="font-size:var(--text-xs);color:var(--slate-500);text-align:center;margin:0;">
            ระบบผสานการถ่ายภาพกับ OCR บนอุปกรณ์ เพื่อการสแกนที่รวดเร็วและเป็นส่วนตัว
          </p>
        </div>
      </div>

      <!-- QUICK STATS -->
      <div class="grid grid-3 anim-slide-up" style="animation-delay:0.25s;">
        <div class="stat-card">
          <div class="stat-icon" style="background:#FFF0E6;">🔥</div>
          <div class="stat-value">${profile.streak}</div>
          <div class="stat-label">เรียนต่อเนื่อง</div>
          <div class="stat-trend trend-up">↑ ทำต่อไปนะ!</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background:#DBEAFE;">📋</div>
          <div class="stat-value">${pendingCount}</div>
          <div class="stat-label">งานที่ยังไม่เสร็จ</div>
          <div class="stat-trend">${pendingCount > 0 ? 'อย่าลืมทำงานนะ!' : 'ทำครบแล้ว! 🎉'}</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background:#D1FAE5;">✅</div>
          <div class="stat-value">${profile.progress}%</div>
          <div class="stat-label">ความก้าวหน้าโดยรวม</div>
          <div class="stat-trend trend-up">↑ ทำเสร็จแล้ว ${completedCount} งาน</div>
        </div>
      </div>
    `;

    // ──────────────────────────────────────────
    // TAB: MY TASKS
    // ──────────────────────────────────────────
    } else if (activeTab === 'tasks') {
        pageTitle = 'งานของฉัน';
        pageSubtitle = 'งานที่ได้รับมอบหมายจากครู';
        bodyHTML = `
      <div class="card anim-slide-up" style="animation-delay:0.1s;margin-bottom:var(--space-8);">
        <div class="card-header">
          <span style="font-weight:700;color:var(--navy-900);">📋 งานที่ได้รับมอบหมาย</span>
          <div style="display:flex;gap:var(--space-2);">
            <span class="badge badge-warning">รอทำ ${pendingCount}</span>
            <span class="badge badge-success">เสร็จแล้ว ${completedCount}</span>
          </div>
        </div>
        <div style="padding:var(--space-5);display:flex;flex-direction:column;gap:var(--space-4);">
          ${myTasks.length === 0
            ? `<p style="color:var(--slate-500);font-size:var(--text-sm);text-align:center;padding:var(--space-8);">ยังไม่มีงานที่ได้รับมอบหมาย กลับมาตรวจสอบภายหลังได้เลย!</p>`
            : myTasks.map(t => {
                const done = t.status[profile.id] === 'completed';
                return `
                  <div style="display:flex;align-items:center;justify-content:space-between;padding:var(--space-4);background:var(--slate-50);border-radius:var(--radius-lg);border-left:4px solid ${done ? 'var(--success)' : 'var(--accent)'};">
                    <div>
                      <div style="font-weight:700;color:var(--navy-900);font-size:var(--text-sm);">${t.title}</div>
                      <div style="font-size:var(--text-xs);color:var(--slate-500);margin-top:2px;">
                        ${t.type} &nbsp;·&nbsp; กำหนดส่ง ${t.dueDate}
                      </div>
                    </div>
                    <div style="display:flex;gap:var(--space-3);align-items:center;flex-shrink:0;">
                      <span class="badge ${done ? 'badge-success' : 'badge-warning'}">${done ? '✅ เสร็จแล้ว' : '⏳ รอทำ'}</span>
                      ${!done ? `<button class="btn btn-primary btn-sm scan-task-btn" data-title="${t.title}">📷 สแกน</button>` : ''}
                    </div>
                  </div>
                `;
              }).join('')
          }
        </div>
      </div>
    `;

    // ──────────────────────────────────────────
    // TAB: REWARDS
    // ──────────────────────────────────────────
    } else if (activeTab === 'rewards') {
        pageTitle = 'รางวัล';
        pageSubtitle = 'รับเหรียญรางวัลจากการทำงานและการสแกนให้สำเร็จ';

        const badges = [
            {
                emoji: '🔥',
                name: 'ดาวแห่งความต่อเนื่อง',
                desc: `เรียนต่อเนื่อง ${profile.streak} วัน`,
                unlocked: profile.streak >= 3,
                badge: 'badge-success',
            },
            {
                emoji: '📷',
                name: 'นักสแกนมือทอง',
                desc: `วันนี้สแกน ${scanMeta.todayCount}/${scanMeta.dailyGoal} ครั้ง`,
                unlocked: scanMeta.todayCount >= scanMeta.dailyGoal,
                badge: 'badge-warning',
            },
            {
                emoji: '🌟',
                name: 'ยอดนักเรียนรู้',
                desc: `ความก้าวหน้าโดยรวม ${profile.progress}%`,
                unlocked: profile.progress >= 70,
                badge: 'badge-info',
            },
            {
                emoji: '✅',
                name: 'แชมป์ทำงาน',
                desc: `ทำเสร็จแล้ว ${completedCount} งาน`,
                unlocked: completedCount >= 2,
                badge: 'badge-success',
            },
            {
                emoji: '🧠',
                name: 'ฮีโร่ผู้มีสมาธิ',
                desc: 'ทำงานฝึกทักษะให้สำเร็จ',
                unlocked: myTasks.some(t => t.type.includes('การฝึกทักษะ') && t.status[profile.id] === 'completed'),
                badge: 'badge-info',
            },
            {
                emoji: '📖',
                name: 'หนอนหนังสือ',
                desc: 'ทำงานอ่านให้สำเร็จ',
                unlocked: myTasks.some(t => t.type.includes('การอ่าน') && t.status[profile.id] === 'completed'),
                badge: 'badge-warning',
            },
        ];

        bodyHTML = `
      <!-- PROGRESS SUMMARY -->
      <div class="card anim-slide-up" style="margin-bottom:var(--space-6);">
        <div class="card-header">
          <span style="font-weight:700;color:var(--navy-900);">🏆 ความคืบหน้าเหรียญรางวัล</span>
          <span class="badge badge-info">ปลดล็อก ${badges.filter(b => b.unlocked).length}/${badges.length}</span>
        </div>
        <div style="padding:var(--space-4) var(--space-5);">
          <div style="display:flex;justify-content:space-between;margin-bottom:var(--space-2);">
            <span style="font-size:var(--text-xs);color:var(--slate-500);">ความคืบหน้าการสะสม</span>
            <span style="font-size:var(--text-xs);font-weight:700;color:var(--navy-900);">${Math.round((badges.filter(b => b.unlocked).length / badges.length) * 100)}%</span>
          </div>
          <div class="progress-track">
            <div class="progress-fill" style="width:${Math.round((badges.filter(b => b.unlocked).length / badges.length) * 100)}%;background:var(--accent);"></div>
          </div>
        </div>
      </div>

      <!-- BADGE GRID -->
      <div class="grid grid-3 anim-slide-up" style="animation-delay:0.1s;">
        ${badges.map((b, i) => `
          <div class="card" style="padding:var(--space-5);text-align:center;animation-delay:${0.1 + i * 0.05}s;opacity:${b.unlocked ? 1 : 0.5};">
            <div style="font-size:40px;margin-bottom:var(--space-3);${b.unlocked ? '' : 'filter:grayscale(1);'}">${b.emoji}</div>
            <div style="font-weight:700;color:var(--navy-900);font-size:var(--text-sm);">${b.name}</div>
            <div style="font-size:var(--text-xs);color:var(--slate-500);margin-top:var(--space-1);">${b.desc}</div>
            <span class="badge ${b.unlocked ? b.badge : 'badge-info'}" style="margin-top:var(--space-3);">${b.unlocked ? 'ปลดล็อกแล้ว 🎉' : 'ยังล็อกอยู่ 🔒'}</span>
          </div>
        `).join('')}
      </div>
    `;

    // ──────────────────────────────────────────
    // TAB: MY PROFILE
    // ──────────────────────────────────────────
    } else if (activeTab === 'profile') {
        pageTitle = 'โปรไฟล์ของฉัน';
        pageSubtitle = 'ข้อมูลการเรียนรู้และสรุปความก้าวหน้าของคุณ';
        bodyHTML = `
      <!-- PROFILE CARD -->
      <div class="card anim-slide-up" style="margin-bottom:var(--space-6);">
        <div class="card-header">
          <span style="font-weight:700;color:var(--navy-900);">👤 ${profile.name}</span>
          <span class="badge ${risk.badge}">ความเสี่ยง${risk.label}</span>
        </div>
        <div style="padding:var(--space-5);">
          <div style="display:flex;align-items:center;gap:var(--space-5);margin-bottom:var(--space-6);">
            <div style="width:72px;height:72px;border-radius:50%;background:var(--navy-100);display:flex;align-items:center;justify-content:center;font-size:36px;">${profile.avatar}</div>
            <div>
              <div style="font-weight:700;color:var(--navy-900);font-size:var(--text-lg);">${profile.name}</div>
              <div style="font-size:var(--text-sm);color:var(--slate-500);">${profile.grade} · อายุ ${profile.age} ปี</div>
              <div style="font-size:var(--text-xs);color:var(--slate-400);margin-top:2px;">${user.email}</div>
            </div>
          </div>
          <div style="margin-bottom:var(--space-5);">
            <div style="display:flex;justify-content:space-between;margin-bottom:var(--space-2);">
              <span style="font-size:var(--text-xs);color:var(--slate-500);">ความก้าวหน้าโดยรวม</span>
              <span style="font-size:var(--text-xs);font-weight:700;color:var(--navy-900);">${profile.progress}%</span>
            </div>
            <div class="progress-track">
              <div class="progress-fill" style="width:${profile.progress}%;background:${risk.color};"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- STATS STRIP -->
      <div class="grid grid-3 anim-slide-up" style="animation-delay:0.1s;margin-bottom:var(--space-6);">
        <div class="stat-card">
          <div class="stat-icon" style="background:#FFF0E6;">🔥</div>
          <div class="stat-value">${profile.streak}</div>
          <div class="stat-label">เรียนต่อเนื่อง</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background:#D1FAE5;">✅</div>
          <div class="stat-value">${completedCount}</div>
          <div class="stat-label">งานที่ทำเสร็จ</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background:#DBEAFE;">📷</div>
          <div class="stat-value">${scanMeta.todayCount}</div>
          <div class="stat-label">สแกนวันนี้</div>
        </div>
      </div>

      <!-- LEARNING GOALS -->
      <div class="card anim-slide-up" style="animation-delay:0.2s;">
        <div class="card-header">
          <span style="font-weight:700;color:var(--navy-900);">🎯 เป้าหมายประจำวัน</span>
        </div>
        <div style="padding:var(--space-5);display:flex;flex-direction:column;gap:var(--space-4);">
          ${[
            { label: 'เป้าหมายการสแกนประจำวัน', current: scanMeta.todayCount, goal: scanMeta.dailyGoal, icon: '📷', color: 'var(--accent)' },
            { label: 'การทำงานให้เสร็จ', current: completedCount, goal: myTasks.length, icon: '📋', color: 'var(--success)' },
            { label: 'เป้าหมายเรียนต่อเนื่อง', current: profile.streak, goal: 7, icon: '🔥', color: 'var(--warning)' },
          ].map(g => {
            const pct = Math.min(Math.round((g.current / g.goal) * 100), 100);
            return `
              <div>
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-2);">
                  <div style="display:flex;align-items:center;gap:var(--space-2);">
                    <span>${g.icon}</span>
                    <span style="font-size:var(--text-sm);font-weight:700;color:var(--navy-900);">${g.label}</span>
                  </div>
                  <span style="font-size:var(--text-xs);color:var(--slate-500);">${g.current}/${g.goal}</span>
                </div>
                <div class="progress-track">
                  <div class="progress-fill" style="width:${pct}%;background:${g.color};"></div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
    }

    buildShell(container, {
        role: 'student',
        user: profile,
        navItems,
        activeItem: activeTab,
        pageTitle,
        pageSubtitle,
        bodyHTML,
    });

    setupStudentEvents(profile);
}

// ──────────────────────────────────────────
// SCAN LOGIC + EVENT WIRING
// ──────────────────────────────────────────
function setupStudentEvents(profile) {
    const scanBtn = document.getElementById('scanBtn');
    const scanFrame = document.getElementById('scanFrame');
    const scanLine = document.getElementById('scanLine');
    const scanStatus = document.getElementById('scanStatus');
    let scanning = false;

    const runScan = (taskTitle = null) => {
        if (scanning) return;
        scanning = true;

        scanFrame?.classList.add('scanning');
        scanLine?.classList.add('active');
        scanStatus?.classList.remove('hidden');
        if (scanBtn) { scanBtn.disabled = true; scanBtn.textContent = '⏳ กำลังสแกน…'; }

        setTimeout(() => {
            scanFrame?.classList.remove('scanning');
            scanLine?.classList.remove('active');
            scanStatus?.classList.add('hidden');
            if (scanBtn) { scanBtn.disabled = false; scanBtn.textContent = '📷 สแกนตอนนี้'; }
            scanning = false;

            AppState.scanSessions.todayCount = Math.min(
                AppState.scanSessions.todayCount + 1,
                AppState.scanSessions.dailyGoal
            );
            AppState.scanSessions.lastScan = new Date().toISOString();

            showToast(
                'สแกนสำเร็จ ✅',
                taskTitle
                    ? `สแกนและส่งงาน "${taskTitle}" เรียบร้อยแล้ว`
                    : 'สแกนใบงานเรียบร้อยแล้ว ระบบ AI ตรวจคะแนนเสร็จสมบูรณ์',
                'success'
            );
        }, 1800);
    };

    // Main scan button
    scanBtn?.addEventListener('click', () => runScan());

    // Per-task scan buttons in the tasks tab
    document.querySelectorAll('.scan-task-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            navigate('student'); // Go to scan tab first
            setTimeout(() => runScan(btn.dataset.title), 300);
        });
    });
}
