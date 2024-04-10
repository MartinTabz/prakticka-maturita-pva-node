$(document).ready(() => {
	$("#odhlasit").click(odhlasit);
	$("#odstranit-ucet").click(odstranitUcet);
});

function odhlasit() {
	fetch("/odhlasit", {
		headers: {
			Accept: "application/json",
		},
	})
		.then((odpoved) => odpoved.json())
		.then((reakce) => {
			if (reakce.uspech) {
				location.href = "/index";
			}
		});
}

function odstranitUcet() {
	let heslo = $("#passCheck").val();

	if (heslo) {
		fetch("/profil", {
			method: "DELETE",
			headers: {
				"Content-type": "application/json",
				Accept: "application/json",
			},
			body: JSON.stringify({
				heslo: heslo,
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
	} else {
		$("#delHlaseni").html("Chybí heslo pro potvrzení!");
	}
}
