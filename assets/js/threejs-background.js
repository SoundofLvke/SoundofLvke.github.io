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
const ambientLight = new THREE.AmbientLight(0x404040, 2); // weiches Umgebungslicht
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0x1ABC9C, 1, 500);
pointLight.position.set(50, 50, 50);
scene.add(pointLight);

// Funktion zum Erstellen eines Partikels
const particleGeometry = new THREE.BufferGeometry();
const particleCount = 1000;
const positions = [];

for (let i = 0; i < particleCount; i++) {
    const x = (Math.random() - 0.5) * 1000;
    const y = (Math.random() - 0.5) * 1000;
    const z = (Math.random() - 0.5) * 1000;
    positions.push(x, y, z);
}

particleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

const particleMaterial = new THREE.PointsMaterial({
    color: 0x1ABC9C,
    size: 1,
    transparent: true,
    opacity: 0.7
});

const particles = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particles);

// Funktion zum Erstellen eines Meshes
const createMesh = (size, color, speed) => {
    const geometry = new THREE.IcosahedronGeometry(size, 0);
    const material = new THREE.MeshPhongMaterial({
        color: color,
        emissive: 0x000000,
        flatShading: true,
        shininess: 50,
        side: THREE.DoubleSide
    });
    const mesh = new THREE.Mesh(geometry, material);
    
    // Zufällige Positionierung innerhalb eines bestimmten Bereichs
    mesh.position.x = (Math.random() - 0.5) * 100;
    mesh.position.y = (Math.random() - 0.5) * 100;
    mesh.position.z = (Math.random() - 0.5) * 100;
    
    // Zufällige Skalierung
    const scale = Math.random() * 2 + 0.5;
    mesh.scale.set(scale, scale, scale);
    
    // Zufällige Rotation
    mesh.rotation.x = Math.random() * 2 * Math.PI;
    mesh.rotation.y = Math.random() * 2 * Math.PI;
    
    // Geschwindigkeit der Rotation
    mesh.userData = {
        rotationSpeedX: (Math.random() * 0.002) + 0.001,
        rotationSpeedY: (Math.random() * 0.002) + 0.001
    };
    
    scene.add(mesh);
    return mesh;
};

// Farben für die Meshes
const colors = [0x1ABC9C, 0xE67E22, 0x3498DB];

// Anzahl der Meshes (Reduziert für bessere Performance)
const numberOfMeshes = 50;
const meshes = [];

for (let i = 0; i < numberOfMeshes; i++) {
    const color = colors[Math.floor(Math.random() * colors.length)];
    meshes.push(createMesh(1, color, 0.001));
}

// Kamera positionieren
camera.position.z = 100;

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
    
    // Rotationsanimation für alle Meshes
    meshes.forEach(mesh => {
        mesh.rotation.x += mesh.userData.rotationSpeedX;
        mesh.rotation.y += mesh.userData.rotationSpeedY;
    });
    
    // Partikel bewegen
    particles.rotation.y += 0.001;
    
    renderer.render(scene, camera);
};

// Starte die Animation
animate();
