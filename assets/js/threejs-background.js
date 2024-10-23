// assets/js/threejs-background.js

// Stelle sicher, dass THREE verfügbar ist
if (typeof THREE === 'undefined') {
    console.error('Three.js ist nicht geladen.');
} else {
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
    const backgroundElement = document.getElementById('threejs-background');
    if (backgroundElement) {
        backgroundElement.appendChild(renderer.domElement);
    } else {
        console.error('Element mit ID "threejs-background" nicht gefunden.');
    }

    // Anpassung des Renderer bei Fensteränderung
    window.addEventListener('resize', () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });

    // Licht hinzufügen
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(50, 50, 50);
    scene.add(pointLight);

    // Partikel-Generator mit zufälligen Farben
    const particleCount = 2000;
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];

    const color = new THREE.Color();

    for (let i = 0; i < particleCount; i++) {
        // Position
        const x = (Math.random() - 0.5) * 1000;
        const y = (Math.random() - 0.5) * 1000;
        const z = (Math.random() - 0.5) * 1000;
        positions.push(x, y, z);

        // Farbe
        color.setHSL(Math.random(), 1.0, 0.5);
        colors.push(color.r, color.g, color.b);
    }

    particlesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 2,
        vertexColors: true,
        transparent: true,
        opacity: 0.7,
        depthWrite: false
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // Verbindungslinien zwischen nahegelegenen Partikeln
    const linesGeometry = new THREE.BufferGeometry();
    const linePositions = [];

    for (let i = 0; i < particleCount; i++) {
        const indexA = i;
        const particleA = new THREE.Vector3(
            particlesGeometry.attributes.position.getX(indexA),
            particlesGeometry.attributes.position.getY(indexA),
            particlesGeometry.attributes.position.getZ(indexA)
        );

        for (let j = i + 1; j < particleCount; j++) {
            const particleB = new THREE.Vector3(
                particlesGeometry.attributes.position.getX(j),
                particlesGeometry.attributes.position.getY(j),
                particlesGeometry.attributes.position.getZ(j)
            );

            const distance = particleA.distanceTo(particleB);
            if (distance < 100) { // Maximale Distanz für Verbindungen
                linePositions.push(
                    particleA.x, particleA.y, particleA.z,
                    particleB.x, particleB.y, particleB.z
                );
            }
        }
    }

    linesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    const linesMaterial = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.1
    });
    const lines = new THREE.LineSegments(linesGeometry, linesMaterial);
    scene.add(lines);

    // Kamera positionieren
    camera.position.z = 300;

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

        // Rotation der Partikel und Linien
        particles.rotation.y += 0.001;
        lines.rotation.y += 0.001;

        renderer.render(scene, camera);
    };

    // Starte die Animation
    animate();
}
