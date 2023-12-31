//Settiamo le variabili per l'utilizzo dei moduli node
var http = require("http")
const path = require('path'); //per la manipolazione del path
var express = require("express")
var mongoose = require("mongoose");
const { stat } = require("fs/promises");
const { callbackify } = require("util");
var app = express() //Crea un'applicazione Express

//Configurazione del middleware
app.use(express.urlencoded({extended: true})); //Permette di ricevere i JSON come array o stringhe
app.use(express.static(__dirname+"/root_istruttore")) //Setta la root di base alla directory specificata

/*
 * Frammenti di codice  utilizzati per servire file statici nell'applicazione Express.js.
 * Ogni funzione gestisce una richiesta GET per un tipo specifico di file nel server.
*/

// Gestisce le richieste GET per i file CSS
app.get("/stylesheets/:filename", (req, res) => {
    const filename = req.params.filename;
    res.sendFile(path.join(__dirname, 'root_istruttore', 'stylesheets', filename));
});

// Gestisce le richieste GET per le immagini nella cartella per le icone
app.get("/img/icons/:filename", (req, res) => {
    const filename = req.params.filename;
    res.sendFile(path.join(__dirname, 'img', 'icons', filename));
});

//Gestisce le richieste GET per le immagini nella cartella generale
app.get("/img/:filename", (req, res) => {
    const filename = req.params.filename;
    res.sendFile(path.join(__dirname, 'img', filename));
});

//Creazione del database MongoDB
const corsi = mongoose.createConnection("mongodb://127.0.0.1:27017/Corsi")
const prenotazioni = mongoose.createConnection("mongodb://127.0.0.1:27017/Prenotazioni")


//DEFINIZIONE SCHEMI MONGOOSE


//***Corsi***
//La scuola guida offre corsi per patenti di guida per 
//motocicli (tipo AM, A1, A2, A) e per autoveicoli (tipo B).
//NOTA:Con questa categoria ci riferiamo in realtà alle lezioni
var corsiScheme = mongoose.Schema({
    id: Number,
    patente: {
        type: [String],
        enum: ["AM", "A1", "A2","A","B"],
        default: 'B'
    },
    descrizione: String

})

//***PRENOTAZIONI***
//Un cliente accede al sistema per prenotare una lezione, 
//indicando giorno e ora di inizio desiderati. Gli istruttori accedono al 
//sistema per “accettare” le prenotazioni richieste dai clienti.
var prenotazioniScheme = mongoose.Schema({
    id: Number,
    studente:String,
    idIstruttore: Number,
    stato:{
        type: [String],
        enum: ["ATTESA", "ACCETTATA", "RIFIUTATA"],
        default: 'ATTESA'
    },
    giorno: Date,
    orario: String

})


//Creazione modelli per lo schema
var Corso=corsi.model("Corso",corsiScheme);
var Prenotazione=prenotazioni.model("Prenotazione",prenotazioniScheme);


//Creiamo il vettore delle prenotazioni 
var idprenotazioni=0;

Prenotazione.find({}).then((result)=>{
    var max=-1;
    result.forEach(element => {
        if(element.idprenotazioni>max){
            max=element.idprenotazioni;
        }
    });
    idprenotazioni=max;
}).catch((err)=>{
    console.error(err);
});


//Connessione
http.createServer(app).listen(4004);


//GESTIONE CORSI

//GET: Visualizza corsi
app.get("/getCorsi",(req,res)=>{

    //Raccolgo i corsi dal database
    Corso.find({}).then((risp)=>{

        //Ci sono dei corsi?
        if(risp.length!=0){

            //Sì,do un ack
            res.status(200).json(risp);
        }else{

            //No,errore
            res.status(404).json(risp);
        }
    })
});


//GESTIONE PRENOTAZIONI

//GET: Visualizza Prenotazioni
app.get("/getPrenotazioni",(req,res)=>{

    //Raccolgo i corsi dal database
    Prenotazione.find({}).then((risp)=>{

        //Ci sono dei corsi?
        if(risp.length!=0){

            //Sì,do un ack
            res.status(200).json(risp);
        }else{

            //No,errore
            res.status(404).json(risp);
        }
    })
});

//GET: Visualizza Prenotazioni in base allo statp
app.get("/getPrenotazioni/:stato",(req,res)=>{

    //Raccolgo i corsi dal database
    Prenotazione.find({"stato":req.params.stato.toString().toUpperCase()}).then((risp)=>{

        //Ci sono dei corsi?
        if(risp.length!=0){

            //Sì,do un ack
            res.status(200).json(risp);
        }else{

            //No,errore
            res.status(404).json(risp);
        }
    })
});

//UPDATE: Accetta prenotazione
app.put("/accettaPrenotazione/", (req, res) => {
    Prenotazione.findOneAndUpdate(
        { "id": req.body.id },
        { "stato": "ACCETTATA" }
    )
    .then(() => {
        res.status(200).json(req.body);
    })
    .catch(error => {
        console.error(error);
        res.status(500).json({ error: "An error occurred" });
    });
});

//UPDATE: Rifiuta prenotazione
app.put("/rifiutaPrenotazione/", (req, res) => {
    Prenotazione.findOneAndUpdate(
        { "id": req.body.id },
        { "stato": "RIFIUTATA" }
    )
    .then(() => {
        res.status(200).json(req.body);
    })
    .catch(error => {
        console.error(error);
        res.status(500).json({ error: "An error occurred" });
    });
});