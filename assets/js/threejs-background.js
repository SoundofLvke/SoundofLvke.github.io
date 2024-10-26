
// Enhanced Three.js Background Animation - Improved Visibility

if (typeof THREE === 'undefined') {
    console.error('Three.js is not loaded.');
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
        console.error('Background element not found.');
    }

    // Responsive resizing
    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    });

    // Ambient light to softly illuminate the particles
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xFFA726, 1.2);  // Warm accent light with increased intensity
    pointLight.position.set(0, 50, 100);
    scene.add(pointLight);

    // Create particles with increased size for better visibility and enhanced glow effect
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

        // Warm color to match the website theme, enhanced brightness
        color.setHSL(0.1 + Math.sin(i * 0.05) * 0.2, 0.95, 0.8 + Math.cos(i * 0.07) * 0.2);
        colors.push(color.r, color.g, color.b);
    }

    particlesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    // Shader material for rendering smooth, visible round particles
    const particlesMaterial = new THREE.ShaderMaterial({
        vertexShader: `
            attribute float size;
            varying vec3 vColor;
            void main() {
                vColor = color;
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_PointSize = size * (1000.0 / -mvPosition.z);
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

    // Clock for smooth animation timing
    let clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        // Enhanced smooth wave-like particle movement
        const positions = particlesGeometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            positions[i + 1] = Math.sin(elapsedTime + positions[i] * 0.015) * 25 + Math.cos(elapsedTime + positions[i + 2] * 0.015) * 25;
        }
        particlesGeometry.attributes.position.needsUpdate = true;

        // Camera positioning to ensure visibility from the start
        camera.position.z = 300;
        camera.lookAt(scene.position);

        // Rendering the scene
        renderer.render(scene, camera);
    }

    animate();
}

// Adding more dynamic movement and color changes to particles
const colors = [];
for (let i = 0; i < particleCount; i++) {
    const color = new THREE.Color();
    color.setHSL(Math.random(), 0.7, 0.5 + Math.random() * 0.3);  // More vibrant colors to match the theme
    colors.push(color.r, color.g, color.b);
}
particlesGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

// Enhanced smooth wave-like particle movement with more dynamism
function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    const positions = particlesGeometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] = Math.sin(elapsedTime + positions[i] * 0.01) * 35 + Math.cos(elapsedTime + positions[i + 2] * 0.01) * 35;
    }
    particlesGeometry.attributes.position.needsUpdate = true;

    camera.position.z = 300;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
}

// Enhanced particle movement to create a more flowing effect
function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    const positions = particlesGeometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] = Math.sin(elapsedTime + positions[i] * 0.01) * 25 + Math.cos(elapsedTime + positions[i + 2] * 0.01) * 25;
    }
    particlesGeometry.attributes.position.needsUpdate = true;

    camera.position.z = 1100;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
}
