
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
                
                //GESTISCI STUDENTI - La segreteria inserisce manualmente le informazioni dello studente
                
                $cont=$("<div>");

                //Label e input box per i campi da riempire
                var $labelnome=$("<p class='labeltext'>").text("Nome");
                var $inputnome=$("<input class='textbox' placeholder='Inserisci nome ...'>");


                var $labelcognome=$("<p class='labeltext'>").text("Cognome");
                var $inputcognome=$("<input class='textbox' placeholder='Inserisci cognome ...'>");

                var $labeldatanascita = $("<p class='labeltext'>").text("Data di Nascita");
                var $inputdatanascita = $("<input class='calendar' type='date'>");

                var $labelemail=$("<p class='labeltext'>").text("Email");
                var $inputemail=$("<input class='textbox' placeholder='Inserisci email...'>");

                var $labelcellulare=$("<p class='labeltext'>").text("Cellulare");
                var $inputcellulare=$("<input class='textbox' placeholder='Inserisci recapito dello studente...'>");

                //Per le patenti implemento una selezione
                var $labelpatente=$("<p class='labeltext'>").text("Patente");
                var $selpatente = $("<select class='selezione' name='choice'> <option value='AM'>AM</option> <option value='A1' selected>A1</option> <option value='A2' selected>A2</option> <option value='A' selected>A</option> <option value='B' selected>B</option>  </select>");

                var $labelpatentiinpossesso=$("<p class='labeltext'>").text("Patenti già in possesso");
                
                //Creo un vettore che raccolga gli input immessi tramite checkboxes

                var $AM = $("<input type='checkbox' name='AM' value='AM'/>AM <br />");
                var $A1 = $("<input type='checkbox' name='A1' value='A1'/>A1 <br />");
                var $A2 = $("<input type='checkbox' name='A2' value='A2'/>A2 <br />");
                var $A = $("<input type='checkbox' name='A' value='A'/>A <br />")
                var $B = $("<input type='checkbox' name='B' value='B'/>B <br /> <br />")

                
                var $buttoniscrizione=$("<button class='subscribe btn btn-outline-info'>").text("Invia");

                //Aggiungo un listener sul click del bottone
                $buttoniscrizione.on("click",function(){

                    var valoriCheckbox = [];
                    $("input[type=checkbox]:checked").each(function() {
                        valoriCheckbox.push($(this).val());
                      });
                      console.log("Valori Checkbox selezionati: " + valoriCheckbox.join(", "));

                    //Sono stati compilati tutti i campi?
                    if($inputnome.val()!="" && $inputcognome.val()!="" && $inputemail.val()!="" && $inputdatanascita.val()!="" && $inputcellulare.val()!=""){

                        //Sì,tutto compilato
                        //Creo l'oggetto studente
                        var stud={nome: $inputnome.val(), 
                            cognome: $inputcognome.val(),
                            datanascita: $inputdatanascita.val(),
                            email: $inputemail.val(),
                            cellulare: $inputcellulare.val(),
                            patente: $selpatente.val(),
                            patentiinpossesso: valoriCheckbox.toString()
                        }

                        //Chiamata AJAX - POST per inviare l'iscrizione

                        $.ajax({
                            url: "/inserisciStudenti",
                            type:"POST",
                            dataType:"json",
                            data:stud
                        }).done(function(){
                            //Inserimento avvenuto con successo
                            $("p.notify").text("Iscrizione sottoposta").hide().fadeIn(800).fadeOut(3000);
                            $inputnome.val("");
                            $inputcognome.val("");
                            $inputdatanascita.val("");
                            $inputemail.val("");
                            $inputcellulare.val("");
                        })

                        $(".tabs a:first-child span").trigger("click");

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
                    $inputdatanascita.focus();
                });

                $inputdatanascita.on("keypress",function(event){
                    if(event.key=="Enter")
                    $inputemail.focus();
                });

                $inputemail.on("keypress",function(event){
                    if(event.key=="Enter")
                    $inputcellulare.focus();
                });

                $inputcellulare.on("keypress",function(event){
                    if(event.key=="Enter")
                    $buttoniscrizione.focus();
                });

                //append degli elemnti html
                $cont.append($labelnome).append($inputnome).append($labelcognome).append($inputcognome).append($labeldatanascita).append($inputdatanascita).append($labelemail).append($inputemail).append($labelcellulare).append($inputcellulare).append($labelpatente).append($selpatente).append($labelpatentiinpossesso).append($AM).append($A1).append($A2).append($A).append($B).append( $buttoniscrizione);
                $("main .content").append($cont);



            }else if($(element).parent().is(":nth-child(2)")){
                //LISTA STUDENTI - La segreteria visualizza la lista degli studenti iscritti

                $cont = $("<div>");

                //GET Ajax all'url offerto da server_segreteria per l'ottenimento della lista degli studenti assegnati
                $.getJSON("/getStudenti", (studenti)=>{

                    var $labelstud = $("<ul class='labelstudenti'>").text("STUDENTI ISCRITTI");
                    $cont.append($labelstud);
                        studenti.forEach((studente)=>{

                            var $infoboxstud = $("<li class='infoboxstudente'>").text(studente.nome+" "+studente.cognome+"  Nato il:"+studente.datanascita+
                            " \n email:"+studente.email+" cellulare:"+studente.cellulare+" \n patente:"+studente.patente+"\n patenti in possesso: "+studente.patentiinpossesso);

                            $cont.append($infoboxstud);
                        })

                }).fail((jqXHR)=>{
                    $(".notify").text(" Nessuno studente trovato! ").hide().fadeIn(800).fadeOut(3000);
                })
                //Append della nostra variabile al content
                $("main .content").append($cont);

            }else if($(element).parent().is(":nth-child(3)")){

                //GESTISCI ISTRUTTORI - La segreteria inserisce manualmente le informazioni dell'istruttore
                
                $cont=$("<div>");

                //Label e input box per i campi da riempire
                var $labelnome=$("<p class='labeltext'>").text("Nome");
                var $inputnome=$("<input class='textbox' placeholder='Inserisci nome ...'>");


                var $labelcognome=$("<p class='labeltext'>").text("Cognome");
                var $inputcognome=$("<input class='textbox' placeholder='Inserisci cognome ...'>");

                var $labelemail=$("<p class='labeltext'>").text("Email");
                var $inputemail=$("<input class='textbox' placeholder='Inserisci email...'>");

                var $labelcellulare=$("<p class='labeltext'>").text("Cellulare");
                var $inputcellulare=$("<input class='textbox' placeholder='Inserisci recapito...'>");

                var $buttoniscrizione=$("<button class='subscribe btn btn-outline-info'>").text("Invia");

                //Aggiungo un listener sul click del bottone
                $buttoniscrizione.on("click",function(){

                    //Sono stati compilati tutti i campi?
                    if($inputnome.val()!="" && $inputcognome.val()!="" && $inputemail.val()!=""  && $inputcellulare.val()!=""){

                        //Sì,tutto compilato
                        //Creo l'oggetto studente
                        var istr={nome: $inputnome.val(), 
                            cognome: $inputcognome.val(),
                            cellulare: $inputcellulare.val(),
                            email: $inputemail.val()
                        }

                        //Chiamata AJAX - POST per inviare l'iscrizione

                        $.ajax({
                            url: "/inserisciIstruttori",
                            type:"POST",
                            dataType:"json",
                            data:istr
                        }).done(function(){
                            //Inserimento avvenuto con successo
                            $("p.notify").text("Iscrizione sottoposta").hide().fadeIn(800).fadeOut(3000);
                            $inputnome.val("");
                            $inputcognome.val("");
                            $inputemail.val("");
                            $inputcellulare.val("");
                        })

                        $(".tabs a:first-child span").trigger("click");

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
                    $inputemail.focus();
                });

                $inputemail.on("keypress",function(event){
                    if(event.key=="Enter")
                    $inputcellulare.focus();
                });

                $inputcellulare.on("keypress",function(event){
                    if(event.key=="Enter")
                    $buttoniscrizione.focus();
                });

                //append degli elemnti html
                $cont.append($labelnome).append($inputnome).append($labelcognome).append($inputcognome).append($labelemail).append($inputemail).append($labelcellulare).append($inputcellulare).append( $buttoniscrizione);
                $("main .content").append($cont);
                

            }else if($(element).parent().is(":nth-child(4)")){
                //LISTA ISTRUTTORI - La segreteria visualizza la lista degli istruttori della scuola guida

                $cont = $("<div>");

                //GET Ajax all'URL offerto da server_segreteria per l'ottenimento della lista degli studenti assegnati
                $.getJSON("/getIstruttori", (istruttori)=>{

                    var $labelistr = $("<ul class='labelistruttori'>").text("ISTRUTTORI");
                    $cont.append($labelistr);
                        istruttori.forEach((istruttore)=>{

                            var $infoboxistr = $("<li class='infoboxistruttore'>").text(istruttore.nome+" "+istruttore.cognome+" cellulare:"+istruttore.cellulare+" \n email:"+istruttore.email);

                            $cont.append($infoboxistr);
                        })

                }).fail((jqXHR)=>{
                    $(".notify").text(" Nessun istruttore trovato! ").hide().fadeIn(800).fadeOut(3000);
                })
                //Append della nostra variabile al content
                $("main .content").append($cont);
            

            }else if($(element).parent().is(":nth-child(5)")){

                 //GESTISCI CORSI - La segreteria inserisce nuovi corsi nel sistema
                
                $cont=$("<div>");

                 //Label e input box per i campi da riempire
                var $labelpatente=$("<p class='labeltext'>").text("Patente");
                var $selpatente = $("<select class='selezione' name='choice'> <option value='AM'>AM</option> <option value='A1' selected>A1</option> <option value='A2' selected>A2</option> <option value='A' selected>A</option> <option value='B' selected>B</option>  </select>");

                var $labeldescrizione=$("<p class='labeltext'>").text("Descrizione");
                var $inputdescrizione=$("<input class='textbox' placeholder='Inserisci una descrizione ...'>");

                var $buttoncreazione=$("<button class='subscribe btn btn-outline-info'>").text("Crea");

                //Aggiungo un listener sul click del bottone
                $buttoncreazione.on("click",function(){

                     //Sono stati compilati tutti i campi?
                    if($inputdescrizione.val()!=""){

                         //Sì,tutto compilato
                         //Creo l'oggetto studente
                        var cor={patente: $selpatente.val(),
                            descrizione: $inputdescrizione.val()
                        }

                        //Chiamata AJAX - POST per inviare l'iscrizione

                        $.ajax({
                            url: "/inserisciCorsi",
                            type:"POST",
                            dataType:"json",
                            data:cor
                        }).done(function(){
                            //Inserimento avvenuto con successo
                            $("p.notify").text("Corso creato").hide().fadeIn(800).fadeOut(3000);
                            $inputdescrizione.val("");
                        })

                        $(".tabs a:first-child span").trigger("click");

                    }else{
                        //No, non tutti i campi sono stati compilati
                        $("p.notify").text("Compila correttamente tutti i campi!").hide().fadeIn(800).fadeOut(3000);
                    }
                });

                $inputdescrizione.on("keypress",function(event){
                    if(event.key=="Enter")
                    $buttoncreazione.focus();
                });

                //append degli elemnti html
                $cont.append($labelpatente)
                        .append($selpatente)
                        .append($labeldescrizione)
                        .append($inputdescrizione)
                        .append($buttoncreazione);

                $("main .content").append($cont);
                

            }else if($(element).parent().is(":nth-child(6)")){
                //VISUALIZZA CORSI - La segreteria visualizza la lista dei corsi della scuola guida

                $cont = $("<ul>");

                //GET Ajax all'URL offerto da server_segreteria per l'ottenimento della lista degli studenti assegnati
                $.getJSON("/getCorsi", (corsi)=>{

                    var $labelcor = $("<ul class='labelcorsi'>").text("CORSI");
                    $cont.append($labelcor);
                        corsi.forEach((corso)=>{

                            //Bottone per l'eliminazione del corso, con dentro l'id univoco del corso da eliminare
                            var $button = $("<button class='deletecourse btn btn-outline-danger' id='"+corso.id+"'>").text("Elimina");
                            //div con display flex per lo spazio tra i bottoni
                            var $div = $("<div class='d-flex gap-2'>")
                            //Descrizione dell'attività
                            var $infoboxcor = $("<li class='infoboxcorso'>").text(corso.id+"- Corso per la patente "+corso.patente+" \n "+corso.descrizione);

                            $div.append($infoboxcor).append($button);
                            $cont.append($div);

                        });

                        //Selezioni i bottoni di eliminazione
                    document.querySelectorAll('button.deletecourse').forEach((bottone)=>{

                        //Listener del click del bottone
                        bottone.addEventListener("click", (e)=>{

                            //Oggetto in cui salvo l'id dell'attività da cancellare
                            var el={id:e.target.getAttribute('id')}
                            console.log(el);

                            //DELETE Ajax
                            $.ajax({
                                url:"/deleteCorso",
                                type:"DELETE",
                                dataType:"json",
                                data:el
                            }).done(()=>{
                                //Se l'operazione va a buon fine refresho la paggina e manndo un messaggio di successo
                                $(".tabs a:nth-child(6) span").trigger("click");
                                $(".notify").text("Corso eliminato!").hide().fadeIn(800).fadeOut(3000);
                            }).fail((jqXHR)=>{
                                //Se fallisce mando un messaggio di errore
                                $(".notify").text("L'operazione non e' andata a buon fine!").hide().fadeIn(800).fadeOut(3000);
                            })

                        });

                    });

                }).fail((jqXHR)=>{
                    $(".notify").text(" Nessun corso trovato! ").hide().fadeIn(800).fadeOut(3000);
                })
                //Append della nostra variabile al content
                $("main .content").append($cont);
                
            
            }

            return false; //Evita la ripropagazione del click sui tabs

        })

    });

    $(".tabs a:first-child span").trigger("click"); //Trigger per settare il tab di default (Gestisci Studenti) quando viene aperta la pagina

}


//Avvio del main 
$(document).ready(()=>{
    main();
});
