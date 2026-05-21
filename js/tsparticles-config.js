// tsparticles-config.js — Full-page particle background matching brand palette

export async function initTsParticles() {
  if (typeof tsParticles === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const isMobile = window.innerWidth < 768;

  await tsParticles.load('tsparticles', {
    fullScreen: false,
    fpsLimit: 60,
    detectRetina: true,
    particles: {
      number: {
        value: isMobile ? 30 : 70,
        density: { enable: true, area: 900 }
      },
      color: {
        value: ['#00D4FF', '#7B2FBE', '#FF2D8A', '#4169E1', '#D946EF']
      },
      shape: { type: 'circle' },
      opacity: {
        value: { min: 0.15, max: 0.45 },
        animation: {
          enable: true,
          speed: 0.4,
          minimumValue: 0.1,
          sync: false
        }
      },
      size: {
        value: { min: 1, max: 3 },
        animation: {
          enable: true,
          speed: 1.5,
          minimumValue: 0.5,
          sync: false
        }
      },
      links: {
        enable: true,
        distance: isMobile ? 100 : 140,
        color: { value: '#00D4FF' },
        opacity: 0.12,
        width: 0.8
      },
      move: {
        enable: true,
        speed: { min: 0.2, max: 0.6 },
        direction: 'none',
        outModes: { default: 'out' },
        random: true,
        straight: false
      }
    },
    interactivity: {
      detectsOn: 'window',
      events: {
        onHover: {
          enable: !isMobile,
          mode: 'grab'
        },
        resize: { enable: true }
      },
      modes: {
        grab: {
          distance: 160,
          links: {
            opacity: 0.25,
            color: '#7B2FBE'
          }
        }
      }
    },
    background: { color: 'transparent' }
  });
}
