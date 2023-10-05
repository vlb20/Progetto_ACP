## Progetto: ``Autoscuola FleGO - Web Application per la gestione di una Scuola Guida``

### NOME: ``VINCENZO LUIGI``
### COGNOME: ``BRUNO``
### MATRICOLA: ``N46005698``
### ALTRI COMPONENTI GRUPPO: ``CRISTINA CARLEO N46005492``

### DOCENTE: ``DE SIMONE``

## DESCRIZIONE

Sono presenti 3 viste. Una riguardante lo studente, una riguardante la segreteria della scuola guida e un'ultima riguardante gli istruttori della scuola guida<br><br>
Uno **studente** deve autenticarsi con le credenziali fornitegli fisicamente, ed una volta fatto questo può visualizzare la propria _iscrizione_, può visualizzare i _corsi_ teorici tenuti dalla scuola guida, può svolgere una _simulazione della prova di teoria_, può visualizzare la lista degli _istruttori_ così da vederne l'_id_ associato e inserirlo per prenotare un'eventuale _lezione pratica_, e può infine visualizzare le proprie _prenotazioni_ per controllarne lo stato ed eventualmente eliminarle<br><br>
La **segreteria** può fare l'_iscrizione_ di uno _studente_ per poi poterne visualizzare la lista in una seconda scheda, può aggiungere degli _istruttori_ per poi poterli visualizzare ed infine può inserire dei _corsi_ con le proprie descrizioni per poi poterli visualizzare ed eventualmente eliminarli<br><br>
Gli **istruttori** possono visualizzare le _prenotazioni_ in attesa per le _lezioni pratiche_ e decidere se accettarle o rifiutarle, possono inoltre visualizzare le _lezioni_ accettate (differenziate per _id_ degli istruttori) e visualizzare i _corsi_ inseriti dalla segreteria.

## DIPENDENZE

> _MONGODB_ : 6.0.5\
> _express_ : 4.18.2\
> _express-session_ : 1.17.3\
> _mongoose_ : 7.5.0\
> _nodemon_ : 3.0.1

## AVVIO DELL'APPLICAZIONE

1.Avviare il servizio **mongodb**\
2.Eseguire nella directory del progetto i seguenti comandi:

> **npm run starts** -- Avvia la vista della **segreteria** sul localhost:4002\
> **npm run starti** -- Avvia la vista degli **istruttori** sul localhost:4004\
> **npm run startc** -- Avvia la vista degli **studenti** sul localhost:4008

3.Effettuare il login in alto a destra nella vista degli **studenti** 

## TEST DELL'APPLICAZIONE
1.Nella vista _segreteria_ effettuare l'iscrizione di almeno uno studente tramite il primo tab e visualizzarlo nel secondo tab\
2.Sempre nella vista _segreteria_ aggiungere qualche istruttore tramite il terzo tab e visualizzarli nel quarto tab\
3.Sempre nella vista _segreteria_ aggiungere qualche corso con le relative descrizioni tramite il quinto tab per poi visualizzarli (ed eventualmente eliminarli) nell'ultimo tab\
4.Nella vista _studente_, dopo avere effettuato il login, visualizzare i corsi nel secondo tab e fare una simulazione di una prova teorica nel terzo tab\
5.Sempre nella vista _studente_ visualizzare gli id degli istruttori nel quarto tab e sceglierne uno da inserire nel quinto tab, assieme alla data e all'ora, per prenotare una lezione pratica\
6.Nella vista _istruttori_ visualizzare e accettare le prenotazioni sottoposte dallo studente nel primo tab per poi visualizzarle nel secondo tab\
7.Nella vista _studente_ visualizzare le prenotazioni effettuate con il relativo stato nell'ultimo tab (ed eventualmente eliminarle)\
8.Nella vista _istruttori_ visualizzare i corsi inseriti dalla segreteria nell'ultimo tab
