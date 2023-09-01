# Progetto ACP WebApplication: ``Learnopolis``
# Docente: ``Luigi De Simone``

# Studenti:
## ``Vincenzo Luigi Bruno`` N46005698
## ``Cristina Carleo`` N46005492

``Web Application per la gestione di un Istituto Scolastico``<br>

Sono presenti una vista riguardante il genitore dell'alunno e una vista riguardante la segreteria dell'istituto scolastico<br><br>
Un **genitore** può inviare la richiesta di iscrizione del proprio _figlio (studente)_, visualizzare i _quadri_ associati al proprio _studente_ e visualizzare le _attività_ pubblicate dalla segreteria <br><br>
La **segreteria** può accettare o rigettare le _iscrizioni_ e poi visualizzarle,  pubblicare e visualizzare i _quadri_ e gestire la pubblicazione/eliminazione delle _attività_ oltre a visualizzarle<br>

## DIPENDENZE

> _MONGODB_ : 6.0.5\
> _express_ : 4.18.2\
> _mongoose_ : 7.5.0\
> _nodemon_ : 3.0.1

## AVVIO DELL'APPLICAZIONE

1.Avviare il servizio **mongodb**\
2.Eseguire nella directory del progetto i seguenti comandi:

> **npm run starts** -- Avvia la vista della **segreteria** sul localhost:4002\
> **npm run startc** -- Avvia la vista del **genitore** sul localhost:4000

## TEST DELL'APPLICAZIONE
1.Nella vista genitore effettuare l'iscrizione dello studente tramite il primo tab\
2.Accettare o rifiutare l'iscrizione tramite il primo tab della vista segreteria e visualizzare le informazioni dello studente tramite il secondo tab\
3.Nella vista segreteria pubblicare un quadro con la matricola dell'alunno appena iscritto tramite il terzo tab e visualizzarlo tramite il quarto tab\
4.Sempre nella vista segreteria, pubblicare una attività tramite il quinto tab e visualizzarla (per poi eventualmente eliminarla) attraverso l'ultimo tab\
5.Nella vista genitore, visualizzare il quadro pubblicato tramite il secondo tab e visualizzare le attività pubblicate tramite l'ultimo tab
