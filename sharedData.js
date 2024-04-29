const Sequelize = require("sequelize");

module.exports = function(sequelize,DataTypes){
    const SharedData = sequelize.define("SharedData",{
        brojPretraga:Sequelize.INTEGER,
        brojKlikova:Sequelize.INTEGER
    })
    return SharedData;
};
