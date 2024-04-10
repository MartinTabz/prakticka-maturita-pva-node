$(document).ready(() => {
	$("#odhlasit").click(odhlasit);
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