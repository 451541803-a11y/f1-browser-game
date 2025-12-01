// Function to create the 3D scene content
const createScene = function (canvas, engine) {
    const scene = new BABYLON.Scene(engine);

    // --- 1. Basic Lighting and Background ---
    scene.clearColor = new BABYLON.Color3(0.1, 0.1, 0.2); // Dark blue sky
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    // --- 2. Camera Setup (Arcade/Follow Camera) ---
    const camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 2, Math.PI / 2.5, 50, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, true);

    // --- 3. Ground/Track ---
    const ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 100, height: 100}, scene);
    const groundMat = new BABYLON.StandardMaterial("groundMat", scene);
    groundMat.diffuseColor = new BABYLON.Color3(0.1, 0.5, 0.1); // Green track area
    ground.material = groundMat;

    // --- 4. Physics Engine Activation ---
    const gravityVector = new BABYLON.Vector3(0, -9.81, 0);
    // Ensure Cannon.js is ready before calling new BABYLON.CannonJSPlugin()
    if (typeof Cannon === 'undefined') {
        console.error("Cannon.js physics library failed to load. Check index.html CDN link.");
        return scene; // Return scene without physics
    }
    const physicsEngine = new BABYLON.CannonJSPlugin(); 
    scene.enablePhysics(gravityVector, physicsEngine);

    // Make the ground static in the physics world (mass: 0)
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(
        ground, 
        BABYLON.PhysicsImpostor.BoxImpostor, 
        { mass: 0, restitution: 0.9 }, 
        scene
    );
    
    // --- 5. Simple Car Body (FIXED TYPO: BABON -> BABYLON) ---
    const carBody = BABYLON.MeshBuilder.CreateBox("carBody", {width: 2, height: 1, depth: 4}, scene);
    carBody.position.y = 1; 

    // Give the car a physics impostor (mass > 0)
    carBody.physicsImpostor = new BABYLON.PhysicsImpostor(
        carBody, 
        BABYLON.PhysicsImpostor.BoxImpostor, 
        { mass: 10, friction: 0.5, restitution: 0.2 },
        scene
    );


    return scene;
}

// --- Main Engine Initialization ---

window.addEventListener('DOMContentLoaded', function() {
    // Get the canvas element from the DOM
    const canvas = document.getElementById('renderCanvas');
    
    // Safety check: ensure canvas exists
    if (!canvas) {
        console.error("CRITICAL ERROR: Canvas element with ID 'renderCanvas' was not found in the HTML.");
        return; 
    }
    
    // Generate the BABYLON 3D engine
    const engine = new BABYLON.Engine(canvas, true);
    
    // Call the createScene function to set up the world
    const scene = createScene(canvas, engine);

    // Start the render loop to draw the scene repeatedly
    engine.runRenderLoop(function () {
        if (scene) {
            scene.render();
        }
    });

    // Handle window resize events
    window.addEventListener('resize', function () {
        engine.resize();
    });
});
