import 'flowbite'
import './index.css'
import {contactForm} from "../contact-form.js";

contactForm()

// Typewriter effect with error correction
class TypewriterEffect {
    constructor(elementId, cursorId) {
        this.element = document.getElementById(elementId);
        this.cursor = document.getElementById(cursorId);
        this.texts = [
            "Full-Stack Web Developer",
            " • ",
            "Marketing & Brand Expert"
        ];
        this.currentText = "";
        this.isDeleting = false;
        this.textIndex = 0;
        this.charIndex = 0;
    }

    async typeWithMistakes(text, mistakes) {
        for (let i = 0; i <= text.length; i++) {
            // Check if we should make a mistake at this position
            const mistake = mistakes.find(m => m.position === i);
            
            if (mistake) {
                // Type the wrong character
                this.currentText += mistake.wrong;
                this.element.textContent = this.currentText;
                await this.sleep(150 + Math.random() * 100);
                
                // Backspace the wrong character
                this.currentText = this.currentText.slice(0, -1);
                this.element.textContent = this.currentText;
                await this.sleep(200 + Math.random() * 150);
                
                // Type the correct character
                this.currentText += mistake.correct;
                this.element.textContent = this.currentText;
                await this.sleep(100 + Math.random() * 100);
            } else {
                // Type normally
                this.currentText += text[i];
                this.element.textContent = this.currentText;
                await this.sleep(80 + Math.random() * 120);
            }
        }
    }

    async start() {
        // First part: "Full-Stack Web Developer"
        const mistakes1 = [
            { position: 5, wrong: 't', correct: 'k' }, // "Full-Stat" -> "Full-Stack"
            { position: 15, wrong: 'd', correct: 'D' } // "developer" -> "Developer"
        ];
        
        await this.typeWithMistakes(this.texts[0], mistakes1);
        await this.sleep(500);

        // Second part: " • "
        await this.typeWithMistakes(this.texts[1], []);
        await this.sleep(300);

        // Third part: "Marketing & Brand Expert"
        const mistakes2 = [
            { position: 3, wrong: 'k', correct: 'k' }, // "Markting" -> "Marketing"
            { position: 19, wrong: 'x', correct: 'E' } // "expert" -> "Expert"
        ];
        
        await this.typeWithMistakes(this.texts[2], mistakes2);
        
        // Keep cursor blinking after completion
        setInterval(() => {
            this.cursor.style.opacity = this.cursor.style.opacity === '0' ? '1' : '0';
        }, 500);
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Start typewriter effect
    setTimeout(() => {
        const typewriter = new TypewriterEffect('typewriter-text', 'typewriter-cursor');
        typewriter.start();
    }, 1000); // Start after 1 second delay
});

document.addEventListener('DOMContentLoaded', function() {
    var currentYear = new Date().getFullYear();
    document.getElementById('currentYear').textContent = currentYear;
});
