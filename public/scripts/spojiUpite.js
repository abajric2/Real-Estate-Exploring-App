window.addEventListener("load", function () {
    let poziviAjax = PoziviAjax
    poziviAjax.getKorisnik(function (error, data) {
        if (data) {
            localStorage.usernameKorisnika = data.username
            document.getElementById("dodaj-upit").innerHTML = `<input type="text" id="unos-upita" placeholder="Unesite upit"><button onclick="posaljiUpit()" id="dugme-upita">Pošalji</button>`
        } else {
            document.getElementById("dodaj-upit").innerHTML = ""
        }
    })
});

function posaljiUpit() {
    let poziviAjax = PoziviAjax
    var tekstUpita = document.getElementById("unos-upita").value;
    poziviAjax.postUpit(parseInt(localStorage.idNekretnine), tekstUpita, function (error, data) {
        if (data) {
            var noviHtml = '<li>';
            noviHtml += '<p class="boldirano">' + localStorage.usernameKorisnika + '</p>';
            noviHtml += '<p>' + tekstUpita + '</p>';
            noviHtml += '</li>';

            document.getElementById('upiti-za-nekretninu').innerHTML += noviHtml;
            document.getElementById('unos-upita').value = ''
        }
    })
}