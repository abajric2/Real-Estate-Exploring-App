const Sequelize = require("sequelize");
const sequelize = new Sequelize("wt24","root","password",{host:"127.0.0.1",dialect:"mysql",logging:false});
const db={};

db.Sequelize = Sequelize;  
db.sequelize = sequelize;

//import modela
const KorisnikModel = require(__dirname + '/korisnik.js');
db.korisnik = KorisnikModel(sequelize, Sequelize);
const NekretninaModel = require(__dirname + '/nekretnina.js');
db.nekretnina = NekretninaModel(sequelize, Sequelize);
const UpitModel = require(__dirname + '/upit.js');
db.upit = UpitModel(sequelize, Sequelize);
const SharedDataModel = require(__dirname + '/sharedData.js');
db.sharedData = SharedDataModel(sequelize, Sequelize);

//relacije
db.nekretnina.hasMany(db.upit,{as:'upitiZaNekretninu'});
db.korisnik.hasMany(db.upit,{as:'korisnikoviUpiti'});
db.nekretnina.hasMany(db.sharedData,{as:'podaciZaNekretninu'});

module.exports=db;