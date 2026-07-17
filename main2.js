document.addEventListener("DOMContentLoaded", () => {
  const counters = document.querySelectorAll(".counter-number");
  
  const startCounter = (counter) => {
    const target = +counter.getAttribute("data-target");
    let count = 0;
    
    // Durata dell'animazione in millisecondi (es. 2000ms = 2 secondi)
    const duration = 2000; 
    const frameRate = 1000 / 60; // 60 FPS
    const totalFrames = Math.round(duration / frameRate);
    const increment = target / totalFrames;

    const updateScore = () => {
      count += increment;
      if (count < target) {
        // Formatta il numero con i punti per le migliaia
        counter.innerText = Math.ceil(count).toLocaleString('it-IT');
        setTimeout(updateScore, frameRate);
      } else {
        counter.innerText = target.toLocaleString('it-IT');
      }
    };

    updateScore();
  };

  // Avvia l'animazione solo quando l'elemento è visibile sullo schermo
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startCounter(entry.target);
        observer.unobserve(entry.target); // Ferma l'osservazione dopo l'avvio
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
});