document.addEventListener('DOMContentLoaded', () => {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const animatedSections = document.querySelectorAll('.animated-section');
    const newsletterForm = document.getElementById('newsletterForm');
    const threatCounter = document.getElementById('threatCounter');

    // Dark mode toggle
    function toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
        updateDarkModeIcon();
    }

    darkModeToggle.addEventListener('click', toggleDarkMode);

    // Check for saved dark mode preference
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }

    updateDarkModeIcon();

    function updateDarkModeIcon() {
        const icon = darkModeToggle.querySelector('.icon');
        icon.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
    }

    // Animated sections
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    animatedSections.forEach(section => {
        observer.observe(section);
    });

    // Newsletter subscription
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('emailInput').value;
        
        if (email && isValidEmail(email)) {
            alert(`Thank you for subscribing with: ${email}`);
            newsletterForm.reset();
        } else {
            alert('Please enter a valid email address.');
        }
    });

    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Simulated real-time cybersecurity threat counter
    let threatCount = 0;
    function updateThreatCounter() {
        threatCount += Math.floor(Math.random() * 5);
        threatCounter.textContent = `Threats Detected: ${threatCount.toLocaleString()}`;
    }

    setInterval(updateThreatCounter, 3000);
    updateThreatCounter(); // Initial update

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});
