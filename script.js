document.addEventListener('DOMContentLoaded', (event) => {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');
    const header = document.querySelector('header');
    const posts = document.querySelectorAll('.post');

    // Mobile menu toggle
    mobileMenuBtn.addEventListener('click', function() {
        nav.classList.toggle('active');
    });

    // Scroll animation for header
    window.addEventListener('scroll', function() {
        header.style.background = window.scrollY > 50 ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)';
    });

    // Fancy hover effect for posts
    posts.forEach(post => {
        post.addEventListener('mousemove', (e) => {
            const { left, top } = post.getBoundingClientRect();
            const x = e.clientX - left;
            const y = e.clientY - top;
            
            post.style.setProperty('--x', `${ x }px`);
            post.style.setProperty('--y', `${ y }px`);
        });
    });
});
