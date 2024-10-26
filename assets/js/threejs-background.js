/* assets/js/threejs-background.js */

// Überprüfe, ob Three.js geladen ist
if (typeof THREE === 'undefined') {
    console.error('Three.js ist nicht geladen.');
} else {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    const backgroundElement = document.getElementById('threejs-background');
    if (backgroundElement) {
        backgroundElement.appendChild(renderer.domElement);
    } else {
        console.error('Background-Element nicht gefunden.');
    }

    // Responsive resizing
    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    });

    // Ambient Light für weiche Beleuchtung der Partikel
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xFFA726, 1.2);  // Warmes Akzentlicht mit erhöhter Intensität
    pointLight.position.set(0, 50, 100);
    scene.add(pointLight);

    // Erstelle Partikel mit erhöhter Größe für bessere Sichtbarkeit und verstärkten Glüheffekt
    const particleCount = 5000;
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];
    const color = new THREE.Color();

    for (let i = 0; i < particleCount; i++) {
        const x = (Math.random() - 0.5) * 1200;
        const y = (Math.random() - 0.5) * 500;
        const z = (Math.random() - 0.5) * 1200;
        positions.push(x, y, z);

        // Warme Farben passend zum Website-Thema, erhöhte Helligkeit
        color.setHSL(0.1 + Math.sin(i * 0.05) * 0.2, 0.95, 0.8 + Math.cos(i * 0.07) * 0.2);
        colors.push(color.r, color.g, color.b);
    }

    particlesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    // Shader Material für glatte, sichtbare runde Partikel
    const particlesMaterial = new THREE.ShaderMaterial({
        vertexShader: `
            varying vec3 vColor;
            void main() {
                vColor = color;
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_PointSize = 2.0 * (300.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            varying vec3 vColor;
            void main() {
                float dist = length(gl_PointCoord - vec2(0.5));
                if (dist > 0.5) discard;
                gl_FragColor = vec4(vColor, 0.95 * (1.0 - dist));
            }
        `,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: true,
        vertexColors: true
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // Clock für sanfte Animation
    let clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        // Sanfte wellenartige Bewegung der Partikel
        const positions = particlesGeometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            positions[i + 1] = Math.sin(elapsedTime + positions[i] * 0.01) * 25 + Math.cos(elapsedTime + positions[i + 2] * 0.01) * 25;
        }
        particlesGeometry.attributes.position.needsUpdate = true;

        // Kamera Positionierung zur Sicherstellung der Sichtbarkeit
        camera.position.z = 300;
        camera.lookAt(scene.position);

        // Rendern der Szene
        renderer.render(scene, camera);
    }

    animate();
}
