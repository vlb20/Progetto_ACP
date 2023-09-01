//Variabile globale che servirà per notificare una nuova iscrizione
var num_iscrizioni=0;

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
                //GESTISCI STUDENTI - La segreteria gestisce le iscrizioni alla classe

                $cont = $("<ul>");

                //GET Ajax all'url offerto da server_segreteria per la visualizzazione degli studenti in attesa dell'iscrizione
                $.getJSON("/getStudenti/attesa", (iscrizioni)=>{

                    //scorro l'array di iscrizioni
                    iscrizioni.forEach((iscrizione)=>{
                        
                        //Elementi HTML per gestire le iscrizioni
                        var $labelstatoiscr = $("<li class='labelstatoiscr' id='"+iscrizione.stato+"'>").text("Iscrizione studente con matricola ["+iscrizione.matricola+"] alla classe "+iscrizione.classe+" - Stato: "+iscrizione.stato);
                        var $buttonassegna = $("<button name='assegna' id='buttonassegna' class='"+iscrizione.matricola+"'>").text("Assegna");
                        var $buttonrifiuta = $("<button name='rifiuta' id='buttonrifiutaiscr' class='"+iscrizione.matricola+"'>").text("Rifiuta");

                        //Appendo al content gli elementi creati
                        $cont.append($labelstatoiscr).append($buttonassegna).append($buttonrifiuta);

                    })

                    
                }).then(()=>{

                    //Seleziono tutti i bottoni
                    document.querySelectorAll("button").forEach((button)=>{

                        //Aggiungo un listener sul click diffenziando il comportamento per classe
                        button.addEventListener("click", (el)=>{

                            //Se si tratta del bottone 'assegna' -> PUT cambiando lo stato in ASSEGNATO
                            if (el.target.getAttribute("name")=="assegna"){

                                //Creo l'oggetto contente la matricola dell'iscritto target
                                var el = {"matricola":el.target.getAttribute("class")}
                                
                                //Chiamata Ajax - PUT
                                $.ajax({
                                    url:"assegnaIscrizione",
                                    type:"PUT",
                                    dataType:"json",
                                    data:el
                                }).done(()=>{
                                    //Se tutto va bene -> refresh della pagina triggerando fittiziamente il click
                                    $(".tabs a:nth-child(1) span").trigger("click");
                                    $(".notify").text("Iscrizione gestita con successo!").hide().fadeIn(800).fadeOut(3000);
                                }).fail(()=>{
                                    //In caso di fallimento
                                    $(".notify").text("Operazione di gestione dell'iscrizione non andata a buon fine!").hide().fadeIn(800).fadeOut(3000);
                                })

                            }//Se si tratta del bottone 'rifiuta' -> PUT cambiando lo stato in NON ASSEGNATO
                            else if(el.target.getAttribute("name")=="rifiuta"){

                                //Creo l'oggetto contente la matricola dell'iscritto target
                                var el = {"matricola":el.target.getAttribute("class")}

                                //Chiamata Ajax -PUT
                                $.ajax({
                                    url:"rigettaIscrizione",
                                    type:"PUT",
                                    dataType:"json",
                                    data:el
                                }).done(()=>{
                                    //Se tutto va bene -> refresh della pagina triggerando fittiziamente il click
                                    $(".tabs a:nth-child(1) span").trigger("click");
                                    $(".notify").text("Iscrizione gestita con successo!").hide().fadeIn(800).fadeOut(3000);
                                }).fail(()=>{
                                    //In caso di fallimento
                                    $(".notify").text("Operazione di gestione dell'iscrizione non andata a buon fine!").hide().fadeIn(800).fadeOut(3000);
                                })

                            }

                        })

                    })

                }).fail((jqXHR)=>{
                    $cont.append($("<li class='error'>").text("Nessuna iscrizione da gestire!")).hide().fadeIn(800);
                })

                //Append della nostra variabile al content
                $("main .content").append($cont);

            }else if($(element).parent().is(":nth-child(2)")){
                //LISTA STUDENTI - La segreteria visualizza la lista degli studenti iscritti

                $cont = $("<div>");

                //bool per controllo fail
                var assegnfound = true;
                var rifutfound = true;

                //GET Ajax all'url offerto da server_segreteria per l'ottenimento della lista degli studenti assegnati
                $.getJSON("/getStudenti/assegnato", (studenti)=>{

                    var $labelstudassegn = $("<ul class='labelstudentiassegnati'>").text("STUDENTI ASSEGNATI");
                    $cont.append($labelstudassegn);
                        studenti.forEach((studente)=>{

                            var $listamatricolestud = $("<li class='listamatricolestudenti'>").text("Matricola "+studente.matricola);
                            var $infoboxstud = $("<li class='infoboxstudente'>").text(studente.nome+" "+studente.cognome+" CF:"+studente.codicefiscale+" Nato il:"+studente.datanascita+" Classe:"+studente.classe);
                            $cont.append($listamatricolestud).append($infoboxstud);
                        })

                }).fail((jqXHR)=>{
                    assegnfound=false;
                })

                //GET Ajax all'url offerto da server_segreteria per l'ottenimento della lista degli studenti non assegnati
                $.getJSON("/getStudenti/rigettato", (studenti)=>{

                    var $labelstudrifiut = $("<ul class='labelstudentirifiutati'>").text("STUDENTI NON ASSEGNATI");
                    $cont.append($labelstudrifiut);
                        studenti.forEach((studente)=>{

                            var $listamatricolestud = $("<li class='listamatricolestudenti'>").text("Matricola "+studente.matricola);
                            var $infoboxstud = $("<li class='infoboxstudente'>").text(studente.nome+" "+studente.cognome+" CD:"+studente.codicefiscale+" Nato il:"+studente.datanascita+" Classe:"+studente.classe);
                            $cont.append($listamatricolestud).append($infoboxstud);
                        })

                }).fail((jqXHR)=>{
                    rifiutfound=false;
                    console.log(assegnfound);
                    console.log(rifutfound);
                    //Se la ricerca non trova nulla scrivo un messaggio di errore
                    if(assegnfound==false && rifutfound==false){
                        console.log("non trovato");
                        $cont.append($("<li class='error'>").text("Nessun studente trovato")).hide().fadeIn(800);
                    }
                })

                //Append della nostra variabile al content
                $("main .content").append($cont);

            }else if($(element).parent().is(":nth-child(3)")){
                //INSERISCI QUADRI - La segreteria inserisce i voti e pubblica le pagelle

                $cont = $("<div>");

                //oggetti html per etichette e inputbox
                var $labelmatricola=$("<p class='labeltext'>").text("Matricola");
                var $inputmatricola = $("<input class='inputpagelle' placeholder='Inserisci la matricola dello studente...'>");
                
                var $selquad = $("<select class='selezione' name='choice'> <option value='PRIMO QUADRIMESTRE'>Primo Quadrimestre</option> <option value='SECONDO QUADRIMESTRE' selected>Secondo Quadrimestre</option> </select>");

                var $labelanno=$("<p class='labeltext'>").text("Anno Scolastico");
                var $inputanno = $("<input class='inputpagelle' placeholder='Inserisci Anno Scolastico...'>");

                var $labelita=$("<p class='labeltext'>").text("Voto Italiano");
                var $inputita = $("<input type='number' id='inputita' name='inputita' min='1' max='10'>");
                var $labelmat=$("<p class='labeltext'>").text("Voto Matematica");
                var $inputmat = $("<input type='number' id='inputmat' name='inputmat' min='1' max='10'>");
                var $labeling=$("<p class='labeltext'>").text("Voto Inglese");
                var $inputing = $("<input type='number' id='inputing' name='inputing' min='1' max='10'>");
                var $labelsto=$("<p class='labeltext'>").text("Voto Storia");
                var $inputsto = $("<input type='number' id='inputsto' name='inputsto' min='1' max='10'>");
                
                //Bottone inserimento
                var $buttonquad = $("<button class='addQuadro btn btn-outline-info'>").text("Aggiungi Quadro");
                //Listener sul bottone
                $buttonquad.on("click", ()=>{

                    //Se abbiamo compilato tutto
                    if($inputmatricola.val()!="" && $selquad.val()!="" && $inputanno.val()!=""  && $inputita.val()!="" && $inputmat.val()!="" && $inputing.val()!="" && $inputsto.val()!=""){

                        //Crea l'oggetto
                        var el = {studente: {matricola: $inputmatricola.val()}, quadrimestre: $selquad.val(), annoscolastico: $inputanno.val(), materie: {votoitaliano: $inputita.val(), votomatematica: $inputmat.val(), votoinglese: $inputing.val(), votostoria: $inputsto.val()}};

                        //Chiamata AJAX - POST per passare la pagella in formato JSON
                        $.ajax({
                            url: "/inserisciPagella",
                            type:"POST",
                            dataType:"json",
                            data:el
                        }).done(()=>{
                            //Messaggio di successo per l'inserimento
                            $("p.notify").text("Quadro inserito con successo!").hide().fadeIn(800).fadeOut(3000);
                            //Clear input
                            $inputmatricola.val("");
                            $inputanno.val("");
                            $inputita.val("");
                            $inputmat.val("");
                            $inputing.val("");
                            $inputsto.val("");
                        })

                    }
                    //Se non sono stati compilati tutti i campi
                    else{
                        $("p.notify").text("Compila tutti i campi!").hide().fadeIn(800).fadeOut(3000);
                    }

                });

                //Listener sul keypress per spostare il focus sul campo successivo
                $inputmatricola.on("keypress", (event)=>{
                    if(event.key==="Enter"){
                        $selquad.focus();
                    }
                });

                $selquad.on("keypress", (event)=>{
                    if(event.key==="Enter"){
                        $inputanno.focus();
                    }
                });

                $inputanno.on("keypress", (event)=>{
                    if(event.key==="Enter"){
                        $inputita.focus();
                    }
                });

                $inputita.on("keypress", (event)=>{
                    if(event.key==="Enter"){
                        $inputmat.focus();
                    }
                });

                $inputmat.on("keypress", (event)=>{
                    if(event.key==="Enter"){
                        $inputing.focus();
                    }
                });

                $inputing.on("keypress", (event)=>{
                    if(event.key==="Enter"){
                        $inputsto.focus();
                    }
                });

                $inputsto.on("keypress", (event)=>{
                    if(event.key==="Enter"){
                        $buttonquad.focus();
                    }
                });

                //appendo i vari elementi html creati
                $cont.append($labelmatricola).append($inputmatricola).append($selquad).append($labelanno).append($inputanno).append($labelita).append($inputita).append($labelmat).append($inputmat).append($labeling).append($inputing).append($labelsto).append($inputsto).append($buttonquad);

                $("main .content").append($cont);

            }else if($(element).parent().is(":nth-child(4)")){
                //VISUALIZZA QUADRI - La segreteria visualizza i quadri che ha pubblicato

                $cont = $("<ul>");
                
                //GET Ajax all'url offerto da server_segreteria per l'ottenimento della lista di quadri
                $.getJSON("/getPagelle", (pagelle)=>{

                    pagelle.forEach((pagella)=>{

                        var $listidpagelle = $("<li class='listidpagella'>").text("ID Pagella: "+pagella.id);
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

                //Append elementi html al content
                $("main .content").append($cont);

            }else if($(element).parent().is(":nth-child(5)")){
                //INSERISCI ATTIVITA' - La segreteria pubblica le attività tramite questo tab

                $cont = $("<div>");

                //Label e input box html per riempire i vari campi
                var $labeldata = $("<p class='labeltext'>").text("Data");
                var $inputdata = $("<input class='calendar' type='date'>");

                var $selezionetipo = $("<select class= 'selezione' name='choice'> <option value='ISTITUTO' selected>Istituto</option> <option value='CLASSE'>Classe</option> </select>");

                var $labeldesc = $("<p class='labeltext'>").text("Descrizione");
                var $tbox = $("<textarea class = 'textbox' placeholder='Inserisci descrizione attività...'>");

                var $buttonattivita = $("<button class ='publish btn btn-outline-info'>").text("Pubblica");

                //Aggiungo il listener al click del bottone
                $buttonattivita.on("click", ()=>{

                    //Controllo che siano stati compilati i vari campi
                    if($inputdata.val()!="" && $tbox.val()!=""){

                        //Creo l'oggetto attivita
                        var el = {data: $inputdata.val(), tipo: $selezionetipo.val(), descrizione: $tbox.val()};

                        //Chiamata AJAX - POST
                        $.ajax({
                            url: "/inserisciAttivita",
                            type: "POST",
                            dataType: "json",
                            data:el
                        }).done(()=>{
                            //Messaggio di pubblicazione avvenuta
                            $("p.notify").text("Attività pubblicata!").hide().fadeIn(800).fadeOut(3000);
                            //Clear degli inputbox
                            $inputdata.val("");
                            $tbox.val("");
                        })

                    }else{//Se non sono stati compilati tutti i campi
                        $("p.notify").text("Compila tutti i campi!").hide().fadeIn(800).fadeOut(3000);
                    }

                });

                //Listener sul keypress per spostare il focus all'inserimento del campo successivo
                $inputdata.on("keypress", (event)=>{
                    if(event.key==="Enter"){
                        $selezionetipo.focus();
                    }
                });

                $selezionetipo.on("keypress", (event)=>{
                    if(event.key==="Enter"){
                        $tbox.focus();
                    }
                });

                $tbox.on("keypress", (event)=>{
                    if(event.key==="Enter"){
                        $buttonattivita.focus();
                    }
                });

                $cont.append($labeldata).append($inputdata).append($selezionetipo).append($labeldesc).append($tbox).append($buttonattivita);

                $("main .content").append($cont);

            }else if($(element).parent().is(":nth-child(6)")){
                //GESTISCI ATTIVITA' - La segreteria visualizza tutte le attività pubblicate e può eliminarle

                $cont=$("<ul>");

                //GET per ottenere l'array di attività
                $.getJSON("/getAttivita", (activities)=>{

                    //Scorro l'array di attività
                    activities.forEach((attivita)=>{

                        //Bottone per l'eliminazione dell'attività, con dentro l'id univoco dell'attività da eliminare
                        var $button = $("<button class='deleteactivity btn btn-outline-danger' id='"+attivita.idatt+"'>").text("Elimina");
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

                    //Selezioni i bottoni di eliminazione
                    document.querySelectorAll('button.deleteactivity').forEach((bottone)=>{

                        //Listener del click del bottone
                        bottone.addEventListener("click", (e)=>{

                            //Oggetto in cui salvo l'id dell'attività da cancellare
                            var el={idatt:e.target.getAttribute('id')}
                            console.log(el);

                            //DELETE Ajax
                            $.ajax({
                                url:"/deleteAttivita",
                                type:"DELETE",
                                dataType:"json",
                                data:el
                            }).done(()=>{
                                //Se l'operazione va a buon fine refresho la paggina e manndo un messaggio di successo
                                $(".tabs a:nth-child(6) span").trigger("click");
                                $(".notify").text("Attività eliminata con successo!").hide().fadeIn(800).fadeOut(3000);
                            }).fail((jqXHR)=>{
                                //Se fallisce mando un messaggio di errore
                                $(".notify").text("Attività non eliminata!").hide().fadeIn(800).fadeOut(3000);
                            })

                        });

                    });

                }).fail((jqXHR)=>{
                    //Fail nella ricerca delle attività -> messaggio di errore
                    $cont.append($("<li class='error'>").text("Non sono state trovate attività!")).hide().fadeIn(800).fadeOut(3000);
                });

                $("main .content").append($cont);

            }

            return false; //Evita la ripropagazione del click sui tabs

        })

    });

    $(".tabs a:first-child span").trigger("click"); //Trigger per settare il tab di default (Gestisci Studenti) quando viene aperta la pagina

}

//Funzione per la notifica di una nuova iscrizione
var check = function(firstcall){

    //GET Ajax delle iscrizioni in attesa
    $.getJSON("/getStudenti/attesa", (iscrizioni)=>{

        //Se è la prima chiamata alla funzione, pongo il contatore di iscrizioni pari alla lunghezza dell'array di iscrizioni
        if(firstcall){

            num_iscrizioni=iscrizioni.length;

        }else if(num_iscrizioni!=iscrizioni.length){

            //Se il contatore è cambiato invio la notifica
            num_iscrizioni=iscrizioni.length;
            var el = document.querySelector(".active");

            //Se mi trovo già sul primo tab triggero il click fittiziamente
            if(el.getAttribute("id")=="gestiscistudentitab"){
                $(el).trigger("click");
                $(".alert").text("Nuova modifica alle iscrizioni");
                $(".alert").on("click",()=>{
                    $(".alert").text("");
                })

            }else{
                //Se invece mi trovo su un'altro tab notifico la modifica
                $(".alert").text("Aggiornate le richieste di iscrizione");
                $(".alert").on("click", ()=>{

                    $(".alert").text("");
    

                });

            }

        }

    });

}

//Avvio del main e della funzione di notifica (passo alla prima call true)

$(document).ready(()=>{
    main(check(true));
});

setInterval(()=>{
    check(false);
}, 1000);