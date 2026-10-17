/* ===================================================
   Life Dashboard – Vanilla JS
   =================================================== */
'use strict';

/* ─────────────────────────────────────────────────
   HELPER: Local Storage (safe)
───────────────────────────────────────────────────*/
var store = {
  get: function (key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  },
  set: function (key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* ignore */ }
  }
};

var KEYS = {
  name:   'ld_name',
  theme:  'ld_theme',
  todos:  'ld_todos',
  links:  'ld_links',
  habits: 'ld_habits',
  mood:   'ld_mood',
  note:   'ld_note'
};

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

/* ─────────────────────────────────────────────────
   TOAST & INLINE MSG
───────────────────────────────────────────────────*/
var toastEl    = document.getElementById('toast');
var toastTimer = null;

function showToast(text) {
  if (!toastEl) return;
  toastEl.textContent = text;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () {
    toastEl.classList.remove('show');
  }, 2700);
}

function showMsg(el, text) {
  if (!el) return;
  el.textContent = text;
  clearTimeout(el._msgTimer);
  el._msgTimer = setTimeout(function () { el.textContent = ''; }, 2600);
}

/* ─────────────────────────────────────────────────
   RIPPLE EFFECT pada card
───────────────────────────────────────────────────*/
document.querySelectorAll('.card').forEach(function (card) {
  card.addEventListener('click', function (e) {
    var r = document.createElement('span');
    r.className = 'card-ripple';
    var rect = card.getBoundingClientRect();
    r.style.left = (e.clientX - rect.left - 30) + 'px';
    r.style.top  = (e.clientY - rect.top  - 30) + 'px';
    card.appendChild(r);
    r.addEventListener('animationend', function () { r.remove(); });
  });
});

/* ─────────────────────────────────────────────────
   CONFETTI BURST
───────────────────────────────────────────────────*/
var CONFETTI_COLORS = ['#a855f7', '#ec4899', '#f59e0b', '#34d399', '#60a5fa', '#f87171', '#fbbf24'];

function confettiBurst(x, y) {
  for (var i = 0; i < 22; i++) {
    var p     = document.createElement('div');
    p.className = 'confetti-piece';
    var angle = Math.random() * Math.PI * 2;
    var dist  = 60 + Math.random() * 90;
    var cx    = (Math.cos(angle) * dist).toFixed(1);
    var cy    = (Math.sin(angle) * dist).toFixed(1);
    var cr    = (Math.random() * 540 - 270).toFixed(1);
    var color = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
    var br    = Math.random() > 0.5 ? '50%' : '2px';
    p.style.cssText = 'left:' + x + 'px;top:' + y + 'px;background:' + color +
      ';--cx:' + cx + 'px;--cy:' + cy + 'px;--cr:' + cr + 'deg;border-radius:' + br + ';';
    document.body.appendChild(p);
    p.addEventListener('animationend', function () { this.remove(); });
  }
}

/* ─────────────────────────────────────────────────
   FLOATING PARTICLES (canvas background)
───────────────────────────────────────────────────*/
(function initParticles() {
  var canvas = document.getElementById('particles');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var W, H;
  var COUNT = 42;

  function mkDot() {
    return {
      x:     Math.random() * W,
      y:     Math.random() * H + H * 0.3,
      r:     Math.random() * 2.8 + 0.6,
      dx:    (Math.random() - 0.5) * 0.4,
      dy:    -(Math.random() * 0.55 + 0.18),
      alpha: Math.random() * 0.5 + 0.12,
      hue:   Math.random() > 0.5 ? 280 : 325
    };
  }

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  var dots = [];
  for (var i = 0; i < COUNT; i++) { dots.push(mkDot()); }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < dots.length; i++) {
      var d = dots[i];
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = 'hsla(' + d.hue + ',88%,72%,' + d.alpha + ')';
      ctx.fill();
      d.x += d.dx;
      d.y += d.dy;
      d.alpha -= 0.0007;
      if (d.y < -12 || d.alpha <= 0) {
        dots[i] = mkDot();
        dots[i].y = H + 10;
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ─────────────────────────────────────────────────
   TYPEWRITER GREETING
───────────────────────────────────────────────────*/
function typewrite(el, text, speed) {
  if (!el) return;
  speed = speed || 45;
  el.classList.remove('done');
  el.textContent = '';
  var i = 0;
  var id = setInterval(function () {
    el.textContent += text[i];
    i++;
    if (i >= text.length) {
      clearInterval(id);
      el.classList.add('done');
    }
  }, speed);
}

/* ─────────────────────────────────────────────────
   MASCOT BUBBLES
───────────────────────────────────────────────────*/
var MASCOT_MSGS = [
  'Hai! Yuk mulai hari ini \u2B50',
  'Kamu bisa! Semangat \uD83D\uDCAA',
  'Ingat minum air putih ya \uD83D\uDCA7',
  'Satu langkah demi satu langkah \uD83D\uDC3E',
  'Jangan lupa istirahat \uD83D\uDE0A',
  'Ayo selesaikan satu tugas dulu!',
  'Kamu luar biasa hari ini \u2728',
  'Fokus! Kamu bisa! \uD83D\uDD25'
];
var mascotIdx    = 0;
var mascotBubble = document.getElementById('mascot-bubble');
var mascotEl     = document.getElementById('mascot');

function nextMascotMsg() {
  mascotIdx = (mascotIdx + 1) % MASCOT_MSGS.length;
  if (!mascotBubble) return;
  mascotBubble.style.animation = 'none';
  void mascotBubble.offsetWidth; /* reflow trigger */
  mascotBubble.style.animation = '';
  mascotBubble.textContent = MASCOT_MSGS[mascotIdx];
}

setInterval(nextMascotMsg, 6000);
if (mascotEl) { mascotEl.addEventListener('click', nextMascotMsg); }

/* ─────────────────────────────────────────────────
   CLOCK, DATE, GREETING
───────────────────────────────────────────────────*/
var clockEl   = document.getElementById('clock');
var dateEl    = document.getElementById('date-pill');
var greetEl   = document.getElementById('greeting');
var nameForm  = document.getElementById('name-form');
var nameInput = document.getElementById('name-input');

var userName = store.get(KEYS.name, '');
if (nameInput) { nameInput.value = userName; }

function getGreeting(h) {
  if (h >= 5  && h < 11) return 'Selamat pagi';
  if (h >= 11 && h < 15) return 'Selamat siang';
  if (h >= 15 && h < 18) return 'Selamat sore';
  return 'Selamat malam';
}

var lastGreet = '';
function updateClock() {
  var now = new Date();
  if (clockEl) {
    clockEl.textContent = now.toLocaleTimeString('id-ID', { hour12: false }).replace(/\./g, ':');
  }
  if (dateEl) {
    dateEl.textContent = now.toLocaleDateString('id-ID', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
  }
  var greet = getGreeting(now.getHours()) + (userName ? ', ' + userName : '');
  if (greet !== lastGreet) {
    lastGreet = greet;
    typewrite(greetEl, greet);
  }
}

if (nameForm) {
  nameForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var prev = userName;
    userName = nameInput ? nameInput.value.trim() : '';
    store.set(KEYS.name, userName);
    lastGreet = '';
    updateClock();
    if (userName && userName !== prev) {
      showToast('Halo, ' + userName + '! \uD83D\uDC4B');
      if (mascotBubble) {
        mascotBubble.textContent = 'Halo ' + userName + '! Semangat ya! \u2B50';
      }
    }
  });
}

updateClock();
setInterval(updateClock, 1000);

/* ─────────────────────────────────────────────────
   THEME (light / dark)
───────────────────────────────────────────────────*/
var themeBtn = document.getElementById('theme-toggle');
var root     = document.documentElement;

function applyTheme(t) {
  root.setAttribute('data-theme', t);
  if (themeBtn) {
    themeBtn.textContent = t === 'dark' ? '\u2600\uFE0F Mode Terang' : '\uD83C\uDF19 Mode Gelap';
  }
}

var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme:dark)').matches;
applyTheme(store.get(KEYS.theme, prefersDark ? 'dark' : 'light'));

if (themeBtn) {
  themeBtn.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    store.set(KEYS.theme, next);
  });
}

/* ─────────────────────────────────────────────────
   FOCUS TIMER
───────────────────────────────────────────────────*/
var RING_FULL    = 439.82; /* 2 * PI * 70 */
var timerDisplay = document.getElementById('timer-display');
var timerStatus  = document.getElementById('timer-status');
var ringFillEl   = document.getElementById('ring-fill');
var cardTimerEl  = document.getElementById('card-timer');
var timerMinInput = document.getElementById('timer-minutes');
var timerSetBtn   = document.getElementById('timer-set');

var TIMER_SECONDS = 25 * 60;
var remaining     = TIMER_SECONDS;
var timerId       = null;
var endTime       = 0;

function renderTimer() {
  var m = String(Math.floor(remaining / 60)).padStart(2, '0');
  var s = String(remaining % 60).padStart(2, '0');
  if (timerDisplay) { timerDisplay.textContent = m + ':' + s; }
  if (ringFillEl) {
    var prog = TIMER_SECONDS > 0 ? remaining / TIMER_SECONDS : 0;
    ringFillEl.style.strokeDashoffset = String(RING_FULL * (1 - prog));
    var hue = Math.round(280 + (1 - prog) * 80);
    ringFillEl.style.stroke = 'hsl(' + (hue % 360) + ',90%,78%)';
  }
}

function stopTimer() {
  clearInterval(timerId);
  timerId = null;
  if (cardTimerEl) { cardTimerEl.classList.remove('timer-running'); }
}

function tick() {
  remaining = Math.max(0, Math.round((endTime - Date.now()) / 1000));
  renderTimer();
  if (remaining === 0) {
    stopTimer();
    if (timerStatus) { timerStatus.textContent = 'Selesai! Waktunya istirahat \uD83C\uDF89'; }
    showToast('\u23F0 Sesi fokus selesai! Istirahat dulu ya.');
    if (timerDisplay) {
      var rect = timerDisplay.getBoundingClientRect();
      confettiBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
    }
  }
}

var timerStartBtn = document.getElementById('timer-start');
var timerStopBtn  = document.getElementById('timer-stop');
var timerResetBtn = document.getElementById('timer-reset');

if (timerStartBtn) {
  timerStartBtn.addEventListener('click', function () {
    if (timerId || remaining === 0) return;
    endTime = Date.now() + remaining * 1000;
    timerId = setInterval(tick, 250);
    if (timerStatus) { timerStatus.textContent = 'Sedang fokus... \uD83D\uDD25'; }
    if (cardTimerEl) { cardTimerEl.classList.add('timer-running'); }
  });
}

if (timerStopBtn) {
  timerStopBtn.addEventListener('click', function () {
    if (!timerId) return;
    stopTimer();
    if (timerStatus) { timerStatus.textContent = 'Dijeda \u23F8'; }
  });
}

if (timerResetBtn) {
  timerResetBtn.addEventListener('click', function () {
    stopTimer();
    remaining = TIMER_SECONDS;
    renderTimer();
    if (timerStatus) { timerStatus.textContent = 'Siap fokus \uD83C\uDFAF'; }
  });
}

if (timerSetBtn) {
  timerSetBtn.addEventListener('click', function () {
    var mins = parseInt(timerMinInput ? timerMinInput.value : '25', 10);
    if (!mins || mins < 1 || mins > 120) return;
    stopTimer();
    TIMER_SECONDS = mins * 60;
    remaining     = TIMER_SECONDS;
    renderTimer();
    if (timerStatus) { timerStatus.textContent = 'Timer diset ke ' + mins + ' menit \u2705'; }
    showToast('Timer diset ke ' + mins + ' menit');
  });
}

renderTimer();

/* ─────────────────────────────────────────────────
   TO-DO LIST
───────────────────────────────────────────────────*/
var todoForm      = document.getElementById('todo-form');
var todoInput     = document.getElementById('todo-input');
var todoList      = document.getElementById('todo-list');
var todoMsg       = document.getElementById('todo-msg');
var todoEmpty     = document.getElementById('todo-empty');
var progressFill  = document.getElementById('todo-progress-fill');
var progressLabel = document.getElementById('todo-progress-label');

var todos = store.get(KEYS.todos, []);
function saveTodos() { store.set(KEYS.todos, todos); }

function isDuplicate(text, ignoreId) {
  var t = text.trim().toLowerCase();
  return todos.some(function (x) {
    return x.id !== ignoreId && x.text.trim().toLowerCase() === t;
  });
}

function renderProgress() {
  if (!progressFill || !progressLabel) return;
  var total = todos.length;
  var doneCount = todos.filter(function (t) { return t.done; }).length;
  var pct = total ? Math.round(doneCount / total * 100) : 0;
  progressFill.style.width  = pct + '%';
  progressLabel.textContent = doneCount + ' / ' + total;
}

function renderTodos() {
  if (!todoList) return;
  todoList.innerHTML = '';
  if (todoEmpty) { todoEmpty.style.display = todos.length ? 'none' : 'block'; }
  renderProgress();

  todos.forEach(function (todo) {
    var li = document.createElement('li');
    li.className = 'todo-item' + (todo.done ? ' done' : '');

    var check  = document.createElement('input');
    check.type = 'checkbox';
    check.checked = todo.done;
    check.setAttribute('aria-label', 'Tandai selesai: ' + todo.text);
    check.addEventListener('change', function () {
      todo.done = check.checked;
      saveTodos();
      renderTodos();
      if (todo.done) {
        showToast('\u2705 "' + todo.text + '" selesai!');
        var r2 = li.getBoundingClientRect();
        confettiBurst(r2.left + r2.width / 2, r2.top + r2.height / 2);
      }
    });

    var span       = document.createElement('span');
    span.className = 'todo-text';
    span.textContent = todo.text;

    var editBtn       = document.createElement('button');
    editBtn.className = 'icon-btn';
    editBtn.type      = 'button';
    editBtn.textContent = '\u270F\uFE0F';
    editBtn.setAttribute('aria-label', 'Edit tugas');
    editBtn.addEventListener('click', function () { startEdit(todo, li, span, editBtn); });

    var delBtn       = document.createElement('button');
    delBtn.className = 'icon-btn del';
    delBtn.type      = 'button';
    delBtn.textContent = '\uD83D\uDDD1\uFE0F';
    delBtn.setAttribute('aria-label', 'Hapus tugas');
    delBtn.addEventListener('click', function () {
      li.style.opacity   = '0';
      li.style.transform = 'translateX(20px)';
      li.style.transition = 'opacity 0.24s, transform 0.24s';
      setTimeout(function () {
        todos = todos.filter(function (t) { return t.id !== todo.id; });
        saveTodos();
        renderTodos();
      }, 240);
    });

    li.append(check, span, editBtn, delBtn);
    todoList.appendChild(li);
  });
}

function startEdit(todo, li, textEl, editBtn) {
  var inp     = document.createElement('input');
  inp.type    = 'text';
  inp.className = 'todo-edit';
  inp.maxLength = 100;
  inp.value   = todo.text;
  li.replaceChild(inp, textEl);
  editBtn.disabled = true;
  inp.focus();

  var isFinished = false;
  function finish(save) {
    if (isFinished) return;
    isFinished = true;
    var val = inp.value.trim();
    if (save && val && val !== todo.text) {
      if (isDuplicate(val, todo.id)) {
        showMsg(todoMsg, 'Tugas sudah ada.');
      } else {
        todo.text = val;
        saveTodos();
      }
    }
    renderTodos();
  }
  inp.addEventListener('keydown', function (e) {
    if (e.key === 'Enter')  finish(true);
    if (e.key === 'Escape') finish(false);
  });
  inp.addEventListener('blur', function () { finish(true); });
}

if (todoForm) {
  todoForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var val = todoInput ? todoInput.value.trim() : '';
    if (!val) return;
    if (isDuplicate(val)) { showMsg(todoMsg, 'Tugas sudah ada.'); return; }
    todos.push({ id: Date.now(), text: val, done: false });
    saveTodos();
    if (todoInput)  { todoInput.value = ''; }
    if (todoMsg)    { todoMsg.textContent = ''; }
    renderTodos();
    showToast('\uD83D\uDCDD Tugas ditambahkan!');
  });
}

renderTodos();

/* ─────────────────────────────────────────────────
   MOOD TRACKER
   Menyimpan data per hari. ID mood pakai angka agar
   stabil di localStorage, bukan string emoji.
───────────────────────────────────────────────────*/
var MOODS = [
  { id: 1, emoji: '\uD83D\uDE04', label: 'Bahagia'  },
  { id: 2, emoji: '\uD83D\uDE0A', label: 'Senang'   },
  { id: 3, emoji: '\uD83D\uDE10', label: 'Biasa'    },
  { id: 4, emoji: '\uD83D\uDE14', label: 'Sedih'    },
  { id: 5, emoji: '\uD83D\uDE24', label: 'Kesal'    },
  { id: 6, emoji: '\uD83E\uDD29', label: 'Semangat' },
  { id: 7, emoji: '\uD83D\uDE34', label: 'Ngantuk'  },
  { id: 8, emoji: '\uD83D\uDE30', label: 'Stres'    }
];

var moodGrid   = document.getElementById('mood-grid');
var moodResult = document.getElementById('mood-result');

/* moodData: { "YYYY-MM-DD": moodId } */
var moodData = store.get(KEYS.mood, {});

function buildMoodGrid() {
  if (!moodGrid) return;
  moodGrid.innerHTML = '';

  MOODS.forEach(function (m) {
    var btn = document.createElement('button');
    btn.className  = 'mood-btn';
    btn.type       = 'button';
    btn.dataset.id = String(m.id);
    btn.setAttribute('aria-label', 'Mood ' + m.label);

    var emojiSpan      = document.createElement('span');
    emojiSpan.className = 'mood-emoji';
    emojiSpan.textContent = m.emoji;

    var labelSpan      = document.createElement('span');
    labelSpan.textContent = m.label;

    btn.appendChild(emojiSpan);
    btn.appendChild(labelSpan);

    btn.addEventListener('click', function () {
      /* hapus active semua tombol */
      moodGrid.querySelectorAll('.mood-btn').forEach(function (b) {
        b.classList.remove('active');
      });
      /* aktifkan tombol ini */
      btn.classList.add('active');
      /* simpan dengan id numerik (stabil) */
      moodData[todayKey()] = m.id;
      store.set(KEYS.mood, moodData);
      /* tampilkan hasil */
      if (moodResult) {
        moodResult.textContent = 'Mood hari ini: ' + m.label + ' ' + m.emoji;
      }
      showToast('Mood tersimpan: ' + m.emoji + ' ' + m.label);
    });

    moodGrid.appendChild(btn);
  });

  /* Restore mood hari ini */
  var savedId = moodData[todayKey()];
  if (savedId) {
    var target = moodGrid.querySelector('[data-id="' + savedId + '"]');
    if (target) {
      target.classList.add('active');
      var saved = MOODS.find(function (m) { return m.id === savedId; });
      if (saved && moodResult) {
        moodResult.textContent = 'Mood hari ini: ' + saved.label + ' ' + saved.emoji;
      }
    }
  }
}

buildMoodGrid();

/* ─────────────────────────────────────────────────
   HABIT TRACKER
───────────────────────────────────────────────────*/
var habitListEl = document.getElementById('habit-list');
var habitForm   = document.getElementById('habit-form');
var habitInput  = document.getElementById('habit-input');
var habitMsg    = document.getElementById('habit-msg');

var DEFAULT_HABITS = [
  { id: 1, name: 'Minum 8 gelas air', checks: {} },
  { id: 2, name: 'Olahraga 15 menit', checks: {} },
  { id: 3, name: 'Baca buku',         checks: {} }
];
var habits = store.get(KEYS.habits, DEFAULT_HABITS);
function saveHabits() { store.set(KEYS.habits, habits); }

function calcStreak(checks) {
  var streak = 0;
  var d = new Date();
  while (true) {
    var key = d.toISOString().slice(0, 10);
    if (!checks[key]) break;
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

function renderHabits() {
  if (!habitListEl) return;
  habitListEl.innerHTML = '';
  var today = todayKey();

  habits.forEach(function (h) {
    var isDone  = !!h.checks[today];
    var streak  = calcStreak(h.checks);

    var item       = document.createElement('div');
    item.className = 'habit-item' + (isDone ? ' done-habit' : '');

    var checkBtn       = document.createElement('button');
    checkBtn.className = 'habit-check-btn' + (isDone ? ' done' : '');
    checkBtn.type      = 'button';
    checkBtn.textContent = isDone ? '\u2713' : '';
    checkBtn.setAttribute('aria-label', (isDone ? 'Batal centang' : 'Centang') + ' ' + h.name);

    checkBtn.addEventListener('click', function () {
      checkBtn.classList.add('pop');
      checkBtn.addEventListener('animationend', function () {
        checkBtn.classList.remove('pop');
      }, { once: true });

      var t = todayKey(); /* re-evaluate hari ini */
      if (h.checks[t]) {
        delete h.checks[t];
      } else {
        h.checks[t] = true;
        showToast('\uD83D\uDD25 "' + h.name + '" selesai hari ini!');
        var r3 = checkBtn.getBoundingClientRect();
        confettiBurst(r3.left + r3.width / 2, r3.top);
      }
      saveHabits();
      renderHabits();
    });

    var nameEl       = document.createElement('span');
    nameEl.className = 'habit-name';
    nameEl.textContent = h.name;

    var streakEl       = document.createElement('span');
    streakEl.className = 'habit-streak';
    streakEl.textContent = streak > 0 ? '\uD83D\uDD25 ' + streak + ' hari' : '';

    var delBtn       = document.createElement('button');
    delBtn.className = 'icon-btn del';
    delBtn.type      = 'button';
    delBtn.textContent = '\uD83D\uDDD1\uFE0F';
    delBtn.setAttribute('aria-label', 'Hapus kebiasaan');
    delBtn.addEventListener('click', function () {
      item.style.opacity   = '0';
      item.style.transform = 'translateX(20px)';
      item.style.transition = 'opacity 0.22s, transform 0.22s';
      setTimeout(function () {
        habits = habits.filter(function (x) { return x.id !== h.id; });
        saveHabits();
        renderHabits();
      }, 220);
    });

    item.append(checkBtn, nameEl, streakEl, delBtn);
    habitListEl.appendChild(item);
  });
}

if (habitForm) {
  habitForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var val = habitInput ? habitInput.value.trim() : '';
    if (!val) return;
    var dup = habits.some(function (h) {
      return h.name.toLowerCase() === val.toLowerCase();
    });
    if (dup) { showMsg(habitMsg, 'Kebiasaan sudah ada.'); return; }
    habits.push({ id: Date.now(), name: val, checks: {} });
    saveHabits();
    if (habitInput) { habitInput.value = ''; }
    renderHabits();
    showToast('\uD83D\uDCAA Kebiasaan baru ditambahkan!');
  });
}

renderHabits();

/* ─────────────────────────────────────────────────
   QUICK NOTE (autosave debounce 700 ms)
───────────────────────────────────────────────────*/
var noteArea  = document.getElementById('note-area');
var noteCount = document.getElementById('note-count');
var noteSaved = document.getElementById('note-saved');

if (noteArea) {
  noteArea.value = store.get(KEYS.note, '');
  if (noteCount) { noteCount.textContent = noteArea.value.length + ' / 500'; }

  var noteSaveTimer = null;
  function saveNote() {
    store.set(KEYS.note, noteArea.value);
    if (noteSaved) {
      noteSaved.classList.add('show');
      clearTimeout(noteSaveTimer);
      noteSaveTimer = setTimeout(function () {
        noteSaved.classList.remove('show');
      }, 1800);
    }
  }

  noteArea.addEventListener('input', function () {
    if (noteCount) { noteCount.textContent = noteArea.value.length + ' / 500'; }
    clearTimeout(noteSaveTimer);
    noteSaveTimer = setTimeout(saveNote, 700);
  });
}

/* ─────────────────────────────────────────────────
   QUICK LINKS
───────────────────────────────────────────────────*/
var linksEl  = document.getElementById('links');
var linkForm = document.getElementById('link-form');
var linkName = document.getElementById('link-name');
var linkUrl  = document.getElementById('link-url');
var linkMsg  = document.getElementById('link-msg');

var DEFAULT_LINKS = [
  { id: 1, name: 'Google',  url: 'https://www.google.com' },
  { id: 2, name: 'YouTube', url: 'https://www.youtube.com' },
  { id: 3, name: 'GitHub',  url: 'https://github.com' }
];
var links = store.get(KEYS.links, DEFAULT_LINKS);
function saveLinks() { store.set(KEYS.links, links); }

function normalizeUrl(raw) {
  var v = raw.trim();
  if (!v) return null;
  if (!/^https?:\/\//i.test(v)) { v = 'https://' + v; }
  try {
    var u = new URL(v);
    return u.hostname.includes('.') ? u.href : null;
  } catch (e) {
    return null;
  }
}

function renderLinks() {
  if (!linksEl) return;
  linksEl.innerHTML = '';
  links.forEach(function (link) {
    var chip       = document.createElement('div');
    chip.className = 'link-chip';

    var a   = document.createElement('a');
    a.href  = link.url;
    a.target = '_blank';
    a.rel   = 'noopener noreferrer';
    a.textContent = link.name;

    var del       = document.createElement('button');
    del.className = 'icon-btn';
    del.type      = 'button';
    del.textContent = '\u2715';
    del.setAttribute('aria-label', 'Hapus link ' + link.name);
    del.addEventListener('click', function () {
      chip.style.opacity   = '0';
      chip.style.transform = 'scale(0.8)';
      chip.style.transition = 'opacity 0.2s, transform 0.2s';
      setTimeout(function () {
        links = links.filter(function (l) { return l.id !== link.id; });
        saveLinks();
        renderLinks();
      }, 200);
    });

    chip.append(a, del);
    linksEl.appendChild(chip);
  });
}

if (linkForm) {
  linkForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = linkName ? linkName.value.trim() : '';
    var url  = normalizeUrl(linkUrl ? linkUrl.value : '');
    if (!name || !url) { showMsg(linkMsg, 'Isi nama dan alamat yang valid.'); return; }
    links.push({ id: Date.now(), name: name, url: url });
    saveLinks();
    if (linkName) { linkName.value = ''; }
    if (linkUrl)  { linkUrl.value  = ''; }
    if (linkMsg)  { linkMsg.textContent = ''; }
    renderLinks();
    showToast('\uD83D\uDD17 Link "' + name + '" ditambahkan!');
  });
}

renderLinks();
