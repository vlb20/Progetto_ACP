//Variabile globale per segnalare che l'iscrizione è stata approvata
var iscrizione_sottoposta=0;
var iscrizione_accettata=0;
var matricola_personale=0;
var codicefiscalestud=0;
var num_attivita=0;

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

            //TAB 1: ISCRIZIONE STUDENTE
            if($element.parent().is(":nth-child(1)")){

                $cont=$("<div>");

                if(iscrizione_sottoposta==0){

                //Label e input box per i campi da riempire
                var $labelnome=$("<p class='labeltext'>").text("Nome");
                var $inputnome=$("<textarea class='textbox' placeholder='Inserisci nome ...'>");


                var $labelcognome=$("<p class='labeltext'>").text("Cognome");
                var $inputcognome=$("<textarea class='textbox' placeholder='Inserisci cognome ...'>");


                var $labelcodicefiscale=$("<p class='labeltext'>").text("Codice Fiscale");
                var $inputcodicefiscale=$("<textarea class='textbox' placeholder='Inserisci il codice fiscale dello studente...'>");

                var $labeldatanascita = $("<p class='labeltext'>").text("Data di Nascita");
                var $inputdatanascita = $("<input class='calendar' type='date'>");

                var $labelclasse=$("<p class='labeltext'>").text("Classe");
                var $inputclasse=$("<input class='inputpagelle' placeholder='Inserisci la classe dello studente...'>");

                var $buttoniscrizione=$("<button class='subscribe btn btn-outline-info'>").text("Invia");

                //Aggiungo un listener sul click del bottone
                $buttoniscrizione.on("click",function(){

                    //Sono stati compilati tutti i campi?
                    if($inputnome.val()!="" && $inputcognome.val()!="" && $inputcodicefiscale.val()!="" && $inputdatanascita.val()!="" && $inputclasse.val()!="" ){

                        //Sì,tutto compilato
                        //Creo l'oggetto studente
                        var stud={nome: $inputnome.val(), 
                            cognome: $inputcognome.val(),
                            codicefiscale: $inputcodicefiscale.val(),
                            datanascita: $inputdatanascita.val(),
                            classe: $inputclasse.val()}

                        //Chiamata AJAX - POST per inviare l'iscrizione

                        $.ajax({
                            url: "/effettuaIscrizione",
                            type:"POST",
                            dataType:"json",
                            data:stud
                        }).done(function(){
                            //Inserimento avvenuto con successo
                            $("p.notify").text("Iscrizione sottoposta").hide().fadeIn(800).fadeOut(3000);
                            $inputnome.val("");
                            $inputcognome.val("");
                            codicefiscalestud=$inputcodicefiscale.val();
                            $inputcodicefiscale.val("");
                            $inputdatanascita.val("");
                            $inputclasse.val("");
                        })

                        iscrizione_sottoposta=1;

                    }else{
                        //No, non tutti i campi sono stati compilati
                        $("p.notify").text("Compila tutti i campi!").hide().fadeIn(800).fadeOut(3000);
                    }
                });

                $inputnome.on("keypress",function(event){
                    if(event.key=="Enter")
                    $inputcognome.focus();
                });

                $inputcognome.on("keypress",function(event){
                    if(event.key=="Enter")
                    $inputcodicefiscale.focus();
                });

                $inputcodicefiscale.on("keypress",function(event){
                    if(event.key=="Enter")
                    $inputdatanascita.focus();
                });

                $inputdatanascita.on("keypress",function(event){
                    if(event.key=="Enter")
                    $inputclasse.focus();
                });

                $inputclasse.on("keypress",function(event){
                    if(event.key=="Enter")
                        $buttoniscrizione.focus();
                });

                //append degli elemnti html
                $cont.append($labelnome).append($inputnome).append($labelcognome).append($inputcognome).append($labelcodicefiscale).append($inputcodicefiscale).append($labeldatanascita).append($inputdatanascita).append($labelclasse).append($inputclasse).append( $buttoniscrizione);
                $("main .content").append($cont);

            }else{

                //Visualizza Iscrizione approvata o meno

                //GET Ajax all'url offerto da server_segreteria per l'ottenimento della lista di quadri
                $.getJSON("/getIscrizione", (iscrizioni)=>{

                    iscrizioni.forEach((studente)=>{

                        if(studente.codicefiscale==codicefiscalestud){
                            
                            var $matricolastud = $("<li class='listamatricolestudenti'>").text("Matricola "+studente.matricola);
                            var $infoboxstud = $("<li class='infoboxstudente'>").text(studente.nome+" "+studente.cognome+" CF:"+studente.codicefiscale+" Nato il:"+studente.datanascita+" Classe:"+studente.classe);

                            var stato_richiesta = studente.stato;


                            //Qual è lo stato dell'iscrizione?
                            if(stato_richiesta=="ASSEGNATO"){

                                //Iscrizione effettuata con successo
                                $("p.notify").text("Iscrizione effettuata con successo").hide().fadeIn(800).fadeOut(3000);
                                $cont.append($matricolastud).append($infoboxstud);
                                $("main .content").append($cont);
                                matricola_personale=studente.matricola;
                                iscrizione_accettata=1;

                            }else if(stato_richiesta=="RIGETTATO"){

                                //Iscrizione rigettata
                                $("p.notify").text("Siamo spiacenti, la tua iscrizione è stata rigettata.").hide().fadeIn(800);
                    

                            }else if(stato_richiesta=="ATTESA"){

                                //Iscrizione in attesa
                                $("p.notify").text("Ancora un po' di pazienza, la tua iscrizione verrà elaborata al più presto.").hide().fadeIn(800);
                    

                            }

                            
                        }

                    })
                    
                }).fail((jqXHR)=>{
                    $cont.append($("<li class='error'>").text("Nessun quadro trovato!"));
                })


            }

            }else if($element.parent().is(":nth-child(2)")){

                //Visualizza Quadri
                $cont = $("<ul>");

                if(iscrizione_accettata==0){

                    $("p.notify").text("Effettua prima l'iscrizione!").hide().fadeIn(800).fadeOut(3000);

                }else{
                
                    //GET Ajax all'url offerto da server_segreteria per l'ottenimento della lista di quadri
                    $.getJSON("/getPagella", (pagelle)=>{

                        pagelle.forEach((pagella)=>{

                            if(pagella.studente.matricola==matricola_personale){
                                
                            var $listidpagelle = $("<li class='listidprenotazione'>").text("ID: "+pagella.id);
                            var $infopagella = $("<li class='infopagella'>").text("Matricola: "+pagella.studente.matricola+" - "+pagella.quadrimestre+" quadrimestre - Anno scolastico: "+pagella.annoscolastico);
                            var $votoita = $("<li class='listvotoita'>").text("Italiano: "+pagella.materie.votoitaliano);
                            var $votomat = $("<li class='listvotomat'>").text("Matematica: "+pagella.materie.votomatematica);
                            var $votoing = $("<li class='listvotoing'>").text("Inglese: "+pagella.materie.votoinglese);
                            var $votosto = $("<li class='listvotosto'>").text("Storia: "+pagella.materie.votostoria);

                            $cont.append($listidpagelle).append($infopagella).append($votoita).append($votomat).append($votoing).append($votosto);
                        
                            }

                        })
                        
                    }).fail((jqXHR)=>{
                        $cont.append($("<li class='errorpag'>").text("Nessun quadro trovato!"));
                    })

                }

                //Append elementi html al content
                $("main .content").append($cont); 

            

            }else if($element.parent().is(":nth-child(3)")){

                //Qui visualizzerò le attività 

                $cont=$("<ul>");

                if(iscrizione_accettata==0){

                    $("p.notify").text("Effettua prima l'iscrizione!").hide().fadeIn(800).fadeOut(3000);

                }else{

                    //GET per ottenere l'array di attività
                    $.getJSON("/getAttivita", (activities)=>{

                        //Scorro l'array di attività
                        activities.forEach((attivita)=>{

                            //div con display flex per lo spazio tra i bottoni
                            var $div = $("<div class='d-flex gap-2'>")
                            //Descrizione dell'attività
                            var $actdesc = $("<li class='attivitadesc'>").text(attivita.descrizione);
                            //Appendo 
                            $cont.append($("<li class='"+attivita.tipo.toString().toLowerCase()+"'>").text(attivita.tipo+" "+attivita.data)).append($actdesc);

                        });

                    }).fail((jqXHR)=>{
                        //Fail nella ricerca delle attività -> messaggio di errore
                        $cont.append($("<li class='erroract'>").text("Non sono state trovate attività!")).hide().fadeIn(1500).fadeOut(2000);
                    });

                }

                $("main .content").append($cont);
                
            }
            return false;

        })
    });

    $(".tabs a:first-child span").trigger("click");
    
}

//Notifica nuove attività
var check = function(firstcall){

    //GET Ajax delle iscrizioni in attesa
    $.getJSON("/getAttivita", (attivitas)=>{

        //Se è la prima chiamata alla funzione, pongo il contatore di iscrizioni pari alla lunghezza dell'array di iscrizioni
        if(firstcall){

            num_attivita=attivitas.length;

        }else if(num_attivita!=attivitas.length){

            //Se il contatore è cambiato invio la notifica
            num_attivita=attivitas.length;
            var el = document.querySelector(".active");

            if(iscrizione_accettata!=0){
                //Se mi trovo già sul primo tab triggero il click fittiziamente
                if(el.getAttribute("id")=="attivitatab"){
                    $(el).trigger("click");
                    $(".alert").text("Nuova attivita'!");
                    $(".alert").on("click",()=>{
                        $(".alert").text("");
                    })

                }else{
                    //Se invece mi trovo su un'altro tab notifico la modifica
                    $(".alert").text("Aggiornate le attivita");
                    $(".alert").on("click", ()=>{

                        $(".alert").text("");
                    });

                }
            }
            

        }

    });

}






//Quando il documento si è caricato
$(document).ready(function(){
    main();
});