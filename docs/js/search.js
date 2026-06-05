const SearchSystem = {
  overlay: null,
  input: null,
  results: null,
  modal: null,
  pages: [],
  isOpen: false,

  init() {
    this.build();
    this.bindKeyboard();
    this.indexContent();
  },

  build() {
    const html = `
      <div id="search-overlay" class="search-overlay" style="display:none">
        <div class="search-modal">
          <div class="search-header">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="search-icon"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <input type="text" id="search-input" class="search-input" placeholder="Search documentation..." autofocus>
            <kbd class="search-kbd">ESC</kbd>
          </div>
          <div id="search-results" class="search-results"></div>
          <div class="search-footer">
            <span><kbd>↑</kbd><kbd>↓</kbd> Navigate</span>
            <span><kbd>↵</kbd> Open</span>
            <span><kbd>ESC</kbd> Close</span>
          </div>
        </div>
      </div>`;
    document.body.insertAdjacentHTML('beforeend', html);
    this.overlay = document.getElementById('search-overlay');
    this.input = document.getElementById('search-input');
    this.results = document.getElementById('search-results');
    this.modal = this.overlay.querySelector('.search-modal');
    this.overlay.addEventListener('click', (e) => { if (e.target === this.overlay) this.close(); });
    this.input.addEventListener('input', () => this.search(this.input.value));
    this.input.addEventListener('keydown', (e) => this.handleKeydown(e));
  },

  indexContent() {
    const sections = document.querySelectorAll('[data-page]');
    sections.forEach(section => {
      const id = section.id;
      const title = section.querySelector('h1, h2')?.textContent || id;
      const content = section.textContent.trim();
      this.pages.push({ id, title, content });
    });
  },

  search(query) {
    if (!query.trim()) { this.results.innerHTML = '<div class="search-empty">Type to search documentation...</div>'; return; }
    const q = query.toLowerCase();
    const matches = this.pages
      .map(page => {
        const idx = page.content.toLowerCase().indexOf(q);
        if (idx === -1) return null;
        const start = Math.max(0, idx - 60);
        const end = Math.min(page.content.length, idx + q.length + 100);
        let snippet = (start > 0 ? '...' : '') + page.content.slice(start, end) + (end < page.content.length ? '...' : '');
        snippet = snippet.replace(new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'), '<mark>$1</mark>');
        return { id: page.id, title: page.title, snippet };
      })
      .filter(Boolean);

    if (!matches.length) {
      this.results.innerHTML = '<div class="search-empty">No results found</div>';
      return;
    }
    this.results.innerHTML = matches.map((m, i) => `
      <a href="#${m.id}" class="search-result-item" data-index="${i}" onclick="SearchSystem.close()">
        <div class="result-title">${m.title}</div>
        <div class="result-snippet">${m.snippet}</div>
      </a>
    `).join('');
  },

  handleKeydown(e) {
    const items = this.results.querySelectorAll('.search-result-item');
    const active = this.results.querySelector('.search-result-item.active');
    let idx = -1;
    if (active) idx = parseInt(active.dataset.index);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      idx = Math.min(idx + 1, items.length - 1);
      items.forEach(el => el.classList.remove('active'));
      if (items[idx]) { items[idx].classList.add('active'); items[idx].scrollIntoView({ block: 'nearest' }); }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      idx = Math.max(idx - 1, 0);
      items.forEach(el => el.classList.remove('active'));
      if (items[idx]) { items[idx].classList.add('active'); items[idx].scrollIntoView({ block: 'nearest' }); }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (active) { active.click(); }
      else if (items[0]) { items[0].click(); }
    }
  },

  open() {
    this.isOpen = true;
    this.overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    setTimeout(() => this.input.focus(), 100);
  },

  close() {
    this.isOpen = false;
    this.overlay.style.display = 'none';
    document.body.style.overflow = '';
    this.input.value = '';
    this.results.innerHTML = '';
  },

  bindKeyboard() {
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); this.open(); }
      if (e.key === 'Escape' && this.isOpen) { this.close(); }
    });
  }
};
