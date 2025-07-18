import 'flowbite'
import './index.css'
import {contactForm} from "../contact-form.js";

contactForm()

document.addEventListener('DOMContentLoaded', () => {
});

document.addEventListener('DOMContentLoaded', function() {
    var currentYear = new Date().getFullYear();
    document.getElementById('currentYear').textContent = currentYear;
});
