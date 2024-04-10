$(document).ready(() => {
	$("#prihlasit").click(prihlasit);
});

function prihlasit() {
	let jmeno = $("#jmeno").val();
	let heslo = $("#heslo").val();

	if (jmeno.trim().length == 0) {
		$("#hlaseni").html("Chybí jméno!");
	} else if (heslo.trim().length == 0) {
		$("#hlaseni").html("Chybí heslo!");
	} else {
		fetch("/prihlasit", {
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
					location.href = "/profil";
				}
			});
	}
}
