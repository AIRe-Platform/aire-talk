<script setup lang="ts">
import { getUILanguage } from '@/locales';
const lang = getUILanguage();
</script>

<template>
    <template v-if="lang === 'fi'">
        <h3>Tietosuojaseloste - AIRe-palvelu</h3>
        <p>Päivitetty 22.9.2026</p>
        <p>
            <a
                href="http://eur-lex.europa.eu/legal-content/FI/TXT/?uri=uriserv:OJ.L_.2016.119.01.0001.01.FIN&toc=OJ:L:2016:119:FULL">
                <b>EU -tietosuoja-asetus (2016/679)</b>
            </a>
        </p>
        <p>
            <i>
                Tämä tietosuojaseloste koskee AIRe-palvelun käyttäjiä, jotka kirjautuvat palveluun
                henkilökohtaisilla käyttäjätunnuksillaan (kirjautunut käyttäjä). Tietosuojaseloste ei
                koske kutsulinkin kautta palvelua käyttäviä henkilöitä (kokeilukäyttäjät), koska tässä
                tapauksessa palvelua käytetään anonyymisti eikä henkilötietoja kerätä.
            </i>
        </p>

        <h4>1 Rekisterin nimi</h4>
        <p>AIRe-palvelu (”AIRe”)</p>

        <h4>2 Rekisterinpitäjä</h4>
        <p>
            Jyväskylän ammattikorkeakoulu Oy (”Jamk”)<br />
            PL 207, 40101 Jyväskylä<br />
            +358 20 743 8100
        </p>

        <h4>3 Yhteyshenkilö rekisteriä koskevissa asioissa</h4>
        <p>
            Rekisteristä vastaava johtaja: Pekka Anttila, johtaja, Kuntoutus- ja sosiaalialan instituutti
        </p>
        <p>
            Rekisteristä vastaavan prosessin omistaja: Katariina Korniloff, johtava tutkija,
            Kuntoutus- ja sosiaalialan instituutti
        </p>
        <p>
            Tuoteomistaja: Minna Eriksen, asiantuntija, Kuntoutus- ja sosiaalialan instituutti
        </p>
        <p>
            Tekninen ylläpitäjä: Goodlife Technology Oy, Jamkin ICT-palvelut
        </p>
        <p>
            etunimi.sukunimi[a]jamk.fi
        </p>
        <p>
            Jamkin tietosuojavastaava: <a href="mailto:tietosuoja@jamk.fi">tietosuoja@jamk.fi</a>
        </p>

        <h4>4 Henkilötietojen käsittely ja sen tarkoitus</h4>
        <p>
            Henkilötietojen käsittelyn tarkoitus on digitaalisen omakuntoutuksen sekä tutkimus-,
            kehittämis-, innovaatio- ja opetustoiminnan (”TKIO”) toteuttaminen: AIRe toimii Jamkin
            Kuntoutus- ja sosiaalialan instituutissa digitaalisen kuntoutuksen tekoälyavusteisena
            testaus- ja simulaatioympäristönä.
        </p>
        <p>
            Palvelu mahdollistaa käyttäjän ja tekoälyavusteisen ohjaajan välisen vuorovaikutuksen
            luonnollisella kielellä sekä kuntoutukseen liittyvän tiedon, ohjauksen ja omahoidon
            tuen tarjoamisen.
        </p>
        <p>
            <b>Kirjautuneet käyttäjät</b> antavat palvelulle luvan tallennettujen käyttäjätietojen
            hyödyntämiseen AIRen tekemien sisältöehdotusten kohdentamisessa. Käyttäjätietoja
            ovat nimi, sukupuoli, syntymävuosi, maa, sekä muut tiedot esim. omaan
            toimintakykyyn liittyen, joita käyttäjä lisää ja tallentaa palveluun. <b>Kokeilukäyttäjät</b> eivät
            voi lisätä eikä tallentaa itsestään käyttäjätietoja, jolloin AIRen käyttö on anonyymia.
        </p>
        <p>
            <b>Sekä kirjautuneiden että kokeilukäyttäjän</b> AIRe-keskustelussa jakamaa tietoa omasta
            tilanteestaan palvelu hyödyntää tukeakseen käyttäjää tunnistamaan omia
            kuntoutustarpeita ja tavoitteita sekä ehdottaakseen käyttäjälle kohdennettua sisältöä.
            TKIO-toiminnassa henkilötietoja voidaan käsitellä esimerkiksi arvioitaessa AIRen
            käyttäjälle ehdottamien teemojen ja sisältöjen soveltuvuutta sekä analysoitaessa
            käyttäjän asettamia kuntoutumistavoitteita.
        </p>
        <p>
            AIRen rekisterinpitäjänä toimii Jamkin Kuntoutus- ja sosiaalialan instituutti.
        </p>
        <p>
            Tätä ilmoitusta voidaan täydentää erityisillä tietosuojaa ja yksityisyyttä koskevilla
            ilmoituksilla ja lausunnoilla, jotka liittyvät tietojenkäsittelyn tiettyihin muotoihin tai
            tarkoituksiin.
        </p>

        <h4>5 Rekisterin tietosisältö</h4>
        <p>
            Palveluun <b>kirjautuneet käyttäjät</b> ovat Jamkin henkilökuntaa ja opiskelijoita sekä TKIO-toimintaan
            osallistuvia, vapaaehtoisia henkilöitä tai yhteistyökumppaneita Jamkin
            ulkopuolelta. AIRe-palvelua hyödyntäville hankkeille tai kokeiluille voidaan laatia omat
            tietosuojailmoitukset ja pyytää käyttäjiltä tarvittaessa erilliset suostumukset. Kukin
            hanke/kokeilu vastaa omasta henkilötietojen käsittelystään ja siihen liittyvistä
            tietosuojavelvoitteistaan.
        </p>
        <p>
            AIRe-palvelun perusrekisteri sisältää seuraavat tiedot:
        </p>
        <ol>
            <li>
                Palvelun käyttäjän perustiedot: etunimi, sukunimi, sukupuoli, syntymävuosi,
                maa ja sähköpostiosoite. Osa käyttäjistä voi kirjautua palveluun heille luoduilla
                demokäyttäjätunnuksilla, jolloin palvelu ei pyydä eikä tallenna käyttäjän
                sähköpostiosoitetta.
            </li>
            <li>
                Muut käyttäjän vapaaehtoisesti tallentamat, itseään koskevat tiedot, kuten
                kuvaus toimintakyvyn rajoitteista
            </li>
            <li>
                Henkilötietojen käyttöä koskevia kieltoja, rajoituksia, suostumuksia ja käyttäjän
                tekemiä muita valintoja koskevat tiedot
            </li>
            <li>
                Käynnin kellonaika, edellisen kirjautumisen ajankohta, käyttäjän palvelussa
                käyttämä aika, viestien lähetysajat, käyttäjän avaamat sisällöt ja vieraillut sivut,
                käyttöliittymän kieli
            </li>
            <li>
                Käyttäjän täyttämät kyselyt tallentuvat tietokantaan, mutta kyselyn asetuksista
                ja käyttäjän suostumuksesta riippuen niitä ei automaattisesti voi yhdistää
                henkilötietoihin
            </li>
            <li>
                Muita rekisterin tarkoitukseen liittyviä, käyttäjään yhdistettäviä tietoja ovat:
                käyttäjän IP-osoite ja rajapinnan polku, käyttäjän päätelaitteeseen ja
                käyttöjärjestelmään liittyvät tunnistetiedot, yksilöllinen satunnaisgeneroitu
                tunniste, sähköpostiosoitteen tiiviste, rooli ja pääsyoikeudet,
                sähköpostivahvistuksen tila sekä mahdollinen käyttäjänimi, käytetty
                selaintyyppi, verkko-osoite, josta käyttäjä on tullut verkkosivulle, sekä palvelin,
                jolta käyttäjä on tullut verkkosivulle
            </li>
        </ol>

        <h4>6 Käsittelyperuste</h4>
        <p>
            Palvelussa olevien henkilötietojen käsittely perustuu seuraaviin oikeusperusteisiin ja
            säädöksiin:
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
            AIRe käyttää Microsoftin Azure-pilvipalvelua taustajärjestelmänä. Kaikki AIRen
            käyttämät palvelut ja taustajärjestelmät sijaitsevat EU-alueella. AIRen chat-toteutus on
            konfiguroitu käyttämään Microsoftin Azure OpenAI rajapintaa, joka ei käytä keskusteluja
            tekoälyn opetukseen, eikä välitä mitään käyttäjän syötteitä kolmansille osapuolille.
        </p>
        <p>
            Pääsääntöisesti henkilötietoja ei luovuteta AIRen/Jamkin ulkopuolelle kolmansille
            osapuolille. AIRen sisältämiä henkilötietoja voidaan siirtää EU:n tai ETA-alueen
            ulkopuolelle tilanteessa, jossa hankkeessa mukana oleva henkilö osallistuu
            kansainväliseen TKIO-toimintaan. Mikäli henkilötietoja on tarpeen luovuttaa EU:n tai
            ETA-alueen ulkopuolelle, tietojen luovutus toteutetaan erillisen hankekohtaisen
            sopimuksen, suostumuksen tai nimenomaisen lainsäädännössä säädetyn perusteen
            nojall. Tämä määritellään aina hankekohtaisesti erillisellä tietosuojaselosteella.
        </p>

        <h4>9 Rekisterin suojauksen periaatteet</h4>
        <p>
            Rekisterin tietojen käsittelyssä huolehditaan siitä, ettei käyttäjän yksityisyyttä
            perusteettomasti vaaranneta.
        </p>
        <ul>
            <li>
                Aineisto säilytetään ja suojataan siten, etteivät ulkopuoliset niitä näe, ja siten,
                ettei niitä voida vahingossa hävittää, muuttaa, luovuttaa, siirtää tai muutoin
                laittomasti käsitellä.
            </li>
            <li>
                Alustan avain- ja pääkäyttäjillä on oikeus nähdä vain sellaisia käyttäjää koskevia
                tietoja, joita hän työtehtävässään tarvitsee.
            </li>
            <li>
                Verkko- ja palvelinlaitteet keskitetty lukittuihin Jamkin tiloihin, joihin on tiukka,
                rajattu pääsy. Verkko ja palvelimet ovat suojattu asianmukaisesti.
            </li>
            <li>
                Käyttöoikeudet on rajattu käyttäjäryhmittäin. Tiedon näkyvyys ja päivitysoikeus
                järjestelmään määräytyy käyttöoikeusrooleittain eri käyttäjäryhmille työtehtävien
                perusteella. Jamkin henkilökuntaa sitoo työsopimuksessa määritelty
                salassapitovelvollisuus.
            </li>
        </ul>

        <h4>10 Henkilötietojen säilyttämisaika tai säilyttämisajan määrittämiskriteerit</h4>
        <p>
            Jamk säilyttää henkilötietoja AIRe-palvelussa GDPR:n mukaisesti niin kauan kuin
            käyttäjä käyttää palvelua, eli hänellä on palvelussa käyttäjätili, ja niin kauan kuin
            hanketoiminta tietojen säilyttämistä vaatii.
        </p>
        <p>
            Palvelun käyttäjä voi poistaa itse oman tilinsä, jolloin kaikki hänestä kerätyt tiedot
            poistetaan. Vaihtoehtoisesti käyttäjä voi valita tietojensa anonymisoinnin, jolloin tiedot
            jäävät palveluun, mutta niitä ei voi yhdistää käyttäjään. Myös palvelun ylläpitäjä voi
            poistaa tiedot käyttäjän puolesta.
        </p>

        <h4>11 Profilointi ja automaattinen päätöksenteko</h4>
        <p>
            Rekisterin tietoja ei käytetä automatisoituihin yksittäispäätöksiin eikä profilointiin.
            Mikäli hanketoiminnassa käytetään profilointia, kerrotaan tästä selkeästi erillisellä,
            hankekohtaisella tietosuojaselosteella.
        </p>

        <h4>12 Rekisteröidyn oikeudet</h4>
        <p>
            Lisätietoa tietosuojasta, rekisteröidyn oikeuksista ja niiden toteuttamisesta kerrotaan
            <a href="https://www.jamk.fi/fi/tietosuoja-jamkissa">Tietosuoja Jamkissa</a>-sivulla.
        </p>
    </template>

    <template v-else-if="lang === 'sv'">
        <h3>Dataskyddsbeskrivning - AIRe-tjänsten</h3>
        <p>Uppdaterad 22.9.2026</p>
        <p>
            <a href="https://eur-lex.europa.eu/legal-content/SV/TXT/?uri=CELEX:32016R0679">
                <b>EU:s allmänna dataskyddsförordning (2016/679)</b>
            </a>
        </p>
        <p>
            <i>
                Denna dataskyddsbeskrivning gäller användare av AIRe-tjänsten som loggar in i tjänsten
                med personliga användaruppgifter (“inloggade användare”). Dataskyddsbeskrivningen
                gäller inte personer som använder tjänsten via en inbjudningslänk (“testanvändare”),
                eftersom tjänsten i dessa fall används anonymt och inga personuppgifter samlas in.
            </i>
        </p>

        <h4>1 Registrets namn</h4>
        <p>AIRe-tjänsten (“AIRe”)</p>

        <h4>2 Personuppgiftsansvarig</h4>
        <p>
            Jyväskylä yrkeshögskola Ab (“Jamk”)<br />
            PB 207, 40101 Jyväskylä<br />
            +358 20 743 8100
        </p>

        <h4>3 Kontaktpersoner i ärenden som gäller registret</h4>
        <p>
            Chef med ansvar för registret: Pekka Anttila, direktör, Institutet för rehabilitering och
            sociala studier
        </p>
        <p>
            Processägare med ansvar för registret: Katariina Korniloff, ledande forskare, Institutet
            för rehabilitering och sociala studier
        </p>
        <p>
            Produktägare: Minna Eriksen, specialist, Institutet för rehabilitering och sociala studier
        </p>
        <p>
            Teknisk administratör: Goodlife Technology Oy, Jamks IKT-tjänster
        </p>
        <p>
            fornamn.efternamn[a]jamk.fi
        </p>
        <p>
            Jamks dataskyddsombud: <a href="mailto:tietosuoja@jamk.fi">tietosuoja@jamk.fi</a>
        </p>

        <h4>4 Behandling av personuppgifter och ändamålet med behandlingen</h4>
        <p>
            Ändamålet med behandlingen av personuppgifter är att genomföra digital
            egenrehabilitering samt forsknings-, utvecklings-, innovations- och
            utbildningsverksamhet (“FoIU”). Vid Jamks Institut för rehabilitering och sociala studier
            fungerar AIRe som en AI-assisterad test- och simuleringsmiljö för digital rehabilitering.
        </p>
        <p>
            Tjänsten möjliggör interaktion på naturligt språk mellan användaren och en AI-assisterad handledare samt
            tillhandahåller information och vägledning om rehabilitering och stöd för egenvård.
        </p>
        <p>
            <b>Inloggade användare</b> ger tjänsten tillstånd att använda lagrade användaruppgifter för
            att anpassa de innehållsförslag som AIRe ger. Användaruppgifterna omfattar namn,
            kön, födelseår och land samt andra uppgifter som användaren lägger till och sparar i
            tjänsten, till exempel uppgifter om den egna funktionsförmågan. <b>Testanvändare</b> kan
            inte lägga till eller spara användaruppgifter om sig själva, vilket innebär att
            användningen av AIRe är anonym.
        </p>
        <p>
            Tjänsten använder information som <b>både inloggade användare och testanvändare</b>
            delar om sin egen situation i AIRe-samtalet för att stödja användaren i att identifiera
            sina rehabiliteringsbehov och mål samt föreslå anpassat innehåll. Inom FoIU-verksamheten kan personuppgifter
            behandlas till exempel när man bedömer lämpligheten hos de teman och det innehåll som AIRe föreslår för
            användaren samt analyserar de rehabiliteringsmål som användaren har ställt upp.
        </p>
        <p>
            Jamks Institut för rehabilitering och sociala studier är personuppgiftsansvarig för AIRe.
        </p>
        <p>
            Denna beskrivning kan kompletteras med särskilda meddelanden och uttalanden om
            dataskydd och integritet som gäller vissa former av eller ändamål med behandlingen av
            uppgifter
        </p>

        <h4>5 Registrets datainnehåll</h4>
        <p>
            Inloggade användare av tjänsten är anställda och studerande vid Jamk samt frivilliga
            personer utanför Jamk som deltar i FoIU-verksamhet. För projekt eller pilot som
            använder AIRe-tjänsten kan separata dataskyddsmeddelanden utarbetas och
            användarna kan vid behov ombes lämna separata samtycken. Varje projekt eller pilot
            ansvarar för sin egen behandling av personuppgifter och de dataskyddsskyldigheter
            som hör samman med behandlingen.
        </p>
        <p>
            AIRe-tjänstens register innehåller följande uppgifter:
        </p>
        <ol>
            <li>
                Grundläggande uppgifter om tjänstens användare: förnamn, efternamn, kön,
                födelseår, land och e-postadress. En del användare kan logga in i tjänsten med
                demoanvändaruppgifter som har skapats för dem. I sådana fall begär eller lagrar
                tjänsten inte användarens e-postadress
            </li>
            <li>
                Andra uppgifter om sig själv som användaren frivilligt sparar, såsom en
                beskrivning av begränsningar i funktionsförmågan
            </li>
            <li>
                Uppgifter om förbud, begränsningar och samtycken som gäller användningen av
                personuppgifter samt om andra val som användaren har gjort
            </li>
            <li>
                Tidpunkten för besöket, tidpunkten för föregående inloggning, den tid som
                användaren har använt tjänsten, tidpunkter då meddelanden skickades, innehåll
                som användaren öppnade och sidor som användaren besökte samt
                användargränssnittets språk
            </li>
            <li>
                Svar på enkäter som användaren fyller i sparas i databasen, men beroende på
                enkätens inställningar och användarens samtycke kan de inte nödvändigtvis
                automatiskt kopplas till personuppgifter
            </li>
            <li>
                Andra uppgifter som anknyter till registrets ändamål och kan kopplas till
                användaren är användarens IP-adress och sökvägen i programmeringsgränssnittet, identifieringsuppgifter
                om användarens enhet och operativsystem, en unik slumpmässigt genererad identifierare, en hash av
                e-postadressen, roll och åtkomsträttigheter, status för e-postverifiering samt ett eventuellt
                användarnamn, typ av webbläsare, den webbadress från vilken användaren kom till webbplatsen samt den
                server från vilken användaren kom till webbplatsen
            </li>
        </ol>

        <h4>6 Rättslig grund för behandlingen</h4>
        <p>
            Behandlingen av personuppgifter i tjänsten grundar sig på följande rättsliga grunder och
            bestämmelser:
        </p>
        <ul>
            <li>Den registrerades samtycke</li>
            <li>
                Utförande av en uppgift av allmänt intresse eller som ett led i den
                personuppgiftsansvariges myndighetsutövning
            </li>
            <li>EU:s allmänna dataskyddsförordning (2016/679)</li>
            <li>Dataskyddslagen (1050/2018)</li>
            <li>Lagen om offentlighet i myndigheternas verksamhet (621/1999)</li>
        </ul>

        <h4>7 Regelmässiga informationskällor</h4>
        <p>
            Personuppgifterna fås från de registrerade själva.
        </p>

        <h4>
            8 Regelmässigt utlämnande av uppgifter och överföring av uppgifter utanför EU
            eller Europeiska ekonomiska samarbetsområdet
        </h4>
        <p>
            AIRe använder Microsofts molntjänst Azure som bakgrundssystem. Alla tjänster och
            bakgrundssystem som AIRe använder finns inom EU. AIRes chattfunktion är
            konfigurerad för att använda Microsoft Azure OpenAI-programmeringsgränssnittet, som
            inte använder samtalen för att träna AI och inte överför några uppgifter som användaren
            matar in till tredje parter.
        </p>
        <p>
            I regel lämnas personuppgifter inte ut till tredje parter utanför AIRe eller Jamk.
            Personuppgifter i AIRe kan överföras utanför EU eller EES i en situation där en person
            som deltar i ett projekt medverkar i internationell FoIU-verksamhet. Om personuppgifter
            behöver lämnas ut utanför EU eller EES sker utlämnandet med stöd av ett separat
            projektspecifikt avtal eller samtycke eller en uttrycklig rättslig grund som föreskrivs i lag.
            Detta fastställs alltid projektspecifikt i ett separat dataskyddsmeddelande.
        </p>

        <h4>9 Principer för skydd av registret</h4>
        <p>
            Vid behandlingen av uppgifterna i registret säkerställs att användarens integritet inte
            äventyras utan grund.
        </p>
        <ul>
            <li>
                Materialet förvaras och skyddas så att obehöriga inte kan se det och så att det
                inte av misstag kan förstöras, ändras, lämnas ut, överföras eller på annat sätt
                behandlas olagligt.
            </li>
            <li>
                Plattformens nyckel- och huvudanvändare har rätt att se endast sådana
                uppgifter om användaren som de behöver i sina arbetsuppgifter
            </li>
            <li>
                Nätverks- och serverutrustningen är centraliserad till låsta lokaler hos Jamk, till
                vilka åtkomsten är strikt begränsad. Nätverket och servrarna är skyddade på
                lämpligt sätt.
            </li>
            <li>
                Åtkomsträttigheterna är begränsade enligt användargrupp. Rätten att se och
                uppdatera uppgifter i systemet bestäms enligt åtkomstroll för olika
                användargrupper utifrån arbetsuppgifterna. Jamks personal omfattas av den
                sekretesskyldighet som anges i anställningsavtalet.
            </li>
        </ul>

        <h4>10 Lagringstid för personuppgifter eller kriterier för att fastställa lagringstiden</h4>
        <p>
            Jamk lagrar personuppgifter i AIRe-tjänsten i enlighet med dataskyddsförordningen så
            länge användaren använder tjänsten, det vill säga har ett användarkonto i tjänsten, och
            så länge projektverksamheten kräver att uppgifterna lagras.
        </p>
        <p>
            Tjänstens användare kan själv radera sitt konto, varvid alla uppgifter som samlats in om
            användaren raderas. Alternativt kan användaren välja att anonymisera sina uppgifter.
            Då blir uppgifterna kvar i tjänsten, men de kan inte kopplas till användaren. Även
            tjänstens administratör kan radera uppgifterna för användarens räkning.
        </p>

        <h4>11 Profilering och automatiserat beslutsfattande</h4>
        <p>
            Uppgifterna i registret används inte för automatiserade individuella beslut eller
            profilering. Om profilering används i projektverksamheten anges detta tydligt i ett
            separat projektspecifikt dataskyddsmeddelande.
        </p>

        <h4>12 Den registrerades rättigheter</h4>
        <p>
            Mer information om dataskydd, de registrerades rättigheter och hur rättigheterna kan
            utövas finns på webbsidan <a href="https://www.jamk.fi/fi/tietosuoja-jamkissa">Tietosuoja Jamkissa</a>, som
            är tillgänglig på finska och engelska.
        </p>
    </template>

    <template v-else>
        <h3>Privacy Statement - AIRe Service</h3>
        <p>Updated 22 September 2026</p>
        <p>
            <a href="https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32016R0679">
                <b>EU General Data Protection Regulation (2016/679)</b>
            </a>
        </p>
        <p>
            <i>
                This privacy statement applies to users of the AIRe service who sign in using personal
                user credentials (“registered users”). It does not apply to individuals who access the
                service through an invitation link (“trial users”), because in such cases the service is
                used anonymously and no personal data is collected.
            </i>
        </p>

        <h4>1 Name of the register</h4>
        <p>AIRe service (“AIRe”)</p>

        <h4>2 Data controller</h4>
        <p>
            Jamk University of Applied Sciences Ltd (“Jamk”)<br />
            PO Box 207, FI-40101 Jyväskylä, Finland<br />
            +358 20 743 8100
        </p>

        <h4>3 Contact persons for matters concerning the register</h4>
        <p>
            Director responsible for the register: Pekka Anttila, Director, Institute of Rehabilitation
        </p>
        <p>
            Process owner responsible for the register: Katariina Korniloff, Principal Researcher,
            Institute of Rehabilitation
        </p>
        <p>
            Product owner: Minna Eriksen, Specialist, Institute of Rehabilitation
        </p>
        <p>
            Technical administrator: Goodlife Technology Oy, Jamk ICT Services
        </p>
        <p>
            firstname.lastname[a]jamk.fi
        </p>
        <p>
            Jamk Data Protection Officer: <a href="mailto:tietosuoja@jamk.fi">tietosuoja@jamk.fi</a>
        </p>

        <h4>4 Processing of personal data and purpose of processing</h4>
        <p>
            The purpose of processing personal data is to support digital self-managed
            rehabilitation as well as research, development, innovation and education activities
            (“RDIE”). At Jamk's Institute of Rehabilitation, AIRe serves as an AI-assisted testing and
            simulation environment for digital rehabilitation.
        </p>
        <p>
            The service enables interaction in natural language between the user and an AI-assisted
            coach and provides rehabilitation-related information, guidance and support for self-care.
        </p>
        <p>
            <b>Registered users</b> authorise the service to use stored user data to personalise the
            content recommendations made by AIRe. User data includes the user's name, gender,
            year of birth and country, as well as other information that the user adds and stores in
            the service, for example information relating to their functioning. <b>Trial users</b> cannot add
            or store user data about themselves, meaning that their use of AIRe is anonymous.
        </p>
        <p>
            The service uses information shared by <b>both registered and trial users</b> in AIRe
            conversations about their own situation to support them in identifying their
            rehabilitation needs and goals and to recommend personalised content. In RDIE
            activities, personal data may be processed, for example, to assess the suitability of the
            themes and content suggested by AIRe and to analyse the rehabilitation goals set by the
            user
        </p>
        <p>
            Jamk's Institute of Rehabilitation acts as the data controller for AIRe.
        </p>
        <p>
            This statement may be supplemented by specific data protection and privacy notices
            and statements relating to particular forms or purposes of data processing.
        </p>

        <h4>5 Data content of the register</h4>
        <p>
            <b>Registered users</b> include Jamk staff and students, as well as volunteers and
            cooperation partners from outside Jamk who participate in RDIE activities.
        </p>
        <p>
            Separate privacy statements may be prepared for projects or trials that use the AIRe
            service, and users may be asked to provide separate consent where necessary. Each
            project or trial is responsible for its own processing of personal data and the related
            data protection obligations.
        </p>
        <p>
            The register of the AIRe service contains the following information:
        </p>
        <ol>
            <li>
                Basic information about the service user: first name, surname, gender, year of
                birth, country and email address. Some users may sign in to the service using
                demo credentials created for them, in which case the service does not request
                or store the user's email address
            </li>
            <li>
                Other information about themselves that users voluntarily store, such as a
                description of limitations in functioning
            </li>
            <li>
                Information about prohibitions, restrictions and consents concerning the use of
                personal data, as well as other choices made by the user
            </li>
            <li>
                Time of the visit, time of the previous sign-in, time spent by the user in the
                service, times when messages were sent, content opened and pages visited by
                the user, and user interface language
            </li>
            <li>
                Questionnaire responses completed by the user are stored in the database, but
                depending on the questionnaire settings and the user's consent, they cannot
                necessarily be linked automatically to personal data
            </li>
            <li>
                Other information relating to the purpose of the data file that can be linked to the
                user includes the user's IP address and application programming interface path;
                identifiers relating to the user's device and operating system; a unique randomly
                generated identifier; a hash of the email address; role and access rights; email
                verification status; any username; browser type; the web address from which the
                user arrived at the website; and the server from which the user arrived at the
                website
            </li>
        </ol>

        <h4>6 Legal basis for processing</h4>
        <p>
            The processing of personal data in the service is based on the following legal bases and
            legislation:
        </p>
        <ul>
            <li>Consent of the data subject</li>
            <li>
                Performance of a task carried out in the public interest or in the exercise of
                official authority
            </li>
            <li>EU General Data Protection Regulation (2016/679)</li>
            <li>Data Protection Act (1050/2018)</li>
            <li>Act on the Openness of Government Activities (621/1999)</li>
        </ul>

        <h4>7 Regular sources of data</h4>
        <p>
            Personal data is obtained from the data subjects themselves.
        </p>

        <h4>
            8 Regular disclosure of data and transfer of data outside the EU or the European
            Economic Area
        </h4>
        <p>
            AIRe uses Microsoft Azure cloud services as its back-end system. All services and back-end systems used by
            AIRe are located within the EU. AIRe's chat function is configured to use the Microsoft Azure OpenAI
            application programming interface, which does not use conversations to train AI and does not transmit any
            user input to third parties.
        </p>
        <p>
            As a general rule, personal data is not disclosed to third parties outside AIRe or Jamk.
            Personal data contained in AIRe may be transferred outside the EU or the EEA when a
            person involved in a project participates in international RDIE activities. If personal data
            must be disclosed outside the EU or the EEA, the disclosure will be based on a separate
            project-specific agreement or consent, or on an explicit legal basis laid down in
            legislation. This will always be specified for each project in a separate privacy
            statement.
        </p>

        <h4>9 Principles of data protection</h4>
        <p>
            When data in the data file is processed, care is taken to ensure that the user's privacy is
            not unjustifiably compromised.
        </p>
        <ul>
            <li>
                The data is stored and protected so that it cannot be viewed by unauthorised
                persons or accidentally destroyed, altered, disclosed, transferred or otherwise
                processed unlawfully.

            </li>
            <li>
                The platform's key users and administrators are entitled to view only the user
                data that they need for their duties.
            </li>
            <li>
                Network and server equipment is located centrally in locked Jamk facilities with
                strictly restricted access. The network and servers are appropriately protected.
            </li>
            <li>
                Access rights are restricted by user group. Rights to view and update data in the
                system are determined by access role for different user groups on the basis of
                their duties. Jamk staff are bound by the confidentiality obligation set out in their
                employment contracts
            </li>
        </ul>

        <h4>10 Retention period for personal data or criteria for determining the retention period</h4>
        <p>
            Jamk retains personal data in the AIRe service in accordance with the GDPR for as long
            as the user uses the service, meaning that they have a user account in the service, and
            for as long as project activities require the data to be retained.
        </p>
        <p>
            Users can delete their own accounts, in which case all data collected about them is
            deleted. Alternatively, users may choose to have their data anonymised, in which case
            the data remains in the service but can no longer be linked to them. The service
            administrator may also delete the data on the user's behalf.
        </p>

        <h4>11 Profiling and automated decision-making</h4>
        <p>
            Data in the register is not used for automated individual decision-making or profiling. If
            profiling is used in project activities, this will be clearly stated in a separate project-specific privacy
            statement.
        </p>

        <h4>12 Rights of the data subject</h4>
        <p>
            Further information about data protection, the rights of data subjects and how to
            exercise those rights is available on the Data Protection at Jamk
            <a href="https://www.jamk.fi/en/data-protection-in-jamk">
                Data Protection at Jamk
            </a> webpage.
        </p>
    </template>
</template>