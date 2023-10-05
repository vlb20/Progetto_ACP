
var main = () => {

	"use strict";

	const logInButton = $('#logIn');
	const container = $('#container');

	$(".log-in-container form button").on("click", (event) => {

		event.preventDefault();

		var username = $("#login-username").val();
		var password = $("#login-password").val();

		var requestLogin = {
			username : username,
			password : password
		}

		console.log(requestLogin);

		$.ajax({
			method: "POST",
			url: "/login/log",
			dataType: "json",
			data : requestLogin
		})
		.then((res) => {
			if (res.outcome === "success") {
				window.alert("Log in avvenuto con successo");

				// Navigate to index
				window.location.href = "/personal.html";
			}
			else {
				window.alert("Credenziali non valide")
			}
		});

	});

};

$(document).ready(main);