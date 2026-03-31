// --- FULL APPLICATION LOGIC ---
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. SETTINGS & LOCAL STORAGE PERSISTENCE ---
    const strictnessSlider = document.getElementById('setting-strictness');
    const remindersToggle = document.getElementById('setting-reminders');
    const githubBtn = document.getElementById('setting-github-btn');
    const saveSettingsBtn = document.getElementById('save-settings-btn');
    const settingsSavedTxt = document.getElementById('settings-saved-txt');

    if(localStorage.getItem('aiMentorStrictness') && strictnessSlider) {
        strictnessSlider.value = localStorage.getItem('aiMentorStrictness');
    }
    if(localStorage.getItem('aiPushReminders') !== null && remindersToggle) {
        remindersToggle.checked = localStorage.getItem('aiPushReminders') === 'true';
    }
    if(localStorage.getItem('aiGithubConnected') === 'true' && githubBtn) {
        githubBtn.innerText = 'Connected';
        githubBtn.classList.replace('secondary-btn', 'primary-btn');
    }

    if(githubBtn) {
        githubBtn.addEventListener('click', () => {
            if(githubBtn.innerText === 'Connect') {
                githubBtn.innerHTML = '<i class="ph ph-spinner-gap spin-anim"></i>';
                setTimeout(() => {
                    githubBtn.innerText = 'Connected';
                    githubBtn.classList.replace('secondary-btn', 'primary-btn');
                    localStorage.setItem('aiGithubConnected', 'true');
                }, 800);
            } else {
                githubBtn.innerText = 'Connect';
                githubBtn.classList.replace('primary-btn', 'secondary-btn');
                localStorage.setItem('aiGithubConnected', 'false');
            }
        });
    }

    if(saveSettingsBtn) {
        saveSettingsBtn.addEventListener('click', () => {
            localStorage.setItem('aiMentorStrictness', strictnessSlider.value);
            localStorage.setItem('aiPushReminders', remindersToggle.checked.toString());
            
            saveSettingsBtn.innerHTML = '<i class="ph ph-spinner-gap spin-anim"></i> Saving...';
            setTimeout(() => {
                saveSettingsBtn.innerHTML = '<i class="ph-bold ph-check"></i> Configuration Saved';
                settingsSavedTxt.classList.remove('hidden');
                setTimeout(() => {
                    saveSettingsBtn.innerHTML = '<i class="ph-bold ph-floppy-disk"></i> Save Configuration';
                    settingsSavedTxt.classList.add('hidden');
                }, 2000);
            }, 600);
        });
    }

    // --- 2. SPA NAVIGATION ---
    const navLinks = document.querySelectorAll('.nav-links li:not(.sidebar-hidden-link)');
    const pages = document.querySelectorAll('.page-section');

    function navigateToPage(targetId) {
        navLinks.forEach(l => l.classList.remove('active'));
        pages.forEach(p => p.classList.remove('active-page'));
        
        const activeLink = document.querySelector(`.nav-links li[data-target="${targetId}"]`);
        if(activeLink) activeLink.classList.add('active');
        
        const page = document.getElementById(targetId);
        if(page) {
            page.classList.add('active-page');
            window.scrollTo(0,0);
        }

        if(targetId === 'page-skills') initLargeRadar();
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => navigateToPage(link.getAttribute('data-target')));
    });

    // --- 3. TOAST NOTIFICATION SYSTEM ---
    const toastContainer = document.getElementById('toast-container');
    const dummyNotifications = [
        { type: 'info', icon: 'ph-fill ph-bell-ringing', title: 'Upcoming Session', msg: 'System Design Mock Interview starts in 15 minutes. Prepare your architecture diagrams.' },
        { type: 'success', icon: 'ph-fill ph-trend-up', title: 'Market Analyst Alert', msg: 'Top Trending Skill: RAG (Retrieval-Augmented Gen). Demand spiked +142%.' },
        { type: 'warning', icon: 'ph-fill ph-warning-circle', title: 'Performance Decay', msg: 'You haven\'t solved an Advanced Graph Algorithm problem in 4 days.' }
    ];

    function createToast(notif) {
        if(remindersToggle && remindersToggle.checked === false) return;

        const toast = document.createElement('div');
        toast.className = `toast ${notif.type}`;
        toast.innerHTML = `
            <div class="toast-icon"><i class="${notif.icon}"></i></div>
            <div class="toast-content w-full">
                <div class="flex-between"><h4>${notif.title}</h4> <i class="ph-bold ph-x text-muted" style="cursor:pointer" onclick="this.parentElement.parentElement.parentElement.remove()"></i></div>
                <p>${notif.msg}</p>
            </div>
        `;
        toastContainer.appendChild(toast);
        
        setTimeout(() => {
            if(toast.parentElement) {
                toast.classList.add('toast-disappear');
                setTimeout(() => toast.remove(), 400);
            }
        }, 8000);
    }

    setInterval(() => {
        const randomNotif = dummyNotifications[Math.floor(Math.random() * dummyNotifications.length)];
        createToast(randomNotif);
    }, 45000);

    // --- 4. GLOBAL SEARCH: AI PLAN GENERATION ---
    const searchInput = document.getElementById('global-search');
    const searchModal = document.getElementById('search-modal');
    const searchQueryText = document.getElementById('search-query-text');
    const generatedPathContainer = document.getElementById('generated-search-path');
    const addPathBtn = document.getElementById('add-path-btn');
    const mainPlannerList = document.getElementById('main-planner-list');

    if(searchInput) {
        searchInput.addEventListener('keydown', (e) => {
            if(e.key === 'Enter' && searchInput.value.trim().length > 0) {
                const query = searchInput.value;
                searchInput.blur();
                
                searchQueryText.innerText = query;
                generatedPathContainer.innerHTML = `<div class="text-center p-4"><i class="ph ph-spinner-gap spin-anim massive-icon text-primary"></i><p>Synthesizing nodes for "${query}"...</p></div>`;
                searchModal.classList.remove('hidden');

                setTimeout(() => {
                    generatedPathContainer.innerHTML = `
                        <div class="task-row pending bg-darker mb-2">
                            <div class="time">Step 1</div>
                            <div class="info"><h4>Read Core Documentation</h4><p>Extract mental models mapping ${query} to your existing knowledge.</p></div>
                        </div>
                        <div class="task-row pending bg-darker mb-2">
                            <div class="time">Step 2</div>
                            <div class="info"><h4>Build Minimum Viable Concept</h4><p>Implement a single end-to-end flow without advanced abstraction.</p></div>
                        </div>
                        <div class="task-row active glow-border bg-darker">
                            <div class="time">Step 3</div>
                            <div class="info"><h4>AI Stress Test</h4><p>Run your implementation against the Neural Code Review Engine.</p></div>
                        </div>
                    `;
                }, 1800);
            }
        });
    }

    if(addPathBtn) {
        addPathBtn.addEventListener('click', () => {
            searchModal.classList.add('hidden');
            const queryName = searchInput.value;
            searchInput.value = '';
            createToast({ type: 'success', icon: 'ph-fill ph-check-circle', title: 'Plan Ingested', msg: 'New AI nodes added to your Auto-Planner pipeline.' });
            
            if(mainPlannerList) {
                mainPlannerList.insertAdjacentHTML('beforeend', `
                    <div class="task-row pending">
                        <div class="time">NEW</div>
                        <div class="info"><h4>Master ${queryName}</h4><p>Custom generated learning path.</p></div>
                        <div class="status">Scheduled</div>
                    </div>
                `);
            }
            navigateToPage('page-planner');
        });
    }

    // --- 5. START SESSION MODAL ROUTING ---
    const startSessionBtn = document.getElementById('start-session-btn');
    const sessionModal = document.getElementById('session-modal');
    
    if(startSessionBtn) startSessionBtn.addEventListener('click', () => sessionModal.classList.remove('hidden'));

    const btnModeCode = document.getElementById('btn-mode-code');
    const btnModeMock = document.getElementById('btn-mode-mock');
    const btnModeTheory = document.getElementById('btn-mode-theory');
    
    if(btnModeCode) {
        btnModeCode.addEventListener('click', () => {
            sessionModal.classList.add('hidden');
            navigateToPage('page-code-review');
        });
    }

    if(btnModeMock) {
        btnModeMock.addEventListener('click', () => {
            sessionModal.classList.add('hidden');
            navigateToPage('page-mock');
        });
    }

    if(btnModeTheory) {
        btnModeTheory.addEventListener('click', () => {
            sessionModal.classList.add('hidden');
            navigateToPage('page-theory');
        });
    }

    const endCodeSession = document.getElementById('end-code-session');
    if(endCodeSession) {
        endCodeSession.addEventListener('click', () => {
            navigateToPage('page-dashboard');
            createToast({ type: 'info', icon: 'ph-fill ph-code', title: 'Session Terminated', msg: 'Code Review logs saved to memory.' });
        });
    }

    // --- 6. STANDARD MODAL CLOSERS ---
    const settingsBtn = document.getElementById('settings-btn');
    const settingsModal = document.getElementById('settings-modal');

    if(settingsBtn) settingsBtn.addEventListener('click', () => settingsModal.classList.remove('hidden'));

    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => {
            if(sessionModal) sessionModal.classList.add('hidden');
            if(settingsModal) settingsModal.classList.add('hidden');
            if(searchModal) searchModal.classList.add('hidden');
        });
    });

    document.addEventListener('click', (e) => {
        if(sessionModal && e.target === sessionModal) sessionModal.classList.add('hidden');
        if(settingsModal && e.target === settingsModal) settingsModal.classList.add('hidden');
        if(searchModal && e.target === searchModal) searchModal.classList.add('hidden');
    });

    // --- 7. NOTIF DROPDOWN (Top Right) ---
    const notifBtn = document.getElementById('notif-btn');
    const notifDropdown = document.getElementById('notif-dropdown');
    
    if(notifBtn && notifDropdown) {
        notifBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            notifDropdown.classList.toggle('show');
        });

        document.addEventListener('click', (e) => {
            if (!notifDropdown.contains(e.target) && !notifBtn.contains(e.target)) {
                notifDropdown.classList.remove('show');
            }
        });
    }

    // --- 8. THEORY MODULE CHAT LOGIC ---
    const theoryInput = document.getElementById('theory-input');
    const theorySendBtn = document.getElementById('theory-send-btn');
    const theoryChatHistory = document.getElementById('theory-chat-history');

    function sendTheoryMessage() {
        const text = theoryInput.value.trim();
        if(!text) return;
        
        theoryInput.value = '';
        
        // Add User Message HTML
        const userMsg = document.createElement('div');
        userMsg.className = 'user-msg text-right mb-4';
        userMsg.innerHTML = `<div class="inline-block bg-primary text-dark p-3 rounded" style="background:var(--primary); color:#000; border-radius:12px 12px 0 12px; font-weight:500; font-size:14px; display:inline-block;">"${text}"</div>`;
        theoryChatHistory.appendChild(userMsg);
        theoryChatHistory.scrollTop = theoryChatHistory.scrollHeight;

        // Simulate AI Thinking
        const aiThinking = document.createElement('div');
        aiThinking.className = 'ai-msg mb-4';
        aiThinking.innerHTML = `
            <div class="flex gap-2">
                <div class="avatar-ai" style="min-width:40px;"><i class="ph-fill ph-chalkboard-teacher text-success"></i></div>
                <div class="bg-gray p-4 rounded border-item" style="background:#111; border-radius:12px 12px 12px 0; font-size:14px; color:var(--text-muted);">
                    <i class="ph ph-spinner-gap spin-anim" style="font-size:20px;"></i> Pacing the chalkboard...
                </div>
            </div>`;
        theoryChatHistory.appendChild(aiThinking);
        theoryChatHistory.scrollTop = theoryChatHistory.scrollHeight;

        // Provide Fake Final Response Let's be generic about architecture
        setTimeout(() => {
            aiThinking.remove();
            const aiMsg = document.createElement('div');
            aiMsg.className = 'ai-msg mb-4';
            aiMsg.style.maxWidth = '85%';
            aiMsg.innerHTML = `
                <div class="flex gap-2">
                    <div class="avatar-ai" style="min-width:40px;"><i class="ph-fill ph-chalkboard-teacher text-success"></i></div>
                    <div class="bg-gray p-4 rounded border-item" style="background:#111; border-radius:12px 12px 12px 0; font-size:14px; line-height:1.6; color:var(--text-muted);">
                        <p class="font-bold text-main mb-2">Great point.</p>
                        <p class="mb-3">To address that directly, think of it conceptually like a Library. If everyone wants the same completely new book, the librarian creates a waitlist (a Message Queue) preventing the library desk from catching on fire.</p>
                        <pre class="font-mono text-xs bg-dark p-3 rounded border-item" style="background:#050505; color:#a1a1aa; line-height: 1.4; overflow-x:auto;">
[Users] -> [API Gateway] -> [Message Queue (Kafka)] -> [Async Workers]
                        </pre>
                        <p class="mt-3">The queue absorbs the pressure, and workers process data at their own optimal pace.</p>
                    </div>
                </div>
            `;
            theoryChatHistory.appendChild(aiMsg);
            theoryChatHistory.scrollTop = theoryChatHistory.scrollHeight;
        }, 1500);
    }

    if(theorySendBtn) theorySendBtn.addEventListener('click', sendTheoryMessage);
    if(theoryInput) theoryInput.addEventListener('keydown', (e) => {
        if(e.key === 'Enter') sendTheoryMessage();
    });

    // --- 9. MISC INTERACTIVE DEMOS ---
    const dropZone = document.getElementById('drop-zone');
    if(dropZone) {
        dropZone.addEventListener('click', () => {
            document.getElementById('resume-loader').classList.remove('hidden');
            dropZone.querySelector('h3').classList.add('hidden');
            dropZone.querySelector('p').classList.add('hidden');
            dropZone.querySelector('button').classList.add('hidden');
            dropZone.querySelector('.massive-icon').classList.add('hidden');
            setTimeout(() => {
                dropZone.classList.add('hidden');
                document.getElementById('resume-results').classList.remove('hidden');
            }, 2000);
        });
    }

    const analyzeBtn = document.getElementById('analyze-btn');
    const profileResults = document.getElementById('profile-results');
    const competitorUrlInput = document.getElementById('competitor-url');

    if(analyzeBtn) {
        analyzeBtn.addEventListener('click', () => {
            const url = competitorUrlInput.value || 'target-candidate';
            analyzeBtn.innerHTML = '<i class="ph ph-spinner-gap spin-anim"></i>';
            setTimeout(() => {
                analyzeBtn.innerHTML = '<i class="ph-bold ph-check"></i> Scraped';
                document.querySelector('.target-name').innerText = url;
                profileResults.classList.remove('hidden');
            }, 1000);
        });
    }

    const tasks = document.querySelectorAll('.task');
    tasks.forEach(task => {
        task.addEventListener('click', () => {
            if(task.classList.contains('active')) {
                task.classList.remove('active', 'glow-border');
                task.classList.add('completed');
                const icon = task.querySelector('.check-icon i');
                if(icon) {
                    icon.className = 'ph-fill ph-check-circle';
                    icon.style.color = 'var(--success)';
                }
            }
        });
    });

    // --- 10. CHARTS ---
    Chart.defaults.color = "rgba(255,255,255,0.6)";
    const ctxSmallElement = document.getElementById('skillsRadarChart');
    if(ctxSmallElement) {
        const ctxSmall = ctxSmallElement.getContext('2d');
        const radarData = {
            labels: ['Backend', 'System Design', 'ML / AI', 'DevOps/Cloud', 'Data Structs'],
            datasets: [
                { label: 'You', data: [85, 30, 40, 45, 90], backgroundColor: 'rgba(0, 112, 243, 0.2)', borderColor: 'rgba(0, 112, 243, 0.8)', borderWidth: 2 },
                { label: 'Requirements', data: [90, 85, 40, 75, 80], backgroundColor: 'transparent', borderColor: 'rgba(255, 255, 255, 0.4)', borderWidth: 1.5, borderDash: [5, 5] }
            ]
        };
        const radarOptions = { responsive: true, maintainAspectRatio: false, scales: { r: { angleLines: { color: 'rgba(255, 255, 255, 0.1)' }, grid: { color: 'rgba(255, 255, 255, 0.05)' }, pointLabels: { font: { size: 10 } }, ticks: { display: false, min: 0, max: 100 } } }, plugins: { legend: { position: 'bottom' } } };
        new Chart(ctxSmall, { type: 'radar', data: radarData, options: radarOptions });

        window.radarData = radarData;
        window.radarOptions = radarOptions;
    }

    let largeRadarChart = null;
    window.initLargeRadar = function() {
        const ctxLarge = document.getElementById('skillsRadarChartLarge');
        if(!ctxLarge) return;
        if(largeRadarChart) largeRadarChart.destroy();
        largeRadarChart = new Chart(ctxLarge.getContext('2d'), { type: 'radar', data: window.radarData, options: { ...window.radarOptions, scales: { r: { ...window.radarOptions.scales.r, pointLabels: { font: { size: 13 } } } } } });
    };

});

// --- GLOBAL STYLES INJECTED DYNAMICALLY ---
document.head.insertAdjacentHTML("beforeend", `<style>.spin-anim { animation: spin 1s linear infinite; } @keyframes spin { 100% { transform: rotate(360deg); } }</style>`);
