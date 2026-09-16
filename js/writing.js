/* Writing — a small markdown subset and the article renderers, shared by the
   browser (writing.html) and the build (static writing/<id>/ pages + feed).
   Subset: ## headings, paragraphs, - bullets, > quotes, **bold**, *italic*,
   `code`, [text](url). Nothing else, on purpose. */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root.MZ) { root.MZ.md = api.md; root.MZ.articleCard = api.articleCard; root.MZ.articlePage = api.articlePage; }
  root.MZ_WRITING = api;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function inline(s) {
    s = esc(s);
    s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>');
    s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+|[^\s)]+)\)/g, function (_, t, u) {
      var ext = /^https?:\/\//.test(u);
      return '<a href="' + u + '"' + (ext ? ' rel="noopener"' : '') + '>' + t + '</a>';
    });
    return s;
  }
  function md(text) {
    var out = [], list = null, quote = null;
    function flush() {
      if (list) { out.push('<ul>' + list.join('') + '</ul>'); list = null; }
      if (quote) { out.push('<blockquote>' + quote.join(' ') + '</blockquote>'); quote = null; }
    }
    String(text || '').split(/\n{2,}/).forEach(function (block) {
      var lines = block.split('\n').map(function (l) { return l.replace(/\s+$/, ''); }).filter(Boolean);
      if (!lines.length) return;
      if (/^## /.test(lines[0])) { flush(); out.push('<h2>' + inline(lines[0].slice(3)) + '</h2>'); return; }
      if (/^### /.test(lines[0])) { flush(); out.push('<h3>' + inline(lines[0].slice(4)) + '</h3>'); return; }
      if (lines.every(function (l) { return /^- /.test(l); })) {
        flush(); out.push('<ul>' + lines.map(function (l) { return '<li>' + inline(l.slice(2)) + '</li>'; }).join('') + '</ul>'); return;
      }
      if (lines.every(function (l) { return /^> /.test(l); })) {
        flush(); out.push('<blockquote>' + inline(lines.map(function (l) { return l.slice(2); }).join(' ')) + '</blockquote>'); return;
      }
      flush(); out.push('<p>' + inline(lines.join(' ')) + '</p>');
    });
    flush();
    return out.join('\n');
  }

  function fmtDate(iso) {
    if (!iso) return '';
    var d = new Date(iso + 'T00:00:00Z');
    if (isNaN(d)) return iso;
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
  }
  function readMinutes(text) { return Math.max(1, Math.round(String(text || '').split(/\s+/).length / 220)); }
  function url(a, base) { return (base || '') + 'writing/' + encodeURIComponent(a.id) + '/'; }

  function articleCard(a, base) {
    return '<article class="wcard">' +
      '<div class="k"><span class="mono">' + esc(fmtDate(a.date)) + '</span><span class="mono">' + readMinutes(a.body) + ' min</span></div>' +
      '<h2><a href="' + url(a, base) + '">' + esc(a.title) + '</a></h2>' +
      '<p>' + esc(a.summary || '') + '</p>' +
      ((a.tags || []).length ? '<div class="tags">' + a.tags.slice(0, 4).map(function (t) { return '<span class="tag">' + esc(t) + '</span>'; }).join('') + '</div>' : '') +
    '</article>';
  }

  function articlePage(a, base, profile) {
    base = base || ''; profile = profile || {};
    var authors = [profile.name || 'morizin'].concat(a.coauthors || []);
    return '<article class="article">' +
      '<header class="article-head">' +
        '<a class="crumb-link" href="' + base + 'writing.html">← Writing</a>' +
        '<h1>' + esc(a.title) + '</h1>' +
        (a.summary ? '<p class="lede">' + esc(a.summary) + '</p>' : '') +
        '<div class="byline">' +
          '<span><b>' + esc(authors[0]) + '</b>' + (authors.length > 1 ? ' with ' + esc(authors.slice(1).join(', ')) : '') + '</span>' +
          '<span>' + esc(fmtDate(a.date)) + (a.originally ? ' · first written ' + esc(fmtDate(a.originally)) : '') + '</span>' +
          '<span>' + readMinutes(a.body) + ' min read</span>' +
        '</div>' +
        ((a.tags || []).length ? '<div class="tags">' + a.tags.map(function (t) { return '<span class="tag">' + esc(t) + '</span>'; }).join('') + '</div>' : '') +
      '</header>' +
      '<div class="prose">' + md(a.body) + '</div>' +
      (a.source && a.source.href ? '<p class="source"><span class="mono">Source</span><a href="' + esc(a.source.href) + '" rel="noopener">' + esc(a.source.label || a.source.href) + ' →</a></p>' : '') +
    '</article>';
  }

  return { md: md, articleCard: articleCard, articlePage: articlePage, url: url, fmtDate: fmtDate, esc: esc };
});
