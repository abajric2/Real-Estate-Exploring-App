const MarketingAjax = (() => {
    let filtriraneNekretnineInfo = null;
    let nekretnineMapiranje = null;
    let jeFiltrirano = false;

    function impl_novoFiltriranje(listaFiltriranihNekretnina) {
        const idNekretninaArray = listaFiltriranihNekretnina.map(nekretnina => nekretnina.id);

        const ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4) {
                if (ajax.status == 200) {
                    filtriraneNekretnineInfo = { nizNekretnina: idNekretninaArray };
                    jeFiltrirano = true;
                } else {
                }
            }
        };

        ajax.open("POST", "http://localhost:3000/marketing/nekretnine", true);
        ajax.setRequestHeader("Content-Type", "application/json");

        const requestBody = { nizNekretnina: idNekretninaArray };
        ajax.send(JSON.stringify(requestBody));
    }

    function impl_osvjeziPretrage(divNekretnine) {
        function osvjeziPodatke() {
            const ajax = new XMLHttpRequest();

            ajax.onreadystatechange = function () {
                if (ajax.readyState == 4) {
                    if (ajax.status == 200) {
                        var jsonRez = JSON.parse(ajax.responseText);
                        if (jsonRez.nizNekretnina.length !== 0) {
                            nekretnineMapiranje = jsonRez.nizNekretnina;
                        }
                        nekretnineMapiranje.forEach(nekretnina => {
                            const divId = `pretrage-${nekretnina.id}`;
                            const pretrageDiv = divNekretnine.querySelector(`#${divId}`);
                            if (pretrageDiv) {
                                let brojPretragaNekretnine = nekretnina.pretrage
                                if(brojPretragaNekretnine !== undefined) pretrageDiv.textContent = `Broj pretraga: ${brojPretragaNekretnine}`;
                            }
                        });
                    } else {
                    }
                }
            };

            ajax.open("POST", "http://localhost:3000/marketing/osvjezi", true);
            if (jeFiltrirano) {
                ajax.setRequestHeader("Content-Type", "application/json");
                ajax.send(JSON.stringify(filtriraneNekretnineInfo));
            } else {
                ajax.send();
            }
            jeFiltrirano = false;
        }
        setInterval(osvjeziPodatke, 500);
    }

    function impl_osvjeziKlikove(divNekretnine) {
        function osvjeziPodatke() {
            const ajax = new XMLHttpRequest();

            ajax.onreadystatechange = function () {
                if (ajax.readyState == 4) {
                    if (ajax.status == 200) {
                        var jsonRez = JSON.parse(ajax.responseText);
                        if (jsonRez.nizNekretnina.length !== 0) {
                            nekretnineMapiranje = jsonRez.nizNekretnina;
                        }
                        nekretnineMapiranje.forEach(nekretnina => {
                            const divId = `klikovi-${nekretnina.id}`;
                            const pretrageDiv = divNekretnine.querySelector(`#${divId}`);
                            if (pretrageDiv) {
                                let brojKlikovaNekretnine = nekretnina.klikovi
                                if(brojKlikovaNekretnine !== undefined) pretrageDiv.textContent = `Broj klikova: ${brojKlikovaNekretnine}`;
                            }
                        });
                    } else {
                    }
                }
            };

            ajax.open("POST", "http://localhost:3000/marketing/osvjezi", true);
            if (jeFiltrirano) {
                ajax.setRequestHeader("Content-Type", "application/json");
                ajax.send(JSON.stringify(filtriraneNekretnineInfo));
            } else {
                ajax.send();
            }
            jeFiltrirano = false;
        }
        setInterval(osvjeziPodatke, 500);
    }

    function impl_klikNekretnina(idNekretnine) {
        const ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4) {
                if (ajax.status == 200) {
                    const idNekretninaArray = [idNekretnine]
                    filtriraneNekretnineInfo = { nizNekretnina: idNekretninaArray };
                    jeFiltrirano = true;
                } else {
                }
            }
        };

        ajax.open("POST", `http://localhost:3000/marketing/nekretnina/${idNekretnine}`, true);
        ajax.send();
    }

    return {
        novoFiltriranje: impl_novoFiltriranje,
        osvjeziPretrage: impl_osvjeziPretrage,
        osvjeziKlikove: impl_osvjeziKlikove,
        klikNekretnina: impl_klikNekretnina
    };
})();
