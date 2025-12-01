// Function to create the 3D scene content
const createScene = function (canvas, engine) {
    const scene = new BABYLON.Scene(engine);

    // --- 1. Basic Lighting and Background ---
    scene.clearColor = new BABYLON.Color3(0.1, 0.1, 0.2); // Dark blue sky
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    // --- 2. Camera Setup (Arcade/Follow Camera) ---
    // ArcRotateCamera is good for testing/viewing, but we'll switch to a FollowCamera later
    const camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 2, Math.PI / 2.5, 50, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, true);

    // --- 3. Ground/Track ---
    const ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 100, height: 100}, scene);
    const groundMat = new BABYLON.StandardMaterial("groundMat", scene);
    groundMat.diffuseColor = new BABYLON.Color3(0.1, 0.5, 0.1); // Green track area
    ground.material = groundMat;

    // --- 4. Physics Engine Activation ---
    // We need physics for the car movement and collision
    const gravityVector = new BABYLON.Vector3(0, -9.81, 0);
    const physicsEngine = new BABYLON.CannonJSPlugin(); // Uses Cannon.js for physics
    scene.enablePhysics(gravityVector, physicsEngine);

    // Make the ground static in the physics world (mass: 0)
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(
        ground, 
        BABYLON.PhysicsImpostor.BoxImpostor, 
        { mass: 0, restitution: 0.9 }, // High restitution makes it bouncy, 0.9 is a starting point
        scene
    );
    
    // --- 5. Simple Car Body (will be replaced by actual car logic) ---
    const carBody = BABON.MeshBuilder.CreateBox("carBody", {width: 2, height: 1, depth: 4}, scene);
    carBody.position.y = 1; // Lift it above the ground

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
    
    // Generate the BABYLON 3D engine
    const engine = new BABYLON.Engine(canvas, true);
    
    // Call the createScene function to set up the world
    const scene = createScene(canvas, engine);

    // Start the render loop to draw the scene repeatedly
    engine.runRenderLoop(function () {
        scene.render();
    });

    // Handle window resize events
    window.addEventListener('resize', function () {
        engine.resize();
    });
});
