const isMobile = window.matchMedia('(max-width: 900px)').matches;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const canvas = document.getElementById('bg-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, innerWidth / innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, isMobile ? 1.5 : 2));
camera.position.z = 12;

const group = new THREE.Group();
scene.add(group);

const particleCount = isMobile ? 55 : 120;
const geo = new THREE.IcosahedronGeometry(1, 1);
for (let i = 0; i < particleCount; i++) {
  const mat = new THREE.MeshBasicMaterial({
    color: new THREE.Color(`hsl(${250 + Math.random() * 70}, 90%, 65%)`),
    wireframe: true,
    transparent: true,
    opacity: isMobile ? 0.16 : 0.22
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set((Math.random() - 0.5) * 24, (Math.random() - 0.5) * 24, (Math.random() - 0.5) * 24);
  mesh.scale.setScalar(Math.random() * 0.7 + 0.2);
  group.add(mesh);
}

function animate() {
  requestAnimationFrame(animate);
  group.rotation.x += isMobile ? 0.0004 : 0.0008;
  group.rotation.y += isMobile ? 0.0007 : 0.0012;
  renderer.render(scene, camera);
}
if (!reduceMotion) animate(); else renderer.render(scene, camera);

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

if (!isMobile && !reduceMotion) {
  addEventListener('mousemove', (e) => {
    gsap.to(group.rotation, {
      x: (e.clientY / innerHeight - 0.5) * 0.45,
      y: (e.clientX / innerWidth - 0.5) * 0.65,
      duration: 1.2,
      ease: 'power3.out'
    });
  });
}

gsap.utils.toArray('.reveal').forEach((el, i) => {
  gsap.to(el, {
    opacity: 1,
    y: 0,
    duration: reduceMotion ? 0.2 : 0.9,
    delay: i * 0.06,
    ease: 'power3.out'
  });
});

if (!isMobile) {
  document.querySelectorAll('.tilt').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(card, {
        rotateY: px * 14,
        rotateX: -py * 14,
        transformPerspective: 900,
        transformOrigin: 'center',
        duration: 0.5,
        ease: 'power2.out'
      });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.6, ease: 'power3.out' });
    });
  });
}
