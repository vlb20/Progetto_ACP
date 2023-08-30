
var main = function(){

    //"use strict"

    //Dichiaro una variabile che mi servirà per l'append del content
    var $cont;

    //Trasformo i tabs in un array e li scoro

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
                $.getJSON("/getStudenti/in attesa", (iscrizioni)=>{

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
                                    url:"approvaIscrizione",
                                    type:"PUT",
                                    dataType:"json",
                                    data:el
                                }).done(()=>{
                                    //Se tutto va bene -> refresh della pagina triggerando fittiziamente il click
                                    $(".tabs a:nth-child(1) span").trigger("click");
                                    $(".notify").text("Iscrizione gestita con successo!").hide().fadeIn(1500).fadeOut(2000);
                                }).fail(()=>{
                                    //In caso di fallimento
                                    $(".notify").text("Operazione di gestione dell'iscrizione non andata a buon fine!").hide().fadeIn(1500).fadeOut(2000);
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
                                    $(".notify").text("Iscrizione gestita con successo!").hide().fadeIn(1500).fadeOut(2000);
                                }).fail(()=>{
                                    //In caso di fallimento
                                    $(".notify").text("Operazione di gestione dell'iscrizione non andata a buon fine!").hide().fadeIn(1500).fadeOut(2000);
                                })

                            }

                        })

                    })

                }).fail((jqXHR)=>{
                    $cont.append($("<li class='error'>").text("Nessuna iscrizioni da gestire!")).hide().fadeIn(1500);
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
                            var $infoboxstud = $("<li class='infoboxstudente'>").text(studente.nome+" "+studente.cognome+" CD:"+studente.codicefiscale+" Nato il:"+studente.datanascita+" Classe:"+studente.classe);
                            $cont.append($listamatricolestud).append($infoboxstud);
                        })

                }).fail((jqXHR)=>{
                    assegnfound=false;
                })

                //GET Ajax all'url offerto da server_segreteria per l'ottenimento della lista degli studenti non assegnati
                $.getJSON("/getStudenti/non assegnato", (studenti)=>{

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
                        $cont.append($("<li class='error'>").text("Nessun studente trovato")).hide().fadeIn(1500);
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
                
                var $selquad = $("<select class='selezione' name='choice'> <option value='PRIMO QUADRIMESTRE'>Primo</option> <option value='SECONDO QUADRIMESTRE' selected>Secondo</option> </select>");

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
                            $("p.notify").text("Quadro inserito con successo!").hide().fadeIn(1500).fadeOut(2000);
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
                        $("p.notify").text("Compila tutti i campi!").hide().fadeIn(1500).fadeOut(2000);
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

                    
                        
                })
            }
            


        })
    })
}

//Avvio del main e della funzione di notifica (passo alla prima call true)

$(document).ready(()=>{
    main(check(true));
});

setInterval(()=>{
    check(false);
}, 1000);