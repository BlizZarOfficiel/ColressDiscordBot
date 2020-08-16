const mysql = require('mysql')
const config = require('./config.json')
let db = mysql.createConnection({
    host     : config.base_de_donnee.adresse,
    user     :  config.base_de_donnee.user,
    password :  config.base_de_donnee.motdepasse,
    database : config.base_de_donnee.nomdelabase,
    charset:"utf8mb4"
})

db.connect()

module.exports = db