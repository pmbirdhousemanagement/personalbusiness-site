/* Personal Business — lists, filters, search, scroll reveal, progress line. */
(function () {
  const $ = (s, el = document) => el.querySelector(s);
  const fmtDate = d => new Date(d + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase();
  const VERB = { written: 'read', audio: 'listen', video: 'watch' };
  const esc = s => s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));

  function labelFor(p) {
    const parts = ['<b>ARTICLE</b>', fmtDate(p.date)];
    if (p.minutes) parts.push(`${p.minutes} min ${VERB[p.medium] || 'read'}`);
    return `<span class="label">${parts.join(' · ')}</span>`;
  }

  function row(p, hl) {
    const h = s => hl ? s.replace(hl, '<mark>$&</mark>') : s;
    let excerpt = '';
    if (hl && p.text) {
      const m = p.text.match(hl);
      if (m) { const i = Math.max(0, m.index - 70); excerpt = `<p class="excerpt">…${h(esc(p.text.slice(i, i + 170)))}…</p>`; }
    }
    return `<li>${labelFor(p)}<h2><a href="${p.url}">${h(esc(p.title))}</a></h2><p class="deck">${h(esc(p.deck || ''))}</p>${excerpt}</li>`;
  }

  async function posts() {
    const base = document.body.dataset.root || '';
    const r = await fetch(base + 'posts.json');
    const all = await r.json();
    return all.sort((a, b) => b.date.localeCompare(a.date)).map(p => ({ ...p, url: base + p.url }));
  }

  // Latest + Conversations
  const list = $('[data-list]');
  if (list) posts().then(all => {
    const limit = +list.dataset.list || all.length;
    const render = m => { list.innerHTML = all.filter(p => m === 'all' || p.medium === m).slice(0, limit).map(p => row(p)).join(''); };
    render('all');
    document.querySelectorAll('.filters button').forEach(b => b.addEventListener('click', () => {
      document.querySelectorAll('.filters button').forEach(x => x.setAttribute('aria-pressed', x === b));
      render(b.dataset.filter);
    }));
  });

  // Search: every word must match title, deck or body.
  const box = $('.search-box');
  if (box) posts().then(all => {
    const out = $('[data-results]'), count = $('.result-count');
    const run = () => {
      const words = box.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
      if (!words.length) { out.innerHTML = ''; count.textContent = ''; return; }
      const hits = all.filter(p => words.every(w => `${p.title || ''} ${p.deck || ''} ${p.text || ''}`.toLowerCase().includes(w)));
      const hl = new RegExp(words.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'gi');
      count.textContent = hits.length ? `${hits.length} result${hits.length > 1 ? 's' : ''}` : 'No results. Try another word.';
      out.innerHTML = hits.map(p => row(p, hl)).join('');
    };
    box.addEventListener('input', run);
    box.focus();
  });

  // Scroll reveal, once, when 15% is on screen.
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const io = !reduce && 'IntersectionObserver' in window && new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
  }), { threshold: 0.15 });
  document.querySelectorAll('.article-body > *').forEach(el => {
    if (!io || el.getBoundingClientRect().top < innerHeight) return el.classList.add('is-visible');
    el.classList.add('reveal'); io.observe(el);
  });

  // Share links
  const u = encodeURIComponent(location.href), t = encodeURIComponent(document.title.replace(/ — Personal Business$/, ''));
  const SHARE = {
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
    email: `mailto:?subject=${t}&body=${u}`
  };
  document.querySelectorAll('[data-share]').forEach(a => { a.href = SHARE[a.dataset.share]; if (a.dataset.share !== 'email') a.target = '_blank'; a.rel = 'noopener'; });

  // Reading progress
  const bar = $('.progress'), body = $('.article-body');
  if (bar && body) {
    const tick = () => {
      const end = body.offsetTop + body.offsetHeight - innerHeight;
      bar.style.width = Math.min(100, Math.max(0, scrollY / end * 100)) + '%';
    };
    addEventListener('scroll', tick, { passive: true }); tick();
  }
})();
