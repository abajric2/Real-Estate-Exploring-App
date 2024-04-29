let SpisakNekretnina = function () {
    //privatni atributi modula
    let listaNekretnina = [];
    let listaKorisnika = [];

    //implementacija metoda
    let init = function (listaNekretninaParam, listaKorisnikaParam) {
        listaNekretnina = listaNekretninaParam || [];
        listaKorisnika = listaKorisnikaParam || [];
    }

    let filtrirajNekretnine = function (kriterij) {
        return listaNekretnina.filter(nekretnina => {
            return Object.entries(kriterij).every(([kriterijKey, kriterijValue]) => {
                switch (kriterijKey) {
                    case 'tip_nekretnine':
                        return nekretnina.tip_nekretnine === kriterijValue;
                    case 'min_kvadratura':
                        return nekretnina.kvadratura >= kriterijValue;
                    case 'max_kvadratura':
                        return nekretnina.kvadratura <= kriterijValue;
                    case 'min_cijena':
                        return nekretnina.cijena >= kriterijValue;
                    case 'max_cijena':
                        return nekretnina.cijena <= kriterijValue;
                    default:
                        return true; 
                }
            });
        });
    }

    let ucitajDetaljeNekretnine = function (id) {
        const nekretnina = listaNekretnina.find(n => n.id === id);
        return nekretnina || null;
    }


    return {
        init: init,
        filtrirajNekretnine: filtrirajNekretnine,
        ucitajDetaljeNekretnine: ucitajDetaljeNekretnine
    }
};



