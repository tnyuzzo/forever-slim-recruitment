import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Privacy Policy | Swiss Research Labs',
  description: 'Informativa sulla Privacy ai sensi del GDPR e della Legge Federale Svizzera sulla Protezione dei Dati.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[#D946A8] hover:text-[#C026A0] mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Torna alla home
        </Link>

        <article className="prose prose-gray max-w-none">
          <h1>Privacy Policy</h1>
          <p className="lead">
            Informativa sulla Privacy ai sensi del Regolamento UE 2016/679 (GDPR) e della Legge Federale Svizzera sulla Protezione dei Dati (nLPD)
          </p>
          <p className="text-sm text-gray-500">Ultimo aggiornamento: 1 febbraio 2026</p>

          <h2>1. Titolare del trattamento</h2>
          <p>
            Swiss Research Labs GmbH<br />
            Industriestrasse 47, 6300 Zug, Svizzera<br />
            Email: privacy@swissresearchlabs.com
          </p>

          <h2>2. Dati raccolti</h2>
          <p>Raccogliamo i seguenti dati personali attraverso il form di candidatura presente sul sito:</p>
          <p><strong>Dati identificativi:</strong> nome, cognome, indirizzo email, numero WhatsApp, città e paese di residenza, fascia di età.</p>
          <p><strong>Dati professionali:</strong> esperienza lavorativa, settori di competenza, disponibilità oraria e giornaliera, competenze linguistiche, motivazioni.</p>
          <p><strong>Contenuti forniti volontariamente:</strong> risposte a domande aperte, file audio (se caricati dall&apos;utente), breve presentazione personale.</p>
          <p><strong>Dati di navigazione:</strong> indirizzo IP, tipo di browser, sistema operativo, pagine visitate, durata della visita, dati di riferimento (UTM parameters). Questi dati vengono raccolti automaticamente tramite cookie e strumenti di analisi.</p>

          <h2>3. Finalità e base giuridica del trattamento</h2>
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left p-2 border">Finalità</th>
                <th className="text-left p-2 border">Base giuridica</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 border">Valutazione della candidatura</td>
                <td className="p-2 border">Esecuzione di misure precontrattuali (Art. 6.1.b GDPR)</td>
              </tr>
              <tr>
                <td className="p-2 border">Contatto per colloquio e onboarding</td>
                <td className="p-2 border">Esecuzione di misure precontrattuali (Art. 6.1.b GDPR)</td>
              </tr>
              <tr>
                <td className="p-2 border">Analisi e miglioramento del sito</td>
                <td className="p-2 border">Legittimo interesse (Art. 6.1.f GDPR)</td>
              </tr>
              <tr>
                <td className="p-2 border">Comunicazioni relative alla candidatura</td>
                <td className="p-2 border">Consenso dell&apos;interessato (Art. 6.1.a GDPR)</td>
              </tr>
              <tr>
                <td className="p-2 border">Adempimenti di legge</td>
                <td className="p-2 border">Obbligo legale (Art. 6.1.c GDPR)</td>
              </tr>
            </tbody>
          </table>

          <h2>4. Conservazione dei dati</h2>
          <p>
            I dati delle candidature vengono conservati per un periodo massimo di <strong>12 mesi</strong> dalla data di invio. Al termine di tale periodo, i dati vengono cancellati o anonimizzati, salvo diverso accordo con l&apos;interessato. I dati dei collaboratori attivi vengono conservati per tutta la durata della collaborazione e per i successivi 10 anni come previsto dalla normativa fiscale e contabile applicabile.
          </p>

          <h2>5. Condivisione dei dati</h2>
          <p>I dati personali non vengono venduti a terzi. Possono essere condivisi con:</p>
          <ul>
            <li><strong>Fornitori di servizi tecnici:</strong> hosting, database, strumenti di analisi — esclusivamente per le finalità sopra indicate e sulla base di accordi di trattamento dati conformi al GDPR.</li>
            <li><strong>Autorità competenti:</strong> qualora richiesto dalla legge applicabile.</li>
          </ul>
          <p>
            I dati possono essere trasferiti al di fuori dello Spazio Economico Europeo (SEE) esclusivamente verso paesi che garantiscono un livello adeguato di protezione dei dati, o sulla base di garanzie appropriate (clausole contrattuali standard approvate dalla Commissione Europea).
          </p>

          <h2>6. Diritti dell&apos;interessato</h2>
          <p>In conformità con il GDPR, l&apos;utente ha diritto di:</p>
          <ul>
            <li><strong>Accesso:</strong> ottenere conferma dell&apos;esistenza di un trattamento e accedere ai propri dati.</li>
            <li><strong>Rettifica:</strong> richiedere la correzione di dati inesatti o incompleti.</li>
            <li><strong>Cancellazione:</strong> richiedere la cancellazione dei propri dati (&quot;diritto all&apos;oblio&quot;).</li>
            <li><strong>Limitazione:</strong> richiedere la limitazione del trattamento in determinati casi.</li>
            <li><strong>Portabilità:</strong> ricevere i propri dati in formato strutturato e leggibile da dispositivo automatico.</li>
            <li><strong>Opposizione:</strong> opporsi al trattamento per motivi legittimi.</li>
            <li><strong>Revoca del consenso:</strong> revocare in qualsiasi momento il consenso prestato, senza pregiudicare la liceità del trattamento basato sul consenso prima della revoca.</li>
          </ul>
          <p>
            Per esercitare i propri diritti, l&apos;utente può scrivere a: privacy@swissresearchlabs.com
          </p>
          <p>
            L&apos;utente ha inoltre il diritto di proporre reclamo all&apos;autorità di controllo competente (in Svizzera: IFPDT — Incaricato federale della protezione dei dati e della trasparenza; nell&apos;UE: l&apos;autorità garante del proprio paese di residenza).
          </p>

          <h2>7. Sicurezza</h2>
          <p>
            Adottiamo misure tecniche e organizzative adeguate per proteggere i dati personali da accesso non autorizzato, perdita, distruzione o alterazione. Tra queste: crittografia dei dati in transito e a riposo, controllo degli accessi, backup regolari e formazione del personale.
          </p>

          <h2>8. Modifiche alla presente informativa</h2>
          <p>
            Ci riserviamo il diritto di aggiornare la presente informativa in qualsiasi momento. La versione aggiornata sarà pubblicata su questa pagina con indicazione della data di ultimo aggiornamento. L&apos;uso continuato del sito dopo la pubblicazione delle modifiche costituisce accettazione delle stesse.
          </p>
        </article>
      </div>
    </div>
  )
}
