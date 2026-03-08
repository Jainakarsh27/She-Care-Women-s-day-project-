// Global Design & Interaction
document.addEventListener('DOMContentLoaded', () => {
    initMouseTrail();
    initNavbar();
    initChatbot();
    checkAuth();
});

// 1. Mouse Trail Effect
function initMouseTrail() {
    const container = document.createElement('div');
    container.id = 'trail-container';
    document.body.appendChild(container);

    window.addEventListener('mousemove', (e) => {
        const particle = document.createElement('div');
        particle.className = 'trail-particle';
        particle.style.left = e.pageX + 'px';
        particle.style.top = e.pageY + 'px';
        container.appendChild(particle);

        setTimeout(() => {
            particle.style.opacity = '0';
            particle.style.transform = 'scale(0.5) translateY(20px)';
            setTimeout(() => particle.remove(), 500);
        }, 100);
    });
}

// 2. Navbar & Active State
function initNavbar() {
    const nav = document.querySelector('nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) nav.classList.add('scrolled');
        else nav.classList.remove('scrolled');
    });

    renderNavbar();
}

function renderNavbar() {
    const navLinks = document.querySelector('.nav-links');
    const navBtns = document.querySelector('.nav-btns');
    if (!navLinks) return;

    const user = JSON.parse(localStorage.getItem('shecare_user'));
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';

    let linksHtml = '';
    let btnHtml = '';

    if (user) {
        // Logged In Dashboard View
        linksHtml = `
            <li><a href="index.html" class="${currentPath === 'index.html' ? 'active' : ''}">Dashboard</a></li>
            <li><a href="health.html" class="${currentPath === 'health.html' ? 'active' : ''}">Health</a></li>
            <li><a href="opportunities.html" class="${currentPath === 'opportunities.html' ? 'active' : ''}">Opportunities</a></li>
            <li><a href="schemes.html" class="${currentPath === 'schemes.html' ? 'active' : ''}">Schemes</a></li>
            <li><a href="safety.html" class="${currentPath === 'safety.html' ? 'active' : ''}">Safety</a></li>
            <li><a href="profile.html" class="${currentPath === 'profile.html' ? 'active' : ''}">Profile</a></li>
            <li><a href="#" onclick="logoutUser()">Logout</a></li>
        `;
        btnHtml = `
            <a href="safety.html" class="btn btn-primary" style="background: #ff4757;">
                <i class="fas fa-exclamation-triangle"></i> EMERGENCY
            </a>
        `;
    } else {
        // Public View
        linksHtml = `
            <li><a href="index.html" class="${currentPath === 'index.html' ? 'active' : ''}">Home</a></li>
            <li><a href="contact.html" class="${currentPath === 'contact.html' ? 'active' : ''}">Contact Us</a></li>
            <li><a href="login.html" class="${currentPath === 'login.html' ? 'active' : ''}">Login</a></li>
            <li><a href="profile.html" class="${currentPath === 'profile.html' ? 'active' : ''}">Register</a></li>
        `;
        btnHtml = `
            <a href="login.html" class="btn btn-primary">Get Started</a>
        `;
    }

    navLinks.innerHTML = linksHtml;
    if (navBtns) navBtns.innerHTML = btnHtml;
}

// 3. Auth & Login Logic
function checkAuth() {
    const publicPages = ['login.html', 'index.html', 'profile.html', 'contact.html'];
    let currentPath = window.location.pathname.split('/').pop() || 'index.html';

    // Handle cases where .html might be missing in the URL
    if (currentPath && !currentPath.includes('.')) {
        currentPath += '.html';
    }

    const user = localStorage.getItem('shecare_user');

    if (!user && !publicPages.includes(currentPath)) {
        window.location.href = 'login.html';
    }

    // If on index or dashboard and logged in, show personalized welcome
    if ((currentPath === 'index.html' || currentPath === '') && user) {
        const userData = JSON.parse(user);
        const heroTitle = document.querySelector('.animate-text') || document.querySelector('.hero h1');
        if (heroTitle) {
            heroTitle.innerHTML = `Welcome back, ${userData.name}!`;
            heroTitle.style.background = "var(--gold-gradient)";
            heroTitle.style.webkitBackgroundClip = "text";
            heroTitle.style.backgroundClip = "text";
            heroTitle.style.webkitTextFillColor = "transparent";
        }
    }
}

function loginUser(email, pass) {
    if (email && pass) {
        localStorage.setItem('shecare_user', JSON.stringify({ email, name: email.split('@')[0] }));
        alert('Login Successful! Welcome to your Dashboard.');
        window.location.href = 'index.html';
    } else {
        alert('Please enter valid credentials.');
    }
}

function logoutUser() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('shecare_user');
        window.location.href = 'index.html';
    }
}

// 4. SheCare AI Bot
function initChatbot() {
    const botHtml = `
        <div id="shecare-bot" class="glass">
            <div class="bot-header">
                <span>SheCare Assistant</span>
                <button onclick="toggleBot()"><i class="fas fa-times"></i></button>
            </div>
            <div id="bot-messages"></div>
            <div class="bot-input">
                <input type="text" id="userMsg" placeholder="Ask me about health, jobs..." onkeypress="handleBotKey(event)">
                <button onclick="sendBotMsg()"><i class="fas fa-paper-plane"></i></button>
            </div>
        </div>
        <button id="bot-toggle" class="glass" onclick="toggleBot()">
            <i class="fas fa-comment-dots"></i>
        </button>
    `;
    document.body.insertAdjacentHTML('beforeend', botHtml);

    // Initial message
    addBotMsg("Hi! I'm your SheCare assistant. How can I help you today? (Try asking about 'health' or 'jobs')");
}

function toggleBot() {
    const bot = document.getElementById('shecare-bot');
    bot.classList.toggle('active');
}

function addBotMsg(text, isUser = false) {
    const msgDiv = document.getElementById('bot-messages');
    const msg = document.createElement('div');
    msg.className = `msg ${isUser ? 'user-msg' : 'bot-msg'}`;
    msg.innerText = text;
    msgDiv.appendChild(msg);
    msgDiv.scrollTop = msgDiv.scrollHeight;
}

function handleBotKey(e) { if (e.key === 'Enter') sendBotMsg(); }

function sendBotMsg() {
    const input = document.getElementById('userMsg');
    const text = input.value.trim().toLowerCase();
    if (!text) return;

    addBotMsg(input.value, true);
    input.value = '';

    setTimeout(() => {
        // Navigation Commands
        if (text.includes('open dash') || text.includes('home')) {
            addBotMsg("Taking you to your Dashboard...");
            setTimeout(() => window.location.href = 'index.html', 1200);
        } else if (text.includes('health')) {
            addBotMsg("I can help with that! Heading to the Health page...");
            setTimeout(() => window.location.href = 'health.html', 1200);
        } else if (text.includes('job') || text.includes('opportunity')) {
            addBotMsg("Finding opportunities for you... Redirecting to Jobs section.");
            setTimeout(() => window.location.href = 'opportunities.html', 1200);
        } else if (text.includes('safety') || text.includes('help') || text.includes('panic')) {
            addBotMsg("Safety first! Let's go to the Safety & Emergency page.");
            setTimeout(() => window.location.href = 'safety.html', 1200);
        } else if (text.includes('scheme')) {
            addBotMsg("Opening Government Schemes directory...");
            setTimeout(() => window.location.href = 'schemes.html', 1200);
        } else if (text.includes('profile')) {
            addBotMsg("Opening your Profile settings...");
            setTimeout(() => window.location.href = 'profile.html', 1200);
        } else if (text.includes('contact')) {
            addBotMsg("Heading to the Contact page...");
            setTimeout(() => window.location.href = 'contact.html', 1200);
        } else {
            addBotMsg("I'm your SheCare assistant! You can say 'open health', 'show jobs', 'safety help', or 'go to profile'.");
        }
    }, 800);
}

// 6. Safety & Panic Logic
function activatePanic() {
    const status = document.getElementById('locationStatus');
    const latLong = document.getElementById('latLong');

    if (status) {
        status.style.display = 'block';
        if (latLong) {
            // Simulated coordinates for VIT Bhopal / General area
            latLong.innerText = "Coordinates: 23.2599° N, 77.4126° E (Bhopal, MP)";
        }

        // Visual alert
        document.body.style.animation = "panic-flash 1s infinite";

        const contact = localStorage.getItem('emergency_contact') || "Police (1091)";
        alert(`🚨 EMERGENCY MODE ACTIVATED 🚨\n\n1. Alerting: ${contact}\n2. Sending Live Location...\n3. Initiating Audio Recording...`);

        setTimeout(() => {
            if (confirm("Emergency protocol is active. Do you wish to STAND DOWN?")) {
                document.body.style.animation = "none";
                status.style.display = 'none';
            }
        }, 5000);
    }
}

function setupContact() {
    const contact = prompt("Enter Name/Number of Emergency Contact (Parent/Spouse):");
    if (contact) {
        localStorage.setItem('emergency_contact', contact);
        location.reload();
    }
}

// 7. Profile Read-Only Logic
function initProfileLogic() {
    const profileForm = document.getElementById('profileForm');
    if (!profileForm) return;

    const user = JSON.parse(localStorage.getItem('shecare_user'));
    const isEdit = localStorage.getItem('profile_edit_mode') === 'true';

    // Toggle fields based on mode
    const inputs = profileForm.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.disabled = !isEdit;
    });

    const editBtn = document.getElementById('editBtn');
    if (editBtn) {
        editBtn.innerHTML = isEdit ? '<i class="fas fa-save"></i> Save Profile' : '<i class="fas fa-edit"></i> Edit Profile';
        editBtn.onclick = toggleProfileEdit;
    }

    if (user && !isEdit) {
        // Pre-fill data if not in edit mode
        if (document.getElementById('profileName')) document.getElementById('profileName').value = user.name || '';
        if (document.getElementById('profileEmail')) document.getElementById('profileEmail').value = user.email || '';

        // Show "My Profile" instead of "Register" if data exists
        if (document.getElementById('profileTitle')) {
            document.getElementById('profileTitle').innerText = "My Saved Profile";
        }
    }
}

function toggleProfileEdit() {
    const isEdit = localStorage.getItem('profile_edit_mode') === 'true';
    if (isEdit) {
        // Saving logic
        const name = document.getElementById('profileName')?.value;
        const email = document.getElementById('profileEmail')?.value;
        const user = JSON.parse(localStorage.getItem('shecare_user')) || {};
        localStorage.setItem('shecare_user', JSON.stringify({ ...user, name, email }));
        localStorage.setItem('profile_edit_mode', 'false');
        alert("Profile details stored successfully!");
    } else {
        localStorage.setItem('profile_edit_mode', 'true');
    }
    location.reload();
}

// Update initialization to include new logic
document.addEventListener('DOMContentLoaded', () => {
    // ... existing calls ...
    if (window.location.pathname.includes('profile')) initProfileLogic();
    if (window.location.pathname.includes('safety')) {
        const saved = localStorage.getItem('emergency_contact');
        if (saved && document.getElementById('savedContact')) {
            document.getElementById('savedContact').innerText = saved;
        }
    }
});

// 5. Voice Assistance (Toggled)
let isSpeaking = false;
const voiceBtn = document.getElementById('voiceBtn');

if (voiceBtn) {
    voiceBtn.addEventListener('click', () => {
        if (isSpeaking) {
            window.speechSynthesis.cancel();
            isSpeaking = false;
            voiceBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
            voiceBtn.style.background = 'var(--primary)';
        } else {
            const text = document.querySelector('main') ? document.querySelector('main').innerText : document.body.innerText;
            const cleanText = text.replace(/\s+/g, ' ').substring(0, 500);
            const utterance = new SpeechSynthesisUtterance("Reading page content for you. " + cleanText);

            utterance.onend = () => {
                isSpeaking = false;
                voiceBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
                voiceBtn.style.background = 'var(--primary)';
            };

            window.speechSynthesis.speak(utterance);
            isSpeaking = true;
            voiceBtn.innerHTML = '<i class="fas fa-stop"></i>';
            voiceBtn.style.background = '#ff4757';
        }
    });
}
