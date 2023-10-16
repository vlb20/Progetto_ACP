/*Variabili per l'utilizzo dei moduli node*/
var http = require("http")
var express = require("express")
var mongoose = require("mongoose");
const { stat } = require("fs/promises");
const { callbackify } = require("util");
var app = express() //Crea un'applicazione Express

//Configurazione middleware
app.use(express.urlencoded({extended: true})); //Permette di ricevere i JSON come array o stringhe
app.use(express.static(__dirname+"/segreteria")) //Setta la root di base alla directory specificata

//Creazione databases MongoDB
const studenti = mongoose.createConnection("mongodb://127.0.0.1:27017/Studenti") //Creo la connessione per l'istanza del database Studenti
const pagelle = mongoose.createConnection("mongodb://127.0.0.1:27017/Pagelle") //Creo la connessione per l'istanza del database Pagelle
const attivita = mongoose.createConnection("mongodb://127.0.0.1:27017/Attivita") //Creo la connessione per l'istanza del database Attività
const materie = mongoose.createConnection("mongodb://127.0.0.1:27017/Materia") //Creo la connessione per l'istanza del database Materie

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
    quadrimestre: String,
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


//Contatore attività e pagelle
var idattivita=0;
var idpagella=0;

Attivita.find({}).then((result) => {
    var max = -1;
    result.forEach((element) => {
        if (element.idatt > max) {
        max = element.idatt;
    }
    });
    idattivita = max;
}).catch((err) => {
    console.error(err);
});

Pagella.find({}).then((result) => {
    var max = -1;
    result.forEach((element) => {
        if (element.id > max) {
        max = element.id;
        }
    });
    idpagella = max;
}).catch((err) => {
    console.error(err);
});


//Connessione
http.createServer(app).listen(4002);

//GESTIONE PAGELLE

//POST: Inserisci pagella
app.post("/inserisciPagella",(req,res)=>{

    //Creazione pagella
    var newpag = new Pagella({id:Number(++idpagella), studente: req.body.studente,
        quadrimestre: req.body.quadrimestre,
        annoscolastico: req.body.annoscolastico,
        materie: req.body.materie
    });


    //Salvataggio pagella
    newpag.save().then(()=>{
        res.status(200).json(newpag);
    })

});

//GET: Visualizza pagelle
app.get("/getPagelle",(req,res)=>{

    //Raccogliamo le attività
    Pagella.find({}).then((risp)=>{
        if(risp.length!=0){
            res.status(200).json(risp);
        }else{
            res.status(404).json(risp);
        }
    })
});

//GESTIONE ATTIVITà

//POST: Inserisci attività
app.post("/inserisciAttivita",(req,res)=>{

    //Creazione attività
    var newatt = new Attivita({idatt:Number(++idattivita),classe:req.body.classe,data:req.body.data,tipo:req.body.tipo,descrizione:req.body.descrizione});

    newatt.save().then(()=>{
        res.status(200).json(newatt);
    })

});

//GET: Visualizza attività
app.get("/getAttivita",(req,res)=>{

    //Raccogliamo le attività
    Attivita.find({}).then((risp)=>{
        if(risp.length!=0){
            res.status(200).json(risp);
        }else{
            res.status(404).json(risp);
        }
    })
});

//DELETE: Elimina attività
app.delete("/deleteAttivita",(req,res)=>{

    //Cerchiamo l'attività da eliminare
    Attivita.findOneAndDelete(req.body).then((cancella)=>{
        //cancella ha funzionato?
        if(cancella!=null){
            //Sì,ack
            res.status(200).json(cancella);
        }else{
            //No.errore
            res.status(404).json(cancella);
        }
    })
});

//GESTIONE STUDENTI

//GET: Visualizza studenti
app.get("/getStudenti",(req,res)=>{

    //Raccolgo le iscrizioni dal database
    Studente.find({}).then((iscrizioni)=>{

        //Ci sono delle iscrizioni?
        if(iscrizioni.length!=0){

            //Sì,do un ack
            res.status(200).json(iscrizioni);
        }else{

            //No,errore
            res.status(404).json(iscrizioni);
        }
    })
})

//GET: Visualizza studenti in base allo stato
app.get("/getStudenti/:status",(req,res)=>{

    //Raccolgo gli studenti con quello status
    Studente.find({"stato":req.params.status.toString().toUpperCase()}).then((statostudenti)=>{
        
        //Ci sono studenti con questo stato?
        if(statostudenti.length!=0){
            
            //Sì,do un ack
            res.status(200).json(statostudenti);
        }else{
            
            //No,errore
            res.status(404).json(statostudenti);
        }
    })
})

//PUT: Approva Iscrizione
app.put("/assegnaIscrizione", (req, res) => {
    Studente.findOneAndUpdate(
        { "matricola": req.body.matricola },
        { "stato": "ASSEGNATO" }
    )
    .then(() => {
        res.status(200).json(req.body);
    })
    .catch(error => {
        console.error(error);
        res.status(500).json({ error: "An error occurred" });
    });
});


//PUT: Rigetta Iscrizione
app.put("/rigettaIscrizione", (req, res) => {
    Studente.findOneAndUpdate(
        { "matricola": req.body.matricola },
        { "stato": "RIGETTATO" }
    )
    .then(() => {
        res.status(200).json(req.body);
    })
    .catch(error => {
        console.error(error);
        res.status(500).json({ error: "An error occurred" });
    });
});