/* ═══════════════════════════════════════════════════════
   CricVerse — script.js
   API: Cricbuzz via RapidAPI
   ⚠  IMPORTANT: Regenerate your RapidAPI key at
      rapidapi.com → My Apps → Regenerate Key
      Then paste the NEW key below.
═══════════════════════════════════════════════════════ */

// ── CONFIG ───────────────────────────────────────────────────
// ⚠ Do NOT put your real key here.
// Add it as a GitHub secret named RAPIDAPI_KEY —
// the Actions workflow injects it automatically at deploy time.
var RAPIDAPI_KEY  = 'YOUR_NEW_RAPIDAPI_KEY';
var RAPIDAPI_HOST = 'cricbuzz-cricket.p.rapidapi.com';
var API_BASE      = 'https://cricbuzz-cricket.p.rapidapi.com';

// ── UTILITY FUNCTIONS (hoisted — always available) ───────────

function loadingHTML(msg) {
  msg = msg || 'Loading';
  return '<div class="state-box"><div class="spinner"></div><div class="state-label">' + msg + '</div></div>';
}

function errorHTML(msg, retryFn) {
  msg = msg || 'Failed to load';
  return '<div class="state-box">'
    + '<div class="error-icon">⚠</div>'
    + '<div class="state-label">' + msg + '</div>'
    + (retryFn ? '<button class="retry-btn" onclick="' + retryFn + '()">Retry</button>' : '')
    + '</div>';
}

function apiKeyNote() {
  return '<div class="state-box">'
    + '<div class="error-icon" style="font-size:2.5rem">🔑</div>'
    + '<div class="state-label">API Key Required</div>'
    + '<div style="font-size:.85rem;color:var(--muted);max-width:340px;text-align:center;line-height:1.7">'
    + '1. Regenerate your key at <strong style="color:var(--accent)">rapidapi.com</strong><br>'
    + '2. Open <code style="color:var(--accent2)">script.js</code><br>'
    + '3. Replace <code style="color:var(--accent2)">YOUR_NEW_RAPIDAPI_KEY</code> on line 12'
    + '</div></div>';
}

// Core fetch wrapper — adds RapidAPI headers to every request
async function cbFetch(path) {
  var res = await fetch(API_BASE + path, {
    method: 'GET',
    headers: {
      'x-rapidapi-key':  RAPIDAPI_KEY,
      'x-rapidapi-host': RAPIDAPI_HOST
    }
  });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  return res.json();
}

// ── CRICBUZZ API HELPERS ─────────────────────────────────────

// GET /matches/v1/live  — live matches
// GET /matches/v1/upcoming — upcoming matches
// GET /matches/v1/recent  — recent/completed matches
// GET /series/v1/international — international series
// GET /stats/v1/rankings/{role}?formatType={test|odi|t20}
//     role: batsmen | bowlers | allrounders

async function fetchLiveMatches()     { return cbFetch('/matches/v1/live'); }
async function fetchUpcomingMatches() { return cbFetch('/matches/v1/upcoming'); }
async function fetchRecentMatches()   { return cbFetch('/matches/v1/recent'); }
async function fetchSeries()          { return cbFetch('/series/v1/international'); }
async function fetchRankings(role, format) {
  return cbFetch('/stats/v1/rankings/' + role + '?formatType=' + format);
}

// ── TICKER ───────────────────────────────────────────────────

// Cricbuzz match shape (from /matches/v1/live):
// match.matchInfo.team1.teamSName, team2.teamSName
// match.matchScore.team1Score.inngs1.runs etc.
// match.matchInfo.matchFormat: TEST | ODI | T20

function matchTeamNames(m) {
  var info = m.matchInfo || {};
  return {
    t1: (info.team1 && (info.team1.teamSName || info.team1.teamName)) || '—',
    t2: (info.team2 && (info.team2.teamSName || info.team2.teamName)) || '—',
  };
}

function matchScoreText(m) {
  var sc = m.matchScore;
  if (!sc) return '';
  var t1s = sc.team1Score && sc.team1Score.inngs1
    ? sc.team1Score.inngs1.runs + '/' + sc.team1Score.inngs1.wickets
      + ' (' + sc.team1Score.inngs1.overs + ')'
    : '';
  return t1s;
}

function buildTicker(matches) {
  var ticker = document.getElementById('ticker');
  if (!ticker) return;
  if (!matches || !matches.length) {
    var blank = '';
    for (var i = 0; i < 8; i++) blank += '<span class="ticker-item"><strong>Fetching live scores…</strong></span>';
    ticker.innerHTML = blank;
    return;
  }
  var all = matches.concat(matches);
  var html = all.map(function(m) {
    var names = matchTeamNames(m);
    var score = matchScoreText(m);
    var fmt   = (m.matchInfo && m.matchInfo.matchFormat) ? m.matchInfo.matchFormat : '';
    return '<span class="ticker-item"><strong>' + names.t1 + ' vs ' + names.t2 + '</strong>'
      + (score ? ' · ' + score : '') + (fmt ? ' · ' + fmt : '') + '</span>';
  }).join('');
  ticker.innerHTML = html;
}

// ── SCROLL ANIMATION ─────────────────────────────────────────

var _io = null;

function observeCards() {
  if (!window.IntersectionObserver) return;
  if (!_io) {
    _io = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) {
          e.target.style.opacity = '1';
          e.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.08 });
  }
  document.querySelectorAll('.match-card, .feature-item').forEach(function(el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    _io.observe(el);
  });
}

// ── NAVBAR ───────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', function() {
  var hamburger = document.getElementById('hamburger');
  var navLinks  = document.getElementById('navLinks');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function() {
      navLinks.classList.toggle('open');
      var spans = hamburger.querySelectorAll('span');
      if (navLinks.classList.contains('open')) {
        spans[0].style.transform = 'translateY(7px) rotate(45deg)';
        spans[1].style.opacity   = '0';
        spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity   = '';
        spans[2].style.transform = '';
      }
    });

    navLinks.querySelectorAll('a').forEach(function(a) {
      a.addEventListener('click', function() {
        navLinks.classList.remove('open');
        var spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity   = '';
        spans[2].style.transform = '';
      });
    });
  }

  window.addEventListener('scroll', function() {
    var nav = document.getElementById('navbar');
    if (nav) nav.style.background = window.scrollY > 20
      ? 'rgba(10,12,15,0.97)'
      : 'rgba(10,12,15,0.88)';
  });
});

// ── WATCH LIVE ───────────────────────────────────────────────

var DEFAULT_STREAMS = [
  {
    id:   'Himalaya Sports',
    name: 'Willow Cricket',
    desc: 'Official Willow TV',
    icon: '🏏',
    url:  'https://him-edj.pages.dev/48e575e9-705f-44c4-bffe-7898176a7bbd',
  },
  {
    id:   'Himalaya 2',
    name: 'Sony LIV Sports',
    desc: 'Sony Sports Network',
    icon: '📺',
    url:  'https://him-edj.pages.dev/',
  },
  {
    id:   'star',
    name: 'Star Sports 1',
    desc: 'Star Sports Live HD',
    icon: '⭐',
    url:  'https://yosintv100.pages.dev/shaka?id=sshindii',
  },
];

var streams      = [];
var activeStream = null;

function loadStreams() {
  try {
    var saved = JSON.parse(localStorage.getItem('cv_streams') || '[]');
    streams = DEFAULT_STREAMS.concat(
      saved.filter(function(s) {
        return !DEFAULT_STREAMS.find(function(d) { return d.id === s.id; });
      })
    );
  } catch (e) {
    streams = DEFAULT_STREAMS.slice();
  }
}

function saveCustomStreams() {
  var custom = streams.filter(function(s) {
    return !DEFAULT_STREAMS.find(function(d) { return d.id === s.id; });
  });
  try { localStorage.setItem('cv_streams', JSON.stringify(custom)); } catch(e) {}
}

function renderStreamList() {
  var list = document.getElementById('streamList');
  if (!list) return;
  list.innerHTML = streams.map(function(s) {
    var isActive = activeStream && activeStream.id === s.id;
    return '<div class="stream-item' + (isActive ? ' active' : '') + '" onclick="selectStream(\'' + s.id + '\')">'
      + '<div class="stream-thumb">' + s.icon + '</div>'
      + '<div><div class="stream-name">' + s.name + '</div>'
      + '<div class="stream-desc">' + s.desc + '</div></div>'
      + '<div class="stream-live-tag">'
      + '<span style="width:5px;height:5px;background:var(--accent2);border-radius:50%;display:inline-block;animation:pulse 1.5s infinite"></span>'
      + ' LIVE</div></div>';
  }).join('');
}

function selectStream(id) {
  activeStream = null;
  for (var i = 0; i < streams.length; i++) {
    if (streams[i].id === id) { activeStream = streams[i]; break; }
  }
  if (!activeStream) return;

  var playerSide = document.getElementById('watchPlayerSide');
  if (!playerSide) return;

  playerSide.innerHTML = '<div class="watch-iframe-wrap">'
    + '<iframe src="' + activeStream.url + '" allowfullscreen'
    + ' allow="autoplay; fullscreen; encrypted-media"'
    + ' scrolling="no" frameborder="0"'
    + ' title="' + activeStream.name + '"></iframe>'
    + '</div>';

  renderStreamList();

  // Update "now playing" badge if it exists
  var badge = document.getElementById('nowPlayingBadge');
  var nameEl = document.getElementById('nowPlayingName');
  if (badge) badge.style.display = '';
  if (nameEl) nameEl.textContent = activeStream.name;
}

function toggleAddForm() {
  var form = document.getElementById('addStreamForm');
  if (!form) return;
  form.classList.toggle('open');
  if (form.classList.contains('open')) {
    var urlInput = document.getElementById('newStreamUrl');
    if (urlInput) urlInput.focus();
  }
}

function cancelAddStream() {
  var form = document.getElementById('addStreamForm');
  if (form) form.classList.remove('open');
  var n = document.getElementById('newStreamName');
  var u = document.getElementById('newStreamUrl');
  if (n) n.value = '';
  if (u) u.value = '';
}

function confirmAddStream() {
  var nameVal = (document.getElementById('newStreamName') || {}).value || '';
  var urlVal  = (document.getElementById('newStreamUrl')  || {}).value || '';
  nameVal = nameVal.trim();
  urlVal  = urlVal.trim();
  if (!urlVal) return;
  var newStream = {
    id:   'custom_' + Date.now(),
    name: nameVal || 'Custom Stream',
    desc: 'Added by you',
    icon: '📡',
    url:  urlVal,
  };
  streams.push(newStream);
  saveCustomStreams();
  renderStreamList();
  cancelAddStream();
  selectStream(newStream.id);
}

function initWatchSection() {
  loadStreams();
  renderStreamList();
  if (document.getElementById('watchPlayerSide')) {
    selectStream('willow');
  }
}

// Expose to global scope (needed for inline onclick handlers)
window.selectStream      = selectStream;
window.toggleAddForm     = toggleAddForm;
window.cancelAddStream   = cancelAddStream;
window.confirmAddStream  = confirmAddStream;
window.initWatchSection  = initWatchSection;
window.loadingHTML       = loadingHTML;
window.errorHTML         = errorHTML;
window.apiKeyNote        = apiKeyNote;
window.buildTicker       = buildTicker;
window.observeCards      = observeCards;
window.matchTeamNames    = matchTeamNames;
window.matchScoreText    = matchScoreText;
window.streams           = streams;
// Cricbuzz fetch functions
window.cbFetch             = cbFetch;
window.fetchLiveMatches    = fetchLiveMatches;
window.fetchUpcomingMatches= fetchUpcomingMatches;
window.fetchRecentMatches  = fetchRecentMatches;
window.fetchSeries         = fetchSeries;
window.fetchRankings       = fetchRankings;
window.RAPIDAPI_KEY        = RAPIDAPI_KEY;
