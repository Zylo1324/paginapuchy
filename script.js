import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  updateProfile
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';

gsap.registerPlugin(ScrollTrigger);

const heroTimeline = gsap.timeline({
  scrollTrigger: {
    trigger: '.hero',
    start: 'top top',
    end: '+=200%',
    scrub: 1,
    pin: true
  }
});

heroTimeline
  .to('.burger-main', { rotation: 0, scale: 1.05, duration: 1 })
  .to('.tomato', { x: 180, y: 60, duration: 1 }, 0)
  .to('.leaf', { x: -200, y: -80, duration: 1 }, 0)
  .to('.hero-bg-text', { x: '-20%', duration: 1 }, 0);

gsap.from(['.charcoal', '.cheese'], {
  scrollTrigger: {
    trigger: '.reveal',
    start: 'top 80%',
    end: 'bottom 60%',
    scrub: true
  },
  y: 120,
  opacity: 0
});

const loginButton = document.getElementById('smart-login');
const loginText = loginButton.querySelector('.login-text');
const loginIcon = loginButton.querySelector('.login-icon');
const loginMenu = document.getElementById('login-menu');
const loginModal = document.getElementById('login-modal');
const modalClose = document.getElementById('modal-close');
const authForm = document.getElementById('auth-form');
const logoutBtn = document.getElementById('logout-btn');
const goHomeBtn = document.getElementById('go-home-btn');

let auth;
let currentUser = null;

const firebaseConfig = {
  apiKey: 'REPLACE_ME',
  authDomain: 'REPLACE_ME',
  projectId: 'REPLACE_ME',
  appId: 'REPLACE_ME'
};

try {
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
} catch (error) {
  console.warn('Firebase no configurado:', error);
}

const plusIcon = `
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
`;

const userIcon = `
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
`;

const updateLoginUI = (user) => {
  if (user) {
    const name = user.displayName || user.email?.split('@')[0] || 'Puchy Lover';
    loginText.textContent = `Hola, ${name}`;
    loginButton.classList.add('logged-in');
    loginIcon.innerHTML = userIcon;
  } else {
    loginText.textContent = 'Iniciar o Registrar';
    loginButton.classList.remove('logged-in');
    loginMenu.classList.remove('show');
    loginIcon.innerHTML = plusIcon;
  }
};

if (auth) {
  onAuthStateChanged(auth, (user) => {
    currentUser = user;
    updateLoginUI(user);
  });
}

loginButton.addEventListener('click', () => {
  if (currentUser) {
    loginMenu.classList.toggle('show');
  } else {
    loginModal.classList.add('show');
    loginModal.setAttribute('aria-hidden', 'false');
  }
});

document.addEventListener('click', (event) => {
  if (!loginMenu.classList.contains('show')) return;
  if (loginButton.contains(event.target) || loginMenu.contains(event.target)) return;
  loginMenu.classList.remove('show');
});

modalClose.addEventListener('click', () => {
  loginModal.classList.remove('show');
  loginModal.setAttribute('aria-hidden', 'true');
});

loginModal.addEventListener('click', (event) => {
  if (event.target === loginModal) {
    loginModal.classList.remove('show');
    loginModal.setAttribute('aria-hidden', 'true');
  }
});

authForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!auth) {
    alert('Configura Firebase para activar el login.');
    return;
  }

  const name = document.getElementById('auth-name').value.trim();
  const email = document.getElementById('auth-email').value.trim();
  const password = document.getElementById('auth-password').value.trim();

  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    currentUser = result.user;
    loginModal.classList.remove('show');
  } catch (error) {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    currentUser = result.user;
    if (name) {
      await updateProfile(currentUser, { displayName: name });
    }
    loginModal.classList.remove('show');
  }
});

logoutBtn.addEventListener('click', async () => {
  if (!auth) return;
  await signOut(auth);
  currentUser = null;
  updateLoginUI(null);
});

goHomeBtn.addEventListener('click', (event) => {
  event.stopPropagation();
  window.location.href = '/home';
});

updateLoginUI(null);
