/*Variabili per l'utilizzo dei moduli node*/
var http = require("http")
var express = require("express")
var mongoose = require("mongoose")
var app = express() //Crea un'applicazione Express

//Configurazione middleware
app.use(express.urlencoded({extended: true})); //Permette di ricevere i JSON come array o stringhe
app.use(express.static(__dirname+"/root_genitore")) //Setta la root di base alla directory specificata

//Creazione databases MongoDB
const studenti = mongoose.createConnection("mongodb://127.0.0.1:27017/Studenti") //Creo la connessione per l'istanza del database Studenti
const pagelle = mongoose.createConnection("mongodb://127.0.0.1:27017/Pagelle") //Creo la connessione per l'istanza del database Pagelle
const attivita = mongoose.createConnection("mongodb://127.0.0.1:27017/Attivita") //Creo la connessione per l'istanza del database Attività
const materie = mongoose.createConnection("mongodb://127.0.0.1:27017/Materia") //Creo la connessione per l'istanza del database Attività


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
        enum: ["ASSEGNATO", "RIGETTATO", "ATTESA"],
        default: 'ATTESA'
    }
})

//Definizione schema Mongoose per le pagelle
var pagelleScheme = mongoose.Schema({
    id: Number,
    studente: {matricola: Number},
    quadrimestre: Number,
    annoscolastico: String,
    materie: {votoitaliano: Number, votomatematica: Number, votoinglese: Number, votostoria: Number}
})

//Definizione schema Mongoose per le attività
var attivitaScheme = mongoose.Schema({
    idatt: Number,
    data: String,
    tipo: {
        type:[String],
        enum:["ISTITUTO","CLASSE"],
        default: 'ISTITUTO'
    },
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


//Creazione connessione
http.createServer(app).listen(4000); //Creo un server sul porto 

//GET: il genitore visualizza le attività relative all'istituto o alla classe in particolare
app.get("/getAttivita",(req,res)=>{

    //Raccolgo le attività dal database
    Attivita.find({}).then((risultato)=>{

        //Ci sono attività?
        if(risultato.length!=0){

            //Sì, mando una ack
            res.status(200).json(risultato) 
        }else{

            //No, errore
            res.status(404).json(risultato);
        }
    })
});

//GET: il genitore visualizza la pagella dello studente
app.get("/getPagella",(req,res)=>{

    //Raccolgo le pagelle dal database relative all'alunno in questiones
    Pagella.find({studente:req.body.matricola}).then((pagelle)=>{

        //Ci sono pagelle?
        if(pagelle.length!=0){
            res.status(200).json(pagelle)
        }else{
            res.status(404).json(pagelle);
        }
    })

});


//POST: il genitore effettua l'iscrizione alla piattaforma del figlio 
app.post("/effettuaIscrizione",(req,res)=>{

    //Controllo che lo studente non sia già iscritto
    Studente.find({matricola:req.body.matricola}).then((studentegiaiscritto)=>{

        //Lo studente è già iscritto?
        if(studentegiaiscritto!=0){
            //Sì,errore
            res.status(404).json(studentegiaiscritto);
        }else{
            //No, è possibile effettuare l'iscrizione
            var newStudente = new Studente({matricola: req.body.matricola,nome: req.body.nome,cognome: req.body.cognome, codicefiscale: req.body.codicefiscale, datanascita: req.body.datanascita, classe: req.body.classe});
            
            console.log("Iscrizione inviata! \n La tua iscrizione: \n"+newStudente);
            newStudente.save().then(()=>{
                res.status(200).json(newStudente);
            })
        }
    })
});
