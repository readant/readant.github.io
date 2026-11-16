/* ========================================
   L Theme - Interactive Features
   Version 3.0.0 - 全面动画增强
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  initHeroEntrance();
  initHeroTyping();
  initScrollReveal();
  initStatCounter();
  initCardTilt();
  initMagneticButtons();
  initParallax();
  initHeaderScroll();
  initCodeCopy();
  initScrollProgress();
  initMobileMenu();
  initSmoothScroll();
  initSearch();
  initTOC();
  initCursorGlow();
  initBaguaHover();
  initFloatingElements();
  initSectionDivider();
});

/* ========================================
   Hero 入场动画（逐个元素 stagger）
   ======================================== */
function initHeroEntrance() {
  const heroLeft = document.querySelector('.hero-left');
  const heroRight = document.querySelector('.hero-right');
  const scrollHint = document.querySelector('.scroll-hint');

  if (heroLeft) {
    const children = heroLeft.children;
    Array.from(children).forEach((child, i) => {
      child.style.opacity = '0';
      child.style.transform = 'translateY(30px)';
      child.style.transition = `opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${0.2 + i * 0.12}s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${0.2 + i * 0.12}s`;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          child.style.opacity = '1';
          child.style.transform = 'translateY(0)';
        });
      });
    });
  }

  if (heroRight) {
    heroRight.style.opacity = '0';
    heroRight.style.transform = 'scale(0.85)';
    heroRight.style.transition = 'opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.4s, transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.4s';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        heroRight.style.opacity = '1';
        heroRight.style.transform = 'scale(1)';
      });
    });
  }

  if (scrollHint) {
    scrollHint.style.opacity = '0';
    scrollHint.style.transform = 'translateY(20px)';
    scrollHint.style.transition = 'opacity 0.6s ease 1.5s, transform 0.6s ease 1.5s';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scrollHint.style.opacity = '1';
        scrollHint.style.transform = 'translateY(0)';
      });
    });
  }
}

/* ========================================
   Hero 打字机效果
   ======================================== */
function initHeroTyping() {
  const eyebrow = document.querySelector('.hero-eyebrow');
  if (!eyebrow) return;

  const text = eyebrow.textContent.trim();
  eyebrow.textContent = '';
  eyebrow.style.visibility = 'visible';

  let i = 0;
  let started = false;

  function type() {
    if (!started) {
      eyebrow.classList.add('typing-active');
      started = true;
    }
    if (i < text.length) {
      eyebrow.textContent += text.charAt(i);
      i++;
      setTimeout(type, 55 + Math.random() * 35);
    } else {
      setTimeout(() => {
        eyebrow.classList.remove('typing-active');
        eyebrow.style.borderRightColor = 'var(--primary)';
        setTimeout(() => {
          eyebrow.style.borderRightColor = 'transparent';
        }, 1500);
      }, 2000);
    }
  }
  setTimeout(type, 800);
}

/* ========================================
   滚动揭示动画（增强版）
   ======================================== */
function initScrollReveal() {
  // 基础揭示
  const revealElements = document.querySelectorAll('.post-card, .project-card, .about-card, .page-article');
  revealElements.forEach(el => el.classList.add('reveal'));

  // 分区标题揭示
  const sectionHeaders = document.querySelectorAll('.section-header, .about-header');
  sectionHeaders.forEach(el => el.classList.add('reveal-up'));

  // 古典引言揭示
  const quotes = document.querySelectorAll('.classical-quote');
  quotes.forEach(el => el.classList.add('reveal-scale'));

  // 统计行揭示
  const statsRows = document.querySelectorAll('.stats-row');
  statsRows.forEach(el => el.classList.add('reveal-up'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  document.querySelectorAll('.reveal, .reveal-up, .reveal-scale').forEach(el => observer.observe(el));

  // 交错延迟
  const grids = document.querySelectorAll('.post-grid, .about-grid');
  grids.forEach(grid => {
    Array.from(grid.children).forEach((child, i) => {
      child.style.transitionDelay = `${i * 0.1}s`;
    });
  });
}

/* ========================================
   数字滚动计数器
   ======================================== */
function initStatCounter() {
  const stats = document.querySelectorAll('.stat-value');
  if (stats.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  stats.forEach(stat => observer.observe(stat));
}

function animateCounter(el) {
  const text = el.textContent;
  const match = text.match(/(\d+)/);
  if (!match) return;

  const target = parseInt(match[1]);
  const suffix = text.replace(match[1], '');
  const duration = 1200;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(target * eased);
    el.textContent = current + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = text;
    }
  }

  el.textContent = '0' + suffix;
  requestAnimationFrame(update);
}

/* ========================================
   卡片鼠标跟随倾斜
   ======================================== */
function initCardTilt() {
  const cards = document.querySelectorAll('.post-card, .about-card, .project-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -3;
      const rotateY = ((x - centerX) / centerX) * 3;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
      card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.15s ease';
    });
  });
}

/* ========================================
   磁性按钮效果
   ======================================== */
function initMagneticButtons() {
  if (window.matchMedia('(max-width: 768px)').matches) return;

  const buttons = document.querySelectorAll('.btn-primary, .btn-ghost, .nav-item');

  buttons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)';
      btn.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
    });

    btn.addEventListener('mouseenter', () => {
      btn.style.transition = 'transform 0.15s ease';
    });
  });
}

/* ========================================
   视差滚动
   ======================================== */
function initParallax() {
  const hero = document.querySelector('.hero-section');
  const baguaContainer = document.querySelector('.bagua-container');
  if (!hero || !baguaContainer) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const heroHeight = hero.offsetHeight;

        if (scrollY < heroHeight) {
          const progress = scrollY / heroHeight;
          // 八卦环随滚动缩小+透明
          baguaContainer.style.transform = `scale(${1 - progress * 0.15})`;
          baguaContainer.style.opacity = `${1 - progress * 0.8}`;
          // Hero 内容上移
          const heroLeft = document.querySelector('.hero-left');
          if (heroLeft) {
            heroLeft.style.transform = `translateY(${scrollY * 0.2}px)`;
            heroLeft.style.opacity = `${1 - progress * 1.2}`;
          }
        }
        ticking = false;
      });
      ticking = true;
    }
  });
}

/* ========================================
   Header 滚动变化
   ======================================== */
function initHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        if (window.scrollY > 80) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  });
}

/* ========================================
   浮动装饰元素
   ======================================== */
function initFloatingElements() {
  const hero = document.querySelector('.hero-section');
  if (!hero) return;

  // 创建浮动的八卦符号
  const symbols = ['☰', '☱', '☲', '☳', '☴', '☵', '☶', '☷'];
  for (let i = 0; i < 6; i++) {
    const el = document.createElement('div');
    el.className = 'floating-symbol';
    el.textContent = symbols[i % symbols.length];
    el.style.cssText = `
      position: absolute;
      font-size: ${1 + Math.random() * 1.5}rem;
      color: rgba(99, 102, 241, ${0.04 + Math.random() * 0.04});
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      pointer-events: none;
      animation: float ${8 + Math.random() * 8}s ease-in-out infinite;
      animation-delay: ${Math.random() * 5}s;
    `;
    hero.appendChild(el);
  }
}

/* ========================================
   分区标题装饰动画
   ======================================== */
function initSectionDivider() {
  const dividers = document.querySelectorAll('.section-divider');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('divider-active');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  dividers.forEach(d => observer.observe(d));
}

/* ========================================
   代码复制按钮
   ======================================== */
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

/* ========================================
   滚动进度指示器
   ======================================== */
function initScrollProgress() {
  const indicator = document.createElement('div');
  indicator.className = 'scroll-indicator';
  document.body.appendChild(indicator);

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        indicator.style.width = `${scrollPercent}%`;
        ticking = false;
      });
      ticking = true;
    }
  });
}

/* ========================================
   移动端菜单
   ======================================== */
function initMobileMenu() {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');

  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    nav.classList.toggle('active');
    toggle.classList.toggle('active');
  });

  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !nav.contains(e.target)) {
      nav.classList.remove('active');
      toggle.classList.remove('active');
    }
  });

  nav.querySelectorAll('.nav-item').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('active');
      toggle.classList.remove('active');
    });
  });
}

/* ========================================
   平滑滚动
   ======================================== */
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

/* ========================================
   工具函数
   ======================================== */
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

/* ========================================
   搜索功能
   ======================================== */
function initSearch() {
  const searchTrigger = document.getElementById('searchTrigger');
  const searchOverlay = document.getElementById('searchOverlay');
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');

  if (!searchTrigger || !searchOverlay) return;

  searchTrigger.addEventListener('click', () => {
    searchOverlay.classList.add('active');
    searchInput.focus();
  });

  searchOverlay.addEventListener('click', (e) => {
    if (e.target === searchOverlay) {
      searchOverlay.classList.remove('active');
    }
  });

  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      searchOverlay.classList.add('active');
      searchInput.focus();
    }
    if (e.key === 'Escape') {
      searchOverlay.classList.remove('active');
    }
  });

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

/* ========================================
   TOC 目录高亮
   ======================================== */
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

/* ========================================
   八卦符号悬停高亮
   ======================================== */
function initBaguaHover() {
  const symbols = document.querySelectorAll('.bagua-symbol');
  const container = document.querySelector('.bagua-container');
  if (!symbols.length || !container) return;

  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const mx = e.clientX - cx;
    const my = e.clientY - cy;
    const angle = Math.atan2(my, mx) * (180 / Math.PI) + 90;

    symbols.forEach(sym => {
      const symAngle = parseFloat(sym.style.getPropertyValue('--angle'));
      let diff = Math.abs(angle - symAngle);
      if (diff > 180) diff = 360 - diff;

      const intensity = Math.max(0, 1 - diff / 60);
      const lines = sym.querySelectorAll('.gua-line');
      lines.forEach(line => {
        line.style.opacity = 0.25 + intensity * 0.75;
        if (intensity > 0.5) {
          line.style.background = 'var(--accent)';
          line.style.boxShadow = `0 0 ${intensity * 8}px var(--accent)`;
        } else {
          line.style.background = '';
          line.style.boxShadow = '';
        }
      });
    });
  });

  container.addEventListener('mouseleave', () => {
    symbols.forEach(sym => {
      const lines = sym.querySelectorAll('.gua-line');
      lines.forEach(line => {
        line.style.opacity = '';
        line.style.background = '';
        line.style.boxShadow = '';
      });
    });
  });
}

/* ========================================
   光标跟随光晕
   ======================================== */
function initCursorGlow() {
  if (window.matchMedia('(max-width: 768px)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  document.body.appendChild(glow);

  let mouseX = 0, mouseY = 0;
  let glowX = 0, glowY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animate() {
    glowX += (mouseX - glowX) * 0.12;
    glowY += (mouseY - glowY) * 0.12;
    glow.style.transform = `translate(${glowX - 150}px, ${glowY - 150}px)`;
    requestAnimationFrame(animate);
  }
  animate();
}
