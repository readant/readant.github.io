/* ========================================
   L Theme - Interactive Features
   Version: 1.0.0
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initCodeCopy();
  initScrollProgress();
  initMobileMenu();
  initSmoothScroll();
  initSearch();
  initTOC();
});

/* Scroll Reveal Animation */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.post-card, .project-card, .about-card, .section-header, .page-article');

  revealElements.forEach(el => {
    el.classList.add('reveal');
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/* Code Block Copy Button */
function initCodeCopy() {
  const codeBlocks = document.querySelectorAll('pre code');

  codeBlocks.forEach(code => {
    const pre = code.parentElement;
    pre.classList.add('code-block');

    const button = document.createElement('button');
    button.className = 'copy-button';
    button.textContent = '复制';
    button.setAttribute('data-tooltip', '复制代码');

    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(code.textContent);
        button.textContent = '已复制';
        button.classList.add('copied');
        setTimeout(() => {
          button.textContent = '复制';
          button.classList.remove('copied');
        }, 2000);
      } catch (err) {
        button.textContent = '失败';
        setTimeout(() => {
          button.textContent = '复制';
        }, 2000);
      }
    });

    pre.appendChild(button);
  });
}

/* Scroll Progress Indicator */
function initScrollProgress() {
  const indicator = document.createElement('div');
  indicator.className = 'scroll-indicator';
  document.body.appendChild(indicator);

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    indicator.style.width = `${scrollPercent}%`;
  });
}

/* Mobile Menu Toggle */
function initMobileMenu() {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');

  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    nav.classList.toggle('active');
    toggle.classList.toggle('active');
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !nav.contains(e.target)) {
      nav.classList.remove('active');
      toggle.classList.remove('active');
    }
  });

  // Close menu when clicking nav links
  nav.querySelectorAll('.nav-item').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('active');
      toggle.classList.remove('active');
    });
  });
}

/* Smooth Scroll for Anchor Links */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* Utility: Debounce */
function debounce(func, wait = 20) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/* Utility: Throttle */
function throttle(func, limit = 100) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/* Search Functionality */
function initSearch() {
  const searchTrigger = document.getElementById('searchTrigger');
  const searchOverlay = document.getElementById('searchOverlay');
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');

  if (!searchTrigger || !searchOverlay) return;

  // Open search
  searchTrigger.addEventListener('click', () => {
    searchOverlay.classList.add('active');
    searchInput.focus();
  });

  // Close search
  searchOverlay.addEventListener('click', (e) => {
    if (e.target === searchOverlay) {
      searchOverlay.classList.remove('active');
    }
  });

  document.addEventListener('keydown', (e) => {
    // Cmd/Ctrl + K to open
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      searchOverlay.classList.add('active');
      searchInput.focus();
    }
    // ESC to close
    if (e.key === 'Escape') {
      searchOverlay.classList.remove('active');
    }
  });

  // Search input handler
  searchInput.addEventListener('input', debounce((e) => {
    const query = e.target.value.trim().toLowerCase();
    if (query.length < 2) {
      searchResults.innerHTML = '<div class="search-empty">输入关键词开始搜索</div>';
      return;
    }
    performSearch(query);
  }, 300));
}

function performSearch(query) {
  const searchResults = document.getElementById('searchResults');

  // Fetch search index
  fetch('/db.json')
    .then(res => {
      if (!res.ok) throw new Error('Search index not found');
      return res.json();
    })
    .then(data => {
      const posts = data.posts || [];
      const results = posts.filter(post => {
        const title = (post.title || '').toLowerCase();
        const content = (post.content || '').toLowerCase();
        const tags = (post.tags || []).join(' ').toLowerCase();
        return title.includes(query) || content.includes(query) || tags.includes(query);
      });

      if (results.length === 0) {
        searchResults.innerHTML = '<div class="search-empty">未找到相关内容</div>';
        return;
      }

      searchResults.innerHTML = results.slice(0, 10).map(post => {
        const excerpt = getExcerpt(post.content, query);
        return `
          <a href="${post.path}" class="search-result-item">
            <div class="search-result-title">${highlightText(post.title, query)}</div>
            <div class="search-result-excerpt">${excerpt}</div>
          </a>
        `;
      }).join('');
    })
    .catch(() => {
      searchResults.innerHTML = '<div class="search-empty">搜索功能需要重新生成，请运行 hexo generate</div>';
    });
}

function getExcerpt(content, query, length = 150) {
  if (!content) return '';
  const plainText = content.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ');
  const index = plainText.toLowerCase().indexOf(query);
  if (index === -1) return plainText.substring(0, length) + '...';

  const start = Math.max(0, index - 50);
  const end = Math.min(plainText.length, index + query.length + 100);
  let excerpt = plainText.substring(start, end);
  if (start > 0) excerpt = '...' + excerpt;
  if (end < plainText.length) excerpt += '...';

  return highlightText(excerpt, query);
}

function highlightText(text, query) {
  if (!text || !query) return text || '';
  const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/* Table of Contents (TOC) */
function initTOC() {
  const tocLinks = document.querySelectorAll('.toc-link');
  if (tocLinks.length === 0) return;

  const headings = [];
  tocLinks.forEach(link => {
    const id = link.getAttribute('href')?.substring(1);
    const heading = document.getElementById(id);
    if (heading) {
      headings.push({ el: heading, link: link });
    }
  });

  if (headings.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        tocLinks.forEach(l => l.classList.remove('active'));
        const item = headings.find(h => h.el === entry.target);
        if (item) item.link.classList.add('active');
      }
    });
  }, {
    rootMargin: '-80px 0px -70% 0px',
    threshold: 0
  });

  headings.forEach(h => observer.observe(h.el));
}
