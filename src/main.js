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

// TYPEWRITER EFFECT
document.addEventListener('DOMContentLoaded', async () => {
    // detect if we're on mobile (Tailwind md:hidden -> <768px)
    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    const nodes = Array.from(document.querySelectorAll('.typewriter'))
        .filter(el => el.offsetParent !== null);

    for (let i = 0; i < nodes.length; i++) {
        await startTypewriter(nodes[i], {
            mistakes: isMobile ? 1 : 2, // 1 for mobile, 2 for larger
            minDelay: 30,
            maxDelay: 110,
            startDelay: i === 0 ? 350 : 600
        });
    }
});

/**
 * Type the full text inside el.dataset.text with a given number of intentional mistakes.
 */
async function startTypewriter(el, opts = {}) {
    const text = el.dataset.text || '';
    const mistakes = opts.mistakes ?? 2;
    const minDelay = opts.minDelay ?? 40;
    const maxDelay = opts.maxDelay ?? 120;
    const startDelay = opts.startDelay ?? 300;

    await wait(startDelay);

    const mistakeIndexes = chooseMistakeIndexes(text, mistakes);
    el.textContent = '';

    for (let i = 0; i < text.length; i++) {
        const ch = text[i];

        if (mistakeIndexes.includes(i)) {
            // type a wrong character, pause, backspace, then continue with the correct char
            const wrong = randomCharDifferent(ch);
            await typeChar(el, wrong, minDelay, maxDelay);
            await wait(220);
            await backspace(el, 1, minDelay, maxDelay);
            await wait(100);
        }

        await typeChar(el, ch, minDelay, maxDelay);
    }
    // done: keep caret blinking (CSS handles it)
}
/* pick mistake indexes among letter/digit characters, roughly evenly spaced */
function chooseMistakeIndexes(text, count) {
    const letterIndices = [];
    for (let i = 0; i < text.length; i++) {
        if (/[A-Za-z0-9]/.test(text[i])) letterIndices.push(i);
    }
    if (letterIndices.length === 0) return [];

    const indexes = new Set();
    for (let k = 1; k <= count; k++) {
        let pos = Math.floor((letterIndices.length * k) / (count + 1));
        pos = Math.max(0, Math.min(letterIndices.length - 1, pos));
        let chosen = letterIndices[pos];
        // avoid duplicates - nudge forward if already present
        let attempts = 0;
        while (indexes.has(chosen) && attempts < 10) {
            attempts++;
            const nextPos = Math.min(letterIndices.length - 1, pos + attempts);
            chosen = letterIndices[nextPos];
        }
        indexes.add(chosen);
    }
    return Array.from(indexes);
}

/* helpers for typing/backspacing with random delays */
function typeChar(el, ch, minDelay, maxDelay) {
    return new Promise(resolve => {
        el.textContent += ch;
        setTimeout(resolve, randomInt(minDelay, maxDelay));
    });
}

function backspace(el, count, minDelay, maxDelay) {
    return new Promise(resolve => {
        let i = 0;
        const step = () => {
            el.textContent = el.textContent.slice(0, -1);
            i++;
            if (i < count) setTimeout(step, randomInt(minDelay, maxDelay));
            else resolve();
        };
        step();
    });
}
function randomCharDifferent(correct) {
    const pool = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let c = correct;
    while (c === correct || c === ' ') {
        c = pool[Math.floor(Math.random() * pool.length)];
    }
    return c;
}
function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function wait(ms) { return new Promise(r => setTimeout(r, ms)); }