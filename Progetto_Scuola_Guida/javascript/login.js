var main = () => {

	"use strict"; // Abilita la modalità rigorosa per il codice JavaScript

	// Seleziono gli elementi del DOM utilizzati nel codice
	const logInButton = $('#logIn');
	const container = $('#container');

	// Listener per gestire il click del pulsante.
	$(".log-in-container form button").on("click", (event) => {

		event.preventDefault();

		// Recupero i dati inseriti dall'utente nel modulo di login.
		var username = $("#login-username").val();
		var password = $("#login-password").val();

		//Creo l'oggetto di richiesta contenente i dati di accesso dell'utente
		var requestLogin = {
			username : username,
			password : password
		}

		console.log(requestLogin); //per debug

		//Effettuo una richiesta Ajax per inviare i dati di accesso al server.
		$.ajax({
			method: "POST",
			url: "/login/log",
			dataType: "json",
			data : requestLogin
		})
		.then((res) => {
			if (res.outcome === "success") {
				//Se l'accesso ha successo, mostra un messaggio e reindirizza l'utente alla pagina personale.
				window.alert("Log in avvenuto con successo");

				window.location.href = "/personal.html";
			}
			else {
				// Se l'accesso non ha successo, mostra un messaggio di errore.
				window.alert("Credenziali non valide")
			}
		});

	});

};

// Assicuro che il codice venga eseguito solo quando il documento è pronto.
$(document).ready(main);