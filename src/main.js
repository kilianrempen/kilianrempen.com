import './index.css'
import 'flowbite'


document.addEventListener('DOMContentLoaded', function() {
    var currentYear = new Date().getFullYear();
    document.getElementById('currentYear').textContent = currentYear;
});