import Image from 'next/image'
import Link from 'next/link'
import { Check, X, PhoneCall, Clock, Headphones, TrendingUp, HeartHandshake, ShieldCheck, MapPin, Calendar, Smartphone, Users } from 'lucide-react'
import { Accordion, AccordionItem } from '@/components/ui/Accordion'
import { Footer } from '@/components/layout/Footer'
import { StickyCTA } from '@/components/ui/StickyCTA'

export default function LandingPage() {
    return (
        <>
            {/* SEZIONE A — HERO */}
            <section className="relative px-4 py-16 md:py-24 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
                <div className="flex-1 space-y-8">
                    <div className="space-y-4">
                        <span className="inline-block py-1.5 px-3 rounded-full bg-primary-light text-primary-main text-sm font-semibold tracking-wide uppercase">
                            Selezione aperta — Posti limitati
                        </span>

                        {/* Hero image crop 16:9 — solo mobile, riusa l'asset portrait */}
                        <div className="md:hidden relative aspect-[16/9] rounded-2xl overflow-hidden shadow-lg -mx-4">
                            <Image
                                src="/images/hero_professional_woman_1771577958488.png"
                                alt="Lavora da casa con i tuoi orari"
                                fill
                                className="object-cover object-[center_15%]"
                                priority
                            />
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-text-main leading-tight tracking-tight">
                            Niente chiamate a freddo: <br className="hidden md:block" />solo appuntamenti già prenotati.
                        </h1>
                        <p className="text-xl text-text-muted leading-relaxed max-w-2xl">
                            Lavora da casa. Solo provvigioni. Vendita consulenziale donna-donna nel settore benessere e controllo peso.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="grid sm:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <h3 className="font-semibold text-lg flex items-center gap-2">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-success flex items-center justify-center text-sm">1</span>
                                    I Vantaggi
                                </h3>
                                <ul className="space-y-2 text-text-muted text-sm md:text-base">
                                    <li className="flex items-start gap-2">
                                        <Check className="w-5 h-5 text-success shrink-0 mt-0.5" />
                                        <span><strong>Lead già caldi:</strong> ricevi contatti che hanno già prenotato — non devi cercare nessuno</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Check className="w-5 h-5 text-success shrink-0 mt-0.5" />
                                        <span><strong>Da casa, con i tuoi orari:</strong> bastano 4 ore al giorno, minimo 3 giorni a settimana</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Check className="w-5 h-5 text-success shrink-0 mt-0.5" />
                                        <span><strong>Prodotto che si vende da solo:</strong> settore in esplosione, clienti già motivate</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="space-y-3">
                                <h3 className="font-semibold text-lg flex items-center gap-2">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">2</span>
                                    I Requisiti
                                </h3>
                                <ul className="space-y-2 text-text-muted text-sm md:text-base">
                                    <li className="flex items-start gap-2">
                                        <Check className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                                        <span>Italiano impeccabile e naturale</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Check className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                                        <span>Puntualità assoluta sugli appuntamenti</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Check className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                                        <span>Empatia reale con le clienti</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4">
                        <Link href="/apply" className="inline-block w-full sm:w-auto text-center bg-primary-main hover:bg-primary-hover text-white rounded-xl px-8 py-4 font-semibold text-lg transition-colors shadow-lg shadow-primary-main/20">
                            CANDIDATI IN 3 MINUTI →
                        </Link>
                        <p className="mt-3 text-sm text-text-muted flex items-center justify-center sm:justify-start gap-3">
                            <Clock className="w-4 h-4" /> 7 step rapidi &bull; Risposta entro 48h &bull; Selezione riservata
                        </p>
                    </div>
                </div>

                <div className="flex-1 w-full relative max-w-md lg:max-w-full">
                    <div className="aspect-[4/5] relative rounded-3xl overflow-hidden shadow-2xl">
                        <Image
                            src="/images/hero_professional_woman_1771577958488.png"
                            alt="Donna professionista che lavora da casa"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                    {/* Decorative element */}
                    <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                            <PhoneCall className="text-success w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-text-muted">Prossima consulenza</p>
                            <p className="font-bold">Tra 15 min</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* SEZIONE B — COSA FARAI / NON FARAI */}
            <section className="bg-bg-alt py-20 px-4">
                <div className="max-w-4xl mx-auto space-y-12">
                    <div className="text-center space-y-6">
                        <h2 className="text-3xl md:text-4xl font-bold">Ecco esattamente cosa farai. E cosa NON dovrai fare mai.</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                                <Check className="w-6 h-6 text-success" />
                            </div>
                            <h3 className="text-xl font-bold">Cosa farai</h3>
                            <p className="text-text-muted leading-relaxed">
                                Ogni giorno riceverai un'agenda con appuntamenti già confermati. Donne che hanno già mostrato interesse, già compilato un questionario, già scelto un orario per parlare con te.
                            </p>
                            <p className="text-text-muted leading-relaxed">
                                Il tuo lavoro è semplice: collegarti all'ora stabilita, ascoltare la cliente, capire la sua situazione, e guidarla verso la soluzione più adatta a lei. Telefono, WhatsApp o Zoom — scegli tu il canale che preferisci.
                            </p>
                            <p className="text-text-muted leading-relaxed">
                                Non vendi un prodotto. Offri una consulenza. Parli con donne che hanno un problema reale — il rapporto con il proprio peso, la frustrazione di aver provato tutto — e tu hai qualcosa di concreto da proporre. Quando il prodotto è giusto e la conversazione è onesta, la vendita è una conseguenza naturale.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-6">
                                <X className="w-6 h-6 text-error" />
                            </div>
                            <h3 className="text-xl font-bold">Cosa NON farai — mai</h3>
                            <ul className="space-y-4">
                                <li className="flex gap-3 text-text-muted">
                                    <X className="w-5 h-5 text-error shrink-0 mt-0.5" />
                                    <span><strong>Mai chiamate a freddo.</strong> Zero. Nessuna lista di numeri da chiamare.</span>
                                </li>
                                <li className="flex gap-3 text-text-muted">
                                    <X className="w-5 h-5 text-error shrink-0 mt-0.5" />
                                    <span><strong>Mai lead da cercare.</strong> Non devi usare i social per trovare clienti.</span>
                                </li>
                                <li className="flex gap-3 text-text-muted">
                                    <X className="w-5 h-5 text-error shrink-0 mt-0.5" />
                                    <span><strong>Mai pressione o manipolazione.</strong> Se la cliente non è convinta, la saluti con rispetto.</span>
                                </li>
                                <li className="flex gap-3 text-text-muted">
                                    <X className="w-5 h-5 text-error shrink-0 mt-0.5" />
                                    <span><strong>Mai gestione ordini o logistica.</strong> Tu parli con le clienti. Il resto lo gestiamo noi.</span>
                                </li>
                                <li className="flex gap-3 text-text-muted">
                                    <X className="w-5 h-5 text-error shrink-0 mt-0.5" />
                                    <span><strong>Mai burocrazia interna.</strong> CRM precompilato, agenda automatica.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* SEZIONE C — LEAD CALDI */}
            <section className="py-20 px-4">
                <div className="max-w-5xl mx-auto flex flex-col items-center text-center space-y-12">
                    <div className="max-w-3xl space-y-6">
                        <h2 className="text-3xl md:text-4xl font-bold">Perché "lead caldi" cambia tutto.</h2>
                        <p className="text-lg text-text-muted leading-relaxed">
                            Se hai lavorato nella vendita, sai che il 90% della fatica è trovare qualcuno che voglia ascoltarti. Qui quel problema non esiste. Le nostre clienti arrivano da campagne pubblicitarie mirate.
                        </p>
                        <p className="text-lg text-text-muted leading-relaxed">
                            Tu non convinci nessuno. Tu aiuti chi ha già deciso di informarsi. La differenza è enorme — nel tasso di conversione, nella qualità della conversazione, e nella soddisfazione di lavorare senza forzature.
                        </p>
                    </div>

                    <div className="w-full relative aspect-[16/9] md:aspect-[21/9] max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-xl">
                        <Image
                            src="/images/flexibility_home_1771577976417.png"
                            alt="Lavoro da casa con lead caldi"
                            fill
                            className="object-cover"
                        />
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 w-full max-w-4xl pt-8">
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 bg-primary-light text-primary-main rounded-full flex items-center justify-center mx-auto text-2xl font-bold">1</div>
                            <h4 className="font-bold text-lg">Vede l'annuncio</h4>
                            <p className="text-text-muted text-sm">La cliente clicca e compila il questionario di pre-qualifica</p>
                        </div>
                        <div className="text-center space-y-4 relative">
                            <div className="hidden md:block absolute top-8 left-0 -ml-[50%] w-full h-[2px] bg-primary-light -z-10" />
                            <div className="w-16 h-16 bg-primary-light text-primary-main rounded-full flex items-center justify-center mx-auto text-2xl font-bold">2</div>
                            <h4 className="font-bold text-lg">Prenota l'appuntamento</h4>
                            <p className="text-text-muted text-sm">Sceglie un giorno e un orario preciso per parlare</p>
                        </div>
                        <div className="text-center space-y-4 relative">
                            <div className="hidden md:block absolute top-8 left-0 -ml-[50%] w-full h-[2px] bg-primary-light -z-10" />
                            <div className="w-16 h-16 bg-primary-main text-white rounded-full flex items-center justify-center mx-auto text-2xl font-bold">3</div>
                            <h4 className="font-bold text-lg">Tu la chiami</h4>
                            <p className="text-text-muted text-sm">All'ora stabilita fai la consulenza e la proposta. E chiudi la vendita.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* SEZIONE D — COMPENSO */}
            <section className="bg-bg-alt py-20 px-4 border-y border-gray-200">
                <div className="max-w-5xl mx-auto space-y-12">
                    <div className="text-center max-w-3xl mx-auto space-y-6">
                        <h2 className="text-3xl md:text-4xl font-bold">Quanto puoi guadagnare. I numeri, senza giri di parole.</h2>
                        <p className="text-lg text-text-muted leading-relaxed">
                            Collaborazione a provvigione. Nessun fisso mensile, ma anche nessun tetto massimo. Guadagni il <strong>10% su ogni vendita conclusa</strong>. Ogni ora che lavori è un'ora di consulenza effettiva.
                        </p>
                        <div className="inline-flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                            <div>
                                <span className="block text-sm text-text-muted">Kit singolo (1 mese)</span>
                                <span className="font-bold text-lg">€19,70 <span className="text-sm font-normal text-text-muted">provvigione</span></span>
                            </div>
                            <div className="hidden sm:block w-[1px] bg-gray-200" />
                            <div>
                                <span className="block text-sm text-text-muted">Kit completo (3 mesi)</span>
                                <span className="font-bold text-lg text-primary-main">€39,90 <span className="text-sm font-normal text-text-muted">provvigione</span></span>
                            </div>
                        </div>
                        <p className="text-sm text-text-muted">Il kit completo è il più richiesto. Questo significa che la maggior parte delle tue vendite genererà la provvigione più alta.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Scenario A */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4 flex flex-col">
                            <h3 className="font-bold text-xl text-text-main pb-2 border-b border-gray-100">Scenario A</h3>
                            <p className="font-semibold text-primary-main">Impegno costante</p>
                            <ul className="text-sm text-text-muted space-y-2 flex-1">
                                <li>• 5 ore/giorno, 5 giorni/sett</li>
                                <li>• ~50 consulenze/settimana</li>
                                <li>• Tasso chiusura 35%</li>
                            </ul>
                            <div className="pt-4 border-t border-gray-100">
                                <p className="text-2xl font-black text-text-main">~€2.500<span className="text-base font-normal text-text-muted">/mese</span></p>
                            </div>
                        </div>

                        {/* Scenario B */}
                        <div className="bg-primary-light/20 rounded-2xl p-6 shadow-lg border-2 border-primary-main space-y-4 flex flex-col relative md:-translate-y-4 z-10">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-main text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                Il più comune
                            </div>
                            <h3 className="font-bold text-xl text-text-main pb-2 border-b border-gray-100">Scenario B</h3>
                            <p className="font-semibold text-primary-main">Ritmo sostenuto</p>
                            <ul className="text-sm text-text-muted space-y-2 flex-1">
                                <li>• 6 ore/giorno, 5-6 giorni/sett</li>
                                <li>• ~66 consulenze/settimana</li>
                                <li>• Tasso chiusura 35%</li>
                            </ul>
                            <div className="pt-4 border-t border-gray-100">
                                <p className="text-3xl font-black text-primary-main">~€3.400<span className="text-base font-normal text-text-muted">/mese</span></p>
                            </div>
                        </div>

                        {/* Scenario C */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4 flex flex-col">
                            <h3 className="font-bold text-xl text-text-main pb-2 border-b border-gray-100">Scenario C</h3>
                            <p className="font-semibold text-primary-main">Performance top</p>
                            <ul className="text-sm text-text-muted space-y-2 flex-1">
                                <li>• 7-8 ore/giorno, 6 giorni/sett</li>
                                <li>• ~84 consulenze/settimana</li>
                                <li>• Tasso chiusura 40%</li>
                            </ul>
                            <div className="pt-4 border-t border-gray-100">
                                <p className="text-2xl font-black text-text-main">~€5.000+<span className="text-base font-normal text-text-muted">/mese</span></p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 md:p-6 text-sm text-amber-900">
                        <p><strong>⚠️ DISCLAIMER GUADAGNI:</strong> IMPORTANTE: I guadagni indicati sopra sono stime basate su scenari ipotetici e dati osservati internamente. Non costituiscono in alcun modo una promessa, garanzia o previsione di risultato. I risultati effettivi variano significativamente in base a molteplici fattori individuali. La collaborazione è a provvigione variabile — non è previsto alcun compenso fisso, minimo garantito o rimborso spese.</p>
                    </div>

                    <div className="text-center">
                        <Link href="/apply" className="inline-block bg-primary-main hover:bg-primary-hover text-white rounded-xl px-8 py-4 font-semibold text-lg transition-colors">
                            INIZIA LA TUA CANDIDATURA
                        </Link>
                    </div>
                </div>
            </section>

            {/* SEZIONE E — REQUISITI & STANDARD */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto space-y-12">
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl md:text-4xl font-bold">Chi cerchiamo. E chi non cerchiamo.</h2>
                        <p className="text-lg text-text-muted">Non selezioniamo in base al curriculum. Selezioniamo in base a chi sei e come comunichi.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-green-50/50 p-8 rounded-2xl border border-green-100 space-y-6">
                            <h3 className="text-xl font-bold text-green-900">Cerchiamo te se:</h3>
                            <ul className="space-y-4">
                                {[
                                    "Parli italiano in modo impeccabile e naturale. Le nostre clienti sono italiane — devono sentirsi a casa.",
                                    "Sei puntuale. Punto. Nessun ritardo, nessuna scusa alle consulenze.",
                                    "Sai ascoltare prima di parlare. La vendita consulenziale parte dall'ascolto.",
                                    "Hai empatia autentica. Servono delicatezza, rispetto e zero giudizio.",
                                    "Hai almeno 4 ore al giorno e 3 giorni a settimana.",
                                    "Sei autonoma e affidabile."
                                ].map((text, i) => (
                                    <li key={i} className="flex gap-3 text-green-800">
                                        <Check className="w-5 h-5 text-success shrink-0 mt-0.5" />
                                        <span>{text}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-red-50/50 p-8 rounded-2xl border border-red-100 space-y-6">
                            <h3 className="text-xl font-bold text-red-900">NON è per te se:</h3>
                            <ul className="space-y-4">
                                {[
                                    "Cerchi un fisso mensile garantito — qui si lavora a provvigione, senza rete.",
                                    "Non puoi garantire costanza — sparire per giorni senza preavviso non è accettabile.",
                                    "Non ti senti a tuo agio a parlare di peso, corpo e benessere femminile.",
                                    "Pensi che vendere significhi \"convincere\" qualcuno a comprare qualcosa che non vuole.",
                                    "Non hai una connessione internet stabile e un ambiente tranquillo per le chiamate."
                                ].map((text, i) => (
                                    <li key={i} className="flex gap-3 text-red-800">
                                        <X className="w-5 h-5 text-error shrink-0 mt-0.5" />
                                        <span>{text}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* SEZIONE F — SUPPORTO */}
            <section className="bg-bg-alt py-20 px-4">
                <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12">

                    <div className="flex-1 w-full max-w-lg lg:max-w-none">
                        <div className="aspect-[4/5] relative rounded-3xl overflow-hidden shadow-xl">
                            <Image
                                src="/images/consultation_phone_1771578005162.png"
                                alt="Supporto e formazione continua"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>

                    <div className="flex-1 space-y-8">
                        <div className="space-y-4">
                            <h2 className="text-3xl md:text-4xl font-bold">Non ti lasciamo sola. Mai.</h2>
                            <p className="text-lg text-text-muted">Entrare nella squadra significa ricevere tutto ciò che ti serve per iniziare a vendere — anche se non hai mai lavorato in questo settore specifico.</p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center shrink-0">
                                    <span className="text-primary-main font-bold">1</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg mb-1">Formazione iniziale completa</h4>
                                    <p className="text-text-muted text-sm">Impari come funziona il prodotto, come si svolge una consulenza e le domande più frequenti. Impari un metodo, non uno script rigido.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center shrink-0">
                                    <span className="text-primary-main font-bold">2</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg mb-1">CRM e agenda preconfigurati</h4>
                                    <p className="text-text-muted text-sm">Non devi imparare software complicati. Accedi a un pannello semplice dove vedi i tuoi appuntamenti del giorno.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center shrink-0">
                                    <span className="text-primary-main font-bold">3</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg mb-1">Supporto continuo e aggiornamenti</h4>
                                    <p className="text-text-muted text-sm">Hai una domanda? Una cliente difficile? C'è sempre qualcuno a cui scrivere. Riceverai periodicamente aggiornamenti sui prodotti.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* SEZIONE G — PROCESSO SELEZIONE */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto space-y-12">
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl md:text-4xl font-bold">Come funziona la selezione. <br />3 step, nessuna sorpresa.</h2>
                    </div>

                    <div className="relative aspect-[16/9] md:aspect-[21/9] w-full max-w-3xl mx-auto hidden md:block">
                        <Image
                            src="/images/selection_process_1771578057954.png"
                            alt="Processo in 3 step"
                            fill
                            className="object-contain"
                        />
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative pt-12 mt-6 md:mt-0">
                            <div className="w-12 h-12 bg-primary-main text-white rounded-full flex items-center justify-center font-bold text-xl absolute -top-6 left-6 shadow-md">1</div>
                            <h4 className="font-bold text-lg mb-3">Candidatura online</h4>
                            <p className="text-text-muted text-sm leading-relaxed">Compili il form. Ti chiediamo le informazioni essenziali e un paio di domande pratiche per capire come gestisci una conversazione di vendita.</p>
                            <div className="mt-4 text-xs font-semibold text-primary-main uppercase tracking-wide">3 minuti</div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative pt-12 mt-6 md:mt-0">
                            <div className="w-12 h-12 bg-primary-main text-white rounded-full flex items-center justify-center font-bold text-xl absolute -top-6 left-6 shadow-md">2</div>
                            <h4 className="font-bold text-lg mb-3">Valutazione</h4>
                            <p className="text-text-muted text-sm leading-relaxed">Il nostro team esamina ogni candidatura. Se il tuo profilo è in linea, ti contattiamo per un breve colloquio conoscitivo.</p>
                            <div className="mt-4 text-xs font-semibold text-primary-main uppercase tracking-wide">24-48 ore</div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative pt-12 mt-6 md:mt-0">
                            <div className="w-12 h-12 bg-primary-main text-white rounded-full flex items-center justify-center font-bold text-xl absolute -top-6 left-6 shadow-md">3</div>
                            <h4 className="font-bold text-lg mb-3">Colloquio e Onboarding</h4>
                            <p className="text-text-muted text-sm leading-relaxed">Una chiamata informale. Vogliamo conoscerti. Se ci troviamo bene, ti inviamo l'onboarding e puoi iniziare entro pochi giorni.</p>
                            <div className="mt-4 text-xs font-semibold text-primary-main uppercase tracking-wide">15-20 minuti</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SEZIONE H — FAQ */}
            <section className="bg-bg-alt py-20 px-4">
                <div className="max-w-3xl mx-auto space-y-10">
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl md:text-4xl font-bold">Domande frequenti</h2>
                        <p className="text-lg text-text-muted">Le risposte che cercavi.</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-8">
                        <Accordion>
                            <AccordionItem
                                question="Devo avere esperienza nella vendita?"
                                answer="Esperienza pregressa nella vendita telefonica o consulenziale è fortemente preferita, ma non è l'unico criterio. Valutiamo la persona nel suo insieme: capacità comunicative, empatia, affidabilità. Se non hai esperienza diretta ma hai lavorato a contatto con il pubblico, potresti comunque essere un buon profilo."
                            />
                            <AccordionItem
                                question="C'è un fisso mensile?"
                                answer="No. La collaborazione è interamente a provvigione — 10% su ogni vendita conclusa. Non è previsto alcun compenso fisso, minimo garantito o rimborso spese. Guadagni in proporzione diretta ai risultati che ottieni."
                            />
                            <AccordionItem
                                question="Quante ore devo lavorare?"
                                answer="Il minimo richiesto è 4 ore al giorno per almeno 3 giorni a settimana. Questo è il livello minimo per ricevere un numero sufficiente di appuntamenti e costruire un ritmo di lavoro."
                            />
                            <AccordionItem
                                question="Posso scegliere i miei orari?"
                                answer="Hai flessibilità nella scelta delle fasce orarie, che concorderai in fase di onboarding. Una volta confermata una fascia, però, è fondamentale essere presente e puntuale."
                            />
                            <AccordionItem
                                question="Da dove posso lavorare? Mi serve attrezzatura?"
                                answer="Da qualsiasi luogo con una connessione internet stabile e un ambiente tranquillo. Non servono cuffiette professionali o attrezzatura speciale — basta il tuo telefono o il tuo computer."
                            />
                            <AccordionItem
                                question="Cosa succede se una cliente non è convinta?"
                                answer="La ringrazi e la saluti con rispetto. Non c'è alcuna pressione per 'chiudere a tutti i costi'. L'etica nella vendita non è un optional — è il nostro standard."
                            />
                            <AccordionItem
                                question="Posso candidarmi se vivo fuori dall'Italia?"
                                answer="Sì, a condizione che il tuo italiano sia perfetto e naturale — senza accento straniero marcato. Le clienti sono italiane e devono sentirsi a loro agio."
                            />
                        </Accordion>
                    </div>

                    <div className="text-center pt-8">
                        <Link href="/apply" className="inline-block w-full sm:w-auto text-center bg-primary-main hover:bg-primary-hover text-white rounded-xl px-8 py-4 font-semibold text-lg transition-colors shadow-lg shadow-primary-main/20">
                            CANDIDATI IN 3 MINUTI →
                        </Link>
                    </div>
                </div>
            </section>

            {/* SEZIONE I — CTA FINALE */}
            <section className="py-24 px-4 bg-white relative overflow-hidden">
                <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
                    <h2 className="text-4xl md:text-5xl font-black">Pronta a iniziare?</h2>
                    <p className="text-xl text-text-muted max-w-2xl mx-auto leading-relaxed">
                        Hai letto fin qui. Sai come funziona, cosa offriamo, cosa chiediamo. <br className="hidden md:block" />Se cerchi un lavoro flessibile basato sulle tue capacità, invia la tua candidatura.
                    </p>
                    <div className="pt-8">
                        <Link href="/apply" className="inline-block bg-primary-main hover:bg-primary-hover text-white rounded-xl px-12 py-5 font-bold text-xl transition-all hover:scale-105 shadow-xl shadow-primary-main/30">
                            INVIA LA CANDIDATURA →
                        </Link>
                        <p className="mt-4 text-sm text-text-muted">
                            Valutazione entro 48h • Rispondiamo a tutte
                        </p>
                    </div>
                </div>
                <div className="absolute right-0 top-0 w-1/3 h-full opacity-10 hidden lg:block pointer-events-none">
                    <Image
                        src="/images/cta_finale_1771578075316.png"
                        alt="Background CTA"
                        fill
                        className="object-cover object-left"
                    />
                </div>
            </section>

            <Footer />
            <StickyCTA />
        </>
    )
}
