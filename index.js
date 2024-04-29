const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const session = require('express-session');
const fs = require('fs').promises;
const db = require('./db.js')

const app = express();

app.use(express.static('public'))
app.use(express.static(path.join('public', 'html')));
app.use(express.static(path.join('public', 'scripts')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'secretValue',
  resave: false,
  saveUninitialized: true
}));

async function azurirajKorisnika(korisnik) {
  try {
    await db.korisnik.update(
      {
        ime: korisnik.ime,
        prezime: korisnik.prezime,
        username: korisnik.username,
        password: korisnik.password
      },
      {
        where: { id: korisnik.id }
      }
    );
  } catch (error) {
    console.error('Greška prilikom ažuriranja korisnika:', error);
    throw error;
  }
}

async function dodajUpit(nekretnina_id, tekst_upita, korisnik_id) {
  try {
    const noviUpit = await db.upit.create({
      tekst_upita: tekst_upita,
      NekretninaId: nekretnina_id, 
      KorisnikId: korisnik_id 
    });

    return noviUpit;
  } catch (error) {
    console.error('Greška prilikom dodavanja upita u bazu:', error);
    throw error; 
  }
}

async function ucitajKorisnike() {
  try {
    const sviKorisnici = await db.korisnik.findAll();

    const formatiraniKorisnici = await Promise.all(sviKorisnici.map(async korisnik => {

      return {
        id: korisnik.id,
        ime: korisnik.ime,
        prezime: korisnik.prezime,
        username: korisnik.username,
        password: korisnik.password
      };
    }));

    return formatiraniKorisnici;
  } catch (error) {
    console.error('Greška prilikom dohvaćanja korisnika iz baze:', error);
    throw error; 
  }
}

async function ucitajNekretnine() {
  try {
    const sveNekretnine = await db.nekretnina.findAll();

    const formatiraneNekretnine = await Promise.all(sveNekretnine.map(async nekretnina => {
      const resSet = await nekretnina.getUpitiZaNekretninu();

      const formatiraniUpiti = [];
      resSet.forEach(upit => {
        formatiraniUpiti.push({
          korisnik_id: upit.KorisnikId,
          tekst_upita: upit.tekst_upita
        });
      });
      return {
        id: nekretnina.id,
        tip_nekretnine: nekretnina.tip_nekretnine,
        naziv: nekretnina.naziv,
        kvadratura: nekretnina.kvadratura,
        cijena: nekretnina.cijena,
        tip_grijanja: nekretnina.tip_grijanja,
        lokacija: nekretnina.lokacija,
        godina_izgradnje: nekretnina.godina_izgradnje,
        datum_objave: nekretnina.datum_objave,
        opis: nekretnina.opis,
        upiti: formatiraniUpiti
      };
    }));

    return formatiraneNekretnine;
  } catch (error) {
    console.error('Greška prilikom dohvaćanja nekretnina iz baze:', error);
    throw error; 
  }
}


async function procitajMeniHTML() {
  const meniPath = path.join(__dirname, 'public/html/meni.html');
  return await fs.readFile(meniPath, 'utf-8');
}

async function azurirajMeniHTML(noviSadrzaj) {
  const meniPath = path.join(__dirname, 'public/html/meni.html');
  await fs.writeFile(meniPath, noviSadrzaj, 'utf-8');
}

async function zamijeniNakonPrijave() {
  const noviSadrzaj = (await procitajMeniHTML())
    .replace(
      '<li><a href="/prijava.html" target="_blank">Prijava</a></li>',
      '<li><button onclick="odjavi()">Odjava</button></li>'
    )
    .replace(
      '<li><a href="/profil.html" target="_blank"></a></li>',
      '<li><a href="/profil.html" target="_blank">Profil</a></li>'
    );
  await azurirajMeniHTML(noviSadrzaj);
}

async function zamijeniNakonOdjave() {
  const noviSadrzaj = (await procitajMeniHTML())
    .replace(
      '<li><button onclick="odjavi()">Odjava</button></li>',
      '<li><a href="/prijava.html" target="_blank">Prijava</a></li>'
    )
    .replace(
      '<li><a href="/profil.html" target="_blank">Profil</a></li>',
      '<li><a href="/profil.html" target="_blank"></a></li>'
    );
  await azurirajMeniHTML(noviSadrzaj);
}

app.get('/nekretnine.html', async function (req, res) {
  res.sendFile(path.join(__dirname, 'public/html/nekretnine.html'));
});

app.get('/detalji.html', async function (req, res) {
  res.sendFile(path.join(__dirname, 'public/html/detalji.html'));
});

app.get('/prijava.html', async function (req, res) {
  res.sendFile(path.join(__dirname, 'public/html/prijava.html'));
});

app.get('/profil.html', async function (req, res) {
  res.sendFile(path.join(__dirname, 'public/html/profil.html'));
});

app.post('/login', async function (req, res) {
  const { username, password } = req.body;
  try {
    const korisnici = await ucitajKorisnike();
    const korisnik = korisnici.find(user => user.username === username);
    if (!korisnik) {
      return res.status(401).json({ greska: 'Neuspješna prijava' });
    }
    const result = await bcrypt.compare(password, korisnik.password);
    if (result) {
      req.session.user = korisnik;
      req.session.username = username;
      await zamijeniNakonPrijave();
      return res.status(200).json({ poruka: 'Uspješna prijava' });
    } else {
      return res.status(401).json({ greska: 'Neuspješna prijava' });
    }
  } catch (error) {
    return res.status(401).json({ greska: 'Neuspješna prijava' });
  }
});

app.post('/logout', async function (req, res) {
  if (req.session.username) {
    try {
      await new Promise((resolve, reject) => {
        req.session.destroy((err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
      await zamijeniNakonOdjave();
      return res.status(200).json({ poruka: 'Uspješno ste se odjavili' });
    } catch (error) {
      return res.status(500).json({ greska: 'Greška prilikom odjave' });
    }
  } else {
    return res.status(401).json({ greska: 'Neautorizovan pristup' });
  }
});

app.get('/korisnik', async function (req, res) {
  if (req.session.user) {
    return res.status(200).json(req.session.user);
  } else {
    return res.status(401).json({ greska: 'Neautorizovan pristup' });
  }
});


app.post('/upit', async function (req, res) {
  if (!req.session.user) {
    return res.status(401).json({ greska: 'Neautorizovan pristup' });
  }
  const { nekretnina_id, tekst_upita } = req.body;
  try {
    const korisnici = await ucitajKorisnike();
    const nekretnine = await ucitajNekretnine();
    const korisnik = korisnici.find(user => user.id === req.session.user.id);
    const nekretnina = nekretnine.find(nek => nek.id === nekretnina_id);
    if (!nekretnina) {
      return res.status(400).json({ greska: `Nekretnina sa id-em ${nekretnina_id} ne postoji` });
    }
    await dodajUpit(nekretnina_id, tekst_upita, korisnik.id);
    return res.status(200).json({ poruka: 'Upit je uspješno dodan' });
  } catch (error) {
    return res.status(500).json({ greska: 'Greška prilikom dodavanja upita' });
  }
});

app.put('/korisnik', async function (req, res) {
  if (!req.session.user) {
    return res.status(401).json({ greska: 'Neautorizovan pristup' });
  }
  const { ime, prezime, username, password } = req.body;
  try {
    const korisnici = await ucitajKorisnike();
    const korisnik = korisnici.find(user => user.id === req.session.user.id);
    if (ime) korisnik.ime = ime;
    if (prezime) korisnik.prezime = prezime;
    if (username) korisnik.username = username;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      korisnik.password = hashedPassword;
    }
    await azurirajKorisnika(korisnik);
    req.session.user = korisnik;
    return res.status(200).json({ poruka: 'Podaci su uspješno ažurirani' });
  } catch (error) {
    return res.status(500).json({ greska: 'Greška prilikom ažuriranja podataka' });
  }
});

app.get('/nekretnine', async function (req, res) {
  try {
    let spisakNekretnina = await ucitajNekretnine();
    return res.status(200).json(spisakNekretnina);
  } catch (error) {
    return res.status(500).json({ greska: 'Greška prilikom čitanja nekretnina' });
  }
});

app.get('/PoziviAjax.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/scripts/PoziviAjax.js'));
});

app.get('/MarketingAjax.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/scripts/MarketingAjax.js'));
});

const sharedDataPath = path.join(__dirname, 'data', 'sharedData.json');

async function ucitajSharedData() {
  try {
    const sviPodaci = await db.sharedData.findAll();

    const formatiraniPodaci = await Promise.all(sviPodaci.map(async podatak => {

      return {
        idPodatka: podatak.id,
        id: podatak.NekretninaId,
        brojPretraga: podatak.brojPretraga,
        brojKlikova: podatak.brojKlikova
      };
    }));

    return formatiraniPodaci;
  } catch (error) {
    console.error('Greška prilikom dohvaćanja podataka o klikovima i pretragama iz baze:', error);
    throw error; 
  }
}

async function updateSharedData(pretrage) {
  try {
    await db.sharedData.update(
      {
        brojPretraga: pretrage.brojPretraga,
        brojKlikova: pretrage.brojKlikova
      },
      {
        where: { NekretninaId: pretrage.id }
      }
    );
  } catch (error) {
    console.error('Greška prilikom ažuriranja broja pretraga:', error);
    throw error;
  }

}
async function insertSharedData(pretrage) {
  try {
    await db.sharedData.create(
      {
        brojPretraga: pretrage.brojPretraga,
        brojKlikova: pretrage.brojKlikova,
        NekretninaId: pretrage.id
      }
    );
  } catch (error) {
    console.error('Greška prilikom ažuriranja broja pretraga:', error);
    throw error;
  }
}

async function postaviSharedData() {
  global.sharedData = await ucitajSharedData();
}

async function azurirajBrojPretraga(idNekretnine) {
  try {
    let pretrage = global.sharedData || [];
    const indeks = pretrage.findIndex((item) => item.id === idNekretnine);
    if (indeks !== -1) {
      pretrage[indeks].brojPretraga++;
      updateSharedData(pretrage[indeks])
    } else {
      pretrage.push({ id: idNekretnine, brojPretraga: 1, brojKlikova: 0 });
      insertSharedData(pretrage[pretrage.length - 1])
    }
    global.sharedData = pretrage;
  } catch (error) {
  }
}

app.post('/marketing/nekretnine', async function (req, res) {
  try {
    const { nizNekretnina } = req.body;
    await Promise.all(nizNekretnina.map(async (id) => {
      await azurirajBrojPretraga(id);
    }));
    return res.status(200).send();
  } catch (error) {
    return res.status(500).json({ greska: 'Greška prilikom spremanja pretraga' });
  }
});

app.post('/marketing/osvjezi', async function (req, res) {
  try {
    let listaNekretninaFiltriranje;
    let odgovorNiz = [];
    if (Object.keys(req.body).length === 0) {
      listaNekretninaFiltriranje = req.session.listaNekretnina;
    }
    else {
      const { nizNekretnina } = req.body;
      req.session.listaNekretnina = nizNekretnina;
      listaNekretninaFiltriranje = nizNekretnina;
      let pretrage = global.sharedData || [];
      odgovorNiz = listaNekretninaFiltriranje.map((id) => {
        const pretraga = pretrage.find((item) => item.id === id) || { brojPretraga: 0 };
        const klikovi = pretrage.find((item) => item.id === id) || { brojKlikova: 0 };
        return {
          id: id,
          klikovi: klikovi.brojKlikova,
          pretrage: pretraga.brojPretraga
        };
      });
    }
    const odgovorObj = { nizNekretnina: odgovorNiz };
    return res.status(200).json(odgovorObj);
  } catch (error) {
    return res.status(500).json({ greska: 'Greška prilikom dohvata broja pretraga' });
  }
});

async function azurirajBrojKlikova(idNekretnine) {
  try {
    let pretrage = global.sharedData;
    const indeks = pretrage.findIndex((item) => parseInt(item.id) === parseInt(idNekretnine));
    if (indeks !== -1) {
      const pretraga = pretrage[indeks];
      pretraga.brojKlikova = (pretraga.brojKlikova || 0) + 1;
      updateSharedData(pretrage[indeks])
    } else {
      pretrage.push({ id: Number(idNekretnine), brojPretraga: 0, brojKlikova: 1 });
      insertSharedData(pretrage[pretrage.length - 1])
    }
    global.sharedData = pretrage;
  } catch (error) {
  }
}

app.post('/marketing/nekretnina/:id', async function (req, res) {
  try {
    const { id } = req.params;
    await azurirajBrojKlikova(id);
    return res.status(200).send();
  } catch (error) {
    return res.status(500).json({ greska: 'Greška prilikom ažuriranja broja klikova' });
  }
});


app.get('/nekretnina/:id', async function (req, res) {
  try {
    const { id } = req.params;
    let nekretnina = await db.nekretnina.findOne({ where: { id: id } });
    if (!nekretnina) {
      return res.status(400).json({ greska: `Nekretnina sa id-em ${id} ne postoji` });
    }
    const resSet = await nekretnina.getUpitiZaNekretninu();

    const formatiraniUpiti = [];
    for (const upit of resSet) {
      const korisnik = await db.korisnik.findOne({ where: { id: upit.KorisnikId } });

      formatiraniUpiti.push({
          username: korisnik ? korisnik.username : null,
          tekst_upita: upit.tekst_upita
      });
  }
    let nekretninaFormatirana = {
      id: nekretnina.id,
      tip_nekretnine: nekretnina.tip_nekretnine,
      naziv: nekretnina.naziv,
      kvadratura: nekretnina.kvadratura,
      cijena: nekretnina.cijena,
      tip_grijanja: nekretnina.tip_grijanja,
      lokacija: nekretnina.lokacija,
      godina_izgradnje: nekretnina.godina_izgradnje,
      datum_objave: nekretnina.datum_objave,
      opis: nekretnina.opis,
      upiti: formatiraniUpiti
    };
    return res.status(200).json(nekretninaFormatirana);
  } catch (error) {
    return res.status(500).json({ greska: 'Greška prilikom dohvatanja nekretnine' });
  }
});

async function startServer() {
  await postaviSharedData();
  await zamijeniNakonOdjave();
  app.listen(3000, () => {
  });
}

startServer();

