import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add global font styles for the app
document.head.innerHTML += `
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Source+Serif+Pro:wght@400;600&family=Fira+Code:wght@400;500&display=swap" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/remixicon@3.0.0/fonts/remixicon.css" rel="stylesheet">
`;

// Add title
const titleEl = document.createElement('title');
titleEl.textContent = 'Research Paper AI Agent';
document.head.appendChild(titleEl);

createRoot(document.getElementById("root")!).render(<App />);
