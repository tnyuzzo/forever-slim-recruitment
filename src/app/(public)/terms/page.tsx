import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Termini e Condizioni | Swiss Research Labs',
  description: 'Termini e Condizioni di utilizzo del sito e del servizio di candidatura.',
}

export default function TermsPage() {
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
          <h1>Termini e Condizioni</h1>
          <p className="lead">Termini e Condizioni di utilizzo del sito e del servizio di candidatura</p>
          <p className="text-sm text-gray-500">Ultimo aggiornamento: 1 febbraio 2026</p>

          <h2>1. Premessa</h2>
          <p>
            I presenti Termini e Condizioni regolano l&apos;accesso e l&apos;utilizzo del sito web gestito da Swiss Research Labs GmbH (di seguito &quot;la Società&quot;), con sede legale in Industriestrasse 47, 6300 Zug, Svizzera. L&apos;utilizzo del sito implica l&apos;accettazione integrale dei presenti termini.
          </p>

          <h2>2. Oggetto del sito</h2>
          <p>
            Il sito ha lo scopo di fornire informazioni relative a un&apos;opportunità di collaborazione commerciale nel settore cosmetici e integratori alimentari, e di raccogliere candidature di soggetti interessati a tale collaborazione. Il sito non costituisce un&apos;offerta di lavoro subordinato.
          </p>

          <h2>3. Natura della collaborazione</h2>
          <p>La collaborazione proposta attraverso il sito si configura come un rapporto di lavoro autonomo/freelance a provvigione. In particolare:</p>
          <ul>
            <li>Non è previsto alcun rapporto di lavoro subordinato.</li>
            <li>Non è previsto alcun compenso fisso, stipendio o retribuzione minima garantita.</li>
            <li>Il compenso consiste esclusivamente in provvigioni variabili calcolate sulle vendite effettivamente concluse.</li>
            <li>Non è previsto alcun rimborso spese.</li>
            <li>La Società si riserva il diritto di accettare o rifiutare qualsiasi candidatura a propria discrezione.</li>
            <li>I termini specifici della collaborazione vengono definiti in un accordo separato in fase di onboarding.</li>
          </ul>

          <h2>4. Dichiarazioni sui guadagni</h2>
          <p>
            Tutti i riferimenti a guadagni, provvigioni, range economici e scenari presenti sul sito sono puramente indicativi e basati su dati interni osservati. Non costituiscono in alcun modo una promessa, garanzia, previsione o impegno contrattuale di risultato.
          </p>
          <p>
            I guadagni effettivi dipendono da fattori individuali e di mercato, tra cui ma non limitatamente a: ore lavorate, giorni di attività, competenze personali, esperienza pregressa e condizioni generali di mercato. I risultati passati non garantiscono risultati futuri.
          </p>

          <h2>5. Requisiti di candidatura</h2>
          <p>L&apos;invio di una candidatura attraverso il sito presuppone che il candidato:</p>
          <ul>
            <li>Abbia almeno 18 anni di età.</li>
            <li>Fornisca informazioni veritiere, accurate e complete.</li>
            <li>Sia consapevole della natura autonoma e a provvigione della collaborazione.</li>
            <li>Abbia la capacità giuridica di stipulare contratti nel proprio paese di residenza.</li>
            <li>Si assuma la responsabilità di operare in conformità con la normativa fiscale e contributiva del proprio paese di residenza.</li>
          </ul>

          <h2>6. Proprietà intellettuale</h2>
          <p>
            Tutti i contenuti del sito — inclusi testi, grafica, immagini, loghi, layout e software — sono di proprietà della Società o dei rispettivi licenzianti e sono protetti dalle leggi sulla proprietà intellettuale. È vietata qualsiasi riproduzione, distribuzione o utilizzo non autorizzato dei contenuti del sito.
          </p>

          <h2>7. Limitazione di responsabilità</h2>
          <p>
            La Società si impegna a mantenere le informazioni presenti sul sito accurate e aggiornate, ma non garantisce la completezza, l&apos;accuratezza o l&apos;attualità delle stesse. In particolare:
          </p>
          <ul>
            <li>La Società non è responsabile per decisioni prese dall&apos;utente sulla base delle informazioni presenti sul sito.</li>
            <li>La Società non garantisce la disponibilità continuativa dell&apos;opportunità di collaborazione.</li>
            <li>La Società non è responsabile per eventuali interruzioni, errori o malfunzionamenti tecnici del sito.</li>
            <li>La Società non è responsabile per danni diretti o indiretti derivanti dall&apos;uso del sito o dall&apos;impossibilità di utilizzarlo.</li>
          </ul>

          <h2>8. Dichiarazione di non affiliazione</h2>
          <p>
            Questo sito non è affiliato, associato, autorizzato, approvato o in alcun modo ufficialmente collegato a Meta Platforms, Inc. (Facebook/Instagram) o a Google LLC. Tutti i nomi di prodotti, loghi e marchi citati sono di proprietà dei rispettivi titolari. L&apos;uso di tali riferimenti è esclusivamente a scopo identificativo e non implica alcuna approvazione o affiliazione.
          </p>

          <h2>9. Link a siti terzi</h2>
          <p>
            Il sito può contenere link a siti web di terze parti. La Società non ha alcun controllo su tali siti e non è responsabile dei loro contenuti, delle loro politiche sulla privacy o delle loro pratiche. L&apos;accesso a siti terzi avviene sotto la esclusiva responsabilità dell&apos;utente.
          </p>

          <h2>10. Modifiche ai termini</h2>
          <p>
            La Società si riserva il diritto di modificare i presenti Termini e Condizioni in qualsiasi momento. Le modifiche entreranno in vigore al momento della pubblicazione sul sito. L&apos;uso continuato del sito dopo la pubblicazione delle modifiche costituisce accettazione delle stesse.
          </p>

          <h2>11. Legge applicabile e foro competente</h2>
          <p>
            I presenti Termini e Condizioni sono regolati dalla legge svizzera. Per qualsiasi controversia derivante dall&apos;utilizzo del sito o dall&apos;interpretazione dei presenti termini, il foro competente è quello di Zug, Svizzera, salvo diversa disposizione imperativa di legge applicabile al consumatore.
          </p>

          <h2>12. Contatti</h2>
          <p>Per qualsiasi domanda relativa ai presenti Termini e Condizioni:</p>
          <p>
            Swiss Research Labs GmbH<br />
            Industriestrasse 47, 6300 Zug, Svizzera<br />
            Email: info@swissresearchlabs.com
          </p>
        </article>
      </div>
    </div>
  )
}
