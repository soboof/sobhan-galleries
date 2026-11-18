/* Sobhan Gallery — site behaviour (no dependencies). Pages work without it. */
(function () {
	'use strict';
	var $ = function (s, r) { return (r || document).querySelector(s); };
	var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

	// ---- mobile menu ----
	var menuBtn = $('.menu-btn');
	if (menuBtn) {
		menuBtn.addEventListener('click', function () {
			var open = document.body.classList.toggle('menu-open');
			menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
		});
	}

	// ---- landing slideshow ----
	var show = $('.show');
	if (show) {
		var slides = $$('.show-slide', show), dots = $$('.show-dots button', show);
		var who = $('.show-cap .who', show), what = $('.show-cap .what', show), ttl = $('.show-cap .ttl', show), link = $('.show-cap a', show);
		var cur = 0, timer = null;
		var go = function (i) {
			slides[cur].classList.remove('on'); dots[cur].removeAttribute('aria-current');
			cur = (i + slides.length) % slides.length;
			var s = slides[cur];
			var img = $('img', s);
			if (img && !img.getAttribute('src')) img.setAttribute('src', img.getAttribute('data-src'));
			s.classList.add('on'); dots[cur].setAttribute('aria-current', 'true');
			who.textContent = s.getAttribute('data-artist');
			what.textContent = s.getAttribute('data-work');
			if (ttl) ttl.textContent = s.getAttribute('data-title');
			if (link) link.setAttribute('href', s.getAttribute('data-href'));
			tone();
		};
		var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		var start = function () { clearInterval(timer); if (!reduce) timer = setInterval(function () { go(cur + 1); }, 5200); };
		var stop = function () { clearInterval(timer); };
		dots.forEach(function (d, i) { d.addEventListener('click', function () { stop(); go(i); start(); }); });
		var stage = $('.show-stage', show), sx = null;
		// phone: is the artwork light or dark behind the gallery name (top) and the caption (bottom)? Pick text colour to match.
		var lum = function (img, y0, y1) {
			if (getComputedStyle(img).objectFit !== 'cover' || !img.naturalWidth) return null;
			try {
				var W = 40, H = Math.max(1, Math.round(W * stage.clientHeight / Math.max(1, stage.clientWidth)));
				var c = document.createElement('canvas'); c.width = W; c.height = H;
				var g = c.getContext('2d'), k = Math.max(W / img.naturalWidth, H / img.naturalHeight);
				var dw = img.naturalWidth * k, dh = img.naturalHeight * k;
				g.drawImage(img, (W - dw) / 2, (H - dh) / 2, dw, dh);
				var d = g.getImageData(0, Math.floor(y0 * H), W, Math.max(1, Math.ceil((y1 - y0) * H))).data, sum = 0;
				for (var i = 0; i < d.length; i += 4) sum += 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
				return sum / (d.length / 4) / 255;
			} catch (err) { return null; }
		};
		var tone = function () {
			var img = $('img', slides[cur]);
			if (!img) return;
			if (!img.complete || !img.naturalWidth) { img.addEventListener('load', tone, { once: true }); return; }
			var t = lum(img, 0.06, 0.28), b = lum(img, 0.68, 0.96);
			if (t !== null) show.setAttribute('data-top', t > 0.58 ? 'light' : 'dark');
			if (b !== null) show.setAttribute('data-bottom', b > 0.58 ? 'light' : 'dark');
			if (window.sobhanTone) window.sobhanTone();
		};
		window.addEventListener('resize', tone);
		// tap a slide to open that artist; swipe to change slides
		stage.addEventListener('click', function () { location.href = slides[cur].getAttribute('data-href'); });
		stage.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; stop(); }, { passive: true });
		stage.addEventListener('touchend', function (e) {
			if (sx === null) return;
			var dx = e.changedTouches[0].clientX - sx; sx = null;
			if (Math.abs(dx) > 40) go(cur + (dx < 0 ? 1 : -1));
			start();
		});
		tone();
		start();
	}

	// ---- landing: no top bar at first; the logo flies from the hero into the bar as the page scrolls ----
	var brandImg = $('.site-head .brand img');
	if (document.body.classList.contains('landing') && brandImg) {
		var head = $('.site-head'), fly = document.createElement('img');
		fly.className = 'fly-logo'; fly.src = brandImg.getAttribute('src'); fly.alt = ''; fly.setAttribute('aria-hidden', 'true');
		document.body.appendChild(fly);
		document.body.classList.add('fly');
		// the gallery name: one line on the slide ("SOBHAN GALLERY"), two lines in the bar (SOBHAN / GALLERY)
		var word = $('.show-word'), brandWord = $('.site-head .brand-word'), fw = null, fa = null, fb = null, wordOn = false;
		var shape = { dx: 0, dy: 0, s1: 1, w1: 1 };
		if (word && brandWord) {
			fw = document.createElement('span'); fw.className = 'brand-word fly-word'; fw.setAttribute('aria-hidden', 'true');
			fw.innerHTML = '<span class="fw-a">SOBHAN</span><small class="fw-b">GALLERY</small>';
			fa = fw.firstChild; fb = fw.lastChild;
			document.body.appendChild(fw);
		}
		var measure = function () {  // where GALLERY must move to sit beside SOBHAN on one line, at SOBHAN's size
			if (!wordOn) return;
			var F = parseFloat(getComputedStyle(fw).fontSize) || 15, f = parseFloat(getComputedStyle(fb).fontSize) || F;
			var x1 = fa.offsetLeft + fa.offsetWidth + 0.8 * F;  // a clear word space, wider than the letter spacing
			shape.s1 = F / f;
			shape.dx = x1 - fb.offsetLeft;
			shape.dy = fa.offsetTop - fb.offsetTop;
			shape.w1 = x1 + fb.offsetWidth * shape.s1;
		};
		var src = null, dist = 240, ticking = false;
		var clamp = function (v) { return v < 0 ? 0 : v > 1 ? 1 : v; };
		var pick = function () {  // the logo on the slide
			src = $$('.show-logo, .hero-logo').filter(function (el) { return getComputedStyle(el).display !== 'none'; })[0] || null;
			dist = src && src.classList.contains('show-logo') ? window.innerHeight * 0.5 : 240;
			wordOn = !!fw && getComputedStyle(word).display !== 'none';  // phone only: the name on the slide
			if (fw) fw.style.display = wordOn ? '' : 'none';
			document.body.classList.toggle('word-fly', wordOn);
			measure();
		};
		var update = function () {
			ticking = false;
			if (!src) return;
			var p = clamp(window.scrollY / dist), e = p * p * (3 - 2 * p);
			var a = src.getBoundingClientRect(), b = brandImg.getBoundingClientRect();
			fly.style.width = (a.width + (b.width - a.width) * e) + 'px';
			fly.style.transform = 'translate(' + (a.left + (b.left - a.left) * e) + 'px,' + (a.top + (b.top - a.top) * e) + 'px)';
			fly.style.filter = src.classList.contains('show-logo') ? 'drop-shadow(0 12px 28px rgba(0,0,0,' + (0.4 * (1 - e)).toFixed(3) + '))' : '';
			var bar = clamp((p - 0.45) / 0.55);
			if (wordOn) {
				var wa = word.getBoundingClientRect(), wb = brandWord.getBoundingClientRect();
				var k0 = wa.width / shape.w1, k = k0 + (1 - k0) * e, r = 1 - e;
				// start from where the name sits before scrolling, so it glides straight up into the bar instead of leaving the screen
				var top0 = wa.top + window.scrollY;
				fw.style.transform = 'translate(' + (wa.left + (wb.left - wa.left) * e) + 'px,' + (top0 + (wb.top - top0) * e) + 'px) scale(' + k + ')';
				// GALLERY slides from beside SOBHAN (one line) down under it (two lines) and shrinks to the bar's size
				fb.style.transform = 'translate(' + (shape.dx * r) + 'px,' + (shape.dy * r) + 'px) scale(' + (shape.s1 + (1 - shape.s1) * e) + ')';
				// from the slide's contrast colour to the bar's ink as the bar fills in
				var light = show && show.getAttribute('data-top') === 'light', c0 = light ? 22 : 255;
				// keep the slide colour until the bar is mostly there, then switch quickly (a mid-grey would vanish on the artwork)
				var q = clamp((bar - 0.4) / 0.3); q = q * q * (3 - 2 * q);
				var mix = function (a, b) { return Math.round(a + (b - a) * q); };
				fw.style.color = 'rgb(' + mix(c0, 22) + ',' + mix(light ? 21 : 255, 21) + ',' + mix(light ? 19 : 255, 19) + ')';
				fw.style.textShadow = light ? 'none' : '0 1px 14px rgba(0,0,0,' + (0.5 * (1 - q)).toFixed(3) + ')';
			}
			head.style.setProperty('--bar', bar.toFixed(3));
			head.style.setProperty('--ui', clamp((p - 0.7) / 0.3).toFixed(3));
			document.body.classList.toggle('bar-on', p > 0.85);
		};
		var req = function () { update(); };  // scroll events already arrive once per frame
		window.sobhanTone = req;
		pick(); update();
		window.addEventListener('scroll', req, { passive: true });
		window.addEventListener('resize', function () { pick(); req(); });
		window.addEventListener('load', function () { measure(); req(); });
		if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { measure(); req(); });
		fly.addEventListener('load', req);
	}

	// ---- artists filter (grid + A–Z list) ----
	var filter = $('#artist-filter');
	if (filter) {
		var items = $$('[data-search]');
		var count = $('.count'), none = $('.no-match');
		var norm = function (s) { return (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); };
		var apply = function () {
			var q = norm(filter.value.trim()), shown = 0;
			items.forEach(function (el) {
				var hit = !q || norm(el.getAttribute('data-search')).indexOf(q) !== -1;
				el.hidden = !hit; if (hit) shown++;
			});
			$$('.az-group').forEach(function (g) { g.hidden = !$$('[data-search]', g).some(function (el) { return !el.hidden; }); });
			if (count) count.textContent = shown + (shown === 1 ? ' artist' : ' artists');
			if (none) none.style.display = shown ? 'none' : 'block';
		};
		filter.addEventListener('input', apply);
		var q0 = new URLSearchParams(location.search).get('q');
		if (q0) { filter.value = q0; apply(); }
	}

	// ---- artwork viewer ----
	var dlg = $('#viewer');
	var works = $$('.work');
	if (dlg && works.length && typeof dlg.showModal === 'function') {
		var vimg = $('.v-stage img', dlg), vcap = $('.v-cap', dlg), idx = 0;
		var showWork = function (i) {
			idx = (i + works.length) % works.length;
			var w = works[idx];
			vimg.src = $('.work-open', w).getAttribute('href');
			vimg.alt = $('.work-open img', w).alt;
			vcap.innerHTML = $('figcaption', w).innerHTML + '<span class="v-pos">' + (idx + 1) + ' / ' + works.length + '</span>';
		};
		works.forEach(function (w, i) {
			$('.work-open', w).addEventListener('click', function (e) {
				if (e.metaKey || e.ctrlKey || e.shiftKey) return;
				e.preventDefault(); showWork(i); dlg.showModal();
			});
		});
		$('.v-prev', dlg).addEventListener('click', function () { showWork(idx - 1); });
		$('.v-next', dlg).addEventListener('click', function () { showWork(idx + 1); });
		$('.v-close', dlg).addEventListener('click', function () { dlg.close(); });
		dlg.addEventListener('click', function (e) { if (e.target === dlg || e.target.classList.contains('v-stage')) dlg.close(); });
		dlg.addEventListener('keydown', function (e) {
			if (e.key === 'ArrowLeft') { showWork(idx - 1); e.preventDefault(); }
			if (e.key === 'ArrowRight') { showWork(idx + 1); e.preventDefault(); }
		});
		var x0 = null;
		dlg.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
		dlg.addEventListener('touchend', function (e) {
			if (x0 === null) return;
			var dx = e.changedTouches[0].clientX - x0;
			if (Math.abs(dx) > 50) showWork(idx + (dx < 0 ? 1 : -1));
			x0 = null;
		});
		dlg.addEventListener('close', function () { vimg.removeAttribute('src'); });
	}

	// ---- search page ----
	var results = $('#results');
	if (results && window.SOBHAN_INDEX) {
		var input = $('#q');
		var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
		var normS = function (s) { return (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); };
		var render = function (q) {
			var nq = normS(q.trim());
			if (!nq) { results.innerHTML = ''; return; }
			var groups = [['Artists', 'a'], ['Artworks', 'w'], ['Exhibitions', 'e']];
			var html = '', total = 0;
			groups.forEach(function (g) {
				var hits = window.SOBHAN_INDEX.filter(function (it) { return it.k === g[1] && normS(it.t + ' ' + (it.m || '') + ' ' + (it.s || '')).indexOf(nq) !== -1; });
				if (!hits.length) return;
				total += hits.length;
				var more = hits.length > 60 ? '<li class="none">… and ' + (hits.length - 60) + ' more. Try a longer search.</li>' : '';
				html += '<h2>' + g[0] + ' (' + hits.length + ')</h2><ul>' + hits.slice(0, 60).map(function (it) {
					return '<li><a href="' + esc(it.u) + '">' + (it.i ? '<img src="' + esc(it.i) + '" alt="" loading="lazy">' : '<span></span>') +
						'<span><span class="r-t">' + esc(it.t) + '</span><br><span class="r-m">' + esc(it.m || '') + '</span></span></a></li>';
				}).join('') + more + '</ul>';
			});
			results.innerHTML = total ? html : '<p class="none">Nothing found for “' + esc(q) + '”.</p>';
		};
		var q1 = new URLSearchParams(location.search).get('search_text') || new URLSearchParams(location.search).get('q') || '';
		input.value = q1; render(q1);
		input.addEventListener('input', function () { render(input.value); });
	}
})();
