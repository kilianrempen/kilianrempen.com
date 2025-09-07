import 'flowbite'
import './index.css'
import {contactForm} from "../contact-form.js";

contactForm()

document.addEventListener('DOMContentLoaded', () => {
    createSnowfall();
});

document.addEventListener('DOMContentLoaded', function() {
    var currentYear = new Date().getFullYear();
    document.getElementById('currentYear').textContent = currentYear;
});


// Create snowfall animation with 100 snowflakes

function createSnowfall() {
    const snowfallContainer = document.getElementById('snowfall');
    const numFlakes = window.innerWidth < 768 ? 35 : 100;
    const snowflakeSymbols = ['❄', '❅', '❆', '•', '∙'];

    for (let i = 0; i < numFlakes; i++) {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';

        // Random snowflake symbol
        const symbolIndex = Math.floor(Math.random() * snowflakeSymbols.length);
        snowflake.textContent = snowflakeSymbols[symbolIndex];

        // Random size (8px to 20px)
        const size = Math.random() * 12 + 8;
        snowflake.style.fontSize = `${size}px`;

        // Random horizontal position
        snowflake.style.left = `${Math.random() * 100}vw`;

        // Random drift amount
        const drift = (Math.random() * 200) - 100;
        snowflake.style.setProperty('--drift', `${drift}px`);

        // Random fall duration (8s to 20s)
        const duration = Math.random() * 12 + 8;
        snowflake.style.animationDuration = `${duration}s`;

        // Random delay so they don't all start at once
        const delay = Math.random() * 20;
        snowflake.style.animationDelay = `${delay}s`;

        // Set target opacity as CSS variable for animation
        const opacity = Math.random() * 0.6 + 0.2;
        snowflake.style.setProperty('--target-opacity', opacity);

        // Apply the snowfall animation
        snowflake.style.animation = `snowfall ${duration}s linear ${delay}s infinite`;

        snowfallContainer.appendChild(snowflake);
    }
}