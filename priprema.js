const db = require('./db.js')
db.sequelize.sync({ force: true }).then(function () {
    inicializacija().then(function () {
        console.log("Baza pripremljena");
        process.exit();
    });
});
function inicializacija() {
    var korisniciPromises = [];
    var nekretninePromises = [];
    var upitiPromises = [];
    return new Promise(function (resolve, reject) {
        upitiPromises.push(db.upit.create({ tekst_upita: 'upit' }));
        upitiPromises.push(db.upit.create({ tekst_upita: 'test' }));
        upitiPromises.push(db.upit.create({ tekst_upita: 'nesto' }));
        upitiPromises.push(db.upit.create({ tekst_upita: 'zzz' }));
        upitiPromises.push(db.upit.create({ tekst_upita: 'aaa' }));
        Promise.all(upitiPromises).then(function (upiti) {
            var upit1 = upiti.filter(function (u) { return u.tekst_upita === 'upit' })[0];
            var upit2 = upiti.filter(function (u) { return u.tekst_upita === 'test' })[0];
            var upit3 = upiti.filter(function (u) { return u.tekst_upita === 'nesto' })[0];
            var upit4 = upiti.filter(function (u) { return u.tekst_upita === 'zzz' })[0];
            var upit5 = upiti.filter(function (u) { return u.tekst_upita === 'aaa' })[0];

            korisniciPromises.push(
                db.korisnik.create({
                    "ime": "Amina",
                    "prezime": "Prezime",
                    "username": "amina",
                    "password": "$2b$10$OBZ0uuuVNb9C1ea6bRb.3umtrzlpegaB4P6Mu4R1sMbTg4WZlMRD2"
                }).then(function (k) {
                    k.setKorisnikoviUpiti([upit1, upit2, upit3]);
                    return new Promise(function (resolve, reject) { resolve(k); });
                })
            );
            korisniciPromises.push(
                db.korisnik.create({
                    "ime": "Tarik",
                    "prezime": "Prezime",
                    "username": "tarik",
                    "password": "$2b$10$OBZ0uuuVNb9C1ea6bRb.3umtrzlpegaB4P6Mu4R1sMbTg4WZlMRD2"
                }).then(function (k) {
                    k.setKorisnikoviUpiti([upit4]);
                    return new Promise(function (resolve, reject) { resolve(k); });
                })
            );
            korisniciPromises.push(
                db.korisnik.create({
                    "ime": "Ime",
                    "prezime": "Prezime",
                    "username": "user1",
                    "password": "$2b$10$OBZ0uuuVNb9C1ea6bRb.3umtrzlpegaB4P6Mu4R1sMbTg4WZlMRD2"
                }).then(function (k) {
                    k.setKorisnikoviUpiti([upit5]);
                    return new Promise(function (resolve, reject) { resolve(k); });
                })
            );
            korisniciPromises.push(
                db.korisnik.create({
                    "ime": "Ime",
                    "prezime": "Prezime",
                    "username": "user2",
                    "password": "$2b$10$OBZ0uuuVNb9C1ea6bRb.3umtrzlpegaB4P6Mu4R1sMbTg4WZlMRD2"
                }).then(function (k) {
                    return new Promise(function (resolve, reject) { resolve(k); });
                })
            );
            nekretninePromises.push(
                db.nekretnina.create({
                    "tip_nekretnine": "Stan",
                    "naziv": "Useljiv stan Sarajevoooo",
                    "kvadratura": 58,
                    "cijena": 232000,
                    "tip_grijanja": "plin",
                    "lokacija": "Novo Sarajevo",
                    "godina_izgradnje": 2019,
                    "datum_objave": "01.10.2023.",
                    "opis": "Sociis natoque penatibus."
                }).then(function (n) {
                    n.setUpitiZaNekretninu([upit1, upit2]);
                    return new Promise(function (resolve, reject) { resolve(n); });
                })
            );
            nekretninePromises.push(
                db.nekretnina.create({
                    "tip_nekretnine": "Poslovni prostor",
                    "naziv": "Mali poslovni prostor",
                    "kvadratura": 20,
                    "cijena": 70000,
                    "tip_grijanja": "struja",
                    "lokacija": "Centar",
                    "godina_izgradnje": 2005,
                    "datum_objave": "20.08.2023.",
                    "opis": "Magnis dis parturient montes."
                }).then(function (n) {
                    n.setUpitiZaNekretninu([upit3]);
                    return new Promise(function (resolve, reject) { resolve(n); });
                })
            );
            nekretninePromises.push(
                db.nekretnina.create({
                    "tip_nekretnine": "Poslovni prostor",
                    "naziv": "Mali poslovni prostor",
                    "kvadratura": 20,
                    "cijena": 70000,
                    "tip_grijanja": "struja",
                    "lokacija": "Centar",
                    "godina_izgradnje": 2005,
                    "datum_objave": "20.08.2023.",
                    "opis": "Magnis dis parturient montes."
                }).then(function (n) {
                    n.setUpitiZaNekretninu([upit4]);
                    return new Promise(function (resolve, reject) { resolve(n); });
                })
            );
            nekretninePromises.push(
                db.nekretnina.create({
                    "tip_nekretnine": "Kuća",
                    "naziv": "Kuća u Sarajevu",
                    "kvadratura": 65,
                    "cijena": 750000,
                    "tip_grijanja": "struja",
                    "lokacija": "Centar",
                    "godina_izgradnje": 2010,
                    "datum_objave": "30.12.2023.",
                    "opis": "Magnis dis parturient montes."
                }).then(function (n) {
                    n.setUpitiZaNekretninu([upit5]);
                    return new Promise(function (resolve, reject) { resolve(n); });
                })
            );
            nekretninePromises.push(
                db.nekretnina.create({
                    "tip_nekretnine": "Kuća",
                    "naziv": "Kuća u centru Sarajeva",
                    "kvadratura": 70,
                    "cijena": 100000,
                    "tip_grijanja": "struja",
                    "lokacija": "Centar",
                    "godina_izgradnje": 2020,
                    "datum_objave": "20.08.2023.",
                    "opis": "Magnis dis parturient montes."
                }).then(function (n) {
                    return new Promise(function (resolve, reject) { resolve(n); });
                })
            );
            nekretninePromises.push(
                db.nekretnina.create({
                    "tip_nekretnine": "Stan",
                    "naziv": "Useljiv stan Sarajevoooo",
                    "kvadratura": 58,
                    "cijena": 232000,
                    "tip_grijanja": "plin",
                    "lokacija": "Novo Sarajevo",
                    "godina_izgradnje": 2019,
                    "datum_objave": "01.10.2023.",
                    "opis": "Sociis natoque penatibus."
                }).then(function (n) {
                    return new Promise(function (resolve, reject) { resolve(n); });
                })
            );
        }).catch(function (err) { console.log("Greska sa dodavanjem upita " + err); });
    });
}
