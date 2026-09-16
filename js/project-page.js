/* Project page renderer — shared by project.html (client) and the build
   (static projects/<id>/index.html). Pure function of the project record. */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root.MZ) { root.MZ.projectPage = api.projectPage; root.MZ.relatedProjects = api.relatedProjects; }
  root.MZ_PROJECT_PAGE = api;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  var ICON = {
    notes: '<path d="M5 4h11l3 3v13H5z"/><path d="M9 12h6M9 16h4"/>',
    chart: '<path d="M5 19V9M12 19V5M19 19v-7"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1.1 1.1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1.1-1.1"/>',
    tag: '<path d="M3 12V5a2 2 0 0 1 2-2h7l9 9-9 9z"/><circle cx="8" cy="8" r="1.4"/>'
  };
  function icon(n) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICON[n] + '</svg>';
  }
  var HAND = '<svg width="120" height="100" viewBox="0 0 130 120" fill="none" stroke="currentColor" stroke-width="1.1" aria-hidden="true"><path d="M30 116 C22 84 20 60 30 40 c3-7 10-8 12 0 l4 20"/><path d="M46 60 l-4-32 c-1-8 8-10 10-2 l6 30"/><path d="M62 56 l0-36 c0-8 9-9 10-1 l3 35"/><path d="M78 58 l4-30 c1-8 10-8 10 1 l1 32"/><path d="M34 96 c26 14 56 12 74-8"/></svg>';

  function isVision(p) {
    return /vision/i.test(p.modality || '') || (p.tags || []).join(' ').toLowerCase().indexOf('computer vision') > -1;
  }
  function paras(text) {
    return String(text || '').split(/\n{2,}/).map(function (t) { return t.trim(); }).filter(Boolean)
      .map(function (t) { return '<p>' + esc(t) + '</p>'; }).join('');
  }
  function withBase(base, path) {
    if (!path || /^(https?:|data:|mailto:)/.test(path)) return path;
    return base + path;
  }

  /* Every count here is read off the record — nothing is invented. */
  function subcards(p) {
    var items = [
      { t: 'Field notes', n: (p.timeline || []).length, d: 'Dated entries from the work as it happened.', ic: 'notes' },
      { t: 'Metrics', n: (p.metrics || []).length, d: 'What was measured, and what it came to.', ic: 'chart' },
      { t: 'Artefacts', n: (p.links || []).length, d: 'Repositories, write-ups and demos.', ic: 'link' },
      { t: 'Skills', n: (p.tags || []).length, d: (p.tags || []).slice(0, 4).join(' · ') || 'The methods behind this project.', ic: 'tag' }
    ].filter(function (s) { return s.n > 0; });
    return items.map(function (s) {
      return '<div class="subcard"><div class="ic">' + icon(s.ic) + '</div>' +
        '<h2 class="h-3">' + esc(s.t) + '</h2><span class="n">' + s.n + '</span><p>' + esc(s.d) + '</p></div>';
    }).join('');
  }

  function projectPage(p, base) {
    base = base || '';
    var overlay = isVision(p)
      ? '<div class="cvbox" style="left:7%;top:20%;width:24%;height:50%;"><span>Person</span></div>' +
        '<div class="cvbox safe" style="left:34%;top:34%;width:34%;height:44%;"><span>Safe zone</span></div>'
      : '';
    var pills = [
      '<span class="pill acc">' + esc(p.number) + '</span>',
      p.domain ? '<span class="pill">' + esc(p.domain) + '</span>' : '',
      p.modality ? '<span class="pill">' + esc(p.modality) + '</span>' : '',
      p.status ? '<span class="pill">' + esc(p.status) + '</span>' : ''
    ].join('');
    var timeline = (p.timeline || []).map(function (e) {
      return '<div class="ev"><div class="when">' + esc(e.when) + '</div><div class="what">' + esc(e.what) + '</div></div>';
    }).join('') || '<p style="color:var(--muted);font-size:13.5px;margin:0;">No timeline entries yet.</p>';
    var metrics = (p.metrics || []).slice(0, 3).map(function (m, i) {
      return '<div class="quick"><div class="n">0' + (i + 1) + '</div><h2 class="h-3">' + esc(m.value) + '</h2><p>' + esc(m.label) + '</p></div>';
    }).join('');
    var subs = subcards(p);
    var links = (p.links || []).length
      ? '<div class="sidebox" style="margin-top:16px;"><h3>Artefacts</h3><ul class="itemlist">' +
        p.links.map(function (l) { return '<li><span class="nm">' + esc(l.label) + '</span><a href="' + esc(l.href) + '" rel="noopener">Open →</a></li>'; }).join('') +
        '</ul></div>' : '';

    return '<article>' +
      '<div class="pd-hero">' +
        '<div><span class="eyebrow">Project ' + esc(p.number) + '</span>' +
          '<h1>' + esc(p.title) + '</h1>' +
          '<div class="pd-meta">' + pills + '</div></div>' +
        '<div class="pd-img">' +
          (p.cover ? '<img src="' + esc(withBase(base, p.cover)) + '" alt="' + esc(p.title) + ' — lead image" width="960" height="720">'
                   : '<div class="ph"><span class="mono">No image yet</span></div>') + overlay +
        '</div>' +
        '<aside class="pd-aside">' +
          '<p class="quote">“' + esc(p.summary || '') + '”</p>' +
          '<span class="mono">The approach</span>' +
          '<div class="skx">' + HAND + '</div>' +
        '</aside>' +
      '</div>' +
      '<div class="pd-body">' +
        '<div>' +
          '<div class="body" style="font-size:16.5px;">' + paras(p.body) + '</div>' +
          (subs ? '<div class="subgraph" id="subgraph"><svg class="g-lines" aria-hidden="true" preserveAspectRatio="none"></svg><div class="subgrid">' + subs + '</div></div>' : '') +
          (metrics ? '<div class="quickrow">' + metrics + '</div>' : '') +
        '</div>' +
        '<aside>' +
          '<div class="sidebox"><h3>Timeline</h3><div class="timeline">' + timeline + '</div></div>' + links +
          '<a class="btn ghost edit-only" style="margin-top:16px;width:100%;justify-content:center;" href="' + base + 'studio.html?edit=' + encodeURIComponent(p.id) + '">Edit this project</a>' +
        '</aside>' +
      '</div>' +
    '</article>';
  }

  function relatedProjects(all, p) {
    var rel = all.filter(function (x) { return x.id !== p.id && (x.domain === p.domain || x.modality === p.modality); });
    if (!rel.length) rel = all.filter(function (x) { return x.id !== p.id; });
    return rel.slice(0, 3);
  }

  return { projectPage: projectPage, relatedProjects: relatedProjects, esc: esc };
});
