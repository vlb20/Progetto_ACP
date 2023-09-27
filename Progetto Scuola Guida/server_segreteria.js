
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
    id:Number,
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
var idstudenti=0;

Studente.find({}).then((result)=>{
    var max=-1;
    result.forEach(element => {
        if(element.idstudenti>max){
            max=element.idstudenti;
        }
    });
    idstudenti=max;
}).catch((err)=>{
    console.error(err);
});

var idcorso=0;

Corso.find({}).then((result)=>{
    var max=-1;
    result.forEach(element => {
        if(element.idcorso>max){
            max=element.idcorso;
        }
    });
    idcorso=max;
}).catch((err)=>{
    console.error(err);
});


//Connessione
http.createServer(app).listen(4002);

//GESTIONE STUDENTI

const generateRandomString=()=>{
    return Math.floor(Math.random()*Date.now()).toString(36);
};

//POST: Inserisci studenti
app.post("/inserisciStudenti",(req,res)=>{

    //Creazione studente
    var newstud = new Studente({nome:req.body.nome, cognome:req.body.cognome, datanascita:req.body.datanascita, email: req.body.email, cellulare: req.body.cellulare, patente: req.body.patente,patentiinpossesso: req.body.patentiinpossesso,
        username: "user"+generateRandomString(), password: generateRandomString()});
    
    newstud.save().then(()=>{
        res.status(200).json(newstud);
    })
    
});

//GET: Visualizza Studenti
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

//GESTIONE ISTRUTTORI

//POST: Inserisci istruttori
app.post("/inserisciIstruttori",(req,res)=>{

    //Creazione attività
    var newistr = new Istruttore({nome:req.body.nome, cognome:req.body.cognome, cellulare: req.body.cellulare, email: req.body.email});
    
    newistr.save().then(()=>{
        res.status(200).json(newistr);
    })
    
});

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

    //Raccolgo le domande dal database
    Domanda.find({}).then((domande)=>{

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

//POST: Inserisci corsi
app.post("/inserisciCorsi",(req,res)=>{

    //Creazione corso
    var newcourse = new Corso({id:Number(++idcorso), patente: req.body.patente, giorno: req.body.patente, orario: req.body.orario});
    newcourse.save().then(()=>{
        res.status(200).json(newcourse);
    })

});

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

//DELETE: Elimina corsi
app.delete("/deleteCorso",(req,res)=>{

    //Cerchiamo l'attività da eliminare
    Corso.findOneAndDelete(req.body).then((cancella)=>{
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