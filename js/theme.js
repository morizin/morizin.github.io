/* Colour theme — runs in <head> so the first paint is already the right one.
   'paper' is the brand default; 'cadet' is the second palette. With no saved
   choice, the OS dark preference picks cadet. */
(function () {
  var KEY = 'morizin.theme';
  var META = { paper: '#F6F1E9', cadet: '#22324E' };
  function saved() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function apply(t) {
    document.documentElement.setAttribute('data-theme', t);
    var m = document.querySelector('meta[name="theme-color"]');
    if (m) m.setAttribute('content', META[t] || META.paper);
  }
  var t = saved();
  if (t !== 'paper' && t !== 'cadet') {
    t = (window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches) ? 'cadet' : 'paper';
  }
  apply(t);
  window.MORIZIN_THEME = {
    get: function () { return document.documentElement.getAttribute('data-theme') || 'paper'; },
    set: function (next) { apply(next); try { localStorage.setItem(KEY, next); } catch (e) {} },
    toggle: function () { var n = this.get() === 'cadet' ? 'paper' : 'cadet'; this.set(n); return n; }
  };
})();
