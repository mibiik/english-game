// This service now directly exports the puter instance.
// Other services can import this and use it directly.

if (!window.puter) {
    console.error("Puter.js is not loaded. Make sure the script is in your index.html");
}

export const puter = window.puter; 