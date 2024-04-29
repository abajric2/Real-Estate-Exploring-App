window.addEventListener("load", function() {
        let poziviAjax = PoziviAjax
        poziviAjax.getNekretninaById(this.localStorage.idNekretnine, function(error, data) {
            if(data) {
                document.getElementById("naziv-nekretnine").innerHTML = `<span class="boldirano">Naziv:</span> ${data.naziv}`
                document.getElementById("kvadratura-nekretnine").innerHTML = `<span class="boldirano">Kvadratura:</span> ${data.kvadratura} m²`
                document.getElementById("cijena-nekretnine").innerHTML = `<span class="boldirano">Cijena:</span> ${data.cijena} KM`
                document.getElementById("tip-grijanja-nekretnine").innerHTML = `<span class="boldirano">Tip grijanja</span>: ${data.tip_grijanja}`
                document.getElementById("godina-izgradnje-nekretnine").innerHTML = `<span class="boldirano">Godina izgradnje</span>: ${data.godina_izgradnje}`
                document.getElementById("lokacija-nekretnine").innerHTML = `<span class="boldirano">Lokacija</span>: ${data.lokacija}`
                document.getElementById("datum-objave-nekretnine").innerHTML = `<span class="boldirano">Datum objave</span>: ${data.datum_objave}`
                document.getElementById("opis-nekretnine").innerHTML = `<span class="boldirano">Opis</span>: ${data.opis}`
                var html = '';
                data.upiti.forEach(function(upit) {
                    html += '<li>';
                    html += '<p class="boldirano">' + upit.username + '</p>';
                    html += '<p>' + upit.tekst_upita + '</p>';
                    html += '</li>';
                });
                document.getElementById('upiti-za-nekretninu').innerHTML = html;
            }
        })
});
