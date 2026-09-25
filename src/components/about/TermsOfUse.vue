<script setup lang="ts">
import { getUILanguage } from '@/locales';
const lang = getUILanguage();
</script>

<template>
    <template v-if="lang === 'fi'">
        <h3>Käyttöehdot - AIRe-palvelu</h3>
        <p>Päivitetty 22.9.2026</p>

        <h4>1 Käyttöehtojen soveltaminen</h4>
        <p>
            Näitä käyttöehtoja sovelletaan Jyväskylän ammattikorkeakoulu Oy:n (”Jamk”), Y-tunnus 1006550-2,
            tarjoaman AIRe-palvelun (”AIRe”) käyttäjiin, jotka
            a) <i>kirjautuvat palveluun käyttäjätunnuksilla</i>
            (”kirjautunut käyttäjä”) tai jotka
            b) käyttävät palvelu kokeiluluontoisesti <i>ilman käyttäjätunnuksia kutsulinkin kautta</i>
            (”kokeilukäyttäjä”).
        </p>
        <p>
            <b>
                Ottamalla AIRe-palvelun käyttöön hyväksyt nämä käyttöehdot ja tietosuojaselosteen sekä sitoudut
                noudattamaan niitä.
            </b>
            <i>
                Tietosuojaseloste ei kuitenkaan koske kokeilukäyttäjiä, koska tällöin palvelun käyttö on anonyymia.
            </i>
        </p>
        <p>
            Käyttöehdot ja tietosuojaseloste ovat käyttäjän saatavilla ennen palvelun käyttöönottoa ja koko palvelun
            käytön ajan ”Tietoa AIRe-palvelusta” -valikossa. Jamkilla on oikeus muuttaa näitä käyttöehtoja ilmoittamalla
            tästä käyttäjälle. Jatkamalla palvelun käyttöä tällaisen ilmoituksen vastaanottamisen jälkeen, käyttäjä
            hyväksyy muutetut käyttöehdot.
        </p>

        <h4>2 Palvelusta ja sen käytöstä</h4>
        <p>
            AIRe on tekoälyavusteinen palvelu, joka toimii Jamkin tutkimus-, kehittämis-, innovaatio, ja
            opetustoiminnan (”TKIO”) testaus- ja simulaatioympäristönä. Palvelu mahdollistaa käyttäjän ja
            tekoälyavusteisen ohjaajan välisen vuorovaikutuksen luonnollisella kielellä sekä kuntoutukseen liittyvän
            tiedon, ohjauksen ja omahoidon tuen tarjoamisen. Palvelun käytön myötä käyttäjä voi nähdä positiivisen
            muutoksen omassa toimintakyvyssään ja/tai hyvinvoinnissaan. AIRe ei korvaa terveydenhuollon
            ammattihenkilöä eikä tee diagnooseja, vaan ehdottaa ohjaavaa ja informatiivista sisältöä kuntoutuksen ja
            hyvinvoinnin tueksi.
        </p>

        <h4>3 Palveluntarjoaja, asioinnin kieli ja asiakastuki</h4>
        <p>
            Jyväskylän ammattikorkeakoulu Oy<br />
            Y-tunnus: 1006550-2<br />
            PL 207<br />
            40101 Jyväskylä
        </p>
        <p>
            Ehtoja koskevat kysymykset pyydämme osoittamaan: <a href="mailto:tietosuoja@jamk.fi">tietosuoja@jamk.fi</a>.
        </p>
        <p>
            Asiakaspalvelua on saatavilla suullisesti ja kirjallisesti suomen ja englannin kielellä.
        </p>
        <p>
            AIRe-palvelussa asiointi tapahtuu käyttäjän valitsemalla, palvelussa kulloinkin saatavilla olevalla
            kielivalinnalla (tällä hetkellä suomi, ruotsi, englanti, espanja, swahili, vietnam, indonesia ja ruandan
            kieli).
        </p>

        <h4>4 Käyttäjätunnusten luominen ja pääsy palveluun</h4>
        <p>
            Käyttäjän hyväksyttyä nämä käyttöehdot, käyttäjä saa oikeuden käyttää palvelua henkilökohtaiseen tai
            TKIO-toimintaan liittyvään, ei-kaupalliseen tarkoitukseen.
        </p>
        <p>
            <b>Kirjautumista varten tarvittavat käyttäjätunnukset</b> toimitetaan käyttäjälle osana tutkimusta,
            pilottia, opetusta tai muuta testikäyttöä avain- tai pääkäyttäjän toimesta. Vaihtoehtoisesti käyttäjä voi
            rekisteröityä palveluun itse jamk.fi-päätteisellä sähköpostiosoitteella tai avain- tai pääkäyttäjän
            salliessa myös muulla sähköpostiosoitteella. Rekisteröitymisen yhteydessä käyttäjä luo itselleen salasanan,
            jossa on vähintään kahdeksan merkkiä sekä isoja ja pieniä kirjaimia ja numeroita.
        </p>
        <p>
            Käyttäjä vastaa käyttäjätunnuksen ja salasanan säilytyksestä ja siitä, että kukaan muu ei voi kirjautua
            palveluun käyttäjän henkilökohtaisella käyttäjätunnuksella ja salasanalla. Mikäli käyttäjä uskoo, että
            salasana ja käyttäjätunnus ovat saattaneet joutua toisen henkilön käyttöön, tulee salasana vaihtaa
            viipymättä. Käyttäjä sitoutuu aina kirjautumaan ulos palvelusta, mikäli hän asioi yhteiskäytössä olevilla
            laitteilla.
        </p>
        <p>
            <b>Kokeilukäyttäjän</b> anonyymi pääsy palveluun tapahtuu erikseen jaettavan kutsulinkin kautta.
        </p>
        <p>
            Palvelun kaikilta käyttäjiltä edellytetään lähtökohtaisesti 18 vuoden ikää, ellei hanke- tai
            kokeilukohtaisesti ole toisin määritelty.
        </p>
        <p>
            Kaikki käyttäjät vastaavat itse palvelun käyttöön tarvittavista järjestelyistä, ellei asiasta ole erikseen
            sovittu. Näihin järjestelyihin kuuluvat palvelun käytön edellyttämien päätelaitteiden ja verkkoyhteyksien
            hankinta, ylläpito, päivitykset ja tietoturva sekä niistä aiheutuvat kustannukset.

        </p>

        <h4>5 Hinnat</h4>
        <p>
            Palvelun käyttö osana Jamkin TKIO-toimintaa on käyttäjälle maksutonta.
        </p>

        <h4>6 Kolmansien osapuolten sisällöt</h4>
        <p>
            Palvelu voi sisältää yhteyksiä tai linkkejä kolmansien osapuolten omistamille tai operoimille sivuille ja
            sähköisiin palveluihin.
        </p>

        <h4>7 Tietosuoja ja henkilötiedot</h4>
        <p>
            Tietojen käsittely sekä yksityisyyden ja henkilötietojen suoja noudattaa AIRen tietosuojaselostetta.
        </p>
        <p>
            <b>Kirjautuneiden käyttäjien</b> palveluun tallentamia käyttäjätietoja voidaan käyttää heille ehdotettavien
            sisältöjen kohdentamiseen. Käyttäjätietoja ovat nimi, sukupuoli, syntymävuosi, maa sekä muut käyttäjän
            itse palveluun tallentamat tiedot.
        </p>
        <p>
            <b>Kokeilukäyttäjät</b> eivät voi tallentaa palveluun käyttäjätietoja, joten heidän AIRe-palvelun käyttönsä
            on anonyymiä. Tietosuojaseloste ei koske heitä.
        </p>
        <p>
            AIRe-palveluun tallentuu sekä <b>kirjautuneiden että kokeilukäyttäjien</b> käytön aikana syntyvä keskustelu.
            Keskustelut ja muut käyttäjän palveluun syöttämät tiedot ovat suojattuja, eikä palvelun avainkäyttäjillä,
            pääkäyttäjillä tai ylläpitäjillä ole pääsyä niiden sisältöön. Käyttäjien keskusteluja ei käytetä
            tekoälymallien kouluttamiseen eikä niitä luovuteta ulkopuolisille tahoille. Lisäksi palveluun tallentuu
            palvelun käyttöön liittyviä tietoja, kuten tietoja käyttökerroista, toimintojen käytöstä ja käytön kestosta,
            jotka ovat yhdistettävissä kirjautuneisiin käyttäjiin. Näitä tietoja voidaan hyödyntää palvelun toiminnan,
            laadun ja teknisen kehittämisen tukena
        </p>
        <p>
            Kaikki AIRe:n käyttämät palvelut ja taustajärjestelmät sijaitsevat EU:ssa, Microsoftin Pohjois-Euroopan
            datakeskuksessa.
        </p>

        <h4>8 Immateriaalioikeudet</h4>
        <p>
            Immateriaalioikeudet palveluun ja kaikkeen palvelussa olevaan materiaaliin kuuluvat Jamkille tai
            kolmannelle osapuolelle.
        </p>
        <p>
            Käyttäjälle ei synny tai siirry mitään immateriaalioikeuksia palvelun käytön kautta tai toimittamalla
            materiaalia palveluun.
        </p>
        <p>
            Käyttäjällä ei ole oikeutta jakaa palvelun sisältöjä ulkopuolisille. Poikkeuksena ovat
            Jamkin henkilöstö sekä ne sidosryhmien edustajat, joille Jamk on kirjallisella sopimuksella myöntänyt
            oikeuden käyttää ja esitellä palvelua osana TKIO-toimintaa.
        </p>
        <p>
            Käyttäjä vastaa vahingosta, jonka hän aiheuttaa palveluntuottajalle tai kolmannelle osapuolelle käyttämällä
            palvelua tai sen sisältämää aineistoa näiden ehtojen, lainsäädännön, viranomaismääräysten tai hyvän tavan
            vastaisesti. Tekijänoikeudellisesta korvausvelvollisuudesta säädetään tekijänoikeuslain 7 luvussa ja
            rikosoikeudellisesta rangaistusvastuusta tekijänoikeuslain 7 luvussa sekä rikoslain (39/1889) 49 luvussa.
        </p>

        <h4>9 Palvelun tuottaminen</h4>
        <p>
            Palvelu on käyttäjän käytettävissä lähtökohtaisesti 24 tuntia vuorokaudessa. Jamkilla on oikeus tuottaa
            palvelu parhaaksi katsomallaan tavalla sekä muuttaa palvelua ilman ennakkoilmoitusta. Jamk pyrkii
            kuitenkin ilmoittamaan olennaisista, palvelun käyttöön merkittävästi vaikuttavista muutoksista
            kohtuullisessa ajassa etukäteen. Muutoksista ilmoittamiseksi katsotaan niistä ilmoittaminen palvelun sisällä
            tai palvelun verkkosivuilla.
        </p>
        <p>
            Jamkilla on oikeus keskeyttää palvelun käyttö osittain, kokonaan tai tietyn käyttäjän osalta. Jamk pyrkii
            varmistamaan, että keskeytys on mahdollisimman lyhyt. Mikäli mahdollista, Jamk pyrkii ilmoittamaan
            kohtuullisessa ajassa etukäteen palvelun käyttökatkoksista tai keskeytyksestä palvelun sisällä tai palvelun
            verkkosivuilla.
        </p>

        <h4>10 Jamkin vastuu</h4>
        <p>
            Palvelun teknisestä ylläpidosta vastaa GoodLife Technology Oy Jamkin toimeksiantamana. Jamk tuottaa
            osittain palvelun sisällön, mutta sen kautta voi olla saatavilla myös yhteistyökumppaneiden ja kolmansien
            osapuolten tuottamaa sisältöä ja palveluita, joista vastaa kukin osapuoli itse.
        </p>
        <p>
            Jamk ei takaa, että palvelu toimii keskeytyksettä tai virheettömästi. Jamk ei myöskään vastaa palvelussa
            käytettävän tekoälyn tai kolmansien osapuolten tuottaman sisällön oikeellisuudesta, täsmällisyydestä,
            kattavuudesta tai luotettavuudesta.
        </p>
        <p>
            Jamk ei vastaa käyttäjälle palvelun käytöstä aiheutuvista välittömistä tai välillisistä vahingoista eikä
            palvelun käytön keskeytyksistä, häiriöistä tai tekoälyn taikka kolmansien osapuolten tuottaman sisällön
            virheistä, muutoksista tai katoamisesta.
        </p>

        <h4>11 Sovellettava laki ja riitojen ratkaisu</h4>
        <p>
            Näihin käyttöehtoihin ja tietosuojailmoitukseen sovelletaan Suomen lakia. Näistä käyttöehdoista aiheutuvat
            erimielisyydet pyritään ensisijaisesti ratkaisemaan sovinnollisesti. Mikäli sopimukseen ei päästä, asian
            ratkaisee ensimmäisenä oikeusasteena Keski-Suomen käräjäoikeus muissa kuin tekijänoikeutta koskevissa
            asioissa. Tekijänoikeusasioissa asian ratkaisee ensimmäisenä oikeusasteena markkinaoikeus.
        </p>

        <h4>12 Ota yhteyttä</h4>
        <p>
            Mikäli sinulla on kysyttävää näihin käyttöehtoihin liittyen, voit olla yhteydessä Jamkin
            tietosuojavastaavaan,
            <a href="mailto:tietosuoja@jamk.fi">tietosuoja@jamk.fi</a> tai AIRe-palvelun yhteyshenkilöihin
            <a href="mailto:aire@jamk.fi">aire@jamk.fi</a>.
        </p>
    </template>

    <template v-else-if="lang === 'sv'">
        <h3>Användarvillkor - AIRe-tjänsten</h3>
        <p>Uppdaterad 22.9.2026</p>

        <h4>1 Tillämpning av användarvillkoren</h4>
        <p>
            Dessa användarvillkor gäller användare av AIRe-tjänsten (”AIRe”) som tillhandahålls av Jyväskylä
            yrkeshögskola Ab (”Jamk”), FO-nummer 1006550-2, vilka antingen
            a) <i>loggar in i tjänsten med användaruppgifter</i> (”inloggad användare”) eller
            b) <i>använder tjänsten på prov utan användaruppgifter via en inbjudningslänk</i> (”testanvändare”).
        </p>
        <p>
            <b>
                Genom att börja använda AIRe-tjänsten godkänner du dessa användarvillkor och
                dataskyddsbeskrivningen samt förbinder dig att följa dem.
            </b>
            <i>
                Dataskyddsbeskrivningen gäller dock inte testanvändare, eftersom användningen av tjänsten då är anonym.
            </i>
        </p>
        <p>
            Användarvillkoren och dataskyddsbeskrivningen är tillgängliga för användaren innan tjänsten tas i bruk och
            under hela användningstiden i menyn ”Information om tjänsten”. Jamk har rätt att ändra dessa
            användarvillkor genom att meddela användaren. Genom att fortsätta använda tjänsten efter att ha tagit
            emot ett sådant meddelande godkänner användaren de ändrade användarvillkoren.
        </p>

        <h4>2 Om tjänsten och dess användning</h4>
        <p>
            AIRe är en AI-assisterad tjänst som fungerar som test- och simuleringsmiljö för Jamks forsknings-,
            utvecklings-, innovations- och utbildningsverksamhet (”FoIU”). Tjänsten möjliggör interaktion på naturligt
            språk mellan användaren och en AI-assisterad handledare samt erbjuder information, vägledning och stöd
            för egenvård i anslutning till rehabilitering. Genom att använda tjänsten kan användaren uppleva en positiv
            förändring i sin funktionsförmåga och/eller sitt välbefinnande. AIRe ersätter inte vårdpersonal och ställer
            inga diagnoser, utan föreslår vägledande och informativt innehåll som stöd för rehabilitering och
            välbefinnande.
        </p>

        <h4>3 Tjänsteleverantör, servicespråk och kundsupport</h4>
        <p>
            Jyväskylä yrkeshögskola Ab<br />
            FO-nummer: 1006550-2<br />
            PB 207<br />
            40101 Jyväskylä
        </p>
        <p>
            Frågor om villkoren ska skickas till: <a href="mailto:tietosuoja@jamk.fi">tietosuoja@jamk.fi</a>.
        </p>
        <p>
            Kundsupport finns tillgänglig muntligt och skriftligt på finska och engelska.
        </p>
        <p>
            AIRe-tjänsten används på ett språk som användaren väljer bland de språkalternativ som vid respektive
            tidpunkt finns tillgängliga i tjänsten (för närvarande finska, svenska, engelska, spanska, swahili,
            vietnamesiska, indonesiska och kinyarwanda).
        </p>

        <h4>4 Skapande av användaruppgifter och åtkomst till tjänsten</h4>
        <p>
            När användaren har godkänt dessa användarvillkor får användaren rätt att använda tjänsten för personliga
            eller icke-kommersiella ändamål med anknytning till FoIU-verksamhet.
        </p>
        <p>
            <b>De användaruppgifter som krävs för inloggning</b> ges till användaren av en nyckel- eller huvudanvändare
            som en del av forskning, en pilot, undervisning eller annan testanvändning. Alternativt kan användaren själv
            registrera sig i tjänsten med en e-postadress som slutar på jamk.fi eller, om en nyckel- eller
            huvudanvändare tillåter det, med en annan e-postadress. Vid registreringen skapar användaren ett lösenord
            med minst åtta tecken som innehåller stora och små bokstäver samt siffror.
        </p>
        <p>
            Användaren ansvarar för att förvara användarnamnet och lösenordet säkert och för att ingen annan kan
            logga in i tjänsten med användarens personliga användarnamn och lösenord. Om användaren misstänker att
            lösenordet och användarnamnet kan ha kommit i en annan persons besittning ska lösenordet omedelbart
            bytas. Användaren förbinder sig att alltid logga ut ur tjänsten vid användning av gemensamma enheter.
        </p>
        <p>
            <b>En testanvändare</b> får anonym åtkomst till tjänsten via en separat distribuerad inbjudningslänk.
        </p>
        <p>
            Som huvudregel ska alla användare av tjänsten ha fyllt 18 år, om inte annat har fastställts för ett visst
            projekt eller försök.
        </p>
        <p>
            Alla användare ansvarar själva för de arrangemang som krävs för att använda tjänsten, om inget annat har
            avtalats. Arrangemangen omfattar anskaffning, underhåll och uppdatering av de enheter och
            nätanslutningar som krävs för att använda tjänsten, deras informationssäkerhet samt kostnaderna för dem.
        </p>

        <h4>5 Priser</h4>
        <p>
            Användning av tjänsten som en del av Jamks FoIU-verksamhet är avgiftsfri för användaren.
        </p>

        <h4>6 Innehåll från tredje part</h4>
        <p>
            Tjänsten kan innehålla anslutningar eller länkar till webbplatser och elektroniska tjänster som ägs eller
            drivs av tredje part.
        </p>

        <h4>7 Dataskydd och personuppgifter</h4>
        <p>
            Behandlingen av uppgifter samt skyddet för integriteten och personuppgifter följer AIRes
            dataskyddsbeskrivning.
        </p>
        <p>
            Användaruppgifter som <b>inloggade användare</b> sparar i tjänsten kan användas för att anpassa det innehåll
            som föreslås för dem. Användaruppgifter är namn, kön, födelseår, land samt andra uppgifter som
            användaren själv sparar i tjänsten.
        </p>
        <p>
            <b>Testanvändare</b> kan inte spara användaruppgifter i tjänsten, vilket innebär att deras användning av
            AIRe-tjänsten är anonym. Dataskyddsbeskrivningen gäller inte dem.
        </p>
        <p>
            De samtal som uppstår när <b>både inloggade användare och testanvändare</b> använder AIRe-tjänsten sparas i
            tjänsten. Samtalen och andra uppgifter som användaren matar in i tjänsten är skyddade, och tjänstens
            nyckelanvändare, huvudanvändare eller administratörer har inte tillgång till innehållet. Användarnas samtal
            används inte för att träna AI-modeller och lämnas inte ut till externa parter. I tjänsten sparas dessutom
            uppgifter om användningen, exempelvis användningstillfällen, användning av funktioner och användningens
            längd, som kan kopplas till inloggade användare. Dessa uppgifter kan användas för att stödja tjänstens
            funktion, kvalitet och tekniska utveckling.
        </p>
        <p>
            Alla tjänster och bakomliggande system som AIRe använder finns inom Europeiska unionen, i Microsofts
            datacenter i Nordeuropa.
        </p>

        <h4>8 Immateriella rättigheter</h4>
        <p>
            De immateriella rättigheterna till tjänsten och allt material i tjänsten tillhör Jamk eller en tredje part.
        </p>
        <p>
            Inga immateriella rättigheter uppstår för eller överförs till användaren genom användningen av tjänsten
            eller genom att material lämnas till tjänsten.
        </p>
        <p>
            Användaren har inte rätt att dela innehåll från tjänsten med externa parter. Undantag är Jamks personal
            samt de företrädare för intressentgrupper som Jamk genom ett skriftligt avtal har gett rätt att använda och
            presentera tjänsten som en del av FoIU-verksamheten.
        </p>
        <p>
            Användaren ansvarar för skada som hen orsakar tjänsteleverantören eller en tredje part genom att använda
            tjänsten eller materialet i den i strid med dessa villkor, lagstiftningen, myndighetsföreskrifter eller god
            sed. Bestämmelser om ersättningsskyldighet enligt upphovsrätten finns i 7 kap. i upphovsrättslagen och om
            straffrättsligt ansvar i 7 kap. i upphovsrättslagen samt i 49 kap. i strafflagen (39/1889).
        </p>

        <h4>9 Tillhandahållande av tjänsten</h4>
        <p>
            Tjänsten är tillgänglig för användaren dygnet runt. Jamk har rätt att tillhandahålla tjänsten på det sätt
            som Jamk anser vara lämpligt samt att ändra tjänsten utan föregående meddelande. Jamk strävar dock efter att
            inom skälig tid i förväg informera om väsentliga ändringar som har betydande inverkan på användningen av
            tjänsten. Ändringar anses ha meddelats när information om dem ges inom tjänsten eller på tjänstens
            webbplats.
        </p>
        <p>
            Jamk har rätt att avbryta användningen av tjänsten helt, delvis eller för en viss användare. Jamk strävar
            efter att säkerställa att avbrottet blir så kort som möjligt. Om det är möjligt strävar Jamk efter att inom
            skälig tid i förväg informera om driftavbrott eller avbrott i tjänsten inom tjänsten eller på tjänstens
            webbplats.
        </p>

        <h4>10 Jamks ansvar</h4>
        <p>
            GoodLife Technology Oy ansvarar för det tekniska underhållet av tjänsten på uppdrag av Jamk. Jamk
            producerar en del av tjänstens innehåll, men via tjänsten kan även innehåll och tjänster som producerats av
            samarbetspartner och tredje parter vara tillgängliga. Varje part ansvarar själv för sitt innehåll och sina
            tjänster.
        </p>
        <p>
            Jamk garanterar inte att tjänsten fungerar utan avbrott eller fel. Jamk ansvarar inte heller för
            riktigheten, exaktheten, fullständigheten eller tillförlitligheten hos innehåll som producerats av den AI
            som används i tjänsten eller av tredje parter.
        </p>
        <p>
            Jamk ansvarar inte för direkta eller indirekta skador som uppstår för användaren till följd av användningen
            av tjänsten, och inte heller för avbrott eller störningar i tjänsten eller för fel, ändringar eller förlust
            av innehåll som genererats av AI eller av tredje part.
        </p>

        <h4>11 Tillämplig lag och tvistlösning</h4>
        <p>
            Dessa användarvillkor och dataskyddsbeskrivningen omfattas av finsk lag. Meningsskiljaktigheter som
            uppstår med anledning av dessa användarvillkor ska i första hand lösas i godo. Om en överenskommelse
            inte kan nås avgörs andra ärenden än upphovsrättsärenden i första instans av Mellersta Finlands tingsrätt.
            Upphovsrättsärenden avgörs i första instans av marknadsdomstolen.
        </p>

        <h4>12 Kontakta oss</h4>
        <p>
            Om du har frågor om dessa användarvillkor kan du kontakta Jamks dataskyddsombud på
            <a href="mailto:tietosuoja@jamk.fi">tietosuoja@jamk.fi</a> eller kontaktpersonerna för AIRe-tjänsten på
            <a href="mailto:aire@jamk.fi">aire@jamk.fi</a>.
        </p>
    </template>

    <template v-else>
        <h3>Terms of Use - AIRe Service</h3>
        <p>Updated 22 September 2026</p>

        <h4>1 Application of the Terms of Use</h4>
        <p>
            These Terms of Use apply to users of the AIRe service (“AIRe”) provided by JAMK University of Applied
            Sciences Ltd (”Jamk”), Business ID 1006550-2, who either
            a) <i>log in to the service using user credentials</i> (”registered user”) or
            b) <i>use the service on a trial basis without user credentials via an invitation link</i>
            (”trial user”).
        </p>
        <p>
            <b>
                By starting to use the AIRe service, you accept these Terms of Use and the Privacy Notice and agree to
                comply with them.
            </b>
            <i>
                However, the Privacy Notice does not apply to trial users because their use of the service is anonymous.
            </i>
        </p>
        <p>
            The Terms of Use and the Privacy Notice are available to the user before they start using the service and
            throughout their use of the service in the ”About” menu. Jamk has the right to amend these Terms of Use
            by notifying the user. By continuing to use the service after receiving such notification, the user accepts
            the amended Terms of Use.
        </p>

        <h4>2 About the service and its use</h4>
        <p>
            AIRe is an AI-assisted service that serves as a testing and simulation environment for Jamk's research,
            development, innovation and education (“RDIE”) activities. The service enables natural-language interaction
            between the user and an AI-assisted coach and provides rehabilitation-related information, guidance and
            support for self-management. Through using the service, the user may experience a positive change in their
            functioning and/or well-being. AIRe does not replace a healthcare professional and does not make
            diagnoses. Instead, it suggests guidance and informative content to support rehabilitation and well-being.
        </p>

        <h4>3 Service provider, service languages and customer support</h4>
        <p>
            JAMK University of Applied Sciences Ltd<br />
            Business ID: 1006550-2<br />
            P.O. Box 207<br />
            40101 Jyväskylä, Finland
        </p>
        <p>
            Please send questions concerning these terms to: <a href="mailto:tietosuoja@jamk.fi">tietosuoja@jamk.fi</a>.
        </p>
        <p>
            Customer support is available orally and in writing in Finnish and English.
        </p>
        <p>
            The AIRe service can be used in a language selected by the user from the language options available in the
            service at the time (currently Finnish, Swedish, English, Spanish, Swahili, Vietnamese, Indonesian and
            Kinyarwanda).
        </p>

        <h4>4 Creation of user credentials and access to the service</h4>
        <p>
            After accepting these Terms of Use, the user is granted the right to use the service for personal or
            non-commercial purposes related to RDIE activities.
        </p>
        <p>
            <b>The user credentials required for logging in</b> are provided to the user by a key user or admin user as
            part of
            research, a pilot, education or other testing. Alternatively, the user may register for the service using an
            email address ending in jamk.fi or, if permitted by a key user or main user, another email address. During
            registration, the user creates a password containing at least eight characters, including uppercase and
            lowercase letters and numbers.
        </p>
        <p>
            The user is responsible for keeping their username and password secure and ensuring that no one else can
            log in to the service using their personal username and password. If the user believes that their password
            and username may have come into another person's possession, the password must be changed
            immediately. The user agrees to always log out of the service when using shared devices.
        </p>
        <p>
            <b>A trial user</b> accesses the service anonymously via a separately distributed invitation link.
        </p>
        <p>
            All users of the service must be at least 18 years old, unless otherwise specified for a particular project
            or trial.
        </p>
        <p>
            All users are responsible for making the arrangements required to use the service unless otherwise agreed.
            These arrangements include acquiring, maintaining and updating the devices and network connections
            required to use the service, ensuring their information security and covering the related costs.
        </p>

        <h4>5 Prices</h4>
        <p>
            Use of the service as part of Jamk's RDIE activities is free of charge to the user.
        </p>

        <h4>6 Third-party content</h4>
        <p>
            The service may contain connections or links to websites and electronic services owned or operated by third
            parties.
        </p>

        <h4>7 Privacy and personal data</h4>
        <p>
            Data processing and the protection of privacy and personal data are governed by the AIRe Privacy Statement.
        </p>
        <p>
            User data stored in the service by <b>registered users</b> may be used to personalise the content suggested
            to
            them. User data includes name, gender, year of birth, country and other information entered into the
            service by the user.
        </p>
        <p>
            <b>Trial users</b> cannot store user data in the service, so their use of the AIRe service is anonymous. The
            Privacy Statement does not apply to them.
        </p>
        <p>
            The conversations generated during use of the AIRe service by <b>both registered users and trial users</b>
            are
            stored in the service. Conversations and other information entered into the service by users are protected,
            and the service's key users, admin users and administrators do not have access to their content. Users'
            conversations are not used to train AI models and are not disclosed to external parties. The service also
            stores information about use of the service, such as information on usage sessions, use of features and
            duration of use, which can be linked to registered users. This information may be used to support the
            service's operation, quality and technical development.
        </p>
        <p>
            All services and back-end systems used by AIRe are located in the European Union, in Microsoft's North
            Europe data centre.
        </p>

        <h4>8 Intellectual property rights</h4>
        <p>
            The intellectual property rights in the service and all material available in the service belong to Jamk or
            a third party.
        </p>
        <p>
            No intellectual property rights are created for or transferred to the user through use of the service or by
            submitting material to the service.
        </p>
        <p>
            The user has no right to share content from the service with external parties. Exceptions are Jamk staff and
            representatives of stakeholders whom Jamk has granted the right, by written agreement, to use and present
            the service as part of RDIE activities.
        </p>
        <p>
            The user is liable for any damage they cause to the service provider or a third party by using the service
            or its material in breach of these Terms, legislation, official regulations or accepted standards of
            conduct. Liability for compensation under copyright law is provided for in Chapter 7 of the Finnish
            Copyright Act, and criminal liability is provided for in Chapter 7 of the Copyright Act and Chapter 49 of
            the Finnish Criminal Code (39/1889).
        </p>

        <h4>9 Provision of the service</h4>
        <p>
            The service is available to the user 24 hours a day. Jamk has the right to provide the service as it
            considers appropriate and to modify the service without prior notice. However, Jamk endeavours to provide
            reasonable advance notice of material changes that significantly affect use of the service. Notice of
            changesk is deemed to have been given when the changes are announced within the service or on the service
            website.
        </p>
        <p>
            Jamk reserves the right to suspend use of the service in part, in full or in respect of a specific user.
            Jamk endeavours to ensure that any suspensions are as brief as possible. Where possible, Jamk will endeavour
            to give reasonable advance notice of service interruptions or the suspension of access rights within the
            service or on the service's website.

        </p>

        <h4>10 Jamk's liability</h4>
        <p>
            GoodLife Technology Oy is responsible for the technical maintenance of the service under assignment from
            Jamk. Jamk produces some of the service content, but content and services produced by partners and third
            parties may also be available through the service, and each party is responsible for its own content and
            services.
        </p>
        <p>
            Jamk does not guarantee that the service will operate without interruption or error. Jamk is also not
            responsible for the correctness, accuracy, completeness or reliability of content produced by the AI used in
            the service or by third parties.
        </p>
        <p>
            Jamk is not liable to the user for any direct or indirect damage arising from use of the service, or for
            interruptions or disruptions in the use of the service, or for errors, changes or loss of content produced
            by the AI or third parties.
        </p>

        <h4>11 Governing law and dispute resolution</h4>
        <p>
            These Terms of Use and the Privacy Notice are governed by Finnish law. Any disputes arising from these
            Terms of Use will primarily be resolved amicably. If no agreement can be reached, disputes other than
            copyright matters will be settled at first instance by the District Court of Central Finland. Copyright
            matters will be settled at first instance by the Market Court.
        </p>

        <h4>12 Contact us</h4>
        <p>
            If you have any questions concerning these Terms of Use, please contact Jamk's Data Protection Officer at
            <a href="mailto:tietosuoja@jamk.fi">tietosuoja@jamk.fi</a> or the AIRe service contact persons at
            <a href="mailto:aire@jamk.fi">aire@jamk.fi</a>.
        </p>
    </template>
</template>
