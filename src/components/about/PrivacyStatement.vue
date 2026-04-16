<script setup lang="ts">
import { getUILanguage } from '@/locales';
const lang = getUILanguage();
</script>

<template>
    <template v-if="lang === 'fi'">
        <h4>Tietosuojaseloste</h4>
        <p>Päivitetty 3.6.2025</p>
        <p>
            <a
                href="http://eur-lex.europa.eu/legal-content/FI/TXT/?uri=uriserv:OJ.L_.2016.119.01.0001.01.FIN&toc=OJ:L:2016:119:FULL">
                <b>EU -tietosuoja-asetus (2016/679)</b>
            </a>
        </p>
        <h4>1 Rekisterin nimi</h4>
        <p>AIRe Platform -palvelualusta</p>
        <h4>2 Rekisterinpitäjä</h4>
        <p>
            Jyväskylän ammattikorkeakoulu Oy (Jamk)<br />
            PL 207, 40101 Jyväskylä<br />
            +358 20 743 8100
        </p>
        <h4>3 Yhteyshenkilö rekisteriä koskevissa asioissa, yhteystiedot virka-aikana</h4>
        <p>
            Rekisteristä vastaava johtaja: johtaja, Kuntoutus- ja sosiaalialan instituutti
        </p>
        <p>
            Rekisteristä vastaavan prosessin omistaja: johtava asiantuntija, Kuntoutus- ja sosiaalialan
            instituutti
        </p>
        <p>
            Sisällöllinen pääkäyttäjä: asiantuntija, Kuntoutus- ja sosiaalialan instituutti
            Tekninen pääkäyttäjä: Goodlife Technology Oy (ylläpitäjä, oikeudet Azure-tilille), Jamkin
            ICT-palvelut
        </p>
        <p>
            <i>etunimi.sukunimi[a]jamk.fi</i><br />
            Jamkin tietosuojavastaava: <a href="mailto:tietosuoja@jamk.fi">tietosuoja@jamk.fi</a>
        </p>
        <h4>4 Henkilötietojen käsittely ja sen tarkoitus</h4>
        <p>
            Henkilötietojen käsittelyn tarkoitus on digitaalisen omakuntoutuksen TKIO-toiminnan
            toteuttaminen. Henkilötietojen käsittely on tarpeen yleisen edun mukaisia tutkimustarkoituksia
            varten.
        </p>
        <p>
            AIRe Platformin käyttötarkoitus on toimia Jamkin Kuntoutus- ja sosiaalialan instituutin
            digitaalisen kuntoutuksen tekoälyavusteisena tutkimus-, kehittämis-, innovaatio- ja
            opetustoiminnan (TKIO) simulaatio- ja testausympäristönä.
        </p>
        <p>
            AIRe-palvelulla varmistetaan tehokas TKIO-toiminta, osallistujien rekisteröinti, sujuva
            keskustelu alustan tekoälyn kanssa ja muistutustoiminnallisuudet. Alustaratkaisu hyödyntää
            käyttäjän itse palveluun tallentamaa tietoa ja/tai käyttäjästä keräämäänsä tietoa personoitujen
            sisältösuositusten tekemiseen. AIRe Platformin käyttäjät jakavat itse itsestään haluamaansa
            omaan toimintakykyyn liittyvä tietoa (esimerkiksi miten toimintarajoite vaikuttaa arjen
            toimintoihin) keskustellen tekoälyavusteisen chatin kanssa. AIRe Platform käyttää tietoja
            auttaakseen käyttäjää tunnistamaan omat kuntoutuksen tarpeet ja tavoitteet sekä ehdottaakseen
            käyttäjän tilanteeseensopivaa kuntoutuksellista tai hyvinvointia tukevaa sisältöä.
            TKIO-toimintoihin liittyviä tehtäviä, joissa tietoa käsitellään, voivat muun muassa olla AIRe
            Platformin käyttäjälle ehdottamien teemojen ja sisältöjen soveltuvuuden sekä käyttäjän itselleen
            asettamien kuntoutumisen tavoitteiden saavuttamisen arviointi.
        </p>
        <p>
            AIRe Platformin rekisterinpitäjänä toimii Jamkin Kuntoutus- ja sosiaalialan instituutti.
        </p>
        <p>
            Tätä ilmoitusta voidaan täydentää erityisillä tietosuojaa ja yksityisyyttä koskevilla
            ilmoituksilla ja lausunnoilla, jotka liittyvät tietojenkäsittelyn tiettyihin muotoihin tai
            tarkoituksiin.
        </p>
        <h4>5 Rekisterin tietosisältö</h4>
        <p>
            Rekisteröidyt käyttäjät ovat Jamkin henkilökuntaa ja opiskelijoita sekä TKIO-toimintaan
            osallistuvia, vapaaehtoisia Jamkin ulkopuolisia henkilöitä, esimerkiksi tutkimukseen
            osallistuvia henkilöitä. Tutkimuksiin osallistuessaan palvelunkäyttäjät tulevat täyttämään
            erillisen, tutkimuskohtaisen suostumuslomakkeen. Jokainen hanke, joka käyttää AIRe Platformia,
            laatii ja vastaa omasta tietosuojaselosteestaan.
        </p>
        <p>
            AIRe-palvelun perusrekisteri sisältää seuraavat tiedot:
        </p>
        <ol>
            <li>
                Palvelun käyttäjän perustiedot: etunimi, sukunimi, sukupuoli, syntymävuosi, maa ja
                sähköpostiosoite. Sähköposti tallennetaan vain Jamk-käyttäjiltä, sekä teknisen pääkäyttäjän
                edustajilta, Jamkin ulkopuoliset käyttäjät kirjatuvat heille luodulla käyttäjätunnuksella,
                joka ei ole yhdistettävissä henkilötietoihin.
            </li>
            <li>
                Lisäksi muut palvelunkäyttäjän vapaaehtoisesti tallentamat, itseään koskevat tiedot, kuten
                kuvaus omasta toimintakyvyn rajoitteistaan, esim. selkäkivun vaikutuksista arjen
                toimintoihin.
            </li>
            <li>
                Henkilötietojen käyttöä koskevia kieltoja, rajoituksia, suostumuksia ja palvelunkäyttäjän
                tekemiä muita valintoja koskevat tiedot (ei käytössä tällä hetkellä).
            </li>
            <li>
                Palvelunkäyttäjän AIRessa käymien chat-keskustelujen sisältö, sekä mahdollisesti täytetyt
                kyselyt, ladatut tiedostot, lokitiedot ja viestien lähetysajat.
            </li>
        </ol>
        <p>
            Muita rekisterin tarkoitukseen liittyviä, palvelunkäyttäjään yhdistettäviä tietoja, ovat:
            käyttäjän
            IP-osoite ja rajapinnan polku, käyttäjän päätelaitteeseen ja käyttöjärjestelmään liittyvät
            tunnistetiedot, yksilöllinen satunnaisgeneroitu tunniste, sähköpostiosoitteen tiiviste, käynnin
            kellonaika, edellisen kirjautumisen ajankohta, käyttöehtojen hyväksymisen ajankohta (ei käytössä
            tällä hetkellä), rooli ja pääsyoikeudet, sähköpostivahvistuksen tila sekä mahdollinen
            käyttäjänimi,
            vieraillut sivut, käytetty selaintyyppi (esim. Internet Explorer, Firefox), verkko-osoite, josta
            käyttäjä on tullut verkkosivulle, sekä palvelin, jolta käyttäjä on tullut verkkosivulle.
        </p>
        <h4>6 Käsittelyperuste</h4>
        <p>
            AIRe Platformissa olevien henkilötietojen käsittely perustuu:
        </p>
        <ul>
            <li>Rekisteröidyn suostumus</li>
            <li>Yleinen etu ja julkinen valta</li>
            <li>EU:n yleinen tietosuoja-asetus (2016/679)</li>
            <li>Tietosuojalaki (1050/2018)</li>
            <li>Laki viranomaisen toiminnan julkisuudesta (621/1999)</li>
        </ul>
        <h4>7 Säännönmukaiset tietolähteet</h4>
        <p>
            Henkilötiedot saadaan rekisteröidyltä itseltään.
        </p>
        <h4>
            8 Säännönmukaiset tietojen luovutukset ja tietojen siirto EU:n tai Euroopan talousalueen
            ulkopuolelle
        </h4>
        <p>
            AIRe käyttää Microsoftin Azure-pilvipalvelua taustajärjestelmänä. Kaikki AIRen käyttämät
            palvelut ja taustajärjestelmät sijaitsevat EU-alueella. AIRen chat toteutus on konfiguroitu
            käyttämään Microsoftin Azure OpenAI rajapintaa, joka ei käytä keskusteluja tekoälyn opetukseen,
            eikä välitä mitään käyttäjän syötteitä kolmansille osapuolille.
            <a href="https://learn.microsoft.com/en-us/legal/cognitive-services/openai/data-privacy?tabs=azure-portal">
                Azure OpenAI -palvelun tietosuoja ja tietoturva
            </a>
        </p>
        <p>
            Pääsääntöisesti henkilötietoja ei luovuteta AIRen/Jamkin ulkopuolelle kolmansille osapuolille.
            AIRe-palvelun sisältämiä henkilötietoja voidaan siirtää EU:n tai ETA-alueen ulkopuolelle
            tilanteessa, jossa tutkimuksessa mukana oleva henkilö osallistuu kansainväliseen TKI-toimintaan.
            Mikäli henkilötietoja on tarpeen luovuttaa EU:n tai ETA-alueen ulkopuolelle, tietojen luovutus
            voidaan toteuttaa erillisen tutkimuskohtaisen sopimuksen, suostumuksen tai nimenomaisen
            lainsäädännössä säädetyn perusteen nojalla, ja se määritellään aina tutkimuskohtaisesti
            erillisellä tietosuojaselosteella.
        </p>
        <h4>9 Rekisterin suojauksen periaatteet</h4>
        <p>
            Rekisterin tietojen käsittelyssä huolehditaan siitä, ettei palvelunkäyttäjän yksityisyyttä
            perusteettomasti vaaranneta. Aineisto:
        </p>
        <ul>
            <li>
                säilytetään ja suojataan siten, etteivät ulkopuoliset niitä näe ja siten, ettei niitä voida
                vahingossa hävittää, muuttaa, luovuttaa, siirtää tai muutoin laittomasti käsitellä
            </li>
            <li>
                alustan admin-käyttäjillä on oikeus nähdä vain sellaisia käyttäjää koskevia tietoja, joita
                hän työtehtävässään tarvitsee
            </li>
            <li>
                henkilötietoja sisältävät asiakirjat hävitetään asianmukaisella tavalla kuten
                tietosuojajätteenä
            </li>
            <li>
                Verkko- ja palvelinlaitteet keskitetty lukittuihin Jamkin tiloihin, joihin on tiukka,
                rajattu pääsy. Verkko ja palvelimet ovat suojattu asianmukaisesti.
            </li>
            <li>
                Käyttöoikeudet on rajattu käyttäjäryhmittäin. Tiedon näkyvyys ja päivitysoikeus
                järjestelmään määräytyy käyttöoikeusrooleittain eri käyttäjäryhmille.
            </li>
            <li>
                Tietoihin on pääsy vain järjestelmän käyttöoikeudet saaneilla. Käyttöoikeus järjestelmään
                määräytyy henkilön työtehtävien. Jamkin henkilökuntaa sitoo työsopimuksessa määritelty
                salassapitovelvollisuus.
            </li>
        </ul>
        <h4>10 Henkilötietojen säilyttämisaika tai säilyttämisajan määrittämiskriteerit</h4>
        <p>
            AIRe-palveluun kerätyt henkilötiedot säilytettään seuraavasti:
        </p>
        <p>
            Jamk säilyttää henkilötietoja AIRe-palvelussa GDPR:n mukaisesti niin kauan kuin palvelunkäyttäjä
            käyttää AIRe-palvelua, eli hänellä on palvelussa käyttäjätili, ja niin kauan kuin
            tutkimustoiminta tietojen säilyttämistä vaatii.
        </p>
        <p>
            Admin käyttäjä voi 'deaktivoida' käyttäjätilin, poistamalla tilin kaikki käyttöoikeudet. Tällöin
            tilillä ei pääse kirjautumaan AIReen, eikä käyttämään sitä. Admin käyttäjä ei voi tällä hetkellä
            poistaa käyttäjätiliä AIResta.
        </p>
        <p>
            Jos käyttäjä poistaa oman tilin itse, kaikki hänestä kerätyt tiedot poistetaan, ellei hän
            valitse jättää anonymisoitua tietoa itsestään. Käyttäjä itse valitsee vaihtoehdon poiston
            yhteydessä.
        </p>
        <p>
            AIRen käytöstä jää aina merkkejä lokiin. Lokiin tallennettavat tiedot ovat anonymisoituja.
        </p>
        <p>
            Lokeihin jää IP-osoite ja rajapinnan polku ja aikaleimat. Käyttäjästä luettavissa on
            yksilöllinen satunnaisgeneroitu tunniste, sähköpostiosoitteen tiiviste, edellisen kirjautumisen
            ajankohta, EULAn hyväksymisen ajankohta (ei käytössä tällä hetkellä), rooli ja pääsyoikeudet,
            sähköpostivahvistuksen tila sekä mahdollinen käyttäjänimi. Kaikki muu tieto on
            käyttäjäkohtaisesti salattua, eikä niitä pysty näkemään kuin käyttäjä itse tai henkilö jolla on
            käyttäjän käyttäjätunnukset.
        </p>
        <h4>11 Profilointi ja automaattinen päätöksenteko</h4>
        <p>
            Ei, rekisterin tietoja ei käytetä automatisoituihin yksittäispäätöksiin eikä profilointiin.
            Mikäli tutkimustoiminnassa käytetään profilointia, kerrotaan tästä selkeästi erillisellä,
            tutkimuskohtaisella tietosuojaselosteella.
        </p>
        <h4>12 Rekisteröidyn oikeudet</h4>
        <p>
            Lisätietoa tietosuojasta, rekisteröidyn oikeuksista ja niiden toteuttamisesta kerrotaan
            <a href="https://www.jamk.fi/fi/jamk/tietosuoja-jamkissa">
                Jamkin tietosuojalausekkeessa ja Rekisteröidyn oikeudet
            </a>-sivulla.
        </p>
    </template>
    <template v-else>
        <h4>Privacy Statement</h4>
        <p>Updated 3 June 2025</p>
        <p>
            <a
                href="http://eur-lex.europa.eu/legal-content/FI/TXT/?uri=uriserv:OJ.L_.2016.119.01.0001.01.FIN&toc=OJ:L:2016:119:FULL">
                <b>EU General Data Protection Regulation (2016/679)</b>
            </a>
        </p>
        <h4>1 Name of the register</h4>
        <p>AIRe Platform</p>
        <h4>2 Data controller</h4>
        <p>
            Jyväskylä University of Applied Sciences (Jamk)<br />
            P.O. Box 207, 40101 Jyväskylä, Finland<br />
            +358 20 743 8100
        </p>
        <h4>3 Contact person for register matters (during office hours)</h4>
        <p>
            Responsible director of the register: Director, Institute of Rehabilitation
        </p>
        <p>
            Process owner of the register: Principal Specialist, Institute of Rehabilitation
        </p>
        <p>
            Key user: Specialist, Institute of Rehabilitation
        </p>
        <p>
            Technical administrator: Goodlife Technology Oy (administrator, Azure account rights),
            Jamk ICT Services
        </p>
        <p>
            email: <a href="mailto:aire@jamk.fi">aire@jamk.fi</a><br />
            Jamk data protection officer: <a href="mailto:tietosuoja@jamk.fi">tietosuoja@jamk.fi</a>
        </p>
        <h4>4 Purpose of processing personal data</h4>
        <p>
            The purpose of processing personal data is to implement digital self-managed
            rehabilitation and its RDI and educational activities. Processing is necessary for
            research purposes in the public interest.
        </p>
        <p>
            The AIRe Platform serves as a simulation and testing environment for AI-assisted
            research, development, innovation, and education activities at Jamk’s Institute of
            Rehabilitation.
        </p>
        <p>
            The platform enables efficient RDI and educational operations, participant registration,
            smooth interaction with the AI, and reminder functionalities. It uses data provided or
            generated by the user to offer personalized content recommendations. Users
            voluntarily share information about their functioning (e.g., how a limitation affects daily
            activities) via AI-assisted conversation. The platform helps users identify rehabilitation
            needs and goals and suggests suitable content. The RDI and educational operations on
            the platform may include evaluating the relevance of AI-suggested themes or content
            and the achievement of user-defined rehabilitation goals.
        </p>
        <p>
            Jamk’s Institute of Rehabilitation acts as the data controller.
        </p>
        <p>
            This privacy statement may be supplemented with specific privacy statements for
            particular processing purposes.
        </p>
        <h4>5 Data content of the register</h4>
        <p>
            Registered users include Jamk staff and students, as well as external volunteers
            participating in RDI or educational activities. Research participants will complete a
            separate consent form. Each project using the platform is responsible for its own
            privacy notice.
        </p>
        <p>
            Basic data the platform collects includes:
        </p>
        <ol>
            <li>
                First name, last name, gender, year of birth, country, and email address (email
                stored only for Jamk users and technical admins; external users log in with
                anonymized credentials).
            </li>
            <li>
                Voluntarily shared data with the AI- assisted conversation (e.g., descriptions of
                limitations in functioning).
            </li>
            <li>
                Preferences, restrictions, consents, and other user choices (currently not in use).
            </li>
            <li>
                Completed surveys, uploaded files, logs, and message timestamps.
            </li>
            <li>
                Technical identifiers: IP address, API path, device and OS identifiers, random unique ID,
                hashed email, login times, role and access rights, email confirmation status, username,
                visited pages, browser type, referring URL, and server source.
            </li>
        </ol>
        <h4>6 Legal basis for processing personal data</h4>
        <ul>
            <li>Consent of the data subject</li>
            <li>Public interest and official authority</li>
            <li>EU GDPR (2016/679)</li>
            <li>Finnish Data Protection Act (1050/2018)</li>
            <li>Act on the Openness of Government Activities (621/1999)</li>
        </ul>
        <h4>7 Regular sources of data</h4>
        <p>
            Data is obtained directly from the data subject.
        </p>
        <h4>8 Regular data disclosures and data transfers outside the EU/EEA</h4>
        <p>
            AIRe uses Microsoft Azure cloud services, all hosted within the EU. The Azure OpenAI
            interface does not use conversations for training or share user input with third parties.

            <a href="https://learn.microsoft.com/en-us/legal/cognitive-services/openai/data-privacy?tabs=azure-portal">
                Data, privacy, and security for Azure OpenAI Service
            </a>
        </p>
        <p>
            Data is not regularly disclosed outside Jamk/AIRe. Transfers outside the EU/EEA may occur in
            international research projects, based on specific agreements, consent, or legal grounds,
            and are defined in project-specific privacy notices.
        </p>
        <h4>9 Principles of data protection</h4>
        <ul>
            <li>
                Data is stored securely to prevent unauthorized access, loss, alteration, or
                unlawful processing.
            </li>
            <li>
                Admin users can only access data necessary for their tasks.
            </li>
            <li>
                Documents containing personal data are properly deleted.
            </li>
            <li>
                Network and server equipment are in locked Jamk facilities with restricted
                access.
            </li>
            <li>
                Access rights are role-based and limited to authorized personnel.
            </li>
            <li>
                Jamk staff are bound by confidentiality agreements.
            </li>
        </ul>
        <h4>10 Data retention</h4>
        <p>
            Data is retained as long as the user has an account or as required by research.
        </p>
        <p>
            Admins can deactivate accounts but not delete them.
        </p>
        <p>
            Users can delete their accounts and choose whether to leave anonymized data in
            the system.
        </p>
        <p>
            Logs (anonymized) retain IP, API path, timestamps, hashed email, and access
            metadata.
        </p>
        <p>
            All other data is encrypted and visible only to the user or someone with their
            credentials.
        </p>
        <h4>11 Profiling and automated decision-making</h4>
        <p>
            No automated decisions or profiling are performed. If profiling is used in research, it will
            be disclosed in a separate privacy notice.
        </p>
        <h4>12 Data subject rights</h4>
        <p>
            More information on data protection and data subject rights is available in
            <a href="https://www.jamk.fi/en/data-protection-in-jamk">
                Jamk’s Data Protection and the Data Subject Rights
            </a> page.
        </p>
    </template>
</template>