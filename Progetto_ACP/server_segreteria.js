/*Variabili per l'utilizzo dei moduli node*/
var http = require("http")
var express = require("express")
var mongoose = require("mongoose")
const exp = require("constants")
const { ok } = require("assert")
var app = express() //Crea un'applicazione Express

//Configurazione middleware
app.use(express.urlencoded({extended: true})); //Permette di ricevere i JSON come array o stringhe
app.use(express.static(__dirname+"/root_admin")) //Setta la root di base alla directory specificata

//Creazione databases MongoDB
const studenti = mongoose.createConnection("mongodb://127.0.0.1:27017/Studenti") //Creo la connessione per l'istanza del database Studenti
const pagelle = mongoose.createConnection("mongodb://127.0.0.1:27017/Pagelle") //Creo la connessione per l'istanza del database Pagelle
const attivita = mongoose.createConnection("mongodb://127.0.0.1:27017/Attivita") //Creo la connessione per l'istanza del database Attività

//Definizione schema Mongoose per gli studenti
var studentiScheme = mongoose.Schema({//Uno studente ha un id, un n
    matricola: Number,
    nome: String,
    cognome: String,
    codicefiscale: String,
    datanascita: String,
    classe: String,
    stato: {
        type: [String],
        enum: ["ASSEGNATO", "NON ASSEGNATO", "IN ATTESA"],
        default: 'IN ATTESA'
    }
})

//Definizione schema Mongoose per le pagelle
var pagelleScheme = mongoose.Schema({
    id: Number,
    studente: {matricola: Number, nome: String, cognome: String},
    quadrimestre: Number,
    annoscolastico: String,
    materie: {votoitaliano: Number, votomatematica: Number, votoinglese: Number, votostoria: Number}
})

//Definizione schema Mongoose per le attività
var attivitaScheme = mongoose.Schema({
    idatt: Number,
    classe: String,
    data: String,
    descrizione: String
})

//Definizione schema Mongoose per le materie
var materieScheme = mongoose.Schema({
    votoitaliano: Number,
    votomatematica: Number,
    votoinglese: Number,
    votostoria: Number
})

//Creazione modelli per gli schemi
var Studente = studenti.model("Studente", studentiScheme);
var Pagella = pagelle.model("Pagella", pagelleScheme);
var Attivita = attivita.model("Attivita", attivitaScheme);
var Materia = materie.model("Materia", materieScheme);