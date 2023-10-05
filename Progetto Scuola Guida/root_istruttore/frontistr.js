//Variabile globale che servirà per notificare una nuova iscrizione
var num_prenotazioni=0;

var main = function(){

    //"use strict"

    //Dichiaro una variabile che mi servirà per l'append del content
    var $cont;

    //Trasformo i tabs in un array e li scorro

    $(".tabs a span").toArray().forEach((element)=>{

        //Setto un handler del click per ogni tab
        $(element).on("click", ()=>{

            //Rimuovo la classe active dai tab per gestire l''higlighting tramite foglio CSS
            $(".tabs a span").removeClass("active");
            $(element).addClass("active"); //Rendo active soltanto il tab cliccato
            $("main .content").empty();

            //Gestito il comportamento in base al tab cliccato
            if($(element).parent().is(":nth-child(1)")){
                
                //GESTISCI PRENOTAZIONI - L'istruttore visualizza le prenotazioni pendenti e le accetta o le rifiuta
                
                $cont=$("<div>");

                 //GET Ajax all'url offerto da server_istruttori per l'acquisizione delle prenotazioni pendenti
                 $.getJSON("/getPrenotazioni/attesa", (lezioni)=>{

                    
                    var $labelprenotazioniattesa = $("<ul class='labelprenattesa'>").text("PRENOTAZIONI IN ATTESA");
                    $cont.append($labelprenotazioniattesa);

                    //scorro l'array di iscrizioni
                    lezioni.forEach((lezione)=>{
                        
                        //Elementi HTML per gestire le iscrizioni
                        var $labelpren = $("<li class='labelpren' id='"+lezione.id+"'>").text("Istruttore: " +lezione.idIstruttore+"\nLezione di guida di "+lezione.studente+" - Stato: "+lezione.stato);
                        var $buttonaccetta = $("<button name='accetta' id='buttonaccetta' class='"+lezione.id+"'>").text("Accetta");
                        var $buttonrifiuta = $("<button name='rifiuta' id='buttonrifiutaiscr' class='"+lezione.id+"'>").text("Rifiuta");

                        //Appendo al content gli elementi creati
                        $cont.append($labelpren).append($buttonaccetta).append($buttonrifiuta);

                        })
                        
                    
                    }).then(()=>{

                        //Seleziono tutti i bottoni
                        document.querySelectorAll("button").forEach((button)=>{
    
                            //Aggiungo un listener sul click differenziando il comportamento per classe
                            button.addEventListener("click", (element)=>{
    
                                //Se si tratta del bottone 'assegna' -> PUT cambiando lo stato in ACCETTATA
                                if (element.target.getAttribute("name")=="accetta"){
    
                                    //Creo l'oggetto contente l'id della prenotazione
                                    var el = {"id":element.target.getAttribute("class")}
                                    
                                    //Chiamata Ajax - PUT
                                    $.ajax({
                                        url:"accettaPrenotazione",
                                        type:"PUT",
                                        dataType:"json",
                                        data:el
                                    }).done(()=>{
                                        //Se tutto va bene -> refresh della pagina triggerando fittiziamente il click
                                        $(".tabs a:nth-child(1) span").trigger("click");
                                        $(".notify").text("Prenotazione accettata!").hide().fadeIn(800).fadeOut(3000);
                                    }).fail(()=>{
                                        //In caso di fallimento
                                        $(".notify").text("Operazione non andata a buon fine!").hide().fadeIn(800).fadeOut(3000);
                                    })
    
                                }//Se si tratta del bottone 'rifiuta' -> PUT cambiando lo stato in RIFIUTATA
                                else if(element.target.getAttribute("name")=="rifiuta"){
    
                                    //Creo l'oggetto contente la matricola dell'iscritto target
                                    var el = {"id":element.target.getAttribute("class")}
    
                                    //Chiamata Ajax -PUT
                                    $.ajax({
                                        url:"rifiutaPrenotazione",
                                        type:"PUT",
                                        dataType:"json",
                                        data:el
                                    }).done(()=>{
                                        //Se tutto va bene -> refresh della pagina triggerando fittiziamente il click
                                        $(".tabs a:nth-child(1) span").trigger("click");
                                        $(".notify").text("Prenotazione rifiutata").hide().fadeIn(800).fadeOut(3000);
                                    }).fail(()=>{
                                        //In caso di fallimento
                                        $(".notify").text("Operazione non andata a buon fine!").hide().fadeIn(800).fadeOut(3000);
                                    })
    
                                }
    
                            })
    
                        })
    
                    }).fail((jqXHR)=>{
                        $cont.append($("<li class='error'>").text("Nessuna prenotazione da gestire!")).hide().fadeIn(800);
                    })
    
                    //Append della nostra variabile al content
                    $("main .content").append($cont);


            }else if($(element).parent().is(":nth-child(2)")){
                //LISTA PRENOTAZIONI ACCETTATE - L'istruttore visualizza le prenotazioni accettate degli studenti ordinate per istruttore

                $cont = $("<div>");

                //bool per controllo fail
                var assegnfound = true;

                //GET Ajax all'url offerto da server_istruttori per la lista delle prenotazioni accettate
                $.getJSON("/getPrenotazioni/accettata", (lezioni)=>{

                    var istr=[];

                    //Creo un vettore con gli istruttori che hanno delle lezioni di guida
                    lezioni.forEach((lezione)=>{

                            //Aggiungo l'istruttore al vettore 
                            if(istr.indexOf(lezione.idIstruttore)==-1){
                                istr.push(lezione.idIstruttore);
                            } 
                    });

                    //debug
                    console.log(istr);

                    //Creo una struttura che abbia come chiave l'istruttore scelto per la lezione di guida
                    var istrObjects=istr.map(function(is){
                        var lezwithistr =[];

                            lezioni.forEach((lezione)=>{
                                if(lezione.idIstruttore==is){
                                    lezwithistr.push(lezione);
                                }
                            })

                        return{"istruttore": is, "prenotazioni": lezwithistr};
                    });

                    istrObjects.forEach(function(is){
                        var $istrName=$("<h3>").text(is.istruttore),
                            $content=$("<ul>");

                        is.prenotazioni.forEach(function(pren){
                            var $li= $("<li>").text("Lezione di guida di "+pren.studente+" il giorno "+pren.giorno.toString()+" alle ore "+ pren.orario);
                            $content.append($li);
                        })

                        //Quindi appendiamo le nostre variabili al content
                        $("main .content").append($istrName);
                        $("main .content").append($content);
                    });

                    


                }).fail((jqXHR)=>{
                    assegnfound=false;
                    $cont.append($("<li class='error'>").text("Nessuna prenotazione da gestire!")).hide().fadeIn(800);
                    
                })


                //Appendiamo quindi cont
                $("main .content").append($cont);

            }else if($(element).parent().is(":nth-child(3)")){

                //VISUALIZZA CORSI - La segreteria visualizza la lista dei corsi della scuola guida
                $cont = $("<div>");

                //GET Ajax all'URL offerto da server_segreteria per l'ottenimento della lista degli studenti assegnati
                $.getJSON("/getCorsi", (corsi)=>{

                    var $labelcor = $("<ul class='labelcorsi'>").text("CORSI");
                    $cont.append($labelcor);
                        corsi.forEach((corso)=>{

                            var $infoboxcor = $("<li class='infoboxcorso'>").text(corso.id+"- Corso per la patente "+corso.patente+" \n "+corso.descrizione);

                            $cont.append($infoboxcor);
                        })

                }).fail((jqXHR)=>{
                    $(".notify").text(" Nessun corso trovato! ").hide().fadeIn(300).fadeOut(800);
                })

                
                //Append della nostra variabile al content
                $("main .content").append($cont);
                
            }

            return false; //Evita la ripropagazione del click sui tabs

        })

    });

    $(".tabs a:first-child span").trigger("click"); //Trigger per settare il tab di default (Gestisci Prenotazioni) quando viene aperta la pagina

}

//Funzione per la notifica di una nuova iscrizione
var check = function(firstcall){

    //GET Ajax delle iscrizioni in attesa
    $.getJSON("/getPrenotazioni/attesa", (pren)=>{

        //Se è la prima chiamata alla funzione, pongo il contatore di iscrizioni pari alla lunghezza dell'array di iscrizioni
        if(firstcall){

            num_prenotazioni=pren.length;

        }else if(num_prenotazioni!=pren.length){

            //Se il contatore è cambiato invio la notifica
            num_prenotazioni=pren.length;
            var el = document.querySelector(".active");

            //Se mi trovo già sul primo tab triggero il click fittiziamente
            if(el.getAttribute("id")=="gestisciprenotazionitab"){
                $(el).trigger("click");
                $(".alert").text("Nuova prenotazione in attesa").fadeOut(800);
                $(".alert").on("click",()=>{
                    $(".alert").text("");
                })

            }else{
                //Se invece mi trovo su un'altro tab notifico la modifica
                $(".alert").text("Aggiornate le prenotazioni").fadeOut(800);
                $(".alert").on("click", ()=>{

                    $(".alert").text("");
    

                });

            }

        }

    });

}


//Avvio del main 
$(document).ready(()=>{
    main(check(true));
});

setInterval(()=>{
    check(false);
}, 1000);

