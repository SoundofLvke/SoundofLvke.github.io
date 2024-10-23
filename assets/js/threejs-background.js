// assets/js/threejs-background.js

// Szene, Kamera und Renderer initialisieren
const scene = new THREE.Scene();

// Kamera konfigurieren
const camera = new THREE.PerspectiveCamera(
    75, // Sichtfeld
    window.innerWidth / window.innerHeight, // Seitenverhältnis
    0.1, // Nahbereich
    1000 // Fernbereich
);

// Renderer erstellen
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById('threejs-background').appendChild(renderer.domElement);

// Anpassung des Renderer bei Fensteränderung
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});

// Licht hinzufügen
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Weiches Umgebungslicht
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1, 500);
pointLight.position.set(50, 50, 50);
scene.add(pointLight);

// Funktion zum Erstellen eines Partikels
const particleGeometry = new THREE.BufferGeometry();
const particleCount = 800; // Reduziert für bessere Performance
const positions = [];
const colors = [];

const color = new THREE.Color();

for (let i = 0; i < particleCount; i++) {
    const x = (Math.random() - 0.5) * 800;
    const y = (Math.random() - 0.5) * 800;
    const z = (Math.random() - 0.5) * 800;
    positions.push(x, y, z);

    // Zufällige, lebendige Farben
    color.setHSL(Math.random(), 0.7, 0.5);
    colors.push(color.r, color.g, color.b);
}

particleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
particleGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

const particleMaterial = new THREE.PointsMaterial({
    size: 1.5,
    vertexColors: true,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending
});

const particles = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particles);

// Kamera positionieren
camera.position.z = 150;

// Mausbewegung für interaktive Kamera
let mouseX = 0, mouseY = 0;
const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

// Event Listener für Mausbewegung
document.addEventListener('mousemove', onDocumentMouseMove, false);

function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) / windowHalfX;
    mouseY = (event.clientY - windowHalfY) / windowHalfY;
}

// Animation loop
const animate = function () {
    requestAnimationFrame(animate);
    
    // Kamera sanft zur Mausposition bewegen
    camera.position.x += (mouseX * 50 - camera.position.x) * 0.05;
    camera.position.y += (-mouseY * 50 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);
    
    // Partikel rotieren leicht für dynamische Bewegung
    particles.rotation.y += 0.0005;
    
    renderer.render(scene, camera);
};

// Starte die Animation
animate();
