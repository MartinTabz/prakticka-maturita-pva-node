$(document).ready(() => {
	$("#vytvorit-poznamku").click(vytvoritPoznamku);
	$(".odstranit-poznamku").click(odstranitPoznamku);
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

function odstranitPoznamku() {
	let id = $(this).data("id");

	fetch("/poznamky", {
		method: "DELETE",
		headers: {
			"Content-type": "application/json",
			Accept: "application/json",
		},
		body: JSON.stringify({
			id: id,
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