//Settiamo le variabili per l'utilizzo dei moduli node
var http = require("http")
const path = require('path'); //per la manipolazione del path
var express = require("express")
var mongoose = require("mongoose");
const { stat } = require("fs/promises");
const { callbackify } = require("util");
const session = require('express-session');     //per usare un'oggetto sessione
const crypto = require('crypto');
var app = express() //Crea un'applicazione Express

//Configurazione del middleware
app.use(express.urlencoded({extended: true})); //Permette di ricevere i JSON come array o stringhe
app.use(express.static(__dirname+"/root_client")) //Setta la root di base alla directory specificata

// Genera una chiave di sessione casuale
const generaChiaveSegreta = () => {
    return crypto.randomBytes(32).toString('hex');  // Chiave casuale di 32 byte convertita in esadecimale
};

// Inizializzazione della sessione
app.use(session({
    secret: generaChiaveSegreta(),           // Invoca la funzione per ottenere la chiave casuale
    resave: false,                           // Non salvare la sessione se non è stata modificata
    saveUninitialized: false                 // Non salvare la sessione se non è stata inizializzata
}));

/*
 * Frammenti di codice  utilizzati per servire file statici nell'applicazione Express.js.
 * Ogni funzione gestisce una richiesta GET per un tipo specifico di file nel server.
*/

// Gestisce le richieste GET per i file CSS
app.get("/stylesheets/:filename", (req, res) => {
    const filename = req.params.filename;
    res.sendFile(path.join(__dirname, 'root_client', 'stylesheets', filename));
});
// Gestisce le richieste GET per i file JavaScript
app.get("/javascript/:filename", (req, res) => {
    const filename = req.params.filename;
    res.sendFile(path.join(__dirname, 'root_client', 'javascript', filename));
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
const studenti = mongoose.createConnection("mongodb://127.0.0.1:27017/Studenti") //Creo una connessione con il database per l'istanza studenti
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
    patentiinpossesso: String,
    username: String,
    password: String

})


//***Corsi***
//La scuola guida offre corsi per patenti di guida per
//motocicli (tipo AM, A1, A2, A) e per autoveicoli (tipo B).
var corsiScheme = mongoose.Schema({
    id: Number,
    patente: {
        type: [String],
        enum: ["AM", "A1", "A2","A","B"],
        default: 'B'
    },
    descrizione: String

})

//***Istruttori***
//Gli istruttori sono inseriti nel sistema dal segretario,
//che per ciascun istruttore inserisce nome, cognome, telefono e indirizzo e-mail
var istruttoriScheme = mongoose.Schema({
    id: Number,
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
    studente: String, //username
    idIstruttore: Number,
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
    domanda: String,
    risposta: String
})


//Creazione modelli per lo schema
var Studente=studenti.model("Studente",studentiScheme);
var Corso=corsi.model("Corso",corsiScheme);
var Istruttore=istruttori.model("Istruttore",istruttoriScheme);
var Prenotazione=prenotazioni.model("Prenotazione",prenotazioniScheme);
var Domanda=domande.model("Domanda",domandeScheme);


var idprenotazioni=0;

// Calcola l'ID massimo delle prenotazioni esistenti nel database
// per garantire che ogni nuova prenotazione abbia un ID univoco.
Prenotazione.find({}).then((result)=>{
    var max=-1;
    result.forEach(element => {
        if(element.id>max){
            max=element.id;
        }
    });
    idprenotazioni=max;
}).catch((err)=>{
    console.error(err);
});


//Connessione
http.createServer(app).listen(4008);

// GET: mostra la pagina di login
app.get("/login", (req, res) => {

    // Serving the requested page
    res.sendFile(__dirname + '/root_client/login.html');
});

// POST: login utente
app.post('/login/log', (req, res) => {

    // Legge l'username e la password dal body della request
    var {username, password} = req.body;

    // Preparo la query
    const query = { username: username };

    // Trova l'unico studente con quello specifico username
    Studente.find(query)
    .then((iscrizioni) => {

        //Nessuno studente trovato
        if (iscrizioni == []) {
            console.log('[SERVER]: username non valido.');
        }

        //Se invece l'username corrisponde
        else {

            // Lo studente è il primo e unico documento che ritorna dal DB
            studente = iscrizioni[0];

            // Se la password è corretta
            if (password === studente.password) {

                // inviamo come risposta success
                var response = {
                    outcome: "success"
                }

                //settiamo le variabili di sessione
                req.session.authenticated = true;
                req.session.username = studente.username;

                // inviamo la risposta
                res.json(response);
            }

            // Password non valida
            else {

                // inviamo come risposta failure
                let response = {
                    outcome: "failure"
                }

                // inviamo la risposta
                res.json(response);
            }
        }
    });
});

// GET: richiesta per vedere se siamo autenticati
app.get('/autenticazioneAvvenuta', (req, res) => {

    var response;

    // Se è vero ritorniamo, lo stato di autenticazione e l'username
    if (req.session.authenticated) {
        response = {
            auth: req.session.authenticated,
            username: req.session.username
        }
    }

    // altrimenti ritorniamo solo lo stato di autenticazione (falso)
    else {
        response = {
            auth: req.session.authenticated,
        }
    }
    
    res.json(response);

});

//GESTIONE STUDENTI

//GET: Visualizza le informazioni dello studente in base all'username
app.get("/getStudenti/:username",(req,res)=>{

    //Raccolgo l'iscrizione dal database
    Studente.find({"username":req.params.username.toString()}).then((iscrizioni)=>{

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

//GESTIONE ISTRUTTORI

//GET: Visualizza Istruttori
app.get("/getIstruttori",(req,res)=>{

    //Raccolgo le assunzioni dal database
    Istruttore.find({}).then((risp)=>{

        //Ci sono delle assunzioni?
        if(risp.length!=0){

            //Sì,do un ack
            res.status(200).json(risp);
        }else{

            //No,errore
            res.status(404).json(risp);
        }
    })
});

//GESTIONE QUIZ

//GET: Visualizza Domande
app.get("/getDomande",(req,res)=>{

    /*Raccolgo le domande dal database ->  verranno prelevate casualmente 40 domande dalla collezione
     * $sample: È un operatore di aggregazione specifico che viene utilizzato per estrarre un campione casuale di documenti dalla collezione.
     * L'operatore $sample richiede un oggetto di configurazione con il campo size, che specifica il numero di documenti da estrarre casualmente.
     */
    Domanda.aggregate([{ $sample: { size: 40 } }]).then((domande)=>{

        //Ci sono delle doamnde?
        if(domande.length!=0){

            //Sì,do un ack
            res.status(200).json(domande);
        }else{

            //No,errore
            res.status(404).json(domande);
        }
    })
})


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

//POST: Crea prenotazione
app.post("/creaPrenotazione",(req,res)=>{

    //Creazione
    var newpren = new Prenotazione({id:Number(++idprenotazioni), studente: req.body.studente, idIstruttore:req.body.idIstruttore, giorno:req.body.giorno, orario:req.body.orario});
    newpren.save().then(()=>{
        res.status(200).json(newpren);
    })

});

//GET: Visualizza Prenotazioni dello studente
app.get("/getPrenotazioni/:studente",(req,res)=>{

    //Raccolgo i corsi dal database
    Prenotazione.find({"studente":req.params.studente.toString()}).then((risp)=>{

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

//DELETE: Elimina prenotazioni
app.delete("/deletePrenotazione",(req,res)=>{

    //Cerchiamo l'attività da eliminare
    Prenotazione.findOneAndDelete(req.body).then((cancella)=>{
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

