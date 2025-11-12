 import React from "react";
import "./IslamicMasterclassLanding.css";

export default function IslamicMasterclassLanding() {
  const handleLogin = () => {
    // TODO: wire up to your auth / router
    console.log("Login clicked");
  };

  const handleSignUp = () => {
    // TODO: wire up to your auth / router
    console.log("Sign Up clicked");
  };

  const handleScrollToCourses = () => {
    const el = document.getElementById("courses");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="im-page">
      {/* Fixed Header */}
      <header className="im-header">
        <div className="im-logo-badge">IM</div>
        <nav className="im-nav-actions">
          <button className="im-pill-outline" onClick={handleLogin}>
            Login
          </button>
          <button className="im-pill-blue" onClick={handleSignUp}>
            Sign Up
          </button>
        </nav>
      </header>
      <div className="im-spacer" aria-hidden="true" />

      {/* Hero */}
      <section className="im-hero">
        <div className="im-hero-inner">
          <div className="im-hero-pill">Online Quran & Islamic Studies Platform</div>
          <h1 lang="ar" dir="rtl" className="im-hero-heading">
            تعلّم القرآن وعلوم الإسلام بسهولة
          </h1>
          <p className="im-hero-subtitle">
            Structured, instructor-led courses for kids, teens, and adults — with
            Quran reading, Tajwīd, Arabic, Tafsīr, and more.
          </p>
          <div className="im-hero-actions">
            <button className="im-pill-blue im-hero-cta" onClick={handleScrollToCourses}>
              Browse Courses
            </button>
            <button className="im-link-button" onClick={handleSignUp}>
              Start Learning →
            </button>
          </div>
        </div>
      </section>

      {/* Courses */}
      <section className="im-section" id="courses">
        <div className="im-section-header">
          <h2 className="im-title">Explore Courses</h2>
          <p className="im-section-subtitle">
            Hand-picked tracks to build strong Quran, Arabic, and Islamic foundations.
          </p>
        </div>

        {/* Optional “filter chips” row (static for now) */}
        <div className="im-filter-row">
          <button className="im-chip im-chip-active">All</button>
          <button className="im-chip">Qur’an</button>
          <button className="im-chip">Tajwīd</button>
          <button className="im-chip">Arabic</button>
          <button className="im-chip">Kids</button>
        </div>

        <div className="im-grid">
          {/* Tile 1: Qur'an Reading Basics */}
          <div className="im-course-wrap">
            <div className="im-course-meta">
              <span className="im-pill-meta">Beginner</span>
              <span className="im-pill-tag">Qur’an</span>
            </div>
            <div className="im-buttons">
              <button className="im-pill-blue">Enroll</button>
            </div>
            <div className="im-card">
              <svg
                className="im-thumb"
                viewBox="0 0 1024 600"
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                aria-label="Qur'an Reading Basics"
              >
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#f6faf7" />
                    <stop offset="100%" stopColor="#ffffff" />
                  </linearGradient>
                </defs>
                <rect width="100%" height="100%" fill="url(#g1)" />
                {/* stacked books */}
                <rect
                  x="110"
                  y="360"
                  width="320"
                  height="40"
                  rx="6"
                  fill="#e2efe7"
                  stroke="#cfe3d9"
                />
                <rect
                  x="120"
                  y="320"
                  width="320"
                  height="40"
                  rx="6"
                  fill="#d7ebdf"
                  stroke="#c6dfd3"
                />
                <rect
                  x="130"
                  y="280"
                  width="320"
                  height="40"
                  rx="6"
                  fill="#cce6d9"
                  stroke="#bddacc"
                />
                {/* title */}
                <text
                  x="60%"
                  y="46%"
                  textAnchor="middle"
                  fontSize="40"
                  fill="#0b2017"
                  fontFamily="Arial"
                  fontWeight="700"
                >
                  Qur&apos;an Reading Basics
                </text>
                <text
                  x="60%"
                  y="62%"
                  textAnchor="middle"
                  fontSize="24"
                  fill="#0b2017"
                  fontFamily="Arial"
                >
                  Letters • Short Surahs • Makharij
                </text>
              </svg>
            </div>
          </div>

          {/* Tile 2: Tajwīd Essentials */}
          <div className="im-course-wrap">
            <div className="im-course-meta">
              <span className="im-pill-meta">Intermediate</span>
              <span className="im-pill-tag">Tajwīd</span>
            </div>
            <div className="im-buttons">
              <button className="im-pill-blue">Enroll</button>
            </div>
            <div className="im-card">
              <svg
                className="im-thumb"
                viewBox="0 0 1024 600"
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                aria-label="Tajwīd Essentials"
              >
                <rect width="100%" height="100%" fill="#ffffff" />
                <rect
                  x="22"
                  y="22"
                  width="980"
                  height="556"
                  rx="14"
                  fill="#f6faf7"
                  stroke="#e2efe7"
                  strokeWidth="2"
                />
                {/* simple calligraphy swirl */}
                <path
                  d="M180 400 C 260 320, 360 320, 440 400
                     C 520 480, 620 480, 740 380"
                  fill="none"
                  stroke="#caa83a"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                <text
                  x="50%"
                  y="46%"
                  textAnchor="middle"
                  fontSize="40"
                  fill="#0b2017"
                  fontFamily="Arial"
                  fontWeight="700"
                >
                  Tajwīd Essentials
                </text>
                <text
                  x="50%"
                  y="62%"
                  textAnchor="middle"
                  fontSize="24"
                  fill="#0b2017"
                  fontFamily="Arial"
                >
                  Makharij • Rules • Practice
                </text>
              </svg>
            </div>
          </div>

          {/* Tile 3: Library of Arabic Islamic Books */}
          <div className="im-course-wrap">
            <div className="im-course-meta">
              <span className="im-pill-meta">All Levels</span>
              <span className="im-pill-tag">Library</span>
            </div>
            <div className="im-buttons">
              <button className="im-pill-blue">Enroll</button>
            </div>
            <div className="im-card">
              <svg
                className="im-thumb"
                viewBox="0 0 1024 600"
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                aria-label="Arabic/Islamic Book Library"
              >
                <rect width="100%" height="100%" fill="#ffffff" />
                <rect
                  x="60"
                  y="180"
                  width="904"
                  height="260"
                  fill="#e2efe7"
                  stroke="#cfe3d9"
                />
                {/* books on shelf */}
                <g transform="translate(90,200)">
                  <rect width="40" height="200" fill="#d7ebdf" />
                  <rect x="60" width="40" height="200" fill="#cce6d9" />
                  <rect x="120" width="40" height="200" fill="#d7ebdf" />
                  <rect x="180" width="40" height="200" fill="#cce6d9" />
                  <rect x="240" width="40" height="200" fill="#d7ebdf" />
                  <rect x="300" width="40" height="200" fill="#cce6d9" />
                  <rect x="360" width="40" height="200" fill="#d7ebdf" />
                  <rect x="420" width="40" height="200" fill="#cce6d9" />
                  <rect x="480" width="40" height="200" fill="#d7ebdf" />
                  <rect x="540" width="40" height="200" fill="#cce6d9" />
                  <rect x="600" width="40" height="200" fill="#d7ebdf" />
                </g>
                <text
                  x="50%"
                  y="80%"
                  textAnchor="middle"
                  fontSize="28"
                  fill="#0b2017"
                  fontFamily="Arial"
                >
                  Library of Arabic/Islamic Books
                </text>
              </svg>
            </div>
          </div>

          {/* Tile 4: Arabic for the Qur’an */}
          <div className="im-course-wrap">
            <div className="im-course-meta">
              <span className="im-pill-meta">Beginner–Intermediate</span>
              <span className="im-pill-tag">Arabic</span>
            </div>
            <div className="im-buttons">
              <button className="im-pill-blue">Enroll</button>
            </div>
            <div className="im-card">
              <svg
                className="im-thumb"
                viewBox="0 0 1024 600"
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                aria-label="Arabic for the Qur’an"
              >
                <rect width="100%" height="100%" fill="#ffffff" />
                <rect
                  x="22"
                  y="22"
                  width="980"
                  height="556"
                  rx="14"
                  fill="#f6faf7"
                  stroke="#e2efe7"
                  strokeWidth="2"
                />
                {/* page lines */}
                <g stroke="#d9eae2">
                  <line x1="120" y1="220" x2="904" y2="220" />
                  <line x1="120" y1="260" x2="904" y2="260" />
                  <line x1="120" y1="300" x2="904" y2="300" />
                  <line x1="120" y1="340" x2="904" y2="340" />
                </g>
                <text
                  x="50%"
                  y="46%"
                  textAnchor="middle"
                  fontSize="40"
                  fill="#0b2017"
                  fontFamily="Arial"
                  fontWeight="700"
                >
                  Arabic for the Qur&apos;an
                </text>
                <text
                  x="50%"
                  y="62%"
                  textAnchor="middle"
                  fontSize="24"
                  fill="#0b2017"
                  fontFamily="Arial"
                >
                  Grammar • Vocabulary • Parsing
                </text>
              </svg>
            </div>
          </div>

          {/* Tile 5: Qur’anic Calligraphy & Scripts */}
          <div className="im-course-wrap">
            <div className="im-course-meta">
              <span className="im-pill-meta">Elective</span>
              <span className="im-pill-tag">Calligraphy</span>
            </div>
            <div className="im-buttons">
              <button className="im-pill-blue">Enroll</button>
            </div>
            <div className="im-card">
              <svg
                className="im-thumb"
                viewBox="0 0 1024 600"
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                aria-label="Qur'anic Calligraphy"
              >
                <rect width="100%" height="100%" fill="#ffffff" />
                <rect
                  x="140"
                  y="100"
                  width="744"
                  height="400"
                  rx="16"
                  fill="#f6faf7"
                  stroke="#e2efe7"
                />
                {/* abstract calligraphy strokes */}
                <path
                  d="M220 300 q80 -120 160 0 t160 0 t160 0"
                  fill="none"
                  stroke="#caa83a"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                <path
                  d="M260 340 q60 -60 120 0 t120 0 t120 0"
                  fill="none"
                  stroke="#0b2017"
                  strokeWidth="3"
                  strokeLinecap="round"
                  opacity=".8"
                />
                <text
                  x="50%"
                  y="82%"
                  textAnchor="middle"
                  fontSize="26"
                  fill="#0b2017"
                  fontFamily="Arial"
                >
                  Qur&apos;anic Calligraphy &amp; Scripts
                </text>
              </svg>
            </div>
          </div>

          {/* Tile 6: Tafsīr Overview */}
          <div className="im-course-wrap">
            <div className="im-course-meta">
              <span className="im-pill-meta">Intermediate</span>
              <span className="im-pill-tag">Tafsīr</span>
            </div>
            <div className="im-buttons">
              <button className="im-pill-blue">Enroll</button>
            </div>
            <div className="im-card">
              <svg
                className="im-thumb"
                viewBox="0 0 1024 600"
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                aria-label="Tafsīr Overview"
              >
                <rect width="100%" height="100%" fill="#ffffff" />
                <rect
                  x="22"
                  y="22"
                  width="980"
                  height="556"
                  rx="14"
                  fill="#f6faf7"
                  stroke="#e2efe7"
                  strokeWidth="2"
                />
                {/* commentary bubbles */}
                <circle cx="240" cy="280" r="16" fill="#caa83a" />
                <rect
                  x="260"
                  y="268"
                  width="520"
                  height="24"
                  rx="8"
                  fill="#e8f3ee"
                />
                <circle cx="240" cy="330" r="16" fill="#caa83a" />
                <rect
                  x="260"
                  y="318"
                  width="520"
                  height="24"
                  rx="8"
                  fill="#e8f3ee"
                />
                <text
                  x="50%"
                  y="46%"
                  textAnchor="middle"
                  fontSize="40"
                  fill="#0b2017"
                  fontFamily="Arial"
                  fontWeight="700"
                >
                  Tafsīr Overview
                </text>
                <text
                  x="50%"
                  y="62%"
                  textAnchor="middle"
                  fontSize="24"
                  fill="#0b2017"
                  fontFamily="Arial"
                >
                  Themes • Context • Sources
                </text>
              </svg>
            </div>
          </div>

          {/* Tile 7: Classics of Tafsīr & Fiqh */}
          <div className="im-course-wrap">
            <div className="im-course-meta">
              <span className="im-pill-meta">Advanced</span>
              <span className="im-pill-tag">Scholarly</span>
            </div>
            <div className="im-buttons">
              <button className="im-pill-blue">Enroll</button>
            </div>
            <div className="im-card">
              <svg
                className="im-thumb"
                viewBox="0 0 1024 600"
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                aria-label="Stack of Islamic Books"
              >
                <rect width="100%" height="100%" fill="#ffffff" />
                <g transform="translate(312,180)">
                  <rect
                    x="0"
                    y="220"
                    width="400"
                    height="40"
                    rx="6"
                    fill="#d7ebdf"
                    stroke="#c6dfd3"
                  />
                  <rect
                    x="20"
                    y="180"
                    width="400"
                    height="40"
                    rx="6"
                    fill="#cce6d9"
                    stroke="#bddacc"
                  />
                  <rect
                    x="40"
                    y="140"
                    width="400"
                    height="40"
                    rx="6"
                    fill="#d7ebdf"
                    stroke="#c6dfd3"
                  />
                  <rect
                    x="60"
                    y="100"
                    width="400"
                    height="40"
                    rx="6"
                    fill="#cce6d9"
                    stroke="#bddacc"
                  />
                </g>
                <text
                  x="50%"
                  y="82%"
                  textAnchor="middle"
                  fontSize="26"
                  fill="#0b2017"
                  fontFamily="Arial"
                >
                  Classics of Tafsīr &amp; Fiqh
                </text>
              </svg>
            </div>
          </div>

          {/* Tile 8: Kids’ Qur’an Club */}
          <div className="im-course-wrap">
            <div className="im-course-meta">
              <span className="im-pill-meta">Kids</span>
              <span className="im-pill-tag">Qur’an & Stories</span>
            </div>
            <div className="im-buttons">
              <button className="im-pill-blue">Enroll</button>
            </div>
            <div className="im-card">
              <svg
                className="im-thumb"
                viewBox="0 0 1024 600"
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                aria-label="Kids’ Qur’an Club"
              >
                <rect width="100%" height="100%" fill="#ffffff" />
                <rect
                  x="180"
                  y="160"
                  width="664"
                  height="280"
                  rx="18"
                  fill="#f6faf7"
                  stroke="#e2efe7"
                />
                {/* book icon */}
                <path
                  d="M260 220 h220 a20 20 0 0 1 20 20 v140 h-240 z"
                  fill="#d7ebdf"
                  stroke="#c6dfd3"
                />
                <path
                  d="M260 220 v160 h-40 v-140 a20 20 0 0 1 20-20 z"
                  fill="#cce6d9"
                  stroke="#bddacc"
                />
                {/* stars */}
                <g fill="#caa83a">
                  <path d="M740 230l10 18 20 3-15 14 4 20-19-10-19 10 4-20-15-14 20-3z" />
                  <path d="M690 300l8 14 16 3-12 12 3 16-15-8-15 8 3-16-12-12 16-3z" />
                  <path d="M780 340l6 12 14 3-10 10 3 14-13-7-13 7 3-14-10-10 14-3z" />
                </g>
                <text
                  x="50%"
                  y="82%"
                  textAnchor="middle"
                  fontSize="26"
                  fill="#0b2017"
                  fontFamily="Arial"
                >
                  Kids&apos; Qur&apos;an Club — Stories &amp; Recitation
                </text>
              </svg>
            </div>
          </div>
        </div>
      </section>

      <footer className="im-footer">© Islamic Masterclass</footer>
    </div>
  );
}
