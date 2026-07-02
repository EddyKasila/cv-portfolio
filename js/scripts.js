// Collapse responsive navbar when toggler is visible
window.addEventListener('DOMContentLoaded', () => {
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const navLinks = [].slice.call(document.querySelectorAll('#navbarSupportedContent .nav-link'));
    navLinks.forEach((link) => {
        link.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

    AOS.init({
        disable: false,
        startEvent: 'DOMContentLoaded',
        offset: 120,
        delay: 0,
        duration: 600,
        easing: 'ease-out',
        once: true,
        mirror: false,
        anchorPlacement: 'top-bottom',
    });
});