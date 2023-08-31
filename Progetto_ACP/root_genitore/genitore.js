//Variabile globale per segnalare che l'iscrizione è stata approvata
var iscrizione_approvata=0;

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

                //Label e input box per i campi da riempire
                var $labelmatricola=$("<p class='labeltext'>").text("Matricola");
                var $inputmatricola=$("<input type='number' placeholder='Inserisci la matricola dello studente...'>");

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
                    if($inputmatricola.val()!="" && $inputnome.val()!="" && $inputcognome.val()!="" && $inputcodicefiscale.val()!="" && $inputdatanascita.val()!="" && $inputclasse.val()!="" ){

                        //Sì,tutto compilato
                        //Creo l'oggetto studente
                        var stud={matricola: $inputmatricola.val(), 
                            nome: $inputnome.val(), 
                            cognome: $inputcognome.val(),
                            codicefiscale: $inputcodicefiscale.val(),
                            datanascita: $inputdatanascita.val(),
                            classe: $inputclasse.val()}

                        //Chiamata AJAX - POST per inviare l'iscrizione

                        $.ajax({
                            url: "/effettuaIscrizione",
                            type:"POST",
                            dataType:"json",
                            data:element
                        }).done(function(){
                            //Inserimento avvenuto con successo
                            $("p.notify").text("Iscrizione effettuata").hide().fadeIn(800).fadeOut(3000);
                            $inputmatricola.val("");
                            $inputnome.val("");
                            $inputcognome.val("");
                            $inputcodicefiscale.val("");
                            $inputdatanascita.val("");
                            $inputclasse.val("");
                        })

                        iscrizione_approvata=1;

                    }else{
                        //No, non tutti i campi sono stati compilati
                        $("p.notify").text("Compila tutti i campi!").hide().fadeIn(800).fadeOut(3000);
                    }
                });

                $inputmatricola.on("keypress",function(event){
                    if(event.key=="Enter")
                        $selquad.focus();
                });

                $inputnome.on("keypress",function(event){
                    if(event.key=="Enter")
                        $selquad.focus();
                });

                $inputcognome.on("keypress",function(event){
                    if(event.key=="Enter")
                        $selquad.focus();
                });

                $inputcodicefiscale.on("keypress",function(event){
                    if(event.key=="Enter")
                        $selquad.focus();
                });

                $inputdatanascita.on("keypress",function(event){
                    if(event.key=="Enter")
                        $selquad.focus();
                });

                $inputclasse.on("keypress",function(event){
                    if(event.key=="Enter")
                        $selquad.focus();
                });



                //append degli elemnti html
                $cont.append($labelmatricola).append($inputmatricola).append($labelnome).append($inputnome).append($labelcognome).append($inputcognome).append($labelcodicefiscale).append($inputcodicefiscale).append($labeldatanascita).append($inputdatanascita).append($labelclasse).append($inputclasse).append( $buttoniscrizione);
                $("main .content").append($cont);
                

            }else if($element.parent().is(":nth-child(2)")){

                //Visualizza Quadri
                $cont = $("<ul>");

                if(iscrizione_approvata==0){

                    $("p.notify").text("Effettua prima l'iscrizione!").hide().fadeIn(800).fadeOut(3000);

                }else{
                
                    //GET Ajax all'url offerto da server_segreteria per l'ottenimento della lista di quadri
                    $.getJSON("/getPagella", (pagelle)=>{

                        pagelle.forEach((pagella)=>{

                            var $listidpagelle = $("<li class='listidprenotazione'>").text("ID: "+pagella.id);
                            var $infopagella = $("<li class='infopagella'>").text("Matricola: "+pagella.studente.matricola+" - "+pagella.quadrimestre+" quadrimestre - Anno scolastico: "+pagella.annoscolastico);
                            var $votoita = $("<li class='listvotoita'>").text("Italiano: "+pagella.materie.votoitaliano);
                            var $votomat = $("<li class='listvotomat'>").text("Matematica: "+pagella.materie.votomatematica);
                            var $votoing = $("<li class='listvotoing'>").text("Inglese: "+pagella.materie.votoinglese);
                            var $votosto = $("<li class='listvotosto'>").text("Storia: "+pagella.materie.votostoria);

                            $cont.append($listidpagelle).append($infopagella).append($votoita).append($votomat).append($votoing).append($votosto);
                        })
                        
                    }).fail((jqXHR)=>{
                        $cont.append($("<li class='error'>").text("Nessun quadro trovato!"));
                    })

                }

                //Append elementi html al content
                $("main .content").append($cont); 

            

            }else if($element.parent().is(":nth-child(3)")){

                //Qui visualizzerò le attività 

                $cont=$("<ul>");

                if(iscrizione_approvata==0){

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
                            //Appendo il tipo della news per differenziarle e lo scrivo insieme alla data
                            $cont.append($("<li class='"+attivita.tipo.toString().toLowerCase()+"'>").text(attivita.tipo+" "+attivita.data));

                            //Appendo il resto degli elementi html
                            $div.append($actdesc).append($button);
                            $cont.append($div);

                        });

                    }).fail((jqXHR)=>{
                        //Fail nella ricerca delle attività -> messaggio di errore
                        $cont.append($("<li class='error'>").text("Non sono state trovate attività!")).hide().fadeIn(1500).fadeOut(2000);
                    });

                }

                $("main .content").append($cont);
                
            }
            return false;

        })
    });

    $(".tabs a:first-child span").trigger("click");
    
}

//Notifica approvazione della pagella







//Quando il documento si è caricato
$(document).ready(function(){
    main();
});
