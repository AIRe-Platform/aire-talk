<!-- This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
 -->


<script setup lang="ts">
import useTheme from '@/context/theme';
import { getUILanguage, l } from '@/locales';
import { reactive } from 'vue';

const state = reactive<{
    termsOpen: boolean,
    privacyOpen: boolean,
}>({
    termsOpen: false,
    privacyOpen: false,
});

const theme = useTheme();
const lang = getUILanguage();

const toggleTermsModal = () => {
    resetModals();
    state.termsOpen = true;
};

const togglePrivacyModal = () => {
    resetModals();
    state.privacyOpen = true;
};


const resetModals = () => {
    state.termsOpen = false;
    state.privacyOpen = false;
}
</script>

<template>
    <div class="about-view">
        <div class="about-menu">
            <h1>{{ $t(l.about_title) }}</h1>
            <div class="btn-container">
                <button type="button" class="btn" @click="toggleTermsModal">{{ $t(l.about_tou) }}</button>
                <button type="button" class="btn" @click="togglePrivacyModal">{{ $t(l.about_privacy_policies)
                    }}</button>
            </div>
            <div class="collab-container">
                <h2>{{ $t(l.about_collaboration) }}</h2>
                <div class="images-container">
                    <a href="https://www.goodlife.technology" target="_blank">
                        <img src="@/assets/images/GoodLife_Logo_white -2023.png" :alt="$t(l.about_goodlife_logo_alt)">
                    </a>
                    <a href="https://www.jamk.fi/fi" target="_blank">
                        <img v-if="theme.style === 'theme-dark' && lang === 'fi'"
                            src="@/assets/images/jamk_tunnus_valkoinen_nimella_suomi.png"
                            :alt="$t(l.about_jamk_logo_alt)">
                        <img v-else-if="theme.style === 'theme-dark' && lang !== 'fi'"
                            src="@/assets/images/jamk_tunnus_valkoinen_nimella_englanti.png"
                            :alt="$t(l.about_jamk_logo_alt)">
                        <img v-else-if="theme.style === 'theme-default' && lang === 'fi'"
                            src="@/assets/images/jamk_tunnus_sininen_nimella_suomi.png"
                            :alt="$t(l.about_jamk_logo_alt)">
                        <img v-else src="@/assets/images/jamk_tunnus_sininen_nimella_englanti.png"
                            :alt="$t(l.about_jamk_logo_alt)">
                    </a>
                </div>
            </div>
        </div>
        <div class="about-container" tabindex="0">
            <div class="about-subcontainer" v-if="state.termsOpen">
                <div class="about-content">
                    <h3>AIRe käyttöehdot</h3>
                    <p>Päivitetty 3.6.2025</p>
                    <p>
                        AIRe on tekoälyavusteinen sovellus, joka on Jamkin tutkimus-, kehittämis-, innovaatio, ja
                        opetustoimintaa tukeva simulaatioympäristö. AIRe auttaa Käyttäjää tunnistamaan kuntoutuksen
                        tarpeita ja opastaa Käyttäjän yksilöllisten kuntoutuksen palveluiden ja sisällön pariin.<br />
                    </p>
                    <p>
                        Käyttämällä AIRe-palvelua sitoudut noudattamaan näitä loppukäyttäjän sopimusehtoja. Palveluiden
                        käyttö ei ole mahdollista, mikäli et hyväksy näitä sopimusehtoja.
                    </p>
                    <h4>1 Yleistä</h4>
                    <p>
                        Näitä käyttöehtoja (”Käyttöehdot”) sovelletaan Jyväskylän ammattikorkeakoulu Oy:n, Y-tunnus
                        1006550-2 (”Jamk”), AIRe-verkkopalveluun (”jäljempänä Palvelu”). AIRe antaa rekisteröityneille
                        käyttäjille mahdollisuuden hyödyntää Palvelua saavuttaakseen positiivisen muutoksen omassa
                        toimintakyvyssään ja hyvinvoinnissaan. Palvelu tarjoaa AIRen käyttäjille (”Käyttäjä”)
                        mahdollisuuden tallentaa Palveluun itseään koskevia tietoja ja käydä keskustelua
                        tekoälyavusteisen AIRe-palvelun kanssa. Käyttäjä voi tarkastella Jamkin, sen yhteistyökumppanien
                        ja muiden kolmansien osapuolten Palveluun tallentamia sisältöjä. Käyttämällä verkkopalvelua
                        annat samalla luvan tallentamiesi tietojen käyttöön.
                    </p>
                    <p>
                        Käyttämällä AIRea sitoudut noudattamaan näitä käyttöehtoja ja tietosuojaselostetta. Ennen kuin
                        käytät AIRea, sinun on hyväksyttävä nämä käyttöehdot ja tietosuojaseloste. Jamkilla on oikeus
                        muuttaa näitä Käyttöehtoja ilmoittamalla tästä Käyttäjälle. Jatkamalla Palvelun käyttöä
                        tällaisen ilmoituksen vastaanottamisen jälkeen, Käyttäjä hyväksyy muutetut käyttöehdot.
                    </p>
                    <h4>2 Palveluntarjoaja, asioinnin kieli ja asiakastuki</h4>
                    <p>
                        Jyväskylän ammattikorkeakoulu Oy<br />
                        Y-tunnus: 1006550-2<br />
                        PL 207<br />
                        40101 Jyväskylä
                    </p>
                    <p>
                        Ehtoja koskevat kysymykset pyydämme osoittamaan: <a href="mailto:tietosuoja@jamk.fi">tietosuoja@jamk.fi</a>. Palvelussa asiointi
                        tapahtuu Käyttäjän valitsemalla, Palvelussa kulloinkin saatavilla olevalla kielivalinnalla
                        (tällä hetkellä suomi, englanti, espanja, swahili, vietnam, indonesia sekä ruandan kieli).
                    </p>
                    <p>
                        Asiakaspalvelua on saatavilla suullisesti ja kirjallisesti suomen ja englannin kielellä.
                    </p>
                    <h4>3 Pääsy palveluun</h4>
                    <p>
                        Käyttäjän hyväksyttyä nämä Käyttöehdot, Jamk antaa Käyttäjälle rajoitetun oikeuden käyttää
                        Palvelua henkilökohtaiseen, ei-kaupalliseen tarkoitukseen. Käyttäjäksi voi rekisteröityä
                        ainoastaan jamk.fi-käyttäjätunnuksilla. Palveluun rekisteröityviltä käyttäjiltä edellytämme 18
                        vuoden ikää. Palveluun rekisteröityminen vaatii toimivan sähköpostiosoitteen.
                    </p>
                    <p>
                        Lisäksi palvelua on mahdollista käyttää Admin-oikeudellisen, rekisteröityneen Käyttäjän luomalla
                        testitunnuksella. Testitunnus mahdollistaa palveluun kirjautumisen ennalta määritetyn ajanjakson
                        aikana. Testitunnuksella Palveluun kirjautuva Käyttäjä hyväksyy ja häntä sitoo samat tietosuoja-
                        ja käyttöehdot, kuin varsinaista Käyttäjää.
                    </p>
                    <p>
                        Käyttäjä on vastuussa kaikista tarvittavista järjestelyistä, jotta hän pääsee AIRe-palveluun.
                        Palvelun käytön edellyttämät päätelaitteet ja yhteydet (kuten yhteys matkaviestinverkkoon tai
                        internetiin) eivät kuulu Jamkin AIRe-palveluun. Käyttäjä vastaa tällaisten laitteiden tai
                        yhteyksien hankkimisesta, ylläpidosta ja päivittämisestä ja niistä aiheutuvista kustannuksista.
                        Käyttäjä vastaa käyttämiensä laitteiden, ohjelmistojen ja tietoliikenneyhteyksien
                        tietoturvallisuudesta.
                    </p>
                    <h4>4 Käyttäjäksi rekisteröityminen</h4>
                    <p>
                        Palvelun käyttö edellyttää Palveluun kirjautumista rekisteröityneenä käyttäjänä (”Luo tili”).
                        Jamk antaa Käyttäjälle mahdollisuuden kirjautua AIRe-palveluun hyödyntäen
                        jamk.fi-sähköpostiosoitetta. Käyttöä varten Käyttäjä luo itselleen käyttäjätunnuksen ja
                        salasanan. Käyttäjä vastaa käyttäjätunnuksen ja salasanan säilytyksestä ja siitä, että kukaan
                        muu kuin Käyttäjä ei voi kirjautua Palveluun Käyttäjän käyttäjätunnusta ja salasanaa käyttäen.
                        Mikäli Käyttäjä uskoo, että Palvelun salasana ja käyttäjätunnus on saattanut vaarantua,
                        Käyttäjän tulee vaihtaa salasana
                        viipymättä.
                    </p>
                    <p>
                        Käyttäjä on vastuussa vahvan salasanan käyttämisestä käyttäjätilin luomisen yhteydessä.

                        Salasanassa on oltava vähintään 8 merkkiä, ja sen tulee sisältää isoja ja pieniä kirjaimia, sekä
                        numeroita.
                    </p>
                    <p>
                        Käyttäjä sitoutuu aina kirjautumaan ulos Palvelusta, mikäli hän asioi Palvelussa yhteiskäytössä
                        olevilla laitteilla.
                    </p>
                    <h4>5 Hinnat</h4>
                    <p>
                        Palvelun käyttö on Käyttäjälle maksutonta.
                    </p>

                    <h4>6 Palveluun syötettävät tiedot</h4>
                    <p>
                        Palvelun tietyt osiot mahdollistavat tietojen syöttämisen Palveluun. Käyttäjä vastaa siitä, että
                        hänen Palveluun syöttämänsä tiedot ovat virheettömiä ja asianmukaisia.
                    </p>
                    <p>
                        Palvelu voi sisältää yhteyksiä tai linkkejä muiden kolmansien osapuolten omistamille tai
                        operoimille sivuille ja sähköisiin palveluihin. Palvelu voi myös sisältää kolmansien osapuolten
                        sisältöjä, tuotteita ja palveluita. Jamk ei ole vastuussa kolmansien osapuolten sisällöstä,
                        linkeistä, tuotteista tai palveluista tai linkkien toimivuudesta.
                    </p>

                    <h4>7 Tietosuoja ja henkilötiedot</h4>
                    <p>
                        Jamk kerää Käyttäjältä hänen Palveluun syöttämiään henkilötietoja ja Palvelun käyttöä koskevia
                        tietoja henkilörekisteriin (AIRe-käyttäjärekisteri). Jamk käsittelee Käyttäjältä saamiaan
                        henkilötietoja tietosuojaselosteen mukaisesti. Käyttäjä sitoutuu lukemaan tietosuojailmoituksen
                        sekä noudattamaan sitä.
                    </p>
                    <p>
                        Tietojen käsittelyyn, yksityisyyden sekä henkilötietojen suojaan sovelletaan AIRen
                        tietosuojaselostetta. Hyväksymällä nämä Käyttöehdot Käyttäjä vahvistaa, että on lukenut ja
                        hyväksynyt Tietosuojaselosteen.
                    </p>
                    <h4>8 Immateriaalioikeudet</h4>
                    <p>
                        Immateriaalioikeudet Palveluun ja kaikkeen Palvelussa olevaan materiaaliin kuuluvat Jamkille tai
                        kolmannelle osapuolelle.
                    </p>
                    <p>
                        Käyttäjälle ei synny tai siirry mitään immateriaalioikeuksia Palvelun käytön kautta tai
                        toimittamalla materiaalia Palveluun. Testitunnuksella Palveluun kirjautuvan Käyttäjän
                        käyttöoikeus Palveluun rajoittuu henkilökohtaiseen käyttöön. Käyttäjällä ei ole oikeutta saattaa
                        yleisön saataviin Palvelun sisältöjä edes osittain ilman Jamkin kirjallista lupaa. Jamkin
                        Käyttäjät voivat käyttää AIRe-palvelua opetus-, kehittämis- ja tutkimustoiminnassa ja esitellä
                        sisältöjä yleisölle.
                    </p>
                    <p>
                        Käyttäjä vastaa näiden ehtojen, lainsäädännön, viranomaismääräysten tai hyvän tavan vastaisesta
                        palvelun ja sen sisältämän aineiston käytöstä palveluntuottajille tai kolmannelle osapuolelle
                        aiheutuneesta vahingosta. Tekijänoikeudellisesta korvausvelvollisuudesta säädetään
                        tekijänoikeuslain 7 luvussa ja rikosoikeudellisesta rangaistusvastuusta tekijänoikeuslain 7
                        luvussa sekä rikoslain (39/1889) 49 luvussa.
                    </p>
                    <h4>9 Palvelun tuottaminen</h4>
                    <p>
                        Palvelu on Käyttäjän käytettävissä lähtökohtaisesti 24 tuntia vuorokaudessa. Jamkilla on oikeus
                        tuottaa Palvelu parhaaksi katsomallaan tavalla. Jamkilla on oikeus muuttaa Palvelua milloin vain
                        ja mistä tahansa syystä ilman ennakkoilmoitusta. Jamk pyrkii kuitenkin ilmoittamaan
                        olennaisista, Palvelun käyttöön merkittävästi vaikuttavista muutoksista kohtuullisessa ajassa
                        etukäteen. Muutoksista ilmoittamiseksi katsotaan niistä ilmoittaminen Palvelun etusivulla.
                    </p>
                    <p>
                        Jamkilla on oikeus keskeyttää Palvelun käyttö osittain, kokonaan tai tietyn Käyttäjän osalta.
                        Jamk pyrkii varmistamaan, että keskeytys on mahdollisimman lyhyt. Mikäli mahdollista, Jamk
                        pyrkii ilmoittamaan kohtuullisessa ajassa etukäteen Palvelun käyttökatkoksista tai
                        keskeytyksestä.
                    </p>
                    <p>
                        Jamk voi keskeyttää, peruuttaa, lopettaa tai muuttaa AIRe-palvelun kokonaan tai osittain ilman
                        erillistä ilmoitusta. Jamk ei ole vastuussa Käyttäjälle, mikäli jostain syystä AIRe-palvelu ei
                        ole käytettävissä.
                    </p>
                    <h4>10 Jamkin vastuu</h4>
                    <p>
                        Palvelun teknisestä ylläpidosta vastaa GoodLife Technology Jamkin toimeksiantamana. Jamk tuottaa
                        osittain Palvelun sisällön, mutta sen kautta on saavutettavissa myös yhteistyökumppaneiden ja
                        kolmansien osapuolten tuottamaa sisältöä ja palveluita, joista vastaa kukin osapuoli.
                    </p>
                    <p>
                        Jamk ei takaa, että Palvelu toimii ilman keskeytyksiä tai virheettä. Jamk ei ole vastuussa
                        Palvelussa olevan tiedon oikeellisuudesta, täsmällisyydestä, kattavuudesta tai luotettavuudesta
                        eikä Palvelussa olevasta tai sen kautta toimitetusta sisällöstä.
                    </p>
                    <p>
                        Jamk ei vastaa Palvelun käytöstä aiheutuvista välittömistä tai välillisistä vahingoista tai
                        Palveluun toimitetun informaation muutoksista tai katoamisesta eikä Palvelun käytön
                        keskeytyksistä tai häiriöistä.
                    </p>
                    <h4>11 Sovellettava laki ja riitojen ratkaisu</h4>
                    <p>
                        Näihin käyttöehtoihin ja tietosuojailmoitukseen sovelletaan Suomen lakia. Näistä käyttöehdoista
                        aiheutuvat erimielisyydet pyritään ensisijaisesti ratkaisemaan sovinnollisesti. Mikäli
                        sopimukseen ei päästä, asian ratkaisee ensimmäisenä oikeusasteena Keski-Suomen käräjäoikeus
                        muissa kuin tekijänoikeutta koskevissa asioissa. Tekijänoikeusasioissa asian ratkaisee
                        ensimmäisenä oikeusasteena markkinaoikeus.
                    </p>
                    <h4>12 Ota yhteyttä</h4>
                    <p>
                        Mikäli sinulla on kysyttävää näihin käyttöehtoihin liittyen, voit olla yhteydessä Jamkin
                        tietosuojavastaavaan,
                        <a href="mailto:tietosuoja@jamk.fi">tietosuoja@jamk.fi</a> tai
                        <a href="mailto:aire@jamk.fi">aire@jamk.fi</a>.
                    </p>
                </div>
            </div>
            <div class="about-subcontainer" v-else-if="state.privacyOpen">
                <div class="about-content">
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
                        <a
                            href="https://learn.microsoft.com/en-us/legal/cognitive-services/openai/data-privacy?tabs=azure-portal">
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
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.about-view {
    display: flex;
    width: 100%;
    height: 100%;
}

.about-menu {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    font-size: larger;
    padding-inline: 3rem;
    margin-block-start: 10rem;
    width: 20%;

    &>.btn-container {
        display: flex;
        flex-direction: column;
        gap: 2rem;
        margin-block-start: 2rem;
    }
}

.about-container {
    background-color: #47425E;
    border-left: 2px solid #2374AB;
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    align-items: center;
    overflow-y: auto;
}

.about-subcontainer {
    background-color: #FFF;
    color: black;
    width: 50%;
    flex-grow: 1;
    padding: 2rem;
    margin-block: 2rem;
}

.images-container {
    display: flex;

    a,
    img {
        width: 100%;
        height: auto;
    }
}

.collab-container {
    margin-block-start: auto;
}

.about-content {
    a {
        color: var(--button-color);
    }

    p {
        margin-bottom: 1rem;
    }
}

@media screen and ((max-aspect-ratio: 1/1) or (max-width: 920px)) {
    .about-view {
        flex-direction: column;
    }

    .about-menu {
        margin-block-start: 0.5rem;
        height: auto;
        width: auto;
        padding: 0;

        &>h1 {
            text-align: end;
            margin-block-start: 0.5rem;
            margin-inline-end: 0.5rem;
        }

        &>.btn-container {
            flex-direction: row;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin-block-start: 1.5rem;
            margin-inline: 0.5rem;

            &>.btn {
                flex: 1 1 5rem;
            }
        }
    }

    .about-container {
        font-size: var(--font-small);
        border-left: unset;
        border-top: 2px solid #2374AB;
        margin-block-start: 0.5rem;
    }

    .about-subcontainer {
        width: auto;
        margin-inline: 1rem;
    }

    .collab-container {
        display: none;
    }
}
</style>
