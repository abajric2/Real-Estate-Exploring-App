function spojiNekretnine(divReferenca, instancaModula, tip_nekretnine) {
    const filtriraneNekretnine = instancaModula.filtrirajNekretnine({ tip_nekretnine: tip_nekretnine });
    if (filtriraneNekretnine.length != 0) {
        const html = `
        <p class="naziv-nekretnine">${tip_nekretnine}</p>
        <div id="lista-nekretnina" class="grid-container">
        ${filtriraneNekretnine.map(nekretnina => {
            return ` 
            <div class="grid-item" id="${nekretnina.id}">
                <img src="../img/kuca1.jpg" alt="Nekretnina 1">
                <div class="property-info">
                    <div>
                        <p>${nekretnina.naziv}</p>
                        <p class="size">${nekretnina.kvadratura} m²</p>
                    </div>
                    <p class="price">${nekretnina.cijena} KM</p>
                </div>
                <button id="detalji-${nekretnina.id}" onclick="povecaj(${nekretnina.id}, '${nekretnina.lokacija}', '${nekretnina.godina_izgradnje}')">Detalji</button>
                
                <div id="pretrage-${nekretnina.id}"></div>
                <div id="klikovi-${nekretnina.id}"></div>
                <p id="lokacija-${nekretnina.id}"></p>
                <p id="godina-izgradnje-${nekretnina.id}"></p>
                <div id="dugme-detalji-${nekretnina.id}"></div>

            </div>
            `
        }).join("")}
        </div>
    `
        if (divReferenca) {
            divReferenca.innerHTML = html;
        }
    } else {
        const html = `
        <p class="naziv-nekretnine">${tip_nekretnine}</p>
        `
        if (divReferenca) divReferenca.innerHTML = html;
    }
}

function povecaj(id, lokacija, godina_izgradnje) {
    let m = MarketingAjax;
    const gridItems = document.querySelectorAll(".grid-item");
    const divNekretnina = document.getElementById(`${id}`);
    const originalnaSirina = divNekretnina.style.width;
    for (const nekretnina of gridItems) {
        if (nekretnina === divNekretnina) {
            nekretnina.style.width = "500px";
            nekretnina.style.gridColumn = 'span 2';
            document.getElementById(`lokacija-${id}`).textContent = `Lokacija: ${lokacija}`
            document.getElementById(`godina-izgradnje-${id}`).textContent = `Godina izgradnje: ${godina_izgradnje}`
            document.getElementById(`dugme-detalji-${id}`).innerHTML = `<button id="otvori-detalje-${id}" onclick="otvoriDetalje(${id})">Otvori detalje</button>`
        } else if (originalnaSirina !== "500px") {
            nekretnina.style.width = originalnaSirina;
            nekretnina.style.gridColumn = 'auto';
            document.getElementById(`lokacija-${nekretnina.id}`).textContent = ""
            document.getElementById(`godina-izgradnje-${nekretnina.id}`).textContent = ""
            document.getElementById(`dugme-detalji-${nekretnina.id}`).innerHTML = ""
        }
    }
    m.klikNekretnina(id);
}
function otvoriDetalje(id) {
    localStorage.idNekretnine = id;
    window.location.href="/detalji.html"
}
const divStan = document.getElementById("stan");
const divKuca = document.getElementById("kuca");
const divPp = document.getElementById("pp");

let nekretnine = SpisakNekretnina();
let poziviAjax = PoziviAjax
let marketingAjax = MarketingAjax
let listaNekretnina

poziviAjax.getNekretnine(function (error, data) {
    if (error) {
    }
    else {
        listaNekretnina = data;
        nekretnine.init(listaNekretnina, []);
        spojiNekretnine(divStan, nekretnine, "Stan");
        spojiNekretnine(divKuca, nekretnine, "Kuća");
        spojiNekretnine(divPp, nekretnine, "Poslovni prostor");

        marketingAjax.novoFiltriranje(listaNekretnina)

        const divNekretnina = document.getElementById("sve-nekretnine");
        marketingAjax.osvjeziKlikove(divNekretnina);
        marketingAjax.osvjeziPretrage(divNekretnina);
    }
});

document.getElementById("filtriranje").addEventListener("click", function () {
    const minCijena = document.getElementById("min_cijena").value;
    const maxCijena = document.getElementById("max_cijena").value;
    const minKvadratura = document.getElementById("min_kvadratura").value;
    const maxKvadratura = document.getElementById("max_kvadratura").value;

    const kriterij = {};

    if (minCijena) kriterij['min_cijena'] = parseFloat(minCijena);
    if (maxCijena) kriterij['max_cijena'] = parseFloat(maxCijena);
    if (minKvadratura) kriterij['min_kvadratura'] = parseFloat(minKvadratura);
    if (maxKvadratura) kriterij['max_kvadratura'] = parseFloat(maxKvadratura);

    nekretnine.init(listaNekretnina, [])
    const filtriraneNekretnine = nekretnine.filtrirajNekretnine(kriterij)
    marketingAjax.novoFiltriranje(filtriraneNekretnine)
    nekretnine.init(filtriraneNekretnine, [])

    spojiNekretnine(divStan, nekretnine, "Stan");
    spojiNekretnine(divKuca, nekretnine, "Kuća");
    spojiNekretnine(divPp, nekretnine, "Poslovni prostor");
});



