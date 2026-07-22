<template>
  <div class="landing">
    <!-- ============ NAV ============ -->
    <nav class="nav" :class="{ scrolled: discroll }">
      <div class="nav-inner">
        <a class="brand" href="#top" @click.prevent="keAtas">
          <img class="logo" :src="logoSolid" alt="Xdemia">
        </a>
        <div class="nav-links">
          <a href="#feed" @click.prevent="keBagian('feed')">Network</a>
          <a href="#communities" @click.prevent="keBagian('communities')">Communities</a>
          <a href="#scholarships" @click.prevent="keBagian('scholarships')">Scholarships</a>
          <a href="#blocks" @click.prevent="keBagian('blocks')">Building Blocks</a>
          <a href="#trust" @click.prevent="keBagian('trust')">Trust</a>
        </div>
        <div class="nav-cta">
          <router-link class="login" to="/login">Log in</router-link>
          <router-link class="btn btn-primary" to="/login">Join free <span class="arr">→</span></router-link>
          <button class="burger" :class="{ open: drawerTerbuka }" aria-label="Menu" @click="drawerTerbuka = !drawerTerbuka">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </nav>

    <div class="nav-drawer" :class="{ open: drawerTerbuka }" @click="tutupDrawerLuar">
      <div class="nav-panel">
        <a href="#feed" @click.prevent="keBagian('feed')">Network</a>
        <a href="#communities" @click.prevent="keBagian('communities')">Communities</a>
        <a href="#scholarships" @click.prevent="keBagian('scholarships')">Scholarships</a>
        <a href="#blocks" @click.prevent="keBagian('blocks')">Building Blocks</a>
        <a href="#trust" @click.prevent="keBagian('trust')">Trust</a>
        <div class="nav-panel-cta">
          <router-link class="btn btn-ghost" to="/login" @click.native="drawerTerbuka = false">Log in</router-link>
          <router-link class="btn btn-primary" to="/login" @click.native="drawerTerbuka = false">Join free <span class="arr">→</span></router-link>
        </div>
      </div>
    </div>

    <!-- ============ BANNER ============ -->
    <header class="banner" :class="{ in: masuk }" id="top">
      <div class="banner-stage">
        <div
          v-for="(s, i) in slides"
          :key="i"
          class="banner-slide"
          :class="{ active: i === slideAktif }"
        >
          <img :src="s.img" :alt="s.name" :style="s.flip ? { transform: 'scaleX(-1)' } : {}">
        </div>
      </div>
      <div class="banner-scrim"></div>

      <div class="banner-content">
        <div class="banner-grid">
          <div class="banner-inner">
            <h1 class="banner-head">
              <span class="t1">Learn.</span><span class="t2">Research.</span><span class="t3">Grow.</span>
            </h1>
          </div>

          <div class="banner-side">
            <div class="banner-login">
              <h3>Sign in</h3>
              <div class="login-field">
                <label>Your email</label>
                <input v-model="email" type="email" placeholder="yourname@youremail.xyz" autocomplete="email">
              </div>
              <div class="login-field">
                <label>Password</label>
                <div class="login-pw-wrap">
                  <input v-model="password" :type="lihatSandi ? 'text' : 'password'" placeholder="Password" autocomplete="current-password" @keyup.enter="masukAksi">
                  <button type="button" class="login-show" @click="lihatSandi = !lihatSandi">{{ lihatSandi ? 'Hide' : 'Show' }}</button>
                </div>
              </div>
              <div class="login-keep">
                <label class="login-check"><input v-model="ingat" type="checkbox"> Keep me logged in</label>
                <button type="button" class="btn btn-primary login-signin" @click="masukAksi">Sign in</button>
              </div>
              <router-link class="login-forgot" to="/login">Forgot password?</router-link>
              <div class="login-download">
                <span>Download now</span>
                <a href="#" class="dl-btn" @click.prevent><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 10v6M9 13l3 3 3-3"/></svg></a>
                <a href="#" class="dl-btn" @click.prevent><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3M9 21h10a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2z"/></svg></a>
              </div>
            </div>
            <p class="banner-lead">The social platform for lifelong learning. Built in Europe.</p>
          </div>
        </div>
      </div>

      <div class="banner-figure">
        <div class="banner-figure-img-wrap">
          <span class="bar"></span>
          <span class="who"><span class="name">{{ slideAktifData.name }}</span><span class="role">{{ slideAktifData.role }}</span></span>
        </div>
      </div>

      <div class="banner-dots">
        <button
          v-for="(s, i) in slides"
          :key="'dot-' + i"
          :class="{ active: i === slideAktif }"
          :aria-label="'Show ' + s.name"
          @click="pilihSlide(i)"
        ><span class="fill"></span></button>
      </div>
      <div class="banner-scroll"><span>Scroll</span><span class="ln2"></span></div>
    </header>

    <!-- ============ STAT STRIP ============ -->
    <section class="statband reveal" :class="{ in: masuk }">
      <div class="shell statband-inner">
        <div class="sb"><span class="n">{{ hitung.scholarships }}+</span><span class="l">Scholarships worldwide</span></div>
        <div class="sb"><span class="n">+{{ hitung.blocks }}</span><span class="l">Building Blocks</span></div>
        <div class="sb"><span class="n">+5<small>GB</small></span><span class="l">Free secure</span></div>
      </div>
    </section>

    <!-- ============ PRODUCT SHOWCASE ============ -->
    <section class="hero" id="feed">
      <div class="shell hero-inner">
        <div class="hero-top reveal" :class="{ in: revealed.hero }">
          <span class="eyebrow">Built for learners</span>
          <h2 class="hero-head">One home for everything<br>you <span class="hl">learn.</span></h2>
          <p class="lead">Your feed, your communities, your courses, your scholarships — all in one trusted place. Here's what Xdemia looks like inside.</p>
        </div>

        <div class="hero-shot reveal d2" :class="{ in: revealed.hero }">
          <div class="xd-frame">
            <div class="xd-bar">
              <div class="xd-dots"><i></i><i></i><i></i></div>
              <div class="xd-url"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>app.xdemia.com</div>
            </div>
            <div class="xd-app">
              <div class="xd-top">
                <div class="xd-top-l">
                  <span class="xd-logo">x<b>δ</b></span>
                  <span class="xd-search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3-3"/></svg>Search…</span>
                </div>
                <div class="xd-tabs">
                  <span class="xd-tab on"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/></svg>Home</span>
                  <span class="xd-tab"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0 1 12 0"/><circle cx="17" cy="9" r="2.2"/></svg>Members</span>
                  <span class="xd-tab"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/></svg>Communities</span>
                  <span class="xd-tab"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4.5" width="18" height="16" rx="2"/><path d="M3 9h18M8 2.5v4M16 2.5v4"/></svg>Events</span>
                  <span class="xd-tab"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 7h18v12H3zM3 7l3-3h6l2 3"/></svg>My Drive</span>
                </div>
                <div class="xd-top-r">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 11.5a8.5 8.5 0 0 1-12 7.7L3 21l1.8-6A8.5 8.5 0 1 1 21 11.5z"/></svg>
                  <span class="xd-bell"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg><span class="badge">26</span></span>
                  <span class="xd-ava"><span class="pic">FA</span><svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg></span>
                  <span class="xd-support"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="2.5" y="13" width="4" height="6" rx="1.5"/><rect x="17.5" y="13" width="4" height="6" rx="1.5"/></svg></span>
                </div>
              </div>
              <div class="xd-grid">
                <aside class="xd-side-left">
                  <div class="xd-panel">
                    <div class="xd-side-h">Discover more</div>
                    <ul class="xd-disco">
                      <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 21h18M5 21V9l7-5 7 5v12M9 21v-6h6v6"/></svg>Institutes</li>
                      <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="4" y="3" width="16" height="18" rx="1.5"/><path d="M8 7h2M8 11h2M8 15h2M14 7h2M14 11h2"/></svg>Organisations</li>
                      <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 5v14M8 5v14M13 5l5 14"/></svg>Repository <em class="beta">(Beta)</em></li>
                      <li class="on"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="8" rx="1.5"/><rect x="3" y="13" width="8" height="8" rx="1.5"/></svg>Building Blocks <span class="dot"></span></li>
                      <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 6h13v12H4z"/><path d="M17 9l3-1.5v9L17 15"/></svg>Courses <span class="dot"></span></li>
                      <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M14 4l6 6-9 9-6 1 1-6z"/></svg>Scholarships</li>
                      <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="4" y="4" width="16" height="16" rx="1.5"/><path d="M8 9h8M8 13h5"/></svg>Newsroom <span class="dot"></span></li>
                      <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 20s-7-4.5-7-9.5A3.5 3.5 0 0 1 12 7a3.5 3.5 0 0 1 7 3.5C19 15.5 12 20 12 20z"/></svg>Favourites <em class="beta">(0)</em></li>
                    </ul>
                  </div>
                  <div class="xd-panel xd-comm-card">
                    <div class="xd-comm-h">Communities <span class="plus">+</span></div>
                    <div class="xd-comm-item"><span class="cv"><b>xδ</b></span><span><span class="nm">Xdemia Marketing</span><span class="st">Closed</span></span></div>
                  </div>
                </aside>

                <section class="xd-center">
                  <div class="xd-compose">
                    <span class="me">FA</span>
                    <span class="field">Start a conversation… <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14l4-4h12a2 2 0 0 0 2-2z"/></svg></span>
                    <span class="post">Post</span>
                  </div>
                  <div class="xd-articles">
                    <div class="xd-art-h"><span class="t">Recent articles</span><span class="more">Show more</span></div>
                    <div class="xd-art-row">
                      <article v-for="a in artikel" :key="a.judul" class="xd-art">
                        <div class="img"><img :src="a.gambar" alt=""><span class="fav"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20s-7-4.5-7-9.5A3.5 3.5 0 0 1 12 7a3.5 3.5 0 0 1 7 3.5C19 15.5 12 20 12 20z"/></svg></span></div>
                        <div class="by"><span class="av" :style="{ background: a.warnaAvatar }">{{ a.inisial }}</span>{{ a.penulis }} <span class="vf">✓</span></div>
                        <h5>{{ a.judul }}</h5>
                        <p>{{ a.ringkasan }}</p>
                        <div class="meta"><span>{{ a.tanggal }}</span><span class="v"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>{{ a.dilihat }} Views</span></div>
                      </article>
                    </div>
                    <div class="xd-feed-tabs"><span class="on">Posts from your network</span><span>What others say</span></div>
                  </div>
                </section>

                <aside class="xd-side-right">
                  <div class="xd-panel xd-r-card">
                    <div class="xd-r-h"><span class="t">Data Activity</span><span class="up">Upgrade</span></div>
                    <div class="xd-data-bar"><i></i></div>
                    <div class="xd-data-txt">0% used · 0.27 GB of 20 GB <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v4h1"/></svg></div>
                  </div>
                  <div class="xd-panel xd-r-card">
                    <div class="xd-r-h"><span class="t">Events</span><span class="plus">+</span></div>
                    <div class="xd-ev"><span class="th"><img :src="portrait('satyarthi')" alt=""></span><span><span class="nm">Video News Challenge</span><span class="dt">06/10/2025</span></span></div>
                    <div class="xd-ev"><span class="th"><img :src="portrait('comenius')" alt=""></span><span><span class="nm">LRT City Sentul</span><span class="dt">06/04/2026</span></span></div>
                  </div>
                  <div class="xd-panel xd-r-card">
                    <div class="xd-r-h"><span class="t">Recent files</span></div>
                    <div class="xd-file"><span class="ic">PDF</span><span class="nm">LRT City Sentul.pdf</span></div>
                    <div class="xd-file"><span class="ic">PDF</span><span class="nm">Adhi Cipta Community.pdf</span></div>
                    <div class="xd-file"><span class="ic file">FILE</span><span class="nm">Logo Xdemia</span></div>
                  </div>
                </aside>
              </div>
              <span class="xd-msg"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>Messages</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============ TRUST ============ -->
    <section class="trust" id="trust">
      <div class="shell trust-grid">
        <div class="reveal" :class="{ in: revealed.trust }">
          <span class="eyebrow">Trust by design</span>
          <h2 class="h2">Beyond BigTech. No profiling.<br>No hidden agenda.</h2>
        </div>
        <div class="trust-list">
          <div class="treveal reveal d1" :class="{ in: revealed.trust }"><span class="tnum">EU</span><div><h4>Built &amp; hosted in the European Union</h4><p>Privacy, security and data sovereignty by design — your data stays yours.</p></div></div>
          <div class="treveal reveal d2" :class="{ in: revealed.trust }"><span class="tnum">✓</span><div><h4>Verified members, encrypted messaging</h4><p>Real people, real institutions. Communication you can trust.</p></div></div>
          <div class="treveal reveal d3" :class="{ in: revealed.trust }"><span class="tnum">∅</span><div><h4>No third-party data sharing</h4><p>Built for learning — not for advertising or attention extraction.</p></div></div>
        </div>
      </div>
    </section>

    <!-- ============ FEATURE: PUBLIC INSTITUTIONS ============ -->
    <section class="feat flip" id="institutions">
      <div class="shell feat-wrap">
        <div class="feat-copy reveal" :class="{ in: revealed.institutions }">
          <span class="eyebrow">Co-created with Public Institutions</span>
          <h2>Helping public education grow. Through lifelong learning. Across borders.</h2>
          <p>Xdemia helps public VET and Higher Education institutions bring lifelong learning to new audiences.</p>
          <p class="p-muted">We provide the tools, technology and trusted European infrastructure — including LMS integrations or Xdemia's own built-in LMS — so institutions can publish, share and monetize courses while focusing on what they do best: creating high-quality educational content.</p>
        </div>
        <div class="feat-shot reveal d2" :class="{ in: revealed.institutions }">
          <div class="xd-frame">
            <div class="xd-bar"><div class="xd-dots"><i></i><i></i><i></i></div><div class="xd-url">app.xdemia.com/institutions</div></div>
            <div class="xd-app xd-pad">
              <div class="xd-panel">
                <div class="xd-dash-head">
                  <div class="xd-dash-title">Institution Dashboard</div>
                  <div class="xd-dash-sub">Manage your public learning presence</div>
                </div>
                <div class="xd-dash-rows">
                  <div class="xd-dash-row">
                    <span class="tag pub">PUB</span>
                    <div><div class="rt">Publish courses</div><div class="rs">Reach learners beyond your LMS</div></div>
                    <span class="active">Active</span>
                  </div>
                  <div class="xd-dash-row">
                    <span class="tag mgt">MGT</span>
                    <div><div class="rt">Manage &amp; share</div><div class="rs">Content, access and analytics</div></div>
                    <span class="active">Active</span>
                  </div>
                  <div class="xd-dash-row">
                    <span class="tag eur">€</span>
                    <div><div class="rt">Monetize content</div><div class="rs">Secure payments, EU compliant</div></div>
                    <span class="active">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============ FEATURE: BUILDING BLOCKS ============ -->
    <section class="feat" id="blocks">
      <div class="shell feat-wrap">
        <div class="feat-copy reveal" :class="{ in: revealed.blocks }">
          <span class="eyebrow">Building Blocks · Beta</span>
          <h2>Education, at the smallest meaningful level.</h2>
          <p>A Building Block is a curated peer-reviewed set of related learning elements — lectures, readings, datasets, lab setups and assignments — that together cover one topic. Use a whole block, or pull the single element you need.</p>
          <ul class="flist">
            <li><span class="ck">✓</span>Authored by teachers and experts at public institutions</li>
            <li><span class="ck">✓</span>Updated continuously — never rebuilt from scratch</li>
            <li><span class="ck">✓</span>Filter by EQF level, complexity, KAI &amp; CDIO</li>
          </ul>
        </div>
        <div class="feat-shot reveal d2" :class="{ in: revealed.blocks }">
          <div class="xd-frame">
            <div class="xd-bar"><div class="xd-dots"><i></i><i></i><i></i></div><div class="xd-url">app.xdemia.com/building-blocks</div></div>
            <div class="xd-app xd-pad">
              <div class="xd-panel">
                <div class="xd-bb-tabs"><span>About</span><span class="on">Catalogue (84)</span><span class="r">My BBs (0)</span></div>
                <div v-for="b in buildingBlocks" :key="b.judul" class="xd-bb-item">
                  <div class="xd-bb-img"><img :src="b.gambar" alt=""><span class="inst">{{ b.institusi }}</span></div>
                  <div class="xd-bb-body">
                    <div class="xd-bb-src">{{ b.sumber }}</div>
                    <h5>{{ b.judul }}</h5>
                    <div class="xd-bb-sys">System</div>
                    <div class="xd-bb-chips"><span v-for="c in b.chip" :key="c">{{ c }}</span></div>
                    <div class="xd-bb-foot"><span class="au">{{ b.inisialPenulis }}</span><span class="aun">{{ b.penulis }}</span><span class="tag">Author</span><span class="priv"><span class="mapb">Map</span>Private</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============ LMS BRIDGE ============ -->
    <section class="bridge" id="bridge">
      <div class="shell bridge-wrap">
        <div class="bridge-viz reveal" :class="{ in: revealed.bridge }">
          <div class="bv-head">
            <span class="bv-label">One course · two campuses</span>
            <span class="bv-status"><i></i>Syncing</span>
          </div>
          <div class="bv-flow">
            <div class="bv-inst"><span class="bv-logo">RA</span><span class="bv-name">RWTH Aachen</span><span class="bv-sys">Moodle LMS</span></div>
            <div class="bv-rail">
              <span class="bv-line"></span>
              <span class="bv-hub">x<span>δ</span></span>
              <span class="bv-hub-label">Bridge</span>
              <span class="bv-packet"><span class="pk-ico">▤</span><span class="pk-txt">LCA for charging infrastructure</span></span>
            </div>
            <div class="bv-inst"><span class="bv-logo alt">KL</span><span class="bv-name">KU Leuven</span><span class="bv-sys">Canvas LMS</span></div>
          </div>
          <div class="bv-foot">
            <span class="bv-foot-item"><b>0</b> extra logins</span>
            <span class="bv-foot-item"><b>1</b> shared course</span>
            <span class="bv-foot-item"><b>∞</b> borders crossed</span>
          </div>
        </div>
        <div class="bridge-copy reveal d1" :class="{ in: revealed.bridge }">
          <span class="eyebrow">The LMS Bridge</span>
          <h2 class="h2">Open education, across every border.</h2>
          <p>The LMS Bridge lets teachers share courses and content across different LMS systems. Students no longer register separately at partner institutions to follow exchange programmes — the course travels with them.</p>
          <p class="euro">It brings the true European spirit of education to life: <em>open, trusted, collaborative</em>.</p>
        </div>
      </div>
    </section>

    <!-- ============ COLLABORATION ============ -->
    <section class="partners" id="collab">
      <div class="shell">
        <div class="sec-head reveal center" :class="{ in: revealed.partners }">
          <span class="eyebrow">In collaboration</span>
          <h2 class="h2">Built with <span class="hl">leading institutions</span> across Europe.</h2>
        </div>
      </div>
      <div class="marquee">
        <div class="marquee-track">
          <div v-for="(p, i) in partnersDobel" :key="p.nama + i" class="plogo">
            <div class="card"><img :src="p.logo" :alt="p.nama" :title="p.nama" loading="lazy"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============ FEATURE: COMMUNITIES ============ -->
    <section class="feat" id="communities">
      <div class="shell feat-wrap">
        <div class="feat-copy reveal" :class="{ in: revealed.communities }">
          <span class="eyebrow">Communities</span>
          <h2>Find your people. Build your circle.</h2>
          <p>Open or closed spaces where students, teachers and researchers gather around the topics they care about — connected to your profile, courses and content.</p>
          <ul class="flist">
            <li><span class="ck">✓</span>Create a community in a click — open to all, or invite-only</li>
            <li><span class="ck">✓</span>Owned and moderated by real, verified members</li>
            <li><span class="ck">✓</span>From a 10-person study group to a 5,000-strong network</li>
          </ul>
        </div>
        <div class="feat-shot reveal d2" :class="{ in: revealed.communities }">
          <div class="xd-frame">
            <div class="xd-bar"><div class="xd-dots"><i></i><i></i><i></i></div><div class="xd-url">app.xdemia.com/communities</div></div>
            <div class="xd-app xd-pad">
              <div class="xd-panel">
                <div class="xd-c-row">
                  <div class="xd-c-cover"><span class="badge">x<b>δ</b></span></div>
                  <div class="xd-c-info"><div class="nm">Xdemia Marketing</div><div class="ow">Owner · <b>Firos Kariman</b></div><div class="ds">The Xdemia marketing studio</div></div>
                  <div class="xd-c-meta"><span class="xd-c-status">Closed · 10 members</span><span class="xd-c-join">Joined</span></div>
                </div>
                <div class="xd-c-row">
                  <div class="xd-c-cover b"><span class="badge">x<b>δ</b></span></div>
                  <div class="xd-c-info"><div class="nm">Xdemia Support</div><div class="ow">Owner · <b>Firos Kariman</b></div><div class="ds">Help and answers from the Xdemia team</div></div>
                  <div class="xd-c-meta"><span class="xd-c-status">Open · 5.4K members</span><span class="xd-c-join">Joined</span></div>
                </div>
                <div class="xd-c-row">
                  <div class="xd-c-cover"><span class="badge">JF</span></div>
                  <div class="xd-c-info"><div class="nm">Jurnalis x Felicia</div><div class="ow">Owner · <b>Felicia Annabel</b></div><div class="ds">Discuss journals and content on this platform</div></div>
                  <div class="xd-c-meta"><span class="xd-c-status">Open · 1.2K members</span><span class="xd-c-join">Join</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============ FEATURE: SCHOLARSHIPS ============ -->
    <section class="feat flip" id="scholarships">
      <div class="shell feat-wrap">
        <div class="feat-copy reveal" :class="{ in: revealed.scholarships }">
          <span class="eyebrow">Scholarships</span>
          <h2>Find your dream study — and fund it.</h2>
          <p>Browse more than a thousand scholarships from across the world, compare your fit, and apply with confidence. Talent should never be limited by access.</p>
          <ul class="flist">
            <li><span class="ck">✓</span>1,000+ opportunities, continuously updated</li>
            <li><span class="ck">✓</span>Compare programmes and read what other students say</li>
            <li><span class="ck">✓</span>A guided path from search to application</li>
          </ul>
        </div>
        <div class="feat-shot reveal d2" :class="{ in: revealed.scholarships }">
          <div class="xd-frame">
            <div class="xd-bar"><div class="xd-dots"><i></i><i></i><i></i></div><div class="xd-url">app.xdemia.com/scholarships</div></div>
            <div class="xd-app xd-pad">
              <div class="xd-panel">
                <div class="xd-schol-hero">
                  <img :src="portrait('satyarthi')" alt="">
                  <div class="sc"></div>
                  <h4>Find your dream study</h4>
                  <p>find scholarships to finance your study</p>
                </div>
                <div class="xd-flow">
                  <div class="xd-step"><span class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="11" cy="11" r="7"/><path d="m20 20-3-3"/></svg></span><h5>All Results</h5><p>Browse 1,000+ scholarships from all over the world.</p></div>
                  <div class="xd-step"><span class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 7h7v13H4zM13 4h7v16h-7z"/></svg></span><h5>Compare</h5><p>Check your fit and read what other students say.</p></div>
                  <div class="xd-step"><span class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/></svg></span><h5>Decide</h5><p>Shortlist the programmes that fit you best.</p></div>
                  <div class="xd-step"><span class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/></svg></span><h5>Apply</h5><p>When you feel confident, apply with one click.</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============ VIDEO TILES ============ -->
    <section class="video-tiles" id="join">
      <div class="shell">
        <div class="tiles-grid">
          <div v-for="(t, i) in tiles" :key="t.judul" class="tile reveal" :class="['d' + (i + 1), { in: revealed.tiles }]">
            <div class="tile-thumb">
              <img :src="t.gambar" :alt="t.judul">
              <div class="tile-overlay">
                <button class="tile-play" aria-label="Play video">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><polygon points="6,4 20,12 6,20"/></svg>
                </button>
              </div>
              <div class="tile-duration">{{ t.durasi }}</div>
            </div>
            <div class="tile-info">
              <p class="tile-tag">{{ t.tag }}</p>
              <h4>{{ t.judul }}</h4>
              <p class="tile-desc">{{ t.deskripsi }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============ FOOTER ============ -->
    <footer>
      <div class="shell">
        <div class="foot-grid">
          <div class="foot-brand">
            <a class="brand" href="#top" @click.prevent="keAtas"><img class="logo" :src="logoWhite" alt="Xdemia"></a>
            <p>The social network built for learning — content, communities and communication from trusted public institutions.</p>
            <span class="foot-eu"><span class="stars">★</span> Made &amp; hosted in the European Union</span>
          </div>
          <div class="foot-col">
            <h4>Platform</h4>
            <a href="#feed" @click.prevent="keBagian('feed')">Network &amp; feed</a>
            <a href="#communities" @click.prevent="keBagian('communities')">Communities</a>
            <a href="#blocks" @click.prevent="keBagian('blocks')">Building Blocks</a>
            <a href="#scholarships" @click.prevent="keBagian('scholarships')">Scholarships</a>
          </div>
          <div class="foot-col">
            <h4>Discover</h4>
            <a href="#" @click.prevent>Members</a>
            <a href="#" @click.prevent>Events</a>
            <a href="#" @click.prevent>Newsroom</a>
            <a href="#" @click.prevent>Repository</a>
          </div>
          <div class="foot-col">
            <h4>Institutions</h4>
            <a href="#collab" @click.prevent="keBagian('collab')">Partner with us</a>
            <a href="#bridge" @click.prevent="keBagian('bridge')">LMS Bridge</a>
            <a href="#trust" @click.prevent="keBagian('trust')">Privacy &amp; data</a>
            <a href="#" @click.prevent>Contact</a>
          </div>
        </div>
        <div class="foot-bottom">
          <span>© {{ tahun }} Xdemia. Learn · Research · Grow.</span>
          <span class="links"><a href="#" @click.prevent>Privacy</a><a href="#" @click.prevent>Security</a><a href="#" @click.prevent>Data sovereignty</a><a href="#" @click.prevent>Terms</a></span>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
const SLIDES = [
  { img: 'malala', name: 'Malala Yousafzai', role: 'Nobel Peace Prize · education activist' },
  { img: 'mandela', name: 'Nelson Mandela', flip: true, role: '"Education is the most powerful weapon."' },
  { img: 'einstein', name: 'Albert Einstein', role: 'Theoretical physicist · 1879–1955' },
  { img: 'comenius', name: 'Jan Amos Comenius', role: 'Father of modern education' },
  { img: 'satyarthi', name: 'Kailash Satyarthi', role: 'Nobel Peace Prize · child’s right to learn' },
  { img: 'velaz', name: 'José María Vélaz', flip: true, role: 'Founder of Fe y Alegría' },
  { img: 'plato', name: 'Plato', flip: true, role: 'Founder of the Academy · c. 387 BC' },
  { img: 'einstein-old', name: 'Albert Einstein', role: '"The training of the mind to think."' }
]

const PBASE = 'https://p4elecs.com/storage/partners/'
const PARTNERS = [
  ['KU Leuven', '01J7AZKYKN38NP69FD89JG0NHX'],
  ['UC Leuven-Limburg', '01J7B1ZX3Y977GAZTBD8EPXFD8'],
  ['T2-Campus', '01J7B20PSHHBQ7X7KSFXC0Q3H3'],
  ['DCInergy', '01J7B25PHV6K480RPEF3R4K99F'],
  ['Encon', '01J97HA5C975AQR9W9YFSJ94HH'],
  ['RWTH Aachen', '01J7B2BJM0G70WC1G8EJMJKF9J'],
  ['TH Köln', '01J7B2D6MMB3D5BVH83CMWTAVB'],
  ['Werner von Siemens Schule', '01J8DM4XN1ZEFR706M9AM8DWRK'],
  ['FEN Aachen', '01J7B2KR8QCGEJ323T5F68SM50'],
  ['Politecnico di Torino', '01J8DK3G272PHKWEKP7AXGKAFR'],
  ['Forma-re-te', '01J7B2PRC6TQEWAX7J84J155PP'],
  ['Manufacturing Industry 4.0', '01J7B2V0YTDV0PYB3W3KDW0AFY'],
  ['Progetto Arcadia', '01J9PSAVVTBA47HDYG2NETZT3E'],
  ['Riga Technical University', '01J7B2M6WE75AAZ6GES9Y1Q6F9'],
  ['LEPEBA Latvia', '01J7B2MTFF5SBAJN6CBCZRZEK9'],
  ['Ventspils Tehnikums', '01J7KBA7HACBBYTFPNN761F731'],
  ['HAN University', '01J8DKP8ABE7NTRTAQ4AJC7GA4'],
  ['The Hague University', '01J8DKXD6BYC4S0K2WRQ0VX64P'],
  ['ISSO', '01J97HC3SFN4K71B3JAZS28PG0'],
  ['Stichting Gelijkspanning', '01J7B2ZB0NDGDWVTKW6KCY6ZF5'],
  ['DC Opportunities', '01J7B2ZV14N51GC412QN71P96D'],
  ['Heijmans', '01J7B30HCYPFRCZCXZJAZ2HYKE']
]

function portraitSrc (id) {
  return require(`@/assets/assets/portraits/${id}.png`)
}

export default {
  name: 'Landing',
  data () {
    return {
      masuk: false,
      slideAktif: 0,
      slideTimer: null,
      email: '',
      password: '',
      ingat: false,
      lihatSandi: false,
      discroll: false,
      drawerTerbuka: false,
      hitung: { scholarships: 0, blocks: 0 },
      revealed: { hero: false, trust: false, institutions: false, blocks: false, bridge: false, partners: false, communities: false, scholarships: false, tiles: false },
      logoSolid: require('@/assets/assets/brand/logo-solid.png'),
      logoWhite: require('@/assets/assets/brand/logo-white.png'),
      slides: SLIDES.map((s) => ({ ...s, img: portraitSrc(s.img) })),
      artikel: [
        { gambar: portraitSrc('malala'), inisial: 'AG', warnaAvatar: '#6a2a86', penulis: 'Ari Ganesa', judul: 'Academic Identity Crisis in the Automation Era', ringkasan: 'For a long time, academic identity felt clear. Good grades reflected real understanding…', tanggal: '6 May 2026', dilihat: 21 },
        { gambar: portraitSrc('mandela'), inisial: 'IF', warnaAvatar: '#0a464e', penulis: 'Ibnu Fanhar', judul: 'Kerja Rodi Di Balik Algoritma FYP', ringkasan: 'Bayangin kamu masuk ke dunia kerja ala film The Devil Wears Prada…', tanggal: '13 April 2026', dilihat: 288 },
        { gambar: portraitSrc('einstein'), inisial: 'IF', warnaAvatar: '#0a464e', penulis: 'Ibnu Fanhar', judul: 'Exploitation Behind Algorithm', ringkasan: 'Imagine entering a world like The Devil Wears Prada, where every demand…', tanggal: '8 April 2026', dilihat: 57 }
      ],
      buildingBlocks: [
        { gambar: portraitSrc('comenius'), institusi: 'RWTH AACHEN', sumber: 'P4ELECS · DC Charging Plazas', judul: 'LCA for different charging infrastructure systems', chip: ['Master 7', 'Application', 'Conceive', 'Intermediate', '8 Hours'], inisialPenulis: 'ME', penulis: 'Menna Elsobki' },
        { gambar: portraitSrc('plato'), institusi: 'RWTH AACHEN', sumber: 'P4ELECS · PV', judul: 'Life cycle assessment of electricity from PV systems', chip: ['Master 7', 'Application', 'Intermediate', '8 Hours'], inisialPenulis: 'ME', penulis: 'Menna Elsobki' }
      ],
      tiles: [
        { gambar: portraitSrc('einstein'), tag: 'Faculty', judul: 'Save faculty time', deskripsi: 'Automate course design, assignments, and grading with AI, so educators can focus on teaching.', durasi: '2:34' },
        { gambar: portraitSrc('malala'), tag: 'Students', judul: 'Boost student retention', deskripsi: 'Improve engagement and course completion rates through proven pedagogical methods that foster deeper learning.', durasi: '3:12' },
        { gambar: portraitSrc('mandela'), tag: 'Careers', judul: 'Develop career-ready skills', deskripsi: 'Track and develop the skills employers seek, helping your graduates excel in the job market.', durasi: '4:05' },
        { gambar: portraitSrc('satyarthi'), tag: 'Teaching', judul: 'Support every teaching style', deskripsi: 'Accommodate diverse pedagogies with a flexible system that meets the unique needs of every educator.', durasi: '3:48' }
      ],
      partners: PARTNERS.map(([nama, id]) => ({ nama, logo: `${PBASE}${id}.jpg` }))
    }
  },
  computed: {
    tahun () { return new Date().getFullYear() },
    slideAktifData () { return this.slides[this.slideAktif] },
    partnersDobel () { return this.partners.concat(this.partners) }
  },
  mounted () {
    setTimeout(() => { this.masuk = true }, 120)
    this.restartSlide()
    window.addEventListener('scroll', this.onScroll, { passive: true })
    this.onScroll()
    this.animateCount('scholarships', 2500)
    this.animateCount('blocks', 80)
    this.revealTimer = setTimeout(() => {
      Object.keys(this.revealed).forEach((k) => { this.revealed[k] = true })
    }, 200)
  },
  beforeDestroy () {
    clearInterval(this.slideTimer)
    clearTimeout(this.revealTimer)
    window.removeEventListener('scroll', this.onScroll)
  },
  methods: {
    portrait (id) { return portraitSrc(id) },
    onScroll () { this.discroll = window.scrollY > 40 },
    keAtas () { window.scrollTo({ top: 0, behavior: 'smooth' }); this.drawerTerbuka = false },
    keBagian (id) {
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
      this.drawerTerbuka = false
    },
    tutupDrawerLuar (e) {
      if (!e.target.closest('.nav-panel')) this.drawerTerbuka = false
    },
    pilihSlide (i) { this.slideAktif = i; this.restartSlide() },
    restartSlide () {
      clearInterval(this.slideTimer)
      this.slideTimer = setInterval(() => {
        this.slideAktif = (this.slideAktif + 1) % this.slides.length
      }, 6000)
    },
    animateCount (kunci, target) {
      const dur = 1400
      const t0 = performance.now()
      const tick = (now) => {
        const p = Math.min(1, (now - t0) / dur)
        const eased = 1 - Math.pow(1 - p, 3)
        this.hitung[kunci] = Math.round(target * eased)
        if (p < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    },
    masukAksi () {
      this.$store.dispatch('auth/login', { email: this.email, password: this.password })
      this.$router.push(this.$route.query.next || '/home')
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Poppins:wght@300;400;500;600;700&display=swap');

.landing{
  --teal:#088898; --teal-deep:#066a76; --teal-ink:#05525c;
  --green:#4dba87; --green-deep:#3a9c6e;
  --bg-l:#ffffff; --bg-soft:#f2f8f8; --bg-2:#e8f2f2; --tint:#e6f4f3; --tint-green:#e8f6ee;
  --text-l:#14282d; --muted-l:#566c71; --faint:#8aa0a4; --line-l:#e0eaea; --line-soft:#eef5f5;
  --night:#05343a;
  --head:'Plus Jakarta Sans', system-ui, sans-serif; --body:'Poppins', system-ui, sans-serif;
  --maxw:1280px; --gutter:clamp(20px,5vw,72px);
  --r-sm:12px; --r:18px; --r-lg:28px;
  --sh:0 18px 44px -22px rgba(8,40,45,.22); --sh-sm:0 8px 22px -14px rgba(8,40,45,.18);
  --ease:cubic-bezier(.22,.61,.36,1);
  background:var(--bg-l); color:var(--text-l); font-family:var(--body); font-weight:400; font-size:17px; line-height:1.62; overflow-x:clip;
}
.landing *{box-sizing:border-box}
.landing a{color:inherit;text-decoration:none}
.landing img{display:block;max-width:100%}
.landing button{font-family:inherit;cursor:pointer;border:none;background:none;color:inherit}
.landing .shell{max-width:var(--maxw);margin:0 auto;padding-inline:var(--gutter)}
.landing section{position:relative}

.eyebrow{font-family:var(--head);font-weight:600;font-size:.76rem;letter-spacing:.02em;color:var(--teal-deep);background:var(--tint);display:inline-flex;align-items:center;gap:.5em;padding:.5em 1em;border-radius:100px}
.eyebrow::before{content:"";width:7px;height:7px;border-radius:50%;background:var(--teal)}
.landing h1,.landing h2,.landing h3,.landing h4{font-family:var(--head);font-weight:700;line-height:1.08;letter-spacing:-.02em;color:var(--text-l)}
.h2{font-size:clamp(2rem,4.2vw,3.4rem);font-weight:700;line-height:1.04;letter-spacing:-.025em}
.lead{font-family:var(--body);font-size:clamp(1.05rem,1.4vw,1.28rem);color:var(--muted-l);font-weight:400;line-height:1.55}

.btn{display:inline-flex;align-items:center;gap:.55em;font-family:var(--head);font-weight:600;font-size:.95rem;padding:.85em 1.6em;border-radius:100px;transition:all .28s var(--ease);white-space:nowrap}
.btn .arr{transition:transform .28s var(--ease)}
.btn:hover .arr{transform:translateX(4px)}
.btn-primary{background:var(--teal);color:#fff;box-shadow:0 10px 26px -12px rgba(8,136,152,.65)}
a.btn-primary{color:#fff}
.btn-primary:hover{background:var(--teal-deep);box-shadow:0 14px 32px -12px rgba(8,136,152,.7);transform:translateY(-1px)}
.btn-ghost{border:1.5px solid var(--line-l);color:var(--text-l);background:#fff}
.btn-ghost:hover{border-color:var(--teal);color:var(--teal-deep);background:var(--tint)}

/* NAV */
.nav{position:sticky;top:0;z-index:100;background:rgba(255,255,255,.82);backdrop-filter:blur(16px) saturate(140%);border-bottom:1px solid transparent;transition:border-color .3s,box-shadow .3s}
.nav.scrolled{border-bottom-color:var(--line-l);box-shadow:0 6px 24px -20px rgba(8,40,45,.4)}
.nav-inner{max-width:var(--maxw);margin:0 auto;padding:15px var(--gutter);display:flex;align-items:center;justify-content:space-between;gap:24px}
.brand{display:flex;align-items:center;gap:12px}
.brand .logo{height:34px;width:auto;display:block;transition:opacity .25s}
.brand:hover .logo{opacity:.75}
.nav-links{display:flex;align-items:center;gap:30px}
.nav-links a{font-family:var(--head);font-size:.92rem;font-weight:500;color:var(--muted-l);transition:color .2s;position:relative}
.nav-links a:hover{color:var(--text-l)}
.nav-cta{display:flex;align-items:center;gap:16px}
.nav-cta .login{font-family:var(--head);font-weight:600;font-size:.92rem;color:var(--text-l)}
.burger{display:none;flex-direction:column;gap:5px;padding:8px;z-index:200}
.burger span{width:24px;height:2px;background:var(--text-l);border-radius:2px;transition:transform .3s var(--ease),opacity .3s}
.burger.open span:nth-child(1){transform:translateY(7px) rotate(45deg)}
.burger.open span:nth-child(2){opacity:0}
.burger.open span:nth-child(3){transform:translateY(-7px) rotate(-45deg)}

.nav-drawer{display:none;position:fixed;top:0;left:0;right:0;bottom:0;z-index:99;background:rgba(20,40,45,.45);backdrop-filter:blur(2px);opacity:0;transition:opacity .3s var(--ease);pointer-events:none}
.nav-drawer.open{opacity:1;pointer-events:all}
.nav-panel{position:absolute;top:0;right:0;width:min(300px,80vw);height:100%;background:#fff;padding:80px 28px 40px;display:flex;flex-direction:column;gap:6px;transform:translateX(100%);transition:transform .34s var(--ease);box-shadow:-20px 0 60px -20px rgba(8,40,45,.25);overflow-y:auto}
.nav-drawer.open .nav-panel{transform:translateX(0)}
.nav-panel a{font-family:var(--head);font-weight:600;font-size:1.08rem;color:var(--text-l);padding:13px 0;border-bottom:1px solid var(--line-soft);display:block}
.nav-panel a:last-of-type{border-bottom:none}
.nav-panel a:hover{color:var(--teal)}
.nav-panel .nav-panel-cta{margin-top:20px;display:flex;flex-direction:column;gap:12px}
.nav-panel .nav-panel-cta .btn{justify-content:center;text-align:center}

/* BANNER */
.banner{position:relative;height:88svh;min-height:560px;max-height:900px;overflow:hidden;background:#0a1a1e}
.banner-stage{position:absolute;inset:0}
.banner-slide{position:absolute;inset:0;opacity:0;transition:opacity 1.4s var(--ease)}
.banner-slide.active{opacity:1}
.banner-slide img{width:100%;height:100%;object-fit:cover;object-position:left center;filter:grayscale(100%) contrast(1.05) brightness(.88)}
.banner-scrim{position:absolute;inset:0;z-index:2;background:linear-gradient(0deg,rgba(6,16,18,.9) 0%,rgba(6,16,18,.28) 26%,rgba(6,16,18,.04) 52%,transparent 100%),linear-gradient(270deg,rgba(6,16,18,.88) 0%,rgba(6,16,18,.55) 28%,rgba(6,16,18,.08) 50%,transparent 65%)}
.banner-content{position:relative;z-index:4;height:100%;max-width:var(--maxw);margin:0 auto;padding:clamp(48px,8vh,80px) var(--gutter) 0;display:flex;flex-direction:column;justify-content:flex-start}
.banner-grid{display:flex;align-items:flex-start;justify-content:space-between;gap:40px;width:100%}
.banner-inner{max-width:380px;padding-top:6px;flex-shrink:0}
.banner-head{font-family:var(--head);font-weight:800;font-size:clamp(2.2rem,4.8vw,4.4rem);line-height:1;letter-spacing:-.03em;color:#fff;margin-bottom:0;display:flex;flex-wrap:nowrap;gap:.18em;align-items:baseline;white-space:nowrap;opacity:0;transform:translateY(14px);transition:all .9s var(--ease) .3s}
.banner.in .banner-head{opacity:1;transform:none}
.banner-head .t1{color:var(--teal)}
.banner-head .t2{color:#fff}
.banner-head .t3{color:rgba(255,255,255,.7)}
.banner-figure{position:absolute;left:var(--gutter);bottom:clamp(38px,6vh,64px);z-index:5;display:flex;flex-direction:column;align-items:flex-start;gap:8px;max-width:260px;opacity:0;transition:opacity .8s var(--ease) .6s}
.banner.in .banner-figure{opacity:1}
.banner-figure .bar{width:28px;height:2px;background:var(--green);flex-shrink:0;display:block}
.banner-figure .who{color:#fff}
.banner-figure .name{font-family:var(--head);font-weight:700;font-size:1rem;display:block;letter-spacing:-.01em}
.banner-figure .role{font-family:var(--body);font-size:.74rem;color:rgba(255,255,255,.68);margin-top:2px;display:block}
.banner-side{display:flex;flex-direction:column;gap:18px;width:300px;flex-shrink:0}
.banner-lead{font-size:.97rem;line-height:1.6;color:rgba(255,255,255,.92);opacity:0;transform:translateY(14px);transition:all .9s var(--ease) .56s}
.banner.in .banner-lead{opacity:1;transform:none}
.banner-login{position:relative;z-index:5;background:#fff;border-radius:var(--r-sm);padding:22px 24px 18px;width:100%;display:flex;flex-direction:column;gap:12px;box-shadow:0 24px 56px -20px rgba(8,40,45,.45);opacity:0;transform:translateY(14px);transition:opacity .9s var(--ease) .42s,transform .9s var(--ease) .42s}
.banner.in .banner-login{opacity:1;transform:none}
.banner-login h3{margin:0;font-family:var(--head);font-weight:700;font-size:1.05rem;color:var(--text-l)}
.login-field{display:flex;flex-direction:column;gap:4px}
.login-field label{font-family:var(--head);font-size:.72rem;font-weight:600;color:var(--muted-l)}
.login-field input{border:1px solid var(--line-l);border-radius:6px;padding:8px 10px;font-family:var(--body);font-size:.84rem;color:var(--text-l);outline:none;transition:border-color .2s;background:#fff;width:100%}
.login-field input:focus{border-color:var(--teal)}
.login-pw-wrap{position:relative;display:flex;align-items:center}
.login-pw-wrap input{padding-right:52px}
.login-show{position:absolute;right:10px;font-family:var(--head);font-size:.72rem;font-weight:600;color:var(--teal-deep);background:none;border:none;cursor:pointer;padding:0}
.login-keep{display:flex;align-items:center;justify-content:space-between;gap:8px}
.login-check{display:flex;align-items:center;gap:6px;font-family:var(--body);font-size:.76rem;color:var(--muted-l);cursor:pointer}
.login-check input{accent-color:var(--teal);width:14px;height:14px;cursor:pointer}
.login-signin{padding:.52em 1.2em;font-size:.82rem;border-radius:100px;border:none;cursor:pointer}
.login-forgot{font-family:var(--head);font-size:.76rem;font-weight:600;color:var(--teal-deep);text-align:center;display:block}
.login-forgot:hover{text-decoration:underline}
.login-download{display:flex;align-items:center;justify-content:flex-end;gap:8px;border-top:1px solid var(--line-l);padding-top:11px;font-family:var(--head);font-size:.72rem;color:var(--muted-l)}
.dl-btn{display:grid;place-items:center;width:28px;height:28px;border:1px solid var(--line-l);border-radius:7px;color:var(--text-l);transition:border-color .2s,color .2s}
.dl-btn:hover{border-color:var(--teal);color:var(--teal)}
.banner-dots{position:absolute;left:var(--gutter);bottom:clamp(38px,6vh,52px);z-index:5;display:flex;gap:8px}
.banner-dots button{width:26px;height:3px;background:rgba(255,255,255,.3);border-radius:2px;overflow:hidden;position:relative;cursor:pointer}
.banner-dots button .fill{position:absolute;inset:0;width:0;background:var(--green)}
.banner-dots button.active .fill{width:100%;transition:width 6s linear}
.banner-scroll{position:absolute;left:50%;bottom:18px;transform:translateX(-50%);z-index:5;color:rgba(255,255,255,.6);font-family:var(--head);font-size:.6rem;letter-spacing:.28em;text-transform:uppercase;display:flex;flex-direction:column;align-items:center;gap:8px}
.banner-scroll .ln2{width:1px;height:30px;background:linear-gradient(var(--green),transparent)}

/* STAT BAND */
.statband{background:var(--teal);padding:clamp(28px,4vw,44px) 0}
.statband-inner{display:grid;grid-template-columns:repeat(3,1fr);max-width:720px;margin-inline:auto;gap:24px}
.statband .sb{text-align:center;color:#fff;position:relative}
.statband .sb:not(:last-child)::after{content:"";position:absolute;right:-12px;top:14%;height:72%;width:1px;background:rgba(255,255,255,.2)}
.statband .n{font-family:var(--head);font-weight:800;font-size:clamp(2rem,3.4vw,2.9rem);line-height:1;letter-spacing:-.02em;display:block}
.statband .n small{font-size:.5em;font-weight:700;margin-left:2px}
.statband .l{font-family:var(--body);font-size:.84rem;color:rgba(255,255,255,.85);margin-top:7px;display:block}

.reveal{opacity:0;transform:translateY(26px);transition:opacity .8s var(--ease),transform .8s var(--ease)}
.reveal.in{opacity:1;transform:none}
.reveal.d1{transition-delay:.07s}.reveal.d2{transition-delay:.14s}.reveal.d3{transition-delay:.21s}.reveal.d4{transition-delay:.28s}
.sec-head{max-width:720px;margin-bottom:clamp(36px,5vw,54px)}
.sec-head .eyebrow{margin-bottom:18px}
.sec-head.center{margin-inline:auto;text-align:center}

/* HERO showcase */
.hero{background:linear-gradient(180deg,var(--bg-soft) 0%,#fff 62%);padding:clamp(54px,8vh,100px) 0 clamp(40px,5vw,72px);position:relative;overflow:hidden}
.hero-inner{position:relative;z-index:2}
.hero-top{text-align:center;max-width:760px;margin:0 auto clamp(34px,4vw,52px)}
.hero .eyebrow{margin-bottom:22px}
.hero-head{font-family:var(--head);font-weight:800;font-size:clamp(2.5rem,5.6vw,4.6rem);line-height:1;letter-spacing:-.038em;margin-bottom:22px}
.hero-head .hl{color:var(--teal);position:relative;white-space:nowrap}
.hero .lead{max-width:560px;margin:0 auto 28px}
.hero-shot{max-width:1120px;margin:0 auto;position:relative}

/* xd- product mockup */
.xd-frame{border-radius:16px;overflow:hidden;background:#eef3f5;border:1px solid var(--line-l);box-shadow:0 40px 90px -40px rgba(8,40,45,.4),0 8px 24px -16px rgba(8,40,45,.3)}
.xd-bar{display:flex;align-items:center;gap:14px;padding:11px 16px;background:#fff;border-bottom:1px solid var(--line-l)}
.xd-dots{display:flex;gap:7px}
.xd-dots i{width:11px;height:11px;border-radius:50%;display:block}
.xd-dots i:nth-child(1){background:#ff5f57}.xd-dots i:nth-child(2){background:#febc2e}.xd-dots i:nth-child(3){background:#28c840}
.xd-url{flex:1;max-width:300px;margin:0 auto;background:#f1f5f6;border-radius:100px;padding:5px 14px;font-family:var(--body);font-size:.74rem;color:var(--faint);text-align:center;display:flex;align-items:center;justify-content:center;gap:6px}
.xd-url svg{width:11px;height:11px}
.xd-app{background:#eef3f5;font-family:var(--body);color:var(--text-l);position:relative;overflow:hidden}
.xd-pad{padding:20px}
.xd-top{display:flex;align-items:center;justify-content:space-between;gap:18px;background:#fff;padding:11px 20px;border-bottom:1px solid var(--line-l)}
.xd-top-l{display:flex;align-items:center;gap:14px;flex-shrink:0}
.xd-logo{width:34px;height:34px;border:2px solid var(--teal);border-radius:9px;display:grid;place-items:center;font-family:var(--head);font-weight:700;color:var(--teal);font-size:.92rem}
.xd-logo b{color:var(--green-deep);font-weight:700}
.xd-search{display:flex;align-items:center;gap:8px;background:#fff;border:1.5px solid var(--teal);border-radius:100px;padding:7px 16px;width:200px;color:var(--faint);font-size:.8rem}
.xd-search svg{width:14px;height:14px;color:var(--teal)}
.xd-tabs{display:flex;align-items:center;gap:6px}
.xd-tab{display:flex;flex-direction:column;align-items:center;gap:3px;padding:6px 16px;border-radius:10px;color:var(--teal-deep);font-family:var(--head);font-weight:500;font-size:.72rem}
.xd-tab svg{width:21px;height:21px}
.xd-tab.on{background:var(--tint)}
.xd-top-r{display:flex;align-items:center;gap:16px;flex-shrink:0;color:var(--teal-deep)}
.xd-top-r svg{width:20px;height:20px}
.xd-bell{position:relative}
.xd-bell .badge{position:absolute;top:-7px;right:-8px;background:#e8503a;color:#fff;font-family:var(--head);font-size:.56rem;font-weight:700;border-radius:100px;padding:1px 5px;line-height:1.5}
.xd-ava{display:flex;align-items:center;gap:5px}
.xd-ava .pic{width:30px;height:30px;border-radius:50%;background:#6a2a86;color:#fff;display:grid;place-items:center;font-family:var(--head);font-weight:700;font-size:.68rem;position:relative}
.xd-ava .chev{width:14px;height:14px}
.xd-support{width:30px;height:30px;border-radius:50%;background:#f08a24;display:grid;place-items:center;color:#fff}
.xd-support svg{width:16px;height:16px;color:#fff}
.xd-grid{display:grid;grid-template-columns:228px 1fr 244px;gap:16px;padding:16px;align-items:start}
.xd-panel{background:#fff;border-radius:14px;padding:16px;border:1px solid #eaf0f1}
.xd-side-h{font-family:var(--head);font-weight:700;font-size:.92rem;color:var(--text-l);margin-bottom:14px}
.xd-disco{list-style:none;display:flex;flex-direction:column;gap:3px}
.xd-disco li{display:flex;align-items:center;gap:12px;padding:8px 10px;border-radius:9px;font-size:.82rem;color:var(--muted-l)}
.xd-disco li.on{background:var(--tint);color:var(--teal-deep);font-weight:600}
.xd-disco li svg{width:18px;height:18px;color:var(--teal-deep);flex-shrink:0}
.xd-disco li .dot{width:6px;height:6px;border-radius:50%;background:var(--teal);margin-left:auto}
.xd-disco .beta{font-style:normal;color:var(--faint);font-size:.72rem;font-weight:400}
.xd-comm-card{margin-top:14px}
.xd-comm-h{display:flex;align-items:center;justify-content:space-between;font-family:var(--head);font-weight:700;font-size:.92rem;margin-bottom:12px}
.xd-comm-h .plus{width:20px;height:20px;border-radius:6px;background:var(--tint);color:var(--teal-deep);display:grid;place-items:center;font-size:.9rem}
.xd-comm-item{display:flex;align-items:center;gap:10px}
.xd-comm-item .cv{width:38px;height:38px;border-radius:9px;background:linear-gradient(135deg,var(--teal),var(--green));display:grid;place-items:center;color:#fff;font-family:var(--head);font-weight:700;font-size:.82rem;flex-shrink:0}
.xd-comm-item .nm{font-family:var(--head);font-weight:600;font-size:.8rem;line-height:1.2}
.xd-comm-item .st{font-size:.72rem;color:var(--faint)}
.xd-compose{display:flex;align-items:center;gap:11px;background:#fff;border-radius:14px;padding:13px;border:1px solid #eaf0f1}
.xd-compose .me{width:38px;height:38px;border-radius:50%;background:#6a2a86;color:#fff;display:grid;place-items:center;font-family:var(--head);font-weight:700;font-size:.74rem;flex-shrink:0}
.xd-compose .field{flex:1;background:#f1f5f6;border-radius:100px;padding:10px 16px;color:var(--faint);font-size:.84rem;display:flex;align-items:center;justify-content:space-between}
.xd-compose .field svg{width:15px;height:15px;color:var(--faint)}
.xd-compose .post{background:#d6ecee;color:var(--teal-deep);font-family:var(--head);font-weight:600;font-size:.82rem;padding:9px 20px;border-radius:9px}
.xd-articles{margin-top:16px;background:#fff;border-radius:14px;padding:16px;border:1px solid #eaf0f1}
.xd-art-h{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px}
.xd-art-h .t{font-family:var(--head);font-weight:700;font-size:1.02rem}
.xd-art-h .more{font-family:var(--head);font-weight:600;font-size:.8rem;color:var(--teal)}
.xd-art-row{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
.xd-art{border-radius:12px;overflow:hidden}
.xd-art .img{aspect-ratio:16/10;position:relative;overflow:hidden;background:#0c2329;border-radius:12px}
.xd-art .img img{width:100%;height:100%;object-fit:cover}
.xd-art .fav{position:absolute;top:9px;right:9px;width:26px;height:26px;border-radius:50%;background:rgba(255,255,255,.92);display:grid;place-items:center;color:var(--teal)}
.xd-art .fav svg{width:13px;height:13px}
.xd-art .by{display:flex;align-items:center;gap:6px;margin-top:10px;font-family:var(--head);font-weight:600;font-size:.76rem;color:var(--text-l)}
.xd-art .by .av{width:18px;height:18px;border-radius:50%;display:grid;place-items:center;color:#fff;font-size:.5rem;font-weight:700}
.xd-art .by .vf{color:var(--teal);font-size:.7rem}
.xd-art h5{font-family:var(--head);font-weight:700;font-size:.86rem;line-height:1.25;margin:7px 0 5px;color:var(--text-l);letter-spacing:-.01em}
.xd-art p{font-size:.74rem;color:var(--muted-l);line-height:1.45;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.xd-art .meta{display:flex;align-items:center;justify-content:space-between;margin-top:8px;font-size:.7rem;color:var(--faint)}
.xd-art .meta .v{display:inline-flex;align-items:center;gap:4px}
.xd-art .meta .v svg{width:12px;height:12px}
.xd-feed-tabs{display:flex;align-items:center;justify-content:center;gap:40px;margin-top:18px;padding-top:16px;border-top:1px solid var(--line-soft)}
.xd-feed-tabs span{font-family:var(--head);font-weight:600;font-size:.86rem;color:var(--faint);position:relative;padding-bottom:8px}
.xd-feed-tabs span.on{color:var(--teal)}
.xd-r-card{margin-bottom:16px}
.xd-r-h{display:flex;align-items:center;justify-content:space-between;margin-bottom:13px}
.xd-r-h .t{font-family:var(--head);font-weight:700;font-size:.92rem}
.xd-r-h .up{font-family:var(--head);font-weight:600;font-size:.74rem;color:var(--teal)}
.xd-r-h .plus{width:20px;height:20px;border-radius:6px;background:var(--tint);color:var(--teal-deep);display:grid;place-items:center;font-size:.9rem}
.xd-data-bar{height:7px;border-radius:100px;background:#eaf0f1;overflow:hidden;margin-bottom:9px}
.xd-data-bar i{display:block;height:100%;width:8%;background:var(--teal);border-radius:100px}
.xd-data-txt{font-size:.74rem;color:var(--muted-l);display:flex;align-items:center;gap:6px}
.xd-data-txt svg{width:13px;height:13px;color:var(--teal);margin-left:auto}
.xd-ev{display:flex;align-items:center;gap:11px;padding:9px 0;border-bottom:1px solid var(--line-soft)}
.xd-ev:last-child{border-bottom:none}
.xd-ev .th{width:46px;height:36px;border-radius:7px;background:linear-gradient(135deg,#0c2329,#0a464e);flex-shrink:0;overflow:hidden}
.xd-ev .th img{width:100%;height:100%;object-fit:cover}
.xd-ev .nm{font-family:var(--head);font-weight:600;font-size:.78rem;line-height:1.2}
.xd-ev .dt{font-size:.72rem;color:var(--faint);margin-top:2px}
.xd-file{display:flex;align-items:center;gap:10px;padding:8px 0}
.xd-file .ic{width:30px;height:34px;border-radius:5px;background:#f1f5f6;display:grid;place-items:center;flex-shrink:0;color:#e8503a;font-family:var(--head);font-weight:700;font-size:.5rem}
.xd-file .ic.file{color:var(--teal-deep)}
.xd-file .nm{font-size:.78rem;color:var(--text-l);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.xd-msg{position:absolute;right:18px;bottom:16px;background:var(--teal);color:#fff;font-family:var(--head);font-weight:600;font-size:.82rem;padding:11px 18px;border-radius:11px;display:flex;align-items:center;gap:9px;box-shadow:0 12px 26px -12px rgba(8,136,152,.7)}
.xd-msg svg{width:16px;height:16px}

/* dashboard rows (institutions) */
.xd-dash-head{padding:14px 0 10px;border-bottom:1px solid var(--line-soft);margin-bottom:12px}
.xd-dash-title{font-family:var(--head);font-weight:700;font-size:.9rem;color:var(--text-l);margin-bottom:6px}
.xd-dash-sub{font-size:.72rem;color:var(--faint)}
.xd-dash-rows{display:flex;flex-direction:column;gap:8px}
.xd-dash-row{display:flex;align-items:center;gap:10px;padding:9px 10px;background:var(--bg-soft);border-radius:8px}
.xd-dash-row .tag{width:28px;height:28px;border-radius:6px;display:grid;place-items:center;color:#fff;font-size:.62rem;font-weight:700;flex-shrink:0}
.xd-dash-row .tag.pub{background:var(--teal)}
.xd-dash-row .tag.mgt{background:var(--green)}
.xd-dash-row .tag.eur{background:var(--teal-deep)}
.xd-dash-row .rt{font-size:.75rem;font-weight:600;color:var(--text-l)}
.xd-dash-row .rs{font-size:.65rem;color:var(--faint)}
.xd-dash-row .active{margin-left:auto;font-size:.62rem;color:var(--teal);font-weight:600}

/* communities mockup */
.xd-c-row{display:flex;align-items:center;gap:16px;padding:14px 4px;border-bottom:1px solid var(--line-soft)}
.xd-c-row:last-child{border-bottom:none}
.xd-c-cover{width:130px;height:74px;border-radius:11px;flex-shrink:0;position:relative;overflow:hidden;background:linear-gradient(120deg,var(--teal),var(--green) 140%)}
.xd-c-cover.b{background:linear-gradient(120deg,#0a464e,#0c6b78)}
.xd-c-cover .badge{position:absolute;left:8px;bottom:8px;width:30px;height:30px;border-radius:8px;background:#fff;display:grid;place-items:center;font-family:var(--head);font-weight:700;font-size:.72rem;color:var(--teal-deep);box-shadow:var(--sh-sm)}
.xd-c-info{flex:1;min-width:0}
.xd-c-info .nm{font-family:var(--head);font-weight:700;font-size:.98rem}
.xd-c-info .ow{font-size:.78rem;color:var(--muted-l);margin:2px 0}
.xd-c-info .ow b{color:var(--teal-deep);font-weight:600}
.xd-c-info .ds{font-size:.78rem;color:var(--faint)}
.xd-c-meta{display:flex;flex-direction:column;align-items:flex-end;gap:8px;flex-shrink:0}
.xd-c-status{font-family:var(--head);font-size:.72rem;font-weight:500;color:var(--muted-l);background:#f1f5f6;padding:4px 11px;border-radius:100px}
.xd-c-join{font-family:var(--head);font-weight:600;font-size:.76rem;color:var(--teal-deep);background:var(--tint);padding:6px 16px;border-radius:100px}

/* scholarship mockup */
.xd-schol-hero{height:150px;border-radius:14px;position:relative;overflow:hidden;background:#0c2329;display:flex;flex-direction:column;justify-content:center;padding:0 30px;margin-bottom:26px}
.xd-schol-hero img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.55}
.xd-schol-hero .sc{position:absolute;inset:0;background:linear-gradient(90deg,rgba(8,40,45,.78),rgba(8,40,45,.2))}
.xd-schol-hero h4{position:relative;z-index:2;font-family:var(--head);font-weight:800;font-size:1.9rem;color:#fff;letter-spacing:-.02em;line-height:1}
.xd-schol-hero p{position:relative;z-index:2;color:rgba(255,255,255,.9);font-size:.94rem;margin-top:6px}
.xd-flow{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;position:relative}
.xd-step{text-align:center;position:relative;z-index:2}
.xd-step .ic{width:60px;height:60px;border-radius:50%;background:#fff;border:1.5px solid var(--line-l);display:grid;place-items:center;margin:0 auto 14px;color:var(--teal-deep)}
.xd-step .ic svg{width:24px;height:24px}
.xd-step h5{font-family:var(--head);font-weight:700;font-size:1rem;margin-bottom:6px}
.xd-step p{font-size:.78rem;color:var(--muted-l);line-height:1.45}

/* building blocks catalogue */
.xd-bb-tabs{display:flex;align-items:center;gap:22px;border-bottom:1px solid var(--line-l);margin-bottom:16px}
.xd-bb-tabs span{font-family:var(--head);font-weight:600;font-size:.86rem;color:var(--faint);padding-bottom:12px;position:relative}
.xd-bb-tabs span.on{color:var(--teal)}
.xd-bb-tabs .r{margin-left:auto;color:var(--muted-l);font-weight:500}
.xd-bb-item{display:flex;gap:16px;padding:16px 0;border-bottom:1px solid var(--line-soft)}
.xd-bb-item:last-child{border-bottom:none}
.xd-bb-img{width:150px;height:104px;border-radius:11px;flex-shrink:0;overflow:hidden;position:relative;background:#0c2329}
.xd-bb-img img{width:100%;height:100%;object-fit:cover}
.xd-bb-img .inst{position:absolute;left:8px;bottom:8px;background:#fff;border-radius:6px;padding:4px 7px;font-family:var(--head);font-weight:700;font-size:.5rem;color:#11407a;letter-spacing:.02em}
.xd-bb-body{flex:1;min-width:0}
.xd-bb-src{font-family:var(--head);font-weight:600;font-size:.76rem;color:var(--teal);margin-bottom:3px}
.xd-bb-body h5{font-family:var(--head);font-weight:700;font-size:1rem;letter-spacing:-.01em}
.xd-bb-sys{font-size:.76rem;color:var(--faint);margin:3px 0 9px}
.xd-bb-chips{display:flex;flex-wrap:wrap;gap:7px}
.xd-bb-chips span{font-family:var(--head);font-size:.68rem;font-weight:500;color:var(--muted-l);background:#f1f5f6;border-radius:7px;padding:4px 10px}
.xd-bb-foot{display:flex;align-items:center;gap:9px;margin-top:11px}
.xd-bb-foot .au{width:26px;height:26px;border-radius:50%;background:var(--teal-deep);display:grid;place-items:center;color:#fff;font-size:.56rem;font-weight:700}
.xd-bb-foot .aun{font-family:var(--head);font-weight:600;font-size:.78rem}
.xd-bb-foot .tag{font-family:var(--head);font-size:.64rem;font-weight:600;color:var(--teal-deep);background:var(--tint);padding:3px 8px;border-radius:100px}
.xd-bb-foot .priv{margin-left:auto;font-family:var(--head);font-weight:600;font-size:.78rem;color:var(--teal-deep);display:inline-flex;align-items:center;gap:6px}
.xd-bb-foot .priv .mapb{background:var(--teal);color:#fff;padding:6px 13px;border-radius:8px;font-size:.74rem}

/* TRUST */
.trust{padding:clamp(64px,9vh,120px) 0}
.trust-grid{display:grid;grid-template-columns:.9fr 1.1fr;gap:clamp(34px,6vw,80px);align-items:start}
.trust-list{display:flex;flex-direction:column;gap:14px}
.treveal{display:flex;gap:20px;align-items:flex-start;background:var(--bg-soft);border:1px solid var(--line-soft);border-radius:var(--r);padding:24px}
.treveal .tnum{flex-shrink:0;width:46px;height:46px;border-radius:12px;background:#fff;border:1px solid var(--line-l);display:grid;place-items:center;font-family:var(--head);font-weight:700;color:var(--teal);font-size:1rem}
.treveal h4{font-family:var(--head);font-weight:700;font-size:1.16rem;margin-bottom:5px}
.treveal p{color:var(--muted-l);font-size:.98rem}

/* feature rows */
.feat{padding:clamp(54px,8vh,100px) 0}
#scholarships.feat{background:var(--bg-soft)}
.feat-wrap{display:grid;grid-template-columns:.82fr 1.18fr;gap:clamp(34px,5vw,72px);align-items:center}
.feat.flip .feat-wrap{grid-template-columns:1.18fr .82fr}
.feat.flip .feat-copy{order:2}
.feat-copy .eyebrow{margin-bottom:18px}
.feat-copy h2{font-size:clamp(1.8rem,3.4vw,2.7rem);margin-bottom:16px;line-height:1.06}
.feat-copy p{color:var(--muted-l);font-size:1.04rem;margin-bottom:16px}
.feat-copy .p-muted{color:var(--muted-l);font-size:1.04rem}
.feat-copy .flist{list-style:none;display:flex;flex-direction:column;gap:11px;margin-top:6px}
.feat-copy .flist li{display:flex;align-items:flex-start;gap:11px;font-size:.98rem;color:var(--text-l)}
.feat-copy .flist li .ck{width:22px;height:22px;border-radius:7px;background:var(--tint);color:var(--teal-deep);display:grid;place-items:center;flex-shrink:0;font-size:.72rem;margin-top:2px}
.feat-shot{position:relative}

/* LMS bridge */
.bridge{padding:clamp(64px,9vh,120px) 0}
.bridge-wrap{display:grid;grid-template-columns:1fr 1.05fr;gap:clamp(40px,6vw,84px);align-items:center}
.bridge-copy h2{margin-bottom:20px}
.bridge-copy p{color:var(--muted-l);font-size:1.04rem;margin-bottom:16px}
.bridge-copy .euro{font-family:var(--head);font-weight:600;color:var(--text-l);font-size:1.24rem;line-height:1.35}
.bridge-copy .euro em{font-style:normal;color:var(--teal-deep)}
.bridge-viz{position:relative;border:1px solid var(--line-l);border-radius:var(--r-lg);background:#fff;box-shadow:var(--sh);padding:clamp(22px,2.6vw,32px);display:flex;flex-direction:column;gap:clamp(22px,3vw,34px)}
.bv-head{display:flex;align-items:center;justify-content:space-between}
.bv-label{font-family:var(--head);font-weight:600;font-size:.78rem;color:var(--muted-l)}
.bv-status{font-family:var(--head);font-weight:600;font-size:.7rem;letter-spacing:.04em;text-transform:uppercase;color:var(--green-deep);display:inline-flex;align-items:center;gap:7px}
.bv-status i{width:8px;height:8px;border-radius:50%;background:var(--green);display:block}
.bv-flow{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:clamp(10px,1.4vw,18px)}
.bv-inst{display:flex;flex-direction:column;align-items:center;gap:7px;text-align:center;width:clamp(78px,9vw,104px)}
.bv-logo{width:52px;height:52px;border-radius:14px;background:var(--teal);color:#fff;display:grid;place-items:center;font-family:var(--head);font-weight:700;font-size:1.05rem;box-shadow:0 10px 22px -12px rgba(8,136,152,.6)}
.bv-logo.alt{background:var(--green-deep);box-shadow:0 10px 22px -12px rgba(58,156,110,.6)}
.bv-name{font-family:var(--head);font-weight:600;font-size:.86rem;line-height:1.15}
.bv-sys{font-family:var(--body);font-size:.7rem;color:var(--faint)}
.bv-rail{position:relative;height:86px;display:flex;align-items:center;justify-content:center}
.bv-line{position:absolute;left:0;right:0;top:50%;height:2px;background:repeating-linear-gradient(90deg,var(--line-l) 0 7px,transparent 7px 13px)}
.bv-hub{position:relative;z-index:2;width:50px;height:50px;border-radius:50%;background:#fff;border:2px solid var(--teal);display:grid;place-items:center;font-family:var(--head);font-weight:700;font-size:1.1rem;color:var(--teal-deep)}
.bv-hub span{color:var(--green-deep)}
.bv-hub-label{position:absolute;top:calc(50% + 34px);font-family:var(--head);font-weight:600;font-size:.62rem;letter-spacing:.1em;text-transform:uppercase;color:var(--faint)}
.bv-packet{position:absolute;top:6px;left:0;z-index:3;display:inline-flex;align-items:center;gap:8px;background:#fff;border:1px solid var(--line-l);border-radius:100px;padding:7px 13px 7px 9px;box-shadow:var(--sh-sm);white-space:nowrap}
.bv-packet .pk-ico{width:20px;height:20px;border-radius:6px;background:var(--tint);color:var(--teal-deep);display:grid;place-items:center;font-size:.7rem}
.bv-packet .pk-txt{font-family:var(--head);font-weight:600;font-size:.74rem;color:var(--text-l)}
.bv-foot{display:flex;gap:0;border-top:1px solid var(--line-l)}
.bv-foot-item{flex:1;text-align:center;font-family:var(--body);font-size:.74rem;color:var(--muted-l);padding-top:16px}
.bv-foot-item:not(:last-child){border-right:1px solid var(--line-l)}
.bv-foot-item b{display:block;font-family:var(--head);font-weight:700;font-size:1.5rem;color:var(--teal);margin-bottom:2px;letter-spacing:-.02em}

/* partners marquee */
.partners{padding:clamp(60px,9vh,110px) 0;overflow:hidden}
.marquee{display:flex;overflow:hidden;-webkit-mask-image:linear-gradient(90deg,transparent,#000 7%,#000 93%,transparent);mask-image:linear-gradient(90deg,transparent,#000 7%,#000 93%,transparent)}
.marquee-track{display:flex;gap:18px;flex-shrink:0;animation:plogoscroll 84s linear infinite;will-change:transform}
.partners:hover .marquee-track{animation-play-state:paused}
@keyframes plogoscroll{to{transform:translateX(calc(-50% - 9px))}}
.plogo{flex-shrink:0;width:150px;height:150px;display:grid;place-items:center}
.plogo .card{width:130px;height:130px;background:#fff;border:1px solid var(--line-l);border-radius:50%;display:grid;place-items:center;padding:26px;box-shadow:var(--sh-sm);transition:border-color .35s,box-shadow .35s}
.plogo:hover .card{border-color:var(--teal);box-shadow:var(--sh)}
.plogo img{max-width:100%;max-height:100%;width:auto;height:auto;object-fit:contain}

/* video tiles */
.video-tiles{padding:clamp(56px,8vh,100px) 0;background:var(--bg-soft)}
.tiles-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:22px}
.tile{background:#fff;border-radius:var(--r);overflow:hidden;border:1px solid var(--line-l);box-shadow:var(--sh-sm);display:flex;flex-direction:column;transition:transform .3s var(--ease),box-shadow .3s var(--ease)}
.tile:hover{transform:translateY(-5px);box-shadow:var(--sh)}
.tile-thumb{position:relative;aspect-ratio:16/10;overflow:hidden;background:#0c2329;flex-shrink:0}
.tile-thumb img{width:100%;height:100%;object-fit:cover;object-position:center top;filter:grayscale(20%) contrast(1.04) brightness(.92);transition:filter .4s var(--ease),transform .5s var(--ease)}
.tile:hover .tile-thumb img{filter:grayscale(0%) contrast(1.06) brightness(1);transform:scale(1.04)}
.tile-overlay{position:absolute;inset:0;background:rgba(6,16,18,.28);display:grid;place-items:center;transition:background .3s var(--ease)}
.tile:hover .tile-overlay{background:rgba(6,16,18,.16)}
.tile-play{width:48px;height:48px;border-radius:50%;background:rgba(255,255,255,.92);border:none;cursor:pointer;display:grid;place-items:center;color:var(--teal-deep);box-shadow:0 6px 20px -6px rgba(0,0,0,.5);transition:transform .25s var(--ease),background .25s;padding-left:3px}
.tile-play:hover{transform:scale(1.12);background:#fff}
.tile-duration{position:absolute;bottom:10px;right:10px;background:rgba(6,16,18,.75);color:#fff;font-family:var(--head);font-size:.66rem;font-weight:600;padding:3px 8px;border-radius:5px;letter-spacing:.02em}
.tile-info{padding:16px 18px 20px;display:flex;flex-direction:column;gap:5px;flex:1}
.tile-tag{font-family:var(--head);font-size:.66rem;font-weight:600;letter-spacing:.07em;text-transform:uppercase;color:var(--teal);margin:0}
.tile-info h4{font-family:var(--head);font-weight:700;font-size:.98rem;line-height:1.22;letter-spacing:-.01em;color:var(--text-l);margin:0}
.tile-desc{font-family:var(--body);font-size:.82rem;color:var(--muted-l);line-height:1.54;margin:0;margin-top:2px}

/* footer */
footer{background:var(--night);color:#fff;padding:64px 0 32px}
.foot-grid{display:grid;grid-template-columns:1.6fr 1fr 1fr 1fr;gap:40px;margin-bottom:48px;padding-bottom:44px;border-bottom:1px solid rgba(255,255,255,.14)}
.foot-brand .brand{margin-bottom:18px}
.foot-brand .logo{height:32px}
.foot-brand p{color:rgba(255,255,255,.66);font-size:.94rem;max-width:300px}
.foot-eu{display:inline-flex;align-items:center;gap:9px;margin-top:20px;font-family:var(--head);font-size:.74rem;font-weight:500;color:rgba(255,255,255,.78);border:1px solid rgba(255,255,255,.2);border-radius:100px;padding:7px 14px}
.foot-eu .stars{color:var(--green)}
.foot-col h4{font-family:var(--head);font-weight:700;font-size:.78rem;letter-spacing:.06em;text-transform:uppercase;color:#fff;margin-bottom:18px}
.foot-col a{display:block;color:rgba(255,255,255,.66);font-size:.92rem;margin-bottom:11px;transition:color .2s}
.foot-col a:hover{color:var(--green)}
.foot-bottom{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;color:rgba(255,255,255,.5);font-size:.82rem}
.foot-bottom .links{display:flex;gap:22px}
.foot-bottom a:hover{color:#fff}

/* RESPONSIVE */
@media(max-width:1080px){
  .nav-links{display:none}
  .burger{display:flex}
  .nav-cta .login{display:none}
  .bridge-wrap,.trust-grid{grid-template-columns:1fr;gap:40px}
  .foot-grid{grid-template-columns:1fr 1fr}
  .xd-grid{grid-template-columns:200px 1fr}
  .xd-side-right{display:none}
  .feat-wrap,.feat.flip .feat-wrap{grid-template-columns:1fr;gap:34px}
  .feat.flip .feat-copy{order:0}
}
@media(max-width:760px){
  .banner{height:90svh}
  .banner-figure{display:none}
  .xd-tabs{display:none}
  .xd-grid{grid-template-columns:1fr}
  .xd-side-left{display:none}
  .xd-art-row{grid-template-columns:1fr 1fr}
  .xd-search{width:130px}
  .xd-flow{grid-template-columns:1fr 1fr;gap:24px}
}
@media(max-width:640px){
  :root{--gutter:18px}
  .statband-inner{grid-template-columns:repeat(3,1fr);gap:12px;max-width:100%}
  .statband .n{font-size:1.6rem}
  .foot-grid{grid-template-columns:1fr}
  .foot-bottom{flex-direction:column;align-items:flex-start}
  .btn{padding:.85em 1.4em}
  .banner{height:100svh;min-height:0;max-height:none}
  .banner-content{padding:0 var(--gutter) clamp(100px,18vh,140px);justify-content:flex-end}
  .banner-grid{flex-direction:column;gap:14px}
  .banner-inner{max-width:none;padding-top:0}
  .banner-head{font-size:clamp(1.6rem,7.5vw,2.4rem);white-space:nowrap;gap:.12em}
  .banner-side{width:100%}
  .banner-lead{font-size:1rem}
  .banner-login{display:none}
  .banner-scroll{display:none}
  .trust{padding:clamp(48px,7vh,80px) 0}
  .trust-grid{grid-template-columns:1fr;gap:28px}
  .treveal{padding:18px}
  .bridge-wrap{grid-template-columns:1fr;gap:32px}
  .tiles-grid{grid-template-columns:1fr}
}
@media(max-width:900px){.tiles-grid{grid-template-columns:repeat(2,1fr)}}
</style>
