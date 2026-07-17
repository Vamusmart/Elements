document.addEventListener("DOMContentLoaded", () => {
  const amountButtons = document.querySelectorAll(".amount-btn");
  const customInputContainer = document.getElementById("custom-input-container");
  const customAmountInput = document.getElementById("custom-amount-input");
  const totalDisplay = document.getElementById("total-display");
  
  const termsLink = document.getElementById("terms-link");
  const termsDropdown = document.getElementById("terms-dropdown");

  const standardSubmitBtn = document.getElementById("standard-submit-btn");
  const paypalModalWrapper = document.getElementById("paypal-modal-wrapper");
  const paypalContainer = document.getElementById("paypal-button-container");
  const paymentMethods = document.querySelectorAll('input[name="payment_method"]');
  const agreeTermsCheckbox = document.getElementById("agree_terms");
  const donationForm = document.getElementById("clean-donation-form");

  let currentAmount = 1.00;

  // 1. Selezione rapida importo
  amountButtons.forEach(button => {
    button.addEventListener("click", () => {
      amountButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");

      const val = button.getAttribute("data-value");

      if (val === "custom") {
        customInputContainer.style.display = "flex";
        currentAmount = parseFloat(customAmountInput.value) || 0;
      } else {
        customInputContainer.style.display = "none";
        currentAmount = parseFloat(val);
      }
      updateTotalDisplay();
      
      // Se l'importo cambia, nascondiamo momentaneamente i pulsanti PayPal per ricalcolare il totale al prossimo click
      if (paypalModalWrapper.style.display === "block") {
        paypalModalWrapper.style.display = "none"; 
      }
    });
  });

  customAmountInput.addEventListener("input", (e) => {
    currentAmount = parseFloat(e.target.value) || 0;
    updateTotalDisplay();
    if (paypalModalWrapper.style.display === "block") {
      paypalModalWrapper.style.display = "none";
    }
  });

  function updateTotalDisplay() {
    totalDisplay.innerText = currentAmount.toLocaleString("it-IT", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }) + "€";
  }

  // Se l'utente cambia metodo di pagamento prima di cliccare "Dona Ora", resettiamo il box PayPal
  paymentMethods.forEach(radio => {
    radio.addEventListener("change", () => {
      paypalModalWrapper.style.display = "none";
    });
  });

  // 2. Gestione del Click sul pulsante UNICO "Dona Ora"
  standardSubmitBtn.addEventListener("click", (e) => {
    // Blocchiamo l'invio nativo del form per evitare l'errore 405
    e.preventDefault();

    // Validazione dei campi obbligatori del form
    if (!donationForm.checkValidity()) {
      donationForm.reportValidity(); // Mostra i messaggi di errore nativi del browser
      return;
    }

    // Validazione della spunta sui termini
    if (!agreeTermsCheckbox.checked) {
      alert("Per procedere è necessario accettare i Termini e le Condizioni.");
      return;
    }

    // QUALSIASI sia la scelta (PayPal o Carta), ora mostriamo il widget di PayPal.
    // L'SDK mostrerà automaticamente il bottone Giallo (PayPal) e quello Nero (Carta di Credito)
    paypalModalWrapper.style.display = "block";
    
    // Scorri leggermente la pagina per mostrare i pulsanti di PayPal apparsi sotto
    paypalModalWrapper.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  // 3. Integrazione SDK PayPal
  if (typeof paypal !== "undefined") {
    paypal.Buttons({
      // Stile del pulsante PayPal per farlo integrare bene con il tuo design
      style: {
        layout: 'vertical',
        color:  'gold',
        shape:  'rect',
        label:  'paypal'
      },
      createOrder: function(data, actions) {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: currentAmount.toFixed(2),
              currency_code: "EUR"
            },
            description: "Donazione per la salvaguardia delle api"
          }]
        });
      },
      onApprove: function(data, actions) {
        return actions.order.capture().then(function(details) {
          alert("Grazie mille per la tua donazione, " + details.payer.name.given_name + "!");
          // Reindirizza l'utente alla pagina di ringraziamento sul tuo sito:
          window.location.href = "index4.html"; 
        });
      },
      onError: function(err) {
        console.error("Errore nel pagamento PayPal: ", err);
        alert("Si è verificato un problema con il pagamento. Controlla i dati o riprova.");
      }
    }).render('#paypal-button-container');
  }

  // Mostra / Nascondi i Termini
  termsLink.addEventListener("click", (e) => {
    e.preventDefault();
    termsDropdown.style.display = termsDropdown.style.display === "none" ? "block" : "none";
  });
});