document.addEventListener("DOMContentLoaded", () => {
  const charts = document.querySelectorAll(".pie-chart");

  const animateChart = (chart) => {
    const targetPercent = parseInt(chart.getAttribute("data-value"), 10);
    let currentPercent = 0;
    const duration = 1200; // Durata animazione in millisecondi
    const frameRate = 1000 / 60; // 60 FPS
    const step = targetPercent / (duration / frameRate);

    const update = () => {
      currentPercent += step;
      if (currentPercent < targetPercent) {
        chart.style.setProperty("--percent", currentPercent);
        requestAnimationFrame(update);
      } else {
        chart.style.setProperty("--percent", targetPercent);
      }
    };

    update();
  };

  // Attiva l'animazione solo quando i grafici entrano nella viewport
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateChart(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  charts.forEach(chart => {
    // Inizializza a zero prima dell'animazione
    chart.style.setProperty("--percent", "0");
    observer.observe(chart);
  });
});