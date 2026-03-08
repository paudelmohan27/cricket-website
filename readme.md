# 🏏 CricVerse — Live Cricket Hub

> A clean, fast, dark-themed cricket website with live scores, ICC rankings, international series, and a built-in live stream player. Zero frameworks. Pure HTML, CSS, and JavaScript.

---

## 🌐 Live Demo

**[mohanpaudel761.com.np](https://mohanpaudel761.com.np)**

---

## 📸 Pages

| Page | Description |
|---|---|
| `index.html` | Homepage — live match cards, ticker, Watch Live section, current series |
| `stats.html` | ICC player rankings (Batting / Bowling / All-Rounder × Test / ODI / T20I) + recent scorecards |
| `about.html` | About the project, features, setup guide |
| `contact.html` | Contact form with validation |

---

## ⚡ Features

- **Live Scores** — real-time match cards for live and upcoming matches, auto-refreshes every 30 seconds
- **Live Ticker** — scrolling score bar at the top of every page, populated from the API
- **Watch Live** — embedded stream player (Willow TV, Sony LIV, Star Sports 1) with ability to add custom embed URLs
- **ICC Rankings** — batting, bowling, and all-rounder rankings across Test, ODI, and T20I formats
- **Recent Scorecards** — completed match results with innings scores
- **International Series** — ongoing and upcoming series listing
- **Responsive** — fully mobile-friendly with hamburger menu
- **No frameworks** — plain HTML/CSS/JS, deploys anywhere as static files

---

## 🔑 API Setup

This project uses the **[Cricbuzz API](https://rapidapi.com/cricbuzz/api/cricbuzz-cricket)** via RapidAPI.

### Steps

1. Sign up at [rapidapi.com](https://rapidapi.com)
2. Subscribe to the **Cricbuzz Cricket** API (free tier available)
3. Copy your API key
4. Open `script.js` and replace the placeholder on **line 12**:

```js
var RAPIDAPI_KEY = 'YOUR_NEW_RAPIDAPI_KEY';  // ← paste here
```

> ⚠️ **Never commit your real API key to a public GitHub repository.** Consider using a backend proxy or environment variable injection for production.

---

## 📡 API Endpoints Used

| Data | Endpoint |
|---|---|
| Live matches | `GET /matches/v1/live` |
| Upcoming matches | `GET /matches/v1/upcoming` |
| Recent / completed | `GET /matches/v1/recent` |
| International series | `GET /series/v1/international` |
| ICC Rankings | `GET /stats/v1/rankings/{role}?formatType={format}` |

**Roles:** `batsmen` · `bowlers` · `allrounders`  
**Formats:** `test` · `odi` · `t20`

---

## 📺 Watch Live

The Watch Live section embeds third-party stream players using iframe embeds. Three channels are included by default:

| Channel | Embed Source |
|---|---|
| Willow Cricket | `pooembed.eu/embed/willow-cricket` |
| Sony LIV Sports | `pooembed.eu/embed/sonyliv-sports` |
| Star Sports 1 | `pooembed.eu/embed/star-sports-1` |

You can add your own stream by clicking **"+ Add Custom Stream"** and pasting any iframe embed URL.

> Stream availability depends on third-party providers and your region.

---

## 🗂️ File Structure

```
cricverse/
├── index.html       # Homepage
├── stats.html       # Rankings & scorecards
├── about.html       # About page
├── contact.html     # Contact form
├── styles.css       # All styles (shared across pages)
├── script.js        # Shared JS — API, navbar, watch live, ticker
└── README.md
```

---

## 🚀 Deployment (GitHub Pages)

1. Fork or clone this repository
2. Add your RapidAPI key to `script.js`
3. Push to GitHub
4. Go to **Settings → Pages → Branch: main → Save**
5. Your site will be live at `https://yourusername.github.io/repo-name`

---

## 🎨 Design

- **Font:** Bebas Neue (display) + Barlow Condensed (UI) + Barlow (body)
- **Theme:** Dark background `#0a0c0f` with cyan `#00e5ff` and orange `#ff6b35` accents
- **Animations:** CSS keyframe staggered reveals, spinning cricket field rings, live pulse indicators
- **Noise overlay:** Subtle SVG fractalNoise texture for depth

---

## 🛠️ Tech Stack

![HTML](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![RapidAPI](https://img.shields.io/badge/RapidAPI-0055DA?style=flat&logo=rapidapi&logoColor=white)

- HTML5 / CSS3 / Vanilla JavaScript
- Cricbuzz API via RapidAPI
- Google Fonts
- GitHub Pages (hosting)

---

## 👤 Author

**Mohan Paudel**  
Computer Engineering Student — ACEM, Tribhuvan University  
🌐 [mohanpaudel761.com.np](https://mohanpaudel761.com.np)  
🐙 [github.com/paudelmohan27](https://github.com/paudelmohan27)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

*Data provided by [Cricbuzz](https://www.cricbuzz.com) via RapidAPI. Stream embeds are third-party services.*
