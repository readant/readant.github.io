/* ========================================
   L Theme - 鼠标跟随光效
   ======================================== */

class CursorEffect {
  constructor() {
    this.cursor = null;
    this.cursorDot = null;
    this.trail = [];
    this.mouse = { x: 0, y: 0 };
    this.trailLength = 8;

    this.init();
  }

  init() {
    this.createElements();
    this.bindEvents();
    this.animate();
  }

  createElements() {
    // 自定义光标
    this.cursor = document.createElement('div');
    this.cursor.className = 'custom-cursor';
    this.cursor.style.cssText = `
      position: fixed;
      width: 40px;
      height: 40px;
      border: 2px solid rgba(79, 109, 245, 0.5);
      border-radius: 50%;
      pointer-events: none;
      z-index: 10000;
      transition: transform 0.15s ease, opacity 0.15s ease, border-color 0.15s ease;
      transform: translate(-50%, -50%);
      mix-blend-mode: difference;
    `;
    document.body.appendChild(this.cursor);

    // 中心点
    this.cursorDot = document.createElement('div');
    this.cursorDot.className = 'cursor-dot';
    this.cursorDot.style.cssText = `
      position: fixed;
      width: 8px;
      height: 8px;
      background: #6b85ff;
      border-radius: 50%;
      pointer-events: none;
      z-index: 10001;
      transform: translate(-50%, -50%);
      box-shadow: 0 0 15px rgba(107, 133, 255, 0.8);
    `;
    document.body.appendChild(this.cursorDot);

    // 拖尾效果
    for (let i = 0; i < this.trailLength; i++) {
      const dot = document.createElement('div');
      dot.className = 'cursor-trail';
      dot.style.cssText = `
        position: fixed;
        width: ${8 - i * 0.8}px;
        height: ${8 - i * 0.8}px;
        background: rgba(79, 109, 245, ${0.4 - i * 0.05});
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%);
      `;
      document.body.appendChild(dot);
      this.trail.push({ el: dot, x: 0, y: 0 });
    }
  }

  bindEvents() {
    document.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    // 悬停链接和按钮时放大
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest('a, button, .nav-item, .post-card, .project-card, .skill-name')) {
        this.cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
        this.cursor.style.borderColor = 'rgba(249, 115, 22, 0.8)';
        this.cursorDot.style.background = '#f97316';
        this.cursorDot.style.boxShadow = '0 0 20px rgba(249, 115, 22, 0.8)';
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest('a, button, .nav-item, .post-card, .project-card, .skill-name')) {
        this.cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        this.cursor.style.borderColor = 'rgba(79, 109, 245, 0.5)';
        this.cursorDot.style.background = '#6b85ff';
        this.cursorDot.style.boxShadow = '0 0 15px rgba(107, 133, 255, 0.8)';
      }
    });

    // 点击效果
    document.addEventListener('mousedown', () => {
      this.cursor.style.transform = 'translate(-50%, -50%) scale(0.8)';
    });

    document.addEventListener('mouseup', () => {
      this.cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    });

    // 鼠标离开窗口
    document.addEventListener('mouseleave', () => {
      this.cursor.style.opacity = '0';
      this.cursorDot.style.opacity = '0';
      this.trail.forEach(t => t.el.style.opacity = '0');
    });

    document.addEventListener('mouseenter', () => {
      this.cursor.style.opacity = '1';
      this.cursorDot.style.opacity = '1';
      this.trail.forEach(t => t.el.style.opacity = '1');
    });
  }

  animate() {
    // 更新光标位置
    this.cursor.style.left = this.mouse.x + 'px';
    this.cursor.style.top = this.mouse.y + 'px';

    // 更新中心点
    this.cursorDot.style.left = this.mouse.x + 'px';
    this.cursorDot.style.top = this.mouse.y + 'px';

    // 更新拖尾
    let prevX = this.mouse.x;
    let prevY = this.mouse.y;

    for (let i = 0; i < this.trail.length; i++) {
      const t = this.trail[i];
      const dx = prevX - t.x;
      const dy = prevY - t.y;

      t.x += dx * (0.3 - i * 0.02);
      t.y += dy * (0.3 - i * 0.02);

      t.el.style.left = t.x + 'px';
      t.el.style.top = t.y + 'px';

      prevX = t.x;
      prevY = t.y;
    }

    requestAnimationFrame(() => this.animate());
  }
}

// 检查是否为移动设备
function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// 非移动设备才启用自定义光标
document.addEventListener('DOMContentLoaded', () => {
  if (!isMobile() && window.innerWidth > 768) {
    // 隐藏默认光标
    document.body.style.cursor = 'none';
    document.querySelectorAll('a, button').forEach(el => {
      el.style.cursor = 'none';
    });

    window.cursorEffect = new CursorEffect();
  }
});
