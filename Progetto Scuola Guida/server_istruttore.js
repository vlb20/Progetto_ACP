
//Settiamo le variabili per l'utilizzo dei moduli node
var http = require("http")
var express = require("express")
var mongoose = require("mongoose");
const { stat } = require("fs/promises");
const { callbackify } = require("util");
var app = express() //Crea un'applicazione Express

//Configurazione del middleware
app.use(express.urlencoded({extended: true})); //Permette di ricevere i JSON come array o stringhe
app.use(express.static(__dirname+"/segreteria")) //Setta la root di base alla directory specificata


//Creazione del database MongoDB
const studenti = mongoose.createConnection("mongodb://127.0.0.1:27017/MyAutoscuola") //Creo una connessione con il database per l'istanza studenti
const corsi = mongoose.createConnection("mongodb://127.0.0.1:27017/Corsi")
const istruttori = mongoose.createConnection("mongodb://127.0.0.1:27017/Istruttori")
const prenotazioni = mongoose.createConnection("mongodb://127.0.0.1:27017/Prenotazioni")
const domande =mongoose.createConnection("mongodb://127.0.0.1:27017/Quiz")



//DEFINIZIONE SCHEMI MONGOOSE

//***Iscrizioni studenti***
//All’atto dell’iscrizione, un impiegato della scuola guida registra i clienti nel sistema 
//inserendo il loro nome, cognome, data di nascita, indirizzo di posta elettronica, telefono mobile, 
//tipo di patente che si vuole conseguire, ed eventuali patenti già in possesso.
var studentiScheme = mongoose.Schema({
    nome: String,
    cognome: String,
    datanascita: String,
    email: String,
    cellulare: String,
    patente: {
        type: [String],
        enum: ["AM", "A1", "A2","A","B"],
        default: 'B'
    },
    patentiinpossesso: {
        type: [String],
        enum: ["AM", "A1", "A2","A","B"],
        default: 'B'
    },
    username: String,
    password: String

})


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
    }

})

//***Istruttori***
//Gli istruttori sono inseriti nel sistema dal segretario, 
//che per ciascun istruttore inserisce nome, cognome, telefono e indirizzo e-mail
var istruttoriScheme = mongoose.Schema({
    nome: String,
    cognome: String,
    cellulare: String,
    email: String
})


//***PRENOTAZIONI***
//Un cliente accede al sistema per prenotare una lezione, 
//indicando giorno e ora di inizio desiderati. Gli istruttori accedono al 
//sistema per “accettare” le prenotazioni richieste dai clienti.
var prenotazioniScheme = mongoose.Schema({
    id: Number,
    studente: {String},
    istruttore: {String, String},
    stato:{
        type: [String],
        enum: ["ATTESA", "ACCETTATA", "RIFIUTATA"],
        default: 'ATTESA'
    },
    giorno: Date,
    orario: String

})


//domande VERO/FALSO
var domandeScheme = mongoose.Schema({
    richiesta: String,
    risposta: Boolean
})


//Creazione modelli per lo schema
var Studente=studenti.model("Studente",studentiScheme);
var Corso=corsi.model("Corso",corsiScheme);
var Istruttore=istruttori.model("Istruttore",istruttoriScheme);
var Prenotazione=prenotazioni.model("Prenotazione",prenotazioniScheme);
var Domanda=domande.model("Domanda",domandeScheme);


//Creiamo il vettore degli studenti iscritti
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
app.get("/getPrenotazioni/:istruttore",(req,res)=>{

    //Raccolgo i corsi dal database
    Prenotazione.find({"istruttore":req.params.istruttore.toString().toUpperCase()}).then((risp)=>{

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