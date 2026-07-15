/* ========================================
   L Theme - 3D 卡片效果
   ======================================== */

class Card3DEffect {
  constructor() {
    this.cards = [];
    this.init();
  }

  init() {
    // 为文章卡片添加 3D 效果
    this.setupCards('.post-card', {
      maxTilt: 10,
      maxGlare: 0.3
    });

    // 为项目卡片添加 3D 效果
    this.setupCards('.project-card', {
      maxTilt: 8,
      maxGlare: 0.25
    });

    // 为关于卡片添加 3D 效果
    this.setupCards('.about-card', {
      maxTilt: 8,
      maxGlare: 0.2
    });

    // 为技能标签添加 3D 效果
    this.setupCards('.skill-name', {
      maxTilt: 15,
      maxGlare: 0.4,
      scale: 1.1
    });
  }

  setupCards(selector, options = {}) {
    const cards = document.querySelectorAll(selector);
    const { maxTilt = 10, maxGlare = 0.3, scale = 1.02 } = options;

    cards.forEach(card => {
      card.style.transformStyle = 'preserve-3d';
      card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';

      // 添加光泽层
      const glare = document.createElement('div');
      glare.className = 'card-glare';
      glare.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: inherit;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.3s ease;
        background: linear-gradient(
          135deg,
          rgba(255, 255, 255, 0.1) 0%,
          rgba(255, 255, 255, 0) 50%,
          rgba(255, 255, 255, 0.05) 100%
        );
        z-index: 1;
      `;
      card.style.position = card.style.position || 'relative';
      card.style.overflow = card.style.overflow || 'hidden';
      card.appendChild(glare);

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -maxTilt;
        const rotateY = ((x - centerX) / centerX) * maxTilt;

        // 计算光泽位置
        const glareX = (x / rect.width) * 100;
        const glareY = (y / rect.height) * 100;

        card.style.transform = `
          perspective(1000px)
          rotateX(${rotateX}deg)
          rotateY(${rotateY}deg)
          scale3d(${scale}, ${scale}, ${scale})
        `;

        // 更新光泽位置
        glare.style.opacity = maxGlare;
        glare.style.background = `
          radial-gradient(
            circle at ${glareX}% ${glareY}%,
            rgba(255, 255, 255, ${maxGlare}) 0%,
            rgba(255, 255, 255, 0) 60%
          )
        `;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        glare.style.opacity = '0';
      });
    });
  }
}

// 光效脉冲动画
class GlowPulse {
  constructor() {
    this.init();
  }

  init() {
    // 为技能环添加脉冲效果
    const skillRing = document.querySelector('.skill-ring');
    if (skillRing) {
      this.addPulse(skillRing);
    }

    // 为中心元素添加脉冲效果
    const centerElement = document.querySelector('.center-element');
    if (centerElement) {
      this.addPulse(centerElement);
    }
  }

  addPulse(element) {
    const pulse = document.createElement('div');
    pulse.className = 'glow-pulse';
    pulse.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 100%;
      height: 100%;
      border-radius: 50%;
      border: 2px solid rgba(79, 109, 245, 0.3);
      animation: pulse-ring 3s ease-out infinite;
      pointer-events: none;
    `;
    element.appendChild(pulse);

    // 添加脉冲动画样式
    if (!document.getElementById('pulse-styles')) {
      const style = document.createElement('style');
      style.id = 'pulse-styles';
      style.textContent = `
        @keyframes pulse-ring {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.5;
          }
          100% {
            transform: translate(-50%, -50%) scale(1.3);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }
}

// 鼠标移动视差效果
class ParallaxEffect {
  constructor() {
    this.elements = [];
    this.mouse = { x: 0, y: 0 };
    this.init();
  }

  init() {
    // 收集需要视差效果的元素
    document.querySelectorAll('.hero-text, .scroll-hint').forEach(el => {
      this.elements.push({
        el: el,
        speed: parseFloat(el.dataset.speed) || 0.02
      });
    });

    if (this.elements.length > 0) {
      this.bindEvents();
      this.animate();
    }
  }

  bindEvents() {
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = (e.clientX - window.innerWidth / 2) / window.innerWidth;
      this.mouse.y = (e.clientY - window.innerHeight / 2) / window.innerHeight;
    });
  }

  animate() {
    this.elements.forEach(item => {
      const x = this.mouse.x * 50 * item.speed;
      const y = this.mouse.y * 50 * item.speed;
      item.el.style.transform = `translate(${x}px, ${y}px)`;
    });

    requestAnimationFrame(() => this.animate());
  }
}

// 检查是否为移动设备
function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// 初始化所有 3D 效果
document.addEventListener('DOMContentLoaded', () => {
  // 3D 卡片效果（所有设备）
  new Card3DEffect();

  // 光效脉冲（所有设备）
  new GlowPulse();

  // 视差效果（仅桌面设备）
  if (!isMobile() && window.innerWidth > 768) {
    new ParallaxEffect();
  }
});
