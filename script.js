document.addEventListener('DOMContentLoaded', () => {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const animatedSections = document.querySelectorAll('.animated-section');
    const newsletterForm = document.getElementById('newsletterForm');

    // Dark mode toggle
    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });

    // Animated sections
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
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
        
        if (email) {
            alert(`Thank you for subscribing with: ${email}`);
            newsletterForm.reset();
        }
    });

    // Simulated real-time cybersecurity threat counter
    const threatCounter = document.createElement('div');
    threatCounter.id = 'threatCounter';
    threatCounter.style.position = 'fixed';
    threatCounter.style.bottom = '20px';
    threatCounter.style.right = '20px';
    threatCounter.style.background = 'rgba(74, 144, 226, 0.9)';
    threatCounter.style.color = 'white';
    threatCounter.style.padding = '10px';
    threatCounter.style.borderRadius = '5px';
    document.body.appendChild(threatCounter);

    let threatCount = 0;
    setInterval(() => {
        threatCount += Math.floor(Math.random() * 5);
        threatCounter.textContent = `Threats Detected: ${threatCount}`;
    }, 3000);
});
