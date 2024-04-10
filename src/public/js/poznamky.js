$(document).ready(() => {
	$("#vytvorit-poznamku").click(vytvoritPoznamku);
});

function vytvoritPoznamku() {
	let nadpis = $("#nadpis").val();
	let text = $("#text").val();
	let dulezite = $("#dulezite").is(":checked");

	if (nadpis.trim().length <= 0) {
		$("#hlaseni").html("Chybí název poznámky!");
	} else {
		fetch("/poznamky", {
			method: "POST",
			headers: {
				"Content-type": "application/json",
				Accept: "application/json",
			},
			body: JSON.stringify({
				nadpis: nadpis,
				text: text,
				dulezite: dulezite,
			}),
		})
			.then((odpoved) => odpoved.json())
			.then((reakce) => {
				if (!reakce.uspech) {
					$("#hlaseni").html(reakce.hlaseni);
				} else {
					location.reload();
				}
			});
	}
}