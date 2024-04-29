const PoziviAjax = (() => {

    function impl_getKorisnik(fnCallback) {
        let ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4 && ajax.status == 200) {
                var jsonRez = JSON.parse(ajax.responseText);
                fnCallback(null, jsonRez);
            }
            else if (ajax.readyState == 4)
                fnCallback(ajax.statusText, null);
        }
        ajax.open("GET", "http://localhost:3000/korisnik", true);
        ajax.send();
    }

    function impl_putKorisnik(noviPodaci, fnCallback) {
        let ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4 && ajax.status == 200) {
                var jsonRez = JSON.parse(ajax.responseText);
                fnCallback(null, jsonRez);
            }
            else if (ajax.readyState == 4)
                fnCallback(ajax.statusText, null);
        }
        ajax.open("PUT", "http://localhost:3000/korisnik", true);
        ajax.setRequestHeader("Content-Type", "application/json");
        ajax.send(JSON.stringify(noviPodaci));
    }

    function impl_postUpit(nekretnina_id, tekst_upita, fnCallback) {
        let ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4 && ajax.status == 200) {
                var jsonRez = JSON.parse(ajax.responseText);
                fnCallback(null, jsonRez);
            }
            else if (ajax.readyState == 4)
                fnCallback(ajax.statusText, null);
        }
        ajax.open("POST", "http://localhost:3000/upit", true);
        ajax.setRequestHeader("Content-Type", "application/json");
        ajax.send(JSON.stringify({ nekretnina_id: nekretnina_id, tekst_upita: tekst_upita }));
    }

    function impl_getNekretnine(fnCallback) {
        let ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4 && ajax.status == 200) {
                var jsonRez = JSON.parse(ajax.responseText);
                fnCallback(null, jsonRez);
            }
            else if (ajax.readyState == 4)
                fnCallback(ajax.statusText, null);
        }
        ajax.open("GET", "http://localhost:3000/nekretnine", true);
        ajax.send();
    }

    function impl_postLogin(username, password, fnCallback) {
        let ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4 && ajax.status == 200) {
                var jsonRez = JSON.parse(ajax.responseText);
                window.location.href = 'http://localhost:3000/nekretnine.html';
                fnCallback(null, jsonRez);
            }
            else if (ajax.readyState == 4)
                fnCallback(ajax.statusText, null);
        }
        ajax.open("POST", "http://localhost:3000/login", true);
        ajax.setRequestHeader("Content-Type", "application/json");
        ajax.send(JSON.stringify({ username: username, password: password }));
    }

    function impl_postLogout(fnCallback) {
        let ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4 && ajax.status == 200) {
                var jsonRez = JSON.parse(ajax.responseText);
                window.top.location.assign('http://localhost:3000/prijava.html');
                fnCallback(null, jsonRez);
            }
            else if (ajax.readyState == 4)
                fnCallback(ajax.statusText, null);
        }
        ajax.open("POST", "http://localhost:3000/logout", true);
        ajax.send();
    }
    function impl_getNekretninaById(nekretnina_id, fnCallback) {
        let ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4 && ajax.status == 200) {
                var jsonRez = JSON.parse(ajax.responseText);
                fnCallback(null, jsonRez);
            }
            else if (ajax.readyState == 4)
                fnCallback(ajax.statusText, null);
        }
        ajax.open("GET", `http://localhost:3000/nekretnina/${nekretnina_id}`, true);
        ajax.send();
    }
    return {
        postLogin: impl_postLogin,
        postLogout: impl_postLogout,
        getKorisnik: impl_getKorisnik,
        putKorisnik: impl_putKorisnik,
        postUpit: impl_postUpit,
        getNekretnine: impl_getNekretnine,
        getNekretninaById: impl_getNekretninaById
    };
})();

