document.addEventListener('DOMContentLoaded', () => {
  const burgerToggle = document.querySelector('.burger-toggle');
  const navbar = document.querySelector('.navbar');

  if (burgerToggle && navbar) {
    burgerToggle.addEventListener('click', () => {
      // Attiva/Disattiva la classe per aprire il menu
      navbar.classList.toggle('active');
      // Attiva/Disattiva l'animazione della "X" sul pulsante
      burgerToggle.classList.toggle('active');
    });

    // Opzionale: Chiude il menu se si clicca su un link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navbar.classList.remove('active');
        burgerToggle.classList.remove('active');
      });
    });
  }
});