/*Variabile globale per segnalare che l'iscrizione è stata approvata
var iscrizione_sottoposta=0;
var iscrizione_accettata=0;
var matricola_personale=0;
var codicefiscalestud=0;
var num_attivita=0;
*/


var main=function(){

    "use strict";

    var $cont;

    $(".tabs a span").toArray().forEach(function(element){
        var $element=$(element);

        //creo un click handler per l'elemento
        $element.on("click",function(){

            $(".tabs a span").removeClass("active");
            $element.addClass("active");
            $("main .content").empty();


            //GESTIONE TAB

            //TAB 1: VISUALIZZA ISCRIZIONE STUDENTE
            if($element.parent().is(":nth-child(1)")){
                
                $cont=$("<ul>");

                $.ajax({
                    method: "GET",
                    url: "/autenticazioneAvvenuta",
                    dataType: "json",
                    success: (response) => {
                        if (response.auth === true) {
                            
                            $.getJSON("/getStudenti/"+response.username, (iscrizioni)=>{ //C'è un'iscrizione per questo studente?

                                //Sì, eccola
                                iscrizioni.forEach((iscrizione)=>{
                                    var $infonome = $("<li class='infostudente'>").text(iscrizione.nome+" "+iscrizione.cognome);
                                    var $labeldata = $("<li class='labelstudente'>").text("Data di nascita: ");
                                    var $infodata = $("<li class='infostudente'>").text(iscrizione.datanascita);
                                    var $labelemail = $("<li class='labelstudente'>").text("Email: ");
                                    var $infoemail = $("<li class='infostudente'>").text(iscrizione.email);
                                    var $labelcellulare = $("<li class='labelstudente'>").text("Cellulare: ");
                                    var $infocellulare = $("<li class='infostudente'>").text(iscrizione.cellulare);
                                    var $labelcorso = $("<li class='labelstudente'>").text("Iscritto al corso per la Patente: ");
                                    var $infocorso = $("<li class='infostudente'>").text(iscrizione.patente);
                                    var $labelpatenti = $("<li class='labelstudente'>").text("Patenti già in possesso: ");
                                    var $infopatenti = $("<li class='infostudente'>").text(iscrizione.patentiinpossesso)

                                    $cont.append($infonome).append($labeldata).append($infodata).append($labelemail).append($infoemail).append($labelcellulare).append($infocellulare).append($labelcorso).append($infocorso).append($labelpatenti).append($infopatenti);
                                })

                            }).fail((jqXHR)=>{
                                //No, o almeno non è stata trovata
                                $cont.append($("<li class='errorstudente'>").text("Nessun studente trovato!"));
                            })

                        }
                        else {
                            window.alert("L'utente deve fare il log-in");
                            
                            // Navigate to login page
                            window.location.href = "/login";
                        }

                    }
                });

                //Append elementi html al content
                $("main .content").append($cont);
                

                

            }else if($element.parent().is(":nth-child(2)")){ //VISUALIZZA CORSI

                $cont = $("<ul>");
                
                //GET Ajax all'url offerto da server_client per l'ottenimento dei corsi
                $.getJSON("/getCorsi", (corsi)=>{

                    corsi.forEach((corso)=>{ //Per ogni corso creo una label e stampo le informazioni ad esso correlate

                        var $listidcorso = $("<li class='listidcorso'>").text("ID: "+corso.id);
                        var $infocorso = $("<li class='infocorso'>").text("Patente: "+corso.patente+" - Info: "+corso.descrizione);

                        $cont.append($listidcorso).append($infocorso);

                    })
                    
                }).fail((jqXHR)=>{
                    $cont.append($("<li class='errorcorsi'>").text("Nessun corso trovato!"));
                })

                //Append elementi html al content
                $("main .content").append($cont);

            

            }else if($element.parent().is(":nth-child(3)")){//TAB SIMULAZIONE DOMANDE

                $cont=$("<ul>");

                //Chiamata AJAX - GET per raccogliere le domande
                $.ajax({
                    method: "GET",
                    url: "/autenticazioneAvvenuta",
                    dataType: "json",
                    success: (response) => {
                        if (response.auth === true){

                            //GET per ottenere l'array di domande
                            $.getJSON("/getDomande", (domande)=>{
                                var i=0;
                                //Scorro l'array di domande
                                domande.forEach((domanda)=>{

                                    //div con display flex per lo spazio tra i bottoni
                                    var $div = $("<div class='d-flex gap-2'>")
                                    //Richiesta della domanda
                                    var $domric = $("<li class='domrichiesta'> <br />").text("Domanda "+ ++i +": ")
                                    var $richiesta = $("<li class='richiesta'>").text(domanda.domanda);

                                    if(domanda.risposta == "vero"){ 
                                        
                                        //Se la risposta alla domanda è vero
                                        var $vero = $("<input type='checkbox' name='vero"+i+"' value='corretta' /> Vero <br />"); //vero sarà la risposta corretta
                                        var $falso = $("<input type='checkbox' name='falso"+i+"' value='sbagliata' /> Falso <br />"); //falso sarà la risposta sbagliata
                                    
                                    }else{ 

                                        //Se la risposta alla domanda è falso
                                        var $vero = $("<input type='checkbox' name='vero"+i+"' value='sbagliata' /> Vero <br />"); //vero sarà la riposta sbagliata
                                        var $falso = $("<input type='checkbox' name='falso"+i+"' value='corretta' /> Falso <br />"); //falso sarà la risposta corretta

                                    }

                                    //Appendo
                                    $cont.append($domric).append($richiesta).append($vero).append($falso);

                                });

                                //Dopo aver risposto a tutte le domande clicco il bottone di consegna
                                var $bottonefine = $("<button class='fine'>").text("Consegna Test");
                                $cont.append($bottonefine);

                                //inizializzo i counter delle risposte corrette ed errate
                                var counterCorrette = 0;
                                var counterErrate = 0;

                                document.querySelectorAll('button.fine').forEach((bottone)=>{

                                    bottone.addEventListener("click", (e)=>{

                                        var valoriCheckbox = []; //inizializzo il vettore delle selezioni
                                            $("input[type=checkbox]:checked").each(function() { //per ogni checkbox checked
                                                valoriCheckbox.push($(this).val()); //inserisco il valore nel vettore
                                            });
                                            console.log("Valori Checkbox selezionati: " + valoriCheckbox.join(", ")); //debug

                                            //Conto le risposte corrette e quelle errate
                                            valoriCheckbox.forEach(function(risp){
                                                if(risp=="corretta"){
                                                    counterCorrette++;
                                                }else{
                                                    counterErrate++;
                                                }
                                            });

                                        //Hai risposto a tutte le domande?
                                        if(counterCorrette+counterErrate >= 40){

                                            //Sì, ho risposto a tutte le domande, facciamo il display dei risultati
                                            var $labelcountercorr = $("<li class='countercorrette'>").text("Numero domande corrette: "+counterCorrette);
                                            var $labelcountererr = $("<li class='countererrate'>").text("Numero domande errate: "+counterErrate);
                                            $cont.append($labelcountercorr).append($labelcountererr);

                                        }else{
                                            //No, ci sono delle domande senza risposta
                                            $cont.append($("<li class='errorquiz'>").text("Devi rispondere a tutte le domande!")).hide().fadeIn(1500).fadeOut(2000);

                                        }

                                    })

                                });

                                


                            }).fail((jqXHR)=>{
                                //Fail nella ricerca delle domande -> messaggio di errore
                                $cont.append($("<li class='errorquiz'>").text("Non sono state trovate domande del quiz!")).hide().fadeIn(1500).fadeOut(2000);
                            });




                        }else{

                            window.alert("L'utente deve fare il log-in");
                            
                            //Vai alla finestra di login
                            window.location.href = "/login";
                        }

                    }
                
                });

                $("main .content").append($cont);


                
            }else if($element.parent().is(":nth-child(4)")){ //VISUALIZZA ISTRUTTORI

                $cont=$("<ul>");

                $.ajax({
                    method: "GET",
                    url: "/autenticazioneAvvenuta",
                    dataType: "json",
                    success: (response) => {
                        if (response.auth === true){

                            //GET per ottenere l'array di istruttori
                            $.getJSON("/getIstruttori", (istruttori)=>{

                                //Scorro l'array di istruttori
                                istruttori.forEach((istruttore)=>{

                                    var $listidistr = $("<li class='listidistruttore'>").text("ID: "+istruttore.id);
                                    var $infoistr = $("<li class='infoistruttore'>").text(istruttore.nome+" "+istruttore.cognome+" - Cellulare: "+istruttore.cellulare+" - Email: "+istruttore.email);

                                    //Appendo il content
                                    $cont.append($listidistr).append($infoistr);

                                })

                            }).fail((jqXHR)=>{
                                $cont.append($("<li class='erroristruttori'>").text("Nessun istruttore trovato!"));
                            })

                        }else{

                            window.alert("L'utente deve fare il log-in");
                            
                            //Vai alla finestra di login
                            window.location.href = "/login";
                        }
                    }
                
                });


                $("main .content").append($cont);

            }else if($element.parent().is(":nth-child(5)")){//PRENOTAZIONE LEZIONI

                $cont=$("<div>");

                $.ajax({
                    method: "GET",
                    url: "/autenticazioneAvvenuta",
                    dataType: "json",
                    success: (response) => {
                        if (response.auth === true){
                            
                            //Label e input box per i campi da riempire

                            var $labelistruttore=$("<p class='labeltext'>").text("ID Istruttore");
                            var $inputistruttore=$("<input type='number' id='inputIstruttore' name='inputIstruttore' min='1'>");

                            var $labeldata = $("<p class='labeltext'>").text("Data");
                            var $inputdata = $("<input class='calendar' type='date'>");

                            var $labelorario=$("<p class='labeltext'>").text("Orario");
                            var $inputorario=$("<input class='inputpagelle' placeholder='Inserisci orario...'>");

                            var $buttonprenota=$("<button class='prenota btn btn-outline-info'>").text("Prenota");

                            //Aggiungo un listener sul click del bottone
                            $buttonprenota.on("click",function(){

                                //Sono stati compilati tutti i campi?
                                if($inputistruttore.val()!="" && $inputdata.val()!="" && $inputorario.val()!="" ){

                                    //Sì,tutto compilato
                                    //Creo l'oggetto prenotazione
                                    var pren={studente: response.username,
                                        idIstruttore: $inputistruttore.val(),
                                        giorno: $inputdata.val(),
                                        orario: $inputorario.val()}

                                    //Chiamata AJAX - POST per inviare la prenotazione

                                    $.ajax({
                                        url: "/creaPrenotazione",
                                        type:"POST",
                                        dataType:"json",
                                        data:pren
                                    }).done(function(){
                                        //Inserimento avvenuto con successo
                                        $("p.notify").text("Prenotazione sottoposta").hide().fadeIn(800).fadeOut(3000);
                                        $inputistruttore.val("");
                                        $inputdata.val("");
                                        $inputorario.val("");
                                    })

                                }else{
                                    //No, non tutti i campi sono stati compilati
                                    $("p.notify").text("Compila tutti i campi!").hide().fadeIn(800).fadeOut(3000);
                                }


                            });
            
                            $inputistruttore.on("keypress",function(event){
                                if(event.key=="Enter")
                                $inputdata.focus();
                            });
            
                            $inputdata.on("keypress",function(event){
                                if(event.key=="Enter")
                                $inputorario.focus();
                            });
            
                            $inputorario.on("keypress",function(event){
                                if(event.key=="Enter")
                                $buttonprenota.focus();
                            });
            
                            //append degli elemnti html
                            $cont.append($labelistruttore).append($inputistruttore).append($labeldata).append($inputdata).append($labelorario).append($inputorario).append($buttonprenota);
                        
                        }else{

                            window.alert("L'utente deve fare il log-in");
                            
                            //Vai alla finestra di login
                            window.location.href = "/login";
                        }
                    }
                });
                
                $("main .content").append($cont);

            }else if($element.parent().is(":nth-child(6)")){//GESTISCI PRENOTAZIONI

                //Lo studente può visualizzare le proprie prenotazioni e nel caso eliminarle

                $cont=$("<ul>");

                $.ajax({
                    method: "GET",
                    url: "/autenticazioneAvvenuta",
                    dataType: "json",
                    success: (response) => {
                        if (response.auth === true){

                            //GET per ottenere l'array di prenotazioni
                            $.getJSON("/getPrenotazioni/"+response.username, (prenotazioni)=>{

                                //Scorro l'array di prenotazioni
                                prenotazioni.forEach((prenotazione)=>{

                                    //Bottone per l'eliminazione della prenotazione, con dentro l'id univoco della prenotazione da eliminare
                                    var $button = $("<button class='deleteprenotazione btn btn-outline-danger' id='"+prenotazione.id+"'>").text("Elimina");
                                    //div con display flex per lo spazio tra i bottoni
                                    var $div = $("<div class='d-flex gap-2'>")
                                    
                                    //Info prenotazione
                                    var $infopren = $("<li class='infopren'>").text("Istruttore n°: "+prenotazione.idIstruttore+" - Giorno: "+prenotazione.giorno+"- Orario: "+prenotazione.orario);
                                    //Appendo lo stato della prenotazione per differenziarle
                                    $cont.append($("<li class='"+prenotazione.stato.toString().toLowerCase()+"'>").text(prenotazione.stato));

                                    //Appendo il resto degli elementi html
                                    $div.append($infopren).append($button);
                                    $cont.append($div);

                                });
            
                                //Selezioni i bottoni di eliminazione
                                document.querySelectorAll('button.deleteprenotazione').forEach((bottone)=>{

                                    //Listener del click del bottone
                                    bottone.addEventListener("click", (e)=>{
            
                                        //Oggetto in cui salvo l'id delle prenotazioni da cancellare
                                        var el={id:e.target.getAttribute('id')}
                                        console.log(el);
            
                                        //DELETE Ajax
                                        $.ajax({
                                            url:"/deletePrenotazione",
                                            type:"DELETE",
                                            dataType:"json",
                                            data:el
                                        }).done(()=>{
                                            //Se l'operazione va a buon fine refresho la pagina e manndo un messaggio di successo
                                            $(".tabs a:nth-child(6) span").trigger("click");
                                            $(".notify").text("Prenotazione eliminata con successo!").hide().fadeIn(800).fadeOut(3000);
                                        }).fail((jqXHR)=>{
                                            //Se fallisce mando un messaggio di errore
                                            $(".notify").text("Prenotazione non eliminata!").hide().fadeIn(800).fadeOut(3000);
                                        })

                                    });

                                });

                            }).fail((jqXHR)=>{
                                //Fail nella ricerca delle prenotazioni -> messaggio di errore
                                $cont.append($("<li class='error'>").text("Non sono state trovate prenotazioni!")).hide().fadeIn(800).fadeOut(3000);
                            });

                                    }
                                }
                            });
                

                $("main .content").append($cont);


            }
            
            return false;

        })
    });

    $(".tabs a:first-child span").trigger("click");
    
}





//Quando il documento si è caricato
$(document).ready(main);
