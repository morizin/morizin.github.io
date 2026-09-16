/* =========================================================
   morizin — shared runtime (V3)
   Content store · card renderers · force-directed home graph (d3-force)
   · grouped projects graph · AI client (search + plan) · sketches
   ========================================================= */
window.MZ = (function () {
  'use strict';

  var LS_KEY = 'morizin.content.v2';
  var LS_KEY_OLD = 'morizin…t.v2';
  var state = { content: null, source: 'static', server: false, error: null };

  /* ---------------- tiny helpers ---------------- */
  function qs(s, r) { return (r || document).querySelector(s); }
  function qsa(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function clamp(v, lo, hi) { return v < lo ? lo : (v > hi ? hi : v); }
  function projectUrl(p) { return 'projects/' + encodeURIComponent(p.id) + '/'; }

  /* ---------------- decorative sketches (reference marginalia) ---------------- */
  var SK = {
    mountain: '<svg width="W" height="H" viewBox="0 0 220 90" fill="none" stroke="currentColor" stroke-width="1.1"><path d="M4 84 L64 22 L98 54 L134 12 L196 84"/><path d="M0 84 h220" stroke-dasharray="2 7"/></svg>',
    globe: '<svg width="W" height="H" viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="1.1"><circle cx="60" cy="60" r="52"/><ellipse cx="60" cy="60" rx="24" ry="52"/><ellipse cx="60" cy="60" rx="52" ry="24"/><path d="M60 8v104M8 60h104"/></svg>',
    hand: '<svg width="W" height="H" viewBox="0 0 130 120" fill="none" stroke="currentColor" stroke-width="1.1"><path d="M30 116 C22 84 20 60 30 40 c3-7 10-8 12 0 l4 20"/><path d="M46 60 l-4-32 c-1-8 8-10 10-2 l6 30"/><path d="M62 56 l0-36 c0-8 9-9 10-1 l3 35"/><path d="M78 58 l4-30 c1-8 10-8 10 1 l1 32"/><path d="M34 96 c26 14 56 12 74-8"/></svg>',
    compass: '<svg width="W" height="H" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.1"><circle cx="50" cy="50" r="44"/><circle cx="50" cy="50" r="36"/><path d="M50 6v20M50 74v20M6 50h20M74 50h20"/><path d="M58 42 L64 30 L70 42 Z" fill="currentColor"/></svg>'
  };
  function sketch(name, w, h) { return SK[name].replace(/W/g, w).replace(/H/g, h); }
  /* .sketch hides itself under 1180px, so these never crowd small screens */
  function sketches(el, list) {
    if (!el) return;
    (list || []).forEach(function (cfg) {
      var s = document.createElement('span');
      s.className = 'sketch';
      s.setAttribute('aria-hidden', 'true');
      Object.keys(cfg.at || {}).forEach(function (k) { s.style[k] = cfg.at[k]; });
      s.innerHTML = sketch(cfg.name, cfg.w, cfg.h);
      el.appendChild(s);
    });
  }

  /* ---------------- content store ---------------- */
  function isValid(d) { return d && typeof d === 'object' && d.profile && Array.isArray(d.projects); }
  function normalise(d) {
    var c = JSON.parse(JSON.stringify(d));
    c.projects = (c.projects || []).map(function (p, i) {
      p.id = p.id || 'p-' + (i + 1);
      p.number = p.number || String(i + 1).padStart(2, '0');
      p.tags = p.tags || []; p.metrics = p.metrics || [];
      p.timeline = p.timeline || []; p.links = p.links || [];
      return p;
    });
    c.projects.sort(function (a, b) { return String(a.number).localeCompare(String(b.number)); });
    c.services = c.services || [];
    return c;
  }
  function readLocal() {
    try {
      var r = localStorage.getItem(LS_KEY) || localStorage.getItem(LS_KEY_OLD);
      if (!r) return null;
      var d = JSON.parse(r); return isValid(d) ? d : null;
    } catch (e) { return null; }
  }
  function writeLocal(d) { try { localStorage.setItem(LS_KEY, JSON.stringify(d)); return true; } catch (e) { return false; } }
  function fetchJson(u) {
    return fetch(u, { cache: 'no-store' }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); });
  }
  function inlineFallback() {
    return Promise.resolve().then(function () {
      var def = window.MORIZIN_DEFAULT, local = readLocal();
      if (!isValid(def) && !local) { state.error = 'Content could not be loaded.'; throw new Error(state.error); }
      state.content = normalise(local || def);
      state.source = local ? 'local' : 'static';
      return state.content;
    });
  }
  /* server.js is a local editing convenience, so only probe its API when we
     are actually running against it — otherwise every static page load 404s. */
  function maybeLocalServer() {
    return /^(localhost|127\.0\.0\.1|\[::1\]|0\.0\.0\.0)$/.test(location.hostname);
  }
  function staticJson() {
    // pages under projects/<id>/ need to reach the site root
    var depth = (location.pathname.match(/\//g) || []).length - 1;
    var up = depth > 0 && /\/projects\/[^/]+\/?$/.test(location.pathname) ? '../../' : '';
    return fetchJson(up + 'content/site.json').then(function (d) {
      if (!isValid(d)) throw new Error('bad payload');
      var local = readLocal();
      state.content = normalise(local || d);
      state.source = local ? 'local' : 'static';
      return state.content;
    });
  }
  function load() {
    if (location.protocol === 'file:') return inlineFallback();
    if (!maybeLocalServer()) return staticJson().catch(inlineFallback);
    return fetchJson('/api/content').then(function (d) {
      if (!isValid(d)) throw new Error('bad payload');
      state.content = normalise(d); state.source = 'server'; state.server = true;
      document.body.classList.add('can-edit');
      return state.content;
    }).catch(staticJson).catch(inlineFallback);
  }
  function source() { return state.source; }
  function isServer() { return state.server; }
  function save(next) {
    var data = normalise(next || state.content);
    state.content = data;
    if (state.server) {
      return fetch('/api/content', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
        .then(function (r) { if (!r.ok) throw new Error('Server rejected the save (' + r.status + ')'); return { persisted: 'server' }; });
    }
    if (!writeLocal(data)) throw new Error('Could not write to local storage');
    state.source = 'local';
    return Promise.resolve({ persisted: 'local' });
  }
  function resetLocal() { try { localStorage.removeItem(LS_KEY); localStorage.removeItem(LS_KEY_OLD); return true; } catch (e) { return false; } }
  function uploadFile(file) {
    var name = (file && file.name) || 'image.jpg';
    if (state.server) {
      return fetch('/api/upload?name=' + encodeURIComponent(name), {
        method: 'POST', headers: { 'Content-Type': file.type || 'application/octet-stream' }, body: file
      }).then(function (r) { if (!r.ok) throw new Error('Upload failed (' + r.status + ')'); return r.json(); });
    }
    return new Promise(function (resolve, reject) {
      var fr = new FileReader();
      fr.onload = function () { resolve({ path: fr.result, inline: true }); };
      fr.onerror = function () { reject(new Error('Could not read the file')); };
      fr.readAsDataURL(file);
    });
  }
  function download(fn, text) {
    var b = new Blob([text], { type: 'application/json' }), u = URL.createObjectURL(b), a = document.createElement('a');
    a.href = u; a.download = fn; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(u); }, 1500);
  }
  function exportContent() { download('morizin-content-' + new Date().toISOString().slice(0, 10) + '.json', JSON.stringify(state.content, null, 2)); }
  function importContent(text) {
    var d = JSON.parse(text);
    if (!isValid(d)) throw new Error('That file is not a valid morizin content export.');
    return save(d);
  }

  /* ---------------- toasts / nav / reveal / footer ---------------- */
  function toastHost() {
    var h = qs('.toasts'); if (!h) { h = document.createElement('div'); h.className = 'toasts'; document.body.appendChild(h); } return h;
  }
  function toast(title, msg, kind) {
    var host = toastHost(), el = document.createElement('div');
    el.className = 'toast' + (kind === 'err' ? ' err' : '');
    el.setAttribute('role', 'status');
    el.innerHTML = '<b>' + esc(title) + '</b>' + (msg ? esc(msg) : '');
    host.appendChild(el);
    setTimeout(function () { el.style.opacity = '0'; el.style.transition = 'opacity .3s ease'; }, 3600);
    setTimeout(function () { el.remove(); }, 4100);
  }
  function initNav() {
    var b = qs('.burger'), m = qs('.menu');
    if (b && m) {
      b.addEventListener('click', function () { var o = m.classList.toggle('open'); b.setAttribute('aria-expanded', String(o)); });
      m.addEventListener('click', function (e) { if (e.target.tagName === 'A') m.classList.remove('open'); });
    }
    var y = qs('#year'); if (y) y.textContent = new Date().getFullYear();
    var t = qs('.theme');
    if (t && window.MORIZIN_THEME) {
      var label = function () { t.setAttribute('aria-label', 'Switch to ' + (MORIZIN_THEME.get() === 'cadet' ? 'paper' : 'cadet') + ' theme'); };
      label();
      t.addEventListener('click', function () { MORIZIN_THEME.toggle(); label(); });
    }
  }
  function initReveal() {
    var els = qsa('.reveal');
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('is-in'); }); return; }
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { threshold: 0.06, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (e) { io.observe(e); });
  }
  /* every page's footer shows the same profile bits */
  function fillFooter(profile) {
    var soc = qs('#foot-social');
    if (soc) soc.innerHTML = (profile.socials || []).map(function (s) {
      return '<li><a href="' + esc(s.href) + '" rel="noopener">' + esc(s.label) + '</a></li>';
    }).join('');
    var em = qs('#foot-email'); if (em) { em.href = 'mailto:' + (profile.email || ''); em.textContent = profile.email || ''; }
    var loc = qs('#foot-loc'); if (loc) loc.textContent = profile.location || '';
    var cal = qs('#foot-cal'); if (cal) { if (profile.calendly) cal.href = profile.calendly; else cal.parentNode.removeChild(cal); }
  }

  /* ---------------- card renderers ---------------- */
  function thumbInner(p, eager) {
    if (p.cover) return '<img src="' + esc(p.cover) + '" alt="' + esc(p.title) + ' cover" loading="' + (eager ? 'eager' : 'lazy') + '" decoding="async" width="480" height="300">';
    return '<div class="ph"><span class="mono">No image yet</span></div>';
  }
  /* Counts come from the content itself — nothing here is invented. */
  function subStats(p) {
    return [
      { l: 'Field notes', n: (p.timeline || []).length, ic: 'notes' },
      { l: 'Metrics', n: (p.metrics || []).length, ic: 'chart' },
      { l: 'Artefacts', n: (p.links || []).length, ic: 'link' }
    ].filter(function (s) { return s.n > 0; });
  }
  var SUBICON = {
    notes: '<path d="M5 4h11l3 3v13H5z"/><path d="M9 12h6M9 16h4"/>',
    chart: '<path d="M5 19V9M12 19V5M19 19v-7"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1.1 1.1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1.1-1.1"/>'
  };
  function subIcon(name) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + SUBICON[name] + '</svg>';
  }
  function subsRow(p) {
    return subStats(p).map(function (s) {
      return '<span>' + esc(s.l) + ' <b>' + s.n + '</b></span>';
    }).join('');
  }
  function tagRow(p) {
    var tags = (p.tags || []).slice(0, 3);
    if (!tags.length) return '';
    return '<div class="tags cardtags">' + tags.map(function (t) {
      return '<span class="tag">' + esc(t) + '</span>';
    }).join('') + '</div>';
  }
  function gcard(p) {
    return '<article class="gcard g-card" data-id="' + esc(p.id) + '">' +
      '<a class="hit" href="' + projectUrl(p) + '" tabindex="-1" aria-hidden="true"></a>' +
      '<div class="thumb">' + thumbInner(p, true) + '<span class="num">' + esc(p.number) + '</span></div>' +
      '<div class="bd">' +
        '<div class="k"><i></i><span>' + esc(p.domain || 'Project') + '</span></div>' +
        '<h3><a href="' + projectUrl(p) + '">' + esc(p.title) + '</a></h3>' +
        '<p>' + esc(p.summary || '') + '</p>' +
        '<div class="subs">' + subsRow(p) + '</div>' +
      '</div></article>';
  }
  function listCard(p) {
    return '<article class="gcard g-card" data-id="' + esc(p.id) + '">' +
      '<a class="hit" href="' + projectUrl(p) + '" tabindex="-1" aria-hidden="true"></a>' +
      '<div class="thumb">' + thumbInner(p) + '<span class="num">' + esc(p.number) + '</span></div>' +
      '<div class="bd">' +
        '<div class="k"><i></i><span>' + esc(p.domain || 'Project') + ' · ' + esc(p.status || '') + '</span></div>' +
        '<h3><a href="' + projectUrl(p) + '">' + esc(p.title) + '</a></h3>' +
        '<p>' + esc(p.summary || '') + '</p>' +
        '<div class="subs">' + subsRow(p) + '</div>' +
        tagRow(p) +
      '</div></article>';
  }

  /* ---------------- filtering / sorting ---------------- */
  function filterProjects(list, f) {
    f = f || {}; var q = (f.q || '').trim().toLowerCase();
    return list.filter(function (p) {
      if (f.domain && f.domain !== 'all' && p.domain !== f.domain) return false;
      if (f.modality && f.modality !== 'all' && p.modality !== f.modality) return false;
      if (f.status && f.status !== 'all' && p.status !== f.status) return false;
      if (f.tag && f.tag !== 'all' && (p.tags || []).indexOf(f.tag) === -1) return false;
      if (q) {
        var hay = [p.title, p.summary, p.body, p.domain, p.modality, (p.tags || []).join(' ')].join(' ').toLowerCase();
        if (hay.indexOf(q) === -1) return false;
      }
      return true;
    });
  }
  function relevance(p, q) {
    if (!q) return 0;
    var score = 0;
    q.split(/\s+/).filter(Boolean).forEach(function (term) {
      if (String(p.title || '').toLowerCase().indexOf(term) > -1) score += 6;
      if ((p.tags || []).join(' ').toLowerCase().indexOf(term) > -1) score += 4;
      if (String(p.domain || '').toLowerCase().indexOf(term) > -1) score += 3;
      if (String(p.modality || '').toLowerCase().indexOf(term) > -1) score += 3;
      if (String(p.summary || '').toLowerCase().indexOf(term) > -1) score += 2;
      if (String(p.body || '').toLowerCase().indexOf(term) > -1) score += 1;
    });
    return score;
  }
  function sortProjects(list, sort, q) {
    var out = list.slice();
    q = (q || '').trim().toLowerCase();
    if (sort === 'newest') {
      out.sort(function (a, b) { return String(b.updated || '').localeCompare(String(a.updated || '')); });
    } else if (sort === 'number') {
      out.sort(function (a, b) { return String(a.number).localeCompare(String(b.number)); });
    } else if (q) {
      out.sort(function (a, b) {
        var d = relevance(b, q) - relevance(a, q);
        return d || String(a.number).localeCompare(String(b.number));
      });
    }
    return out;
  }
  function topProjects(list, n) {
    var featured = list.filter(function (p) { return p.featured; });
    var rest = list.filter(function (p) { return !p.featured; });
    return featured.concat(rest).slice(0, n);
  }
  function uniq(list, key) {
    var out = []; list.forEach(function (p) { if (p[key] && out.indexOf(p[key]) === -1) out.push(p[key]); }); return out.sort();
  }
  function uniqTags(list) {
    var out = [];
    list.forEach(function (p) { (p.tags || []).forEach(function (t) { if (t && out.indexOf(t) === -1) out.push(t); }); });
    return out.sort();
  }
  function groupBy(list, key) {
    var order = [], map = {};
    list.forEach(function (p) {
      var k = p[key] || 'Other';
      if (!map[k]) { map[k] = []; order.push(k); }
      map[k].push(p);
    });
    return order.map(function (k) { return { key: k, items: map[k] }; });
  }
  function param(n) { return new URLSearchParams(location.search).get(n); }

  /* ---------------- AI client (Groq via worker/) ----------------
     Everything degrades: with no endpoint configured, search falls back to the
     on-device relevance ranking above and plan mode explains it is offline. */
  function aiBase() {
    var c = window.MORIZIN_CONFIG || {};
    return String(c.api || '').replace(/\/+$/, '');
  }
  function aiEnabled() { return !!aiBase(); }
  function aiCall(kind, body) {
    if (!aiEnabled()) return Promise.reject(Object.assign(new Error('AI is not configured'), { code: 'offline' }));
    var ctl = ('AbortController' in window) ? new AbortController() : null;
    var timer = ctl && setTimeout(function () { ctl.abort(); }, 20000);
    return fetch(aiBase() + '/' + kind, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body), signal: ctl && ctl.signal
    }).then(function (r) {
      if (timer) clearTimeout(timer);
      return r.json().catch(function () { return {}; }).then(function (j) {
        if (r.status === 429) throw Object.assign(new Error(j.message || 'Daily limit reached'), { code: 'limit', limit: j.limit });
        if (!r.ok) throw Object.assign(new Error(j.message || ('AI request failed (' + r.status + ')')), { code: 'error' });
        return j;
      });
    });
  }
  function aiSearch(prompt) { return aiCall('search', { prompt: prompt }); }
  function aiPlan(prompt) { return aiCall('plan', { prompt: prompt }); }

  /* ---------------- geometry shared by the graphs ---------------- */
  function arcPath(sx, sy, tx, ty, bend) {
    var dx = tx - sx, dy = ty - sy, len = Math.sqrt(dx * dx + dy * dy) || 1;
    var k = bend * len;
    var cx = (sx + tx) / 2 + (-dy / len) * k, cy = (sy + ty) / 2 + (dx / len) * k;
    return { d: 'M' + sx + ' ' + sy + ' Q' + cx + ' ' + cy + ' ' + tx + ' ' + ty, cx: cx, cy: cy };
  }
  function pointOnQuad(sx, sy, cx, cy, tx, ty, t) {
    var u = 1 - t;
    return { x: u * u * sx + 2 * u * t * cx + t * t * tx, y: u * u * sy + 2 * u * t * cy + t * t * ty };
  }
  /* The curve ends at the node's centre and disappears under it; walk back
     until the point clears the node — that is where the dot belongs. */
  function quadExit(sx, sy, cx, cy, tx, ty, box) {
    for (var t = 1; t > 0.15; t -= 0.01) {
      var p = pointOnQuad(sx, sy, cx, cy, tx, ty, t);
      if (p.x < box.l || p.x > box.r || p.y < box.t || p.y > box.b) return p;
    }
    return pointOnQuad(sx, sy, cx, cy, tx, ty, 0.5);
  }

  /* ---------------- home: force-directed graph (d3-force) ----------------
     Obsidian-style physics — nodes repel, links pull, everything settles —
     but the nodes are the brand's HTML cards, not dots. The hub is pinned to
     the centre; project cards and their satellites float and can be dragged.
     Requires window.d3 (loaded on index.html); without it we stack. */
  function mountForceGraph(stage, projects, opts) {
    opts = opts || {};
    var svg = qs('.g-lines', stage), layer = qs('.canvas-layer', stage), hub = qs('.g-hub', stage);
    if (!svg || !layer || !hub) return null;
    if (!window.d3) { stage.classList.add('is-stacked', 'ready'); return null; }

    var nodes = [], links = [], byId = {};
    var hubNode = { id: '__hub', kind: 'hub', fx: 0, fy: 0 };
    nodes.push(hubNode); byId[hubNode.id] = hubNode;

    projects.forEach(function (p, i) {
      var n = { id: p.id, kind: 'project', p: p, i: i };
      nodes.push(n); byId[n.id] = n;
      links.push({ source: '__hub', target: p.id, kind: 'spoke', i: i });
      subStats(p).forEach(function (s, j) {
        var sid = p.id + '::' + s.ic;
        var sn = { id: sid, kind: 'sat', p: p, stat: s, parent: p.id, i: i, j: j };
        nodes.push(sn); byId[sid] = sn;
        links.push({ source: p.id, target: sid, kind: 'twig', i: i });
      });
    });

    /* build DOM */
    layer.innerHTML = projects.map(gcard).join('') + projects.map(function (p) {
      return subStats(p).map(function (s) {
        return '<a class="sat g-node" data-id="' + esc(p.id + '::' + s.ic) + '" href="' + projectUrl(p) + '" aria-label="' +
          esc(p.title + ' — ' + s.n + ' ' + s.l.toLowerCase()) + '">' + subIcon(s.ic) +
          '<b>' + esc(s.l) + '</b><i>' + s.n + '</i></a>';
      }).join('');
    }).join('');
    var els = {};
    qsa('.g-card, .sat', layer).forEach(function (el) { els[el.dataset.id] = el; el.classList.add('g-node'); });

    var sim = null, W = 0, H = 0, hubR = 0, cw = 0, sizes = {};

    function measure() {
      W = stage.clientWidth; H = stage.clientHeight;
      var short = Math.min(W, H);
      hubR = clamp(Math.round(short * 0.24), 70, 132);
      hub.style.width = hub.style.height = (hubR * 2) + 'px';
      hub.style.padding = Math.round(hubR * 0.26) + 'px';
      hub.classList.toggle('sm', hubR * 2 < 230);
      hub.classList.toggle('xs', hubR * 2 < 160);
      hubNode.fx = W / 2; hubNode.fy = H / 2;

      var compact = W < 1000 || H < 640;
      cw = compact ? clamp(Math.round(short * 0.34), 132, 190) : clamp(Math.round(short * 0.28), 190, 236);
      qsa('.g-card', layer).forEach(function (c) {
        c.classList.toggle('compact', compact);
        c.classList.toggle('tight', !compact);
        c.style.width = cw + 'px';
      });
      sizes = {};
      nodes.forEach(function (n) {
        if (n.kind === 'hub') { sizes[n.id] = { hw: hubR, hh: hubR, r: hubR }; return; }
        var el = els[n.id];
        var w = el.offsetWidth, h = el.offsetHeight;
        sizes[n.id] = { hw: w / 2, hh: h / 2, r: Math.sqrt(w * w + h * h) / 2 };
      });
      svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    }

    function boundForce() {
      // keep every node inside the stage, allowing for its own box
      for (var k = 0; k < nodes.length; k++) {
        var n = nodes[k]; if (n.kind === 'hub') continue;
        var s = sizes[n.id], m = 8;
        n.x = clamp(n.x, s.hw + m, W - s.hw - m);
        n.y = clamp(n.y, s.hh + m, H - s.hh - m);
      }
    }

    function tick() {
      // forces run before integration, so clamp again here — after velocities
      // have moved the node — and kill the velocity that pushed it out
      for (var k = 0; k < nodes.length; k++) {
        var n = nodes[k]; if (n.kind === 'hub') continue;
        var s = sizes[n.id], m = 8;
        if (n.x < s.hw + m) { n.x = s.hw + m; n.vx = 0; } else if (n.x > W - s.hw - m) { n.x = W - s.hw - m; n.vx = 0; }
        if (n.y < s.hh + m) { n.y = s.hh + m; n.vy = 0; } else if (n.y > H - s.hh - m) { n.y = H - s.hh - m; n.vy = 0; }
      }
      var parts = [];
      links.forEach(function (l) {
        var a = l.source, b = l.target;
        var sa = sizes[a.id], sb = sizes[b.id];
        // start on the source's edge, end at the target's centre (hidden under it)
        var dx = b.x - a.x, dy = b.y - a.y, len = Math.sqrt(dx * dx + dy * dy) || 1;
        var sx, sy;
        if (a.kind === 'hub') { sx = a.x + dx / len * sa.r; sy = a.y + dy / len * sa.r; }
        else {
          var t = Math.min(sa.hw / (Math.abs(dx) / len || 1e-6), sa.hh / (Math.abs(dy) / len || 1e-6));
          sx = a.x + dx / len * t; sy = a.y + dy / len * t;
        }
        var bend = l.kind === 'spoke' ? (l.i % 2 ? 0.12 : -0.12) : 0.08;
        var arc = arcPath(sx, sy, b.x, b.y, bend);
        var tone = l.i % 3 === 1 ? 'c2' : (l.i % 3 === 2 ? 'c3' : '');
        parts.push('<path class="' + tone + ' ' + l.kind + '" data-for="' + esc(b.kind === 'sat' ? b.parent : b.id) + '" d="' + arc.d + '"/>');
        if (l.kind === 'spoke') {
          var dot = quadExit(sx, sy, arc.cx, arc.cy, b.x, b.y, { l: b.x - sb.hw - 5, r: b.x + sb.hw + 5, t: b.y - sb.hh - 5, b: b.y + sb.hh + 5 });
          parts.push('<circle class="' + tone + '" cx="' + dot.x + '" cy="' + dot.y + '" r="4"/>');
        }
      });
      svg.innerHTML = parts.join('');
      nodes.forEach(function (n) {
        if (n.kind === 'hub') return;
        els[n.id].style.transform = 'translate(' + (n.x - sizes[n.id].hw) + 'px,' + (n.y - sizes[n.id].hh) + 'px)';
      });
    }

    function seed() {
      // start each project on its own spoke so the first frame already reads as a graph
      var n = projects.length, base = W > H ? -180 / Math.max(n, 1) : -90 - 180 / Math.max(n, 1);
      var R = Math.min(W, H) * 0.36;
      nodes.forEach(function (nd) {
        if (nd.kind === 'hub') return;
        var a = (base + nd.i * (360 / Math.max(n, 1))) * Math.PI / 180;
        var r = nd.kind === 'project' ? R : R + 60 + nd.j * 14;
        var jitter = nd.kind === 'sat' ? (nd.j - 1) * 0.35 : 0;
        nd.x = W / 2 + Math.cos(a + jitter) * r;
        nd.y = H / 2 + Math.sin(a + jitter) * r;
      });
    }

    function start() {
      measure(); seed();
      if (sim) sim.stop();
      sim = d3.forceSimulation(nodes)
        .force('link', d3.forceLink(links).id(function (d) { return d.id; })
          .distance(function (l) {
            return l.kind === 'spoke' ? hubR + sizes[l.target.id].r + Math.min(W, H) * 0.06 : sizes[l.source.id].r + 46;
          }).strength(function (l) { return l.kind === 'spoke' ? 0.9 : 1; }))
        .force('charge', d3.forceManyBody().strength(function (d) { return d.kind === 'hub' ? -400 : (d.kind === 'project' ? -900 : -160); }))
        .force('collide', d3.forceCollide().radius(function (d) { return sizes[d.id].r + (d.kind === 'hub' ? 24 : 10); }).strength(0.9).iterations(2))
        .force('bound', boundForce)
        .alphaDecay(0.035)
        .on('tick', tick);
      stage.classList.remove('is-stacked');
      stage.classList.add('ready');
    }

    /* drag — the Obsidian bit, in pointer events (no d3-drag). A press that
       moves less than 5px is a click and reaches the link untouched; past that
       it is a drag, and the click the browser fires afterwards is swallowed. */
    var dragging = null;
    // links and images are natively draggable; a native drag cancels pointer
    // events before the first move ever reaches us — d3-drag did this too
    layer.addEventListener('dragstart', function (e) { e.preventDefault(); });
    layer.addEventListener('pointerdown', function (e) {
      if (e.button !== 0 && e.pointerType === 'mouse') return;
      var el = e.target.closest('.g-node'); if (!el) return;
      var n = byId[el.dataset.id]; if (!n) return;
      var r = stage.getBoundingClientRect();
      dragging = { n: n, el: el, id: e.pointerId, x0: e.clientX, y0: e.clientY, ox: n.x - (e.clientX - r.left), oy: n.y - (e.clientY - r.top), moved: false };
    });
    layer.addEventListener('pointermove', function (e) {
      if (!dragging || e.pointerId !== dragging.id) return;
      var dx = e.clientX - dragging.x0, dy = e.clientY - dragging.y0;
      if (!dragging.moved) {
        if (dx * dx + dy * dy < 25) return;
        dragging.moved = true;
        try { dragging.el.setPointerCapture(dragging.id); } catch (err) { /* capture is a nicety, not a requirement */ }
        stage.classList.add('dragging');
        dragging.n.fx = dragging.n.x; dragging.n.fy = dragging.n.y;
        sim.alphaTarget(0.25).restart();
      }
      var r = stage.getBoundingClientRect();
      dragging.n.fx = e.clientX - r.left + dragging.ox;
      dragging.n.fy = e.clientY - r.top + dragging.oy;
      e.preventDefault();
    });
    function endDrag(e) {
      if (!dragging || e.pointerId !== dragging.id) return;
      var d = dragging; dragging = null;
      if (d.moved) {
        d.n.fx = null; d.n.fy = null;
        sim.alphaTarget(0);
        stage.classList.remove('dragging');
        // the click arrives after pointerup in the same task; timers run later
        var swallow = function (ev) { ev.preventDefault(); ev.stopPropagation(); };
        layer.addEventListener('click', swallow, true);
        setTimeout(function () { layer.removeEventListener('click', swallow, true); }, 0);
      }
    }
    window.addEventListener('pointermove', function (e) { if (dragging && e.target && !layer.contains(e.target)) layer.dispatchEvent(new PointerEvent('pointermove', e)); });
    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointercancel', endDrag);

    /* hover: light the family, dim the rest */
    nodes.forEach(function (n) {
      if (n.kind === 'hub') return;
      var el = els[n.id], pid = n.kind === 'sat' ? n.parent : n.id;
      el.addEventListener('mouseenter', function () {
        qsa('path', svg).forEach(function (p) { p.classList.toggle('on', p.dataset.for === pid); });
        qsa('.g-node', layer).forEach(function (c) {
          var cid = c.dataset.id.split('::')[0];
          c.classList.toggle('dim', cid !== pid);
        });
      });
      el.addEventListener('mouseleave', function () {
        qsa('path', svg).forEach(function (p) { p.classList.remove('on'); });
        qsa('.g-node', layer).forEach(function (c) { c.classList.remove('dim'); });
      });
    });

    /* a stage too short for physics (landscape phone with the panel open,
       a tiny window) falls back to a scrolling stack until there is room */
    function tooSmall() { return stage.clientHeight < 320 || stage.clientWidth < 260; }
    function stackIfNeeded() {
      var stacked = tooSmall();
      if (stacked === stage.classList.contains('is-stacked')) return stacked;
      stage.classList.toggle('is-stacked', stacked);
      if (stacked) { if (sim) sim.stop(); svg.innerHTML = ''; hub.removeAttribute('style'); }
      else { start(); }
      return stacked;
    }
    var t = null;
    function schedule() {
      clearTimeout(t);
      t = setTimeout(function () { if (stackIfNeeded()) return; measure(); sim.alpha(0.6).restart(); }, 120);
    }
    if ('ResizeObserver' in window) new ResizeObserver(schedule).observe(stage);
    window.addEventListener('orientationchange', schedule);
    if (tooSmall()) { stage.classList.add('is-stacked', 'ready'); } else { start(); }

    return {
      /* pull matching projects in, push the rest out and dim them */
      focus: function (ids) {
        var set = {}; (ids || []).forEach(function (id) { set[id] = true; });
        var any = !!(ids && ids.length);
        nodes.forEach(function (n) {
          if (n.kind === 'hub') return;
          var pid = n.kind === 'sat' ? n.parent : n.id;
          els[n.id].classList.toggle('faded', any && !set[pid]);
          els[n.id].classList.toggle('lit', any && !!set[pid]);
        });
        sim.force('link').distance(function (l) {
          var pid = l.target.kind === 'sat' ? l.target.parent : l.target.id;
          var base = l.kind === 'spoke' ? hubR + sizes[l.target.id].r + Math.min(W, H) * 0.06 : sizes[l.source.id].r + 46;
          if (!any || l.kind !== 'spoke') return base;
          return set[pid] ? base * 0.8 : base * 1.35;
        });
        sim.alpha(0.7).restart();
      },
      restart: start
    };
  }

  /* ---------------- projects page: domain clusters + connectors ---------------- */
  function groupGraphHtml(groups) {
    return '<div class="groupstage" id="groupstage">' +
      '<svg class="g-lines" aria-hidden="true"></svg>' +
      groups.map(function (g, i) {
        var tone = i % 3 === 1 ? 'c2' : (i % 3 === 2 ? 'c3' : '');
        return '<section class="g-group ' + tone + '" data-group="' + esc(g.key) + '" aria-labelledby="grp-' + i + '">' +
          '<header class="g-grouphead"><i class="dot"></i>' +
            '<h2 id="grp-' + i + '">' + esc(g.key) + '</h2>' +
            '<b>' + g.items.length + ' project' + (g.items.length === 1 ? '' : 's') + '</b>' +
          '</header>' +
          '<div class="g-groupgrid">' + g.items.map(listCard).join('') + '</div>' +
        '</section>';
      }).join('') +
    '</div>';
  }
  function mountGroupGraph(stage) {
    var svg = qs('.g-lines', stage);
    if (!svg) return;
    function draw() {
      svg.innerHTML = '';
      if (window.matchMedia('(max-width:640px)').matches) return;
      var root = stage.getBoundingClientRect();
      svg.setAttribute('viewBox', '0 0 ' + stage.clientWidth + ' ' + stage.clientHeight);
      var parts = [];
      qsa('.g-group', stage).forEach(function (group) {
        var dot = qs('.g-grouphead .dot', group);
        if (!dot) return;
        var dr = dot.getBoundingClientRect();
        var hr = qs('.g-grouphead', group).getBoundingClientRect();
        var sx = dr.left - root.left + dr.width / 2, sy = hr.bottom - root.top - 2;
        var tone = group.classList.contains('c2') ? 'c2' : (group.classList.contains('c3') ? 'c3' : '');
        qsa('.g-card', group).forEach(function (card, i) {
          var cr = card.getBoundingClientRect();
          var tx = cr.left - root.left + cr.width / 2, ty = cr.top - root.top;
          var arc = arcPath(sx, sy, tx, ty, i % 2 ? 0.1 : -0.1);
          parts.push('<path class="' + tone + '" data-for="' + esc(card.dataset.id) + '" d="' + arc.d + '"/>');
          parts.push('<circle class="' + tone + '" cx="' + tx + '" cy="' + (ty - 1) + '" r="3.5"/>');
        });
      });
      svg.innerHTML = parts.join('');
    }
    qsa('.g-card', stage).forEach(function (card) {
      card.addEventListener('mouseenter', function () {
        qsa('path', svg).forEach(function (p) { p.classList.toggle('on', p.dataset.for === card.dataset.id); });
      });
      card.addEventListener('mouseleave', function () {
        qsa('path', svg).forEach(function (p) { p.classList.remove('on'); });
      });
    });
    var t = null;
    function schedule() { clearTimeout(t); t = setTimeout(draw, 100); }
    if ('ResizeObserver' in window) new ResizeObserver(schedule).observe(stage);
    qsa('img', stage).forEach(function (im) { if (!im.complete) im.addEventListener('load', schedule, { once: true }); });
    draw();
  }

  /* ---------------- project page: hub → sub-cards ---------------- */
  function mountSubgraph(root) {
    var svg = qs('.g-lines', root), grid = qs('.subgrid', root);
    if (!svg || !grid) return;
    function draw() {
      svg.innerHTML = '';
      if (window.matchMedia('(max-width:900px)').matches) return;
      var W = root.clientWidth, H = root.clientHeight;
      svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
      var cx = W / 2, parts = [];
      qsa('.subcard', grid).forEach(function (card) {
        var r = card.getBoundingClientRect(), rr = root.getBoundingClientRect();
        var x = r.left - rr.left + r.width / 2, y = r.top - rr.top;
        var arc = arcPath(cx, 0, x, y, 0.1);
        parts.push('<path d="' + arc.d + '"/><circle cx="' + x + '" cy="' + (y + 2) + '" r="3.5"/>');
      });
      svg.innerHTML = parts.join('');
    }
    var t = null;
    window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(draw, 120); });
    draw();
  }

  return {
    qs: qs, qsa: qsa, esc: esc, sketches: sketches,
    load: load, source: source, isServer: isServer, save: save,
    resetLocal: resetLocal, uploadFile: uploadFile, exportContent: exportContent, importContent: importContent,
    toast: toast, initNav: initNav, initReveal: initReveal, fillFooter: fillFooter,
    gcard: gcard, listCard: listCard,
    filterProjects: filterProjects, sortProjects: sortProjects, topProjects: topProjects, relevance: relevance,
    uniq: uniq, uniqTags: uniqTags, groupBy: groupBy, param: param,
    aiEnabled: aiEnabled, aiSearch: aiSearch, aiPlan: aiPlan,
    mountForceGraph: mountForceGraph, groupGraphHtml: groupGraphHtml,
    mountGroupGraph: mountGroupGraph, mountSubgraph: mountSubgraph
  };
})();
