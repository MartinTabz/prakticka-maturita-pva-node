$(document).ready(() => {
	$("#registrovat").click(registrovat);
});

function registrovat() {
	let jmeno = $("#jmeno").val();
	let heslo = $("#heslo").val();
	let heslo_kontrola = $("#heslo_kontrola").val();

	if (jmeno.trim().length == 0) {
		$("#hlaseni").html("Chybí jméno!");
	} else if (heslo.trim().length == 0) {
		$("#hlaseni").html("Chybí heslo!");
	} else if (heslo != heslo_kontrola) {
		$("#hlaseni").html("Hesla se neshodují!");
	} else {
		fetch("/registrovat", {
			method: "POST",
			headers: {
				"Content-type": "application/json",
				Accept: "application/json",
			},
			body: JSON.stringify({
				jmeno: jmeno,
				heslo: heslo,
			}),
		})
			.then((odpoved) => odpoved.json())
			.then((reakce) => {
				if (!reakce.uspech) {
					$("#hlaseni").html(reakce.hlaseni);
				} else {
					location.href = "/prihlaseni";
				}
			});
	}
}
