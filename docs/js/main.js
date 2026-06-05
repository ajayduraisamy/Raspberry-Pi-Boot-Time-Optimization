const DocsApp = {
  currentPage: 'overview',
  sidebarLinks: [],
  sections: [],
  tocLinks: [],

  init() {
    this.cacheElements();
    this.bindNavigation();
    this.bindScrollSpy();
    this.bindProgressBar();
    this.bindCopyButtons();
    this.bindBackToTop();
    this.bindCodeToggles();
    this.animateCounters();
    this.initTerminal();
    this.handleRoute();
    window.addEventListener('hashchange', () => this.handleRoute());
    this.initReadingTime();
    this.initVersionSelector();
    this.initSidebarToggle();
  },

  cacheElements() {
    this.sidebarLinks = document.querySelectorAll('.sidebar-link');
    this.sections = document.querySelectorAll('.doc-section');
    this.tocLinks = document.querySelectorAll('.toc-link');
  },

  handleRoute() {
    const hash = location.hash.replace('#', '') || 'overview';
    this.currentPage = hash;
    this.showPage(hash);
    this.updateSidebar(hash);
    this.updateTOC(hash);
    this.updateBreadcrumbs(hash);
    this.updatePrevNext(hash);
    if (window.innerWidth < 1024) document.querySelector('.sidebar').classList.remove('open');
  },

  showPage(id) {
    this.sections.forEach(s => {
      s.style.display = s.id === id ? 'block' : 'none';
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const title = document.querySelector(`#${id} h1`)?.textContent || '';
    document.title = title ? `${title} — Pi Boot Opt Docs` : 'Raspberry Pi Boot Time Optimization Docs';
  },

  updateSidebar(id) {
    this.sidebarLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
    });
  },

  updateTOC(id) {
    const section = document.getElementById(id);
    if (!section) return;
    const headings = section.querySelectorAll('h2, h3');
    const tocContainer = document.querySelector('.toc-links');
    if (!tocContainer) return;
    if (headings.length < 2) { tocContainer.innerHTML = '<div class="toc-empty">No headings</div>'; return; }
    tocContainer.innerHTML = Array.from(headings).map(h => {
      const anchor = h.id || h.textContent.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      if (!h.id) h.id = anchor;
      return `<a href="#${anchor}" class="toc-item ${h.tagName === 'H3' ? 'toc-h3' : ''}">${h.textContent}</a>`;
    }).join('');
    this.tocLinks = document.querySelectorAll('.toc-item');
    this.bindTOCScroll();
  },

  bindTOCScroll() {
    const toc = document.querySelector('.toc');
    if (!toc) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.tocLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
          });
        }
      });
    }, { rootMargin: '-80px 0px -60% 0px' });
    document.querySelectorAll('h2[id], h3[id]').forEach(h => observer.observe(h));
  },

  bindNavigation() {
    document.querySelectorAll('.sidebar-link, .toc-item, .breadcrumb-link').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          history.pushState(null, '', href);
          this.handleRoute();
        }
      });
    });
  },

  bindScrollSpy() {
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar) return;
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const active = this.sections.find(s => {
            const rect = s.getBoundingClientRect();
            return rect.top <= 150 && rect.bottom > 150;
          });
          if (active) this.updateSidebar(active.id);
          ticking = false;
        });
        ticking = true;
      }
    });
  },

  bindProgressBar() {
    const bar = document.getElementById('reading-progress');
    if (!bar) return;
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = `${(scrollTop / docHeight) * 100}%`;
    });
  },

  bindCopyButtons() {
    document.querySelectorAll('.copy-code-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const code = btn.closest('.code-block')?.querySelector('code')?.textContent || '';
        navigator.clipboard.writeText(code).then(() => {
          const orig = btn.innerHTML;
          btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>';
          setTimeout(() => { btn.innerHTML = orig; }, 2000);
        });
      });
    });
    document.querySelectorAll('[data-copy]').forEach(el => {
      el.addEventListener('click', () => {
        navigator.clipboard.writeText(el.dataset.copy).then(() => {
          const orig = el.textContent;
          el.textContent = 'Copied!';
          setTimeout(() => { el.textContent = orig; }, 2000);
        });
      });
    });
  },

  bindBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;
    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 400);
    });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  },

  bindCodeToggles() {
    document.querySelectorAll('.code-expand-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const block = btn.closest('.code-block');
        block.classList.toggle('expanded');
        btn.textContent = block.classList.contains('expanded') ? 'Collapse' : 'Expand';
      });
    });
  },

  animateCounters() {
    const counters = document.querySelectorAll('.counter');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.dataset.target);
          const duration = 1500;
          const start = performance.now();
          const animate = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            entry.target.textContent = Math.floor(progress * target).toLocaleString();
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => observer.observe(c));
  },

  initTerminal() {
    if (typeof TerminalDemo !== 'undefined') {
      TerminalDemo.init('terminal-body');
      const restartBtn = document.getElementById('terminal-restart');
      if (restartBtn) restartBtn.addEventListener('click', () => TerminalDemo.restart());
    }
  },

  initReadingTime() {
    document.querySelectorAll('[data-reading-time]').forEach(el => {
      const section = document.getElementById(el.dataset.readingTime);
      if (section) {
        const words = section.textContent.trim().split(/\s+/).length;
        el.textContent = `${Math.max(1, Math.ceil(words / 200))} min read`;
      }
    });
  },

  initVersionSelector() {
    const sel = document.getElementById('version-select');
    if (sel) {
      sel.addEventListener('change', () => {
      });
    }
  },

  initSidebarToggle() {
    const toggle = document.getElementById('sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    if (toggle && sidebar) {
      toggle.addEventListener('click', () => sidebar.classList.toggle('open'));
    }
    const overlay = document.querySelector('.sidebar-overlay');
    if (overlay && sidebar) {
      overlay.addEventListener('click', () => sidebar.classList.remove('open'));
    }
  },

  updateBreadcrumbs(id) {
    const container = document.querySelector('.breadcrumbs');
    if (!container) return;
    const section = document.getElementById(id);
    const h1 = section?.querySelector('h1')?.textContent || '';
    const parts = [{ label: 'Docs', href: '#overview' }];
    if (id !== 'overview' && h1) parts.push({ label: h1 });
    container.innerHTML = parts.map((p, i) => `
      ${i > 0 ? '<span class="bc-sep">/</span>' : ''}
      ${p.href ? `<a href="${p.href}" class="bc-link">${p.label}</a>` : `<span class="bc-current">${p.label}</span>`}
    `).join('');
  },

  updatePrevNext(id) {
    const order = ['overview','getting-started','installation','project-overview','architecture','how-it-works','commands','services-analysis','optimization-script','before-vs-after','screenshots','interactive-demo','api-reference','faq','troubleshooting','learning-outcomes','future-enhancements','changelog'];
    const idx = order.indexOf(id);
    const prev = document.querySelector('.nav-prev');
    const next = document.querySelector('.nav-next');
    const prevSec = idx > 0 ? document.getElementById(order[idx - 1]) : null;
    const nextSec = idx < order.length - 1 ? document.getElementById(order[idx + 1]) : null;
    if (prev) {
      if (prevSec) { prev.innerHTML = `← ${prevSec.querySelector('h1')?.textContent || ''}`; prev.href = `#${order[idx - 1]}`; prev.style.display = ''; }
      else { prev.style.display = 'none'; }
    }
    if (next) {
      if (nextSec) { next.innerHTML = `${nextSec.querySelector('h1')?.textContent || ''} →`; next.href = `#${order[idx + 1]}`; next.style.display = ''; }
      else { next.style.display = 'none'; }
    }
  }
};

document.addEventListener('DOMContentLoaded', () => DocsApp.init());
