
// Minimalist, Clean Three.js Background for a Relaxed Ambience

if (typeof THREE === 'undefined') {
    console.error('Three.js is not loaded.');
} else {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    const backgroundElement = document.getElementById('threejs-background');
    if (backgroundElement) {
        backgroundElement.appendChild(renderer.domElement);
    } else {
        console.error('Background element not found.');
    }

    // Responsive resizing
    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    });

    // Soft ambient light
    const light = new THREE.AmbientLight(0x999999, 0.4);
    scene.add(light);

    // Particle system with subtle movement
    const particleCount = 400;
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];
    const color = new THREE.Color();

    for (let i = 0; i < particleCount; i++) {
        positions.push((Math.random() - 0.5) * 600, (Math.random() - 0.5) * 600, (Math.random() - 0.5) * 600);
        color.setHSL(0.6, 0.3 + Math.random() * 0.2, 0.7);  // Softer blues
        colors.push(color.r, color.g, color.b);
    }

    particlesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 3,
        vertexColors: true,
        opacity: 0.6,
        transparent: true,
        depthWrite: false
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // Camera and slow animation for a relaxing vibe
    camera.position.z = 500;
    let mouseX = 0, mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX - window.innerWidth / 2) * 0.001;
        mouseY = -(e.clientY - window.innerHeight / 2) * 0.001;
    });

    function animate() {
        requestAnimationFrame(animate);
        camera.position.x += (mouseX * 10 - camera.position.x) * 0.02;
        camera.position.y += (mouseY * 10 - camera.position.y) * 0.02;
        particles.rotation.y += 0.0005;
        renderer.render(scene, camera);
    }

    animate();
}
