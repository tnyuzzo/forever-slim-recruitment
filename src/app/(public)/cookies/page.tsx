import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Cookie Policy | Swiss Research Labs',
  description: 'Informativa sull\'utilizzo dei Cookie.',
}

export default function CookiesPage() {
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
          <h1>Cookie Policy</h1>
          <p className="lead">Informativa sull&apos;utilizzo dei Cookie</p>
          <p className="text-sm text-gray-500">Ultimo aggiornamento: 1 febbraio 2026</p>

          <h2>1. Cosa sono i cookie</h2>
          <p>
            I cookie sono piccoli file di testo che vengono memorizzati sul dispositivo dell&apos;utente durante la navigazione. Servono a migliorare l&apos;esperienza di navigazione, ricordare le preferenze e raccogliere informazioni anonime sull&apos;utilizzo del sito.
          </p>

          <h2>2. Tipologie di cookie utilizzati</h2>

          <h3>Cookie tecnici (necessari)</h3>
          <p>
            Questi cookie sono essenziali per il funzionamento del sito. Non possono essere disattivati. Non raccolgono informazioni personali identificabili.
          </p>
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left p-2 border">Cookie</th>
                <th className="text-left p-2 border">Finalità</th>
                <th className="text-left p-2 border">Durata</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 border">session_id</td>
                <td className="p-2 border">Gestione sessione utente</td>
                <td className="p-2 border">Sessione</td>
              </tr>
              <tr>
                <td className="p-2 border">cookie_consent</td>
                <td className="p-2 border">Memorizzazione preferenze cookie</td>
                <td className="p-2 border">12 mesi</td>
              </tr>
              <tr>
                <td className="p-2 border">csrf_token</td>
                <td className="p-2 border">Protezione sicurezza form</td>
                <td className="p-2 border">Sessione</td>
              </tr>
            </tbody>
          </table>

          <h3>Cookie analitici</h3>
          <p>
            Utilizzati per raccogliere informazioni aggregate sull&apos;utilizzo del sito (pagine visitate, tempo di permanenza, origine del traffico). Ci aiutano a migliorare il sito. I dati sono anonimizzati.
          </p>
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left p-2 border">Cookie</th>
                <th className="text-left p-2 border">Fornitore</th>
                <th className="text-left p-2 border">Finalità</th>
                <th className="text-left p-2 border">Durata</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 border">_ga</td>
                <td className="p-2 border">Google Analytics</td>
                <td className="p-2 border">Analisi traffico</td>
                <td className="p-2 border">24 mesi</td>
              </tr>
              <tr>
                <td className="p-2 border">_gid</td>
                <td className="p-2 border">Google Analytics</td>
                <td className="p-2 border">Identificazione sessione</td>
                <td className="p-2 border">24 ore</td>
              </tr>
              <tr>
                <td className="p-2 border">_gat</td>
                <td className="p-2 border">Google Analytics</td>
                <td className="p-2 border">Limitazione richieste</td>
                <td className="p-2 border">1 minuto</td>
              </tr>
            </tbody>
          </table>

          <h3>Cookie di marketing (opzionali)</h3>
          <p>
            Utilizzati per tracciare l&apos;efficacia delle campagne pubblicitarie e mostrare contenuti pertinenti. Vengono installati solo previo consenso dell&apos;utente.
          </p>
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left p-2 border">Cookie</th>
                <th className="text-left p-2 border">Fornitore</th>
                <th className="text-left p-2 border">Finalità</th>
                <th className="text-left p-2 border">Durata</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 border">_fbp</td>
                <td className="p-2 border">Meta (Facebook)</td>
                <td className="p-2 border">Tracciamento conversioni</td>
                <td className="p-2 border">90 giorni</td>
              </tr>
              <tr>
                <td className="p-2 border">_fbc</td>
                <td className="p-2 border">Meta (Facebook)</td>
                <td className="p-2 border">Attribuzione click</td>
                <td className="p-2 border">90 giorni</td>
              </tr>
            </tbody>
          </table>

          <h2>3. Gestione dei cookie</h2>
          <p>L&apos;utente può gestire le proprie preferenze sui cookie in qualsiasi momento:</p>
          <ul>
            <li><strong>Tramite il banner cookie:</strong> al primo accesso al sito, un banner consente di accettare o rifiutare le diverse categorie di cookie.</li>
            <li><strong>Tramite le impostazioni del browser:</strong> ogni browser consente di bloccare o eliminare i cookie. Di seguito le guide per i principali browser:
              <ul>
                <li>Google Chrome: Impostazioni → Privacy e sicurezza → Cookie</li>
                <li>Mozilla Firefox: Impostazioni → Privacy e sicurezza</li>
                <li>Safari: Preferenze → Privacy</li>
                <li>Microsoft Edge: Impostazioni → Cookie e autorizzazioni sito</li>
              </ul>
            </li>
          </ul>
          <p>La disattivazione dei cookie tecnici potrebbe compromettere il funzionamento del sito.</p>

          <h2>4. Cookie di terze parti</h2>
          <p>Alcuni cookie sono installati da servizi terzi integrati nel sito. Per le informative privacy di questi servizi:</p>
          <ul>
            <li>Google: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">https://policies.google.com/privacy</a></li>
            <li>Meta: <a href="https://www.facebook.com/privacy/policy" target="_blank" rel="noopener noreferrer">https://www.facebook.com/privacy/policy</a></li>
          </ul>

          <h2>5. Aggiornamenti</h2>
          <p>Questa Cookie Policy può essere aggiornata periodicamente. La versione più recente è sempre disponibile su questa pagina.</p>
        </article>
      </div>
    </div>
  )
}
