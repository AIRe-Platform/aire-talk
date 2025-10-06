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
                        <img id="goodlife-logo" src="@/assets/images/GoodLife_Logo_white -2023.png"
                            :alt="$t(l.about_goodlife_logo_alt)">
                    </a>
                    <a href="https://www.jamk.fi/fi" target="_blank">
                        <template v-if="theme.style === 'theme-dark'">
                            <img v-if="lang === 'fi'" src="@/assets/images/jamk_tunnus_valkoinen_nimella_suomi.png"
                                :alt="$t(l.about_jamk_logo_alt)">
                            <img v-else src="@/assets/images/jamk_tunnus_valkoinen_nimella_englanti.png"
                                :alt="$t(l.about_jamk_logo_alt)">
                        </template>
                        <template v-else>
                            <img v-if="lang === 'fi'" src="@/assets/images/jamk_tunnus_sininen_nimella_suomi.png"
                                :alt="$t(l.about_jamk_logo_alt)">
                            <img v-else src="@/assets/images/jamk_tunnus_sininen_nimella_englanti.png"
                                :alt="$t(l.about_jamk_logo_alt)">
                        </template>

                    </a>
                </div>
            </div>
        </div>
        <div class="about-container" tabindex="0">
            <div class="about-subcontainer" v-if="state.termsOpen">
                <div class="about-content" v-if="lang === 'fi'">
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
                        Ehtoja koskevat kysymykset pyydämme osoittamaan:
                        <a href="mailto:tietosuoja@jamk.fi">tietosuoja@jamk.fi</a>. Palvelussa asiointi
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
                <div class="about-content" v-else>
                    <h3>AIRe Platform Terms of Use</h3>
                    <p>Updated 3 June 2025</p>
                    <p>
                        AIRe Platform is an AI-assisted service that serves as a simulation environment supporting
                        Jamk’s research, development, innovation, and educational activities. AIRe helps the user
                        identify rehabilitation needs and guides the user toward personalized rehabilitation services
                        and content.
                    </p>
                    <p>
                        By using the AIRe service, you agree to comply with these end-user terms. Use of the services is
                        not permitted if you do not accept these terms.
                    </p>
                    <h4>1 General</h4>
                    <p>
                        These terms of use (“Terms”) apply to the AIRe online service (“Service”) provided by Jamk
                        University of Applied Sciences Ltd, Business ID 1006550-2 (“Jamk”). AIRe allows registered
                        users to utilize the Service to achieve positive changes in their functioning and well-being. The
                        Service enables users (“User”) to store personal information and interact with the AI-assisted
                        AIRe service. Users can also view rehabilitation content stored in the Service by Jamk, its
                        partners, and other third parties. By using the Service, you consent to the use of the information
                        you provide.
                    </p>
                    <p>
                        By using AIRe, you agree to these Terms of Use and the Privacy Statement. You must accept
                        these before using AIRe. Jamk reserves the right to amend these Terms by notifying the User.
                        Continued use of the Service after such notification constitutes acceptance of the updated
                        Terms.
                    </p>
                    <h4>2 Service provider, service language, and customer support</h4>
                    <p>
                        JAMK University of Applied Sciences Ltd<br />
                        Business ID: 1006550-2<br />
                        P.O. Box 207<br />
                        40101 Jyväskylä, Finland
                    </p>
                    <p>
                        Questions regarding the Terms of Use: 
                        <a href="mailto:tietosuoja@jamk.fi">tietosuoja@jamk.fi</a>. The Service is available in the 
                        language selected by the User from the options currently supported (currently Finnish, 
                        English, Spanish, Swahili, Vietnamese, Indonesian, and Kinyarwanda).
                    </p>
                    <p>
                        Customer service is available in Finnish and English, both orally and in writing.
                    </p>
                    <h4>3 Access to the service</h4>
                    <p>
                        Upon accepting these Terms of Use, Jamk grants the User a limited right to use the Service for
                        personal, non-commercial purposes. Only users with jamk.fi credentials may register. Users
                        must be at least 18 years old and have a valid email address.
                    </p>
                    <p>
                        The Service may also be accessed using test account credentials created by an admin-level
                        registered User. The test account allows login during a predefined period. Users logging in with a
                        test account are bound by the same privacy and usage terms as regular Users.
                    </p>
                    <p>
                        Users are responsible for arranging devices and needed connections to access the AIRe service.
                        Devices and connections (e.g., mobile or internet) required to use the Service are not provided
                        by Jamk. Users are responsible for acquiring, maintaining, and updating such devices and
                        connections and for any associated costs. Users are also responsible for the security of their
                        devices, software, and connections.
                    </p>
                    <h4>4 User registration</h4>
                    <p>
                        Use of the Service requires login as a registered user (“Create account”). Jamk allows login
                        using a jamk.fi email address. Users create a username and password and are responsible for
                        keeping them secure. If a User suspects their credentials have been compromised, they must
                        change their password immediately.
                    </p>
                    <p>
                        Passwords must be strong: at least 8 characters, including uppercase and lowercase letters and
                        numbers.
                    </p>
                    <p>
                        Users must always log out when using shared devices.
                    </p>
                    <h4>5 Pricing</h4>
                    <p>
                        The Service is free of charge for Users.
                    </p>
                    <h4>6 Data entered into the service</h4>
                    <p>
                        Some parts of the Service allow Users to enter data. Users are responsible for ensuring the
                        accuracy and appropriateness of the data they provide.
                    </p>
                    <p>
                        The Service may contain links to third-party websites and services. Jamk is not responsible for
                        the content, links, products, or services of third parties.
                    </p>

                    <h4>7 Privacy and personal data</h4>
                    <p>
                        Jamk collects personal data and usage information from Users into the AIRe user register. Jamk
                        processes this data in accordance with the Privacy Statement. Users agree to read and comply
                        with the Privacy Statement.
                    </p>
                    <p>
                        The processing of data, protection of privacy and personal data is governed by the AIRe Privacy
                        Statement. By accepting these Terms of Use, the User confirms they have read and accepted
                        the Privacy Statement.
                    </p>
                    <h4>8 Intellectual property rights</h4>
                    <p>
                        All intellectual property rights to the Service and its content belong to Jamk or third parties.
                    </p>
                    <p>
                        Users do not acquire any intellectual property rights through use of the Service. Test account
                        access is limited to personal use and test users may not make any part of the Service publicly
                        available without written permission from Jamk.
                    </p>
                    <p>
                        Jamk users may use AIRe for educational, development, and research purposes and present content 
                        to the public.
                    </p>
                    <p>
                        Users are liable for any damages caused by violating these Terms of Use, laws, regulations, or
                        good practice. Copyright liability is governed by chapter 7 of the Copyright Act and criminal
                        liability by chapter 49 of the Criminal Code of Finland.
                    </p>
                    <h4>9 Service provision</h4>
                    <p>
                        The Service is generally available 24/7. Jamk reserves the right to provide the Service in the
                        manner it deems most appropriate and may change it at any time without notice. Jamk will
                        attempt to notify Users of significant changes in advance via the Service homepage.
                    </p>
                    <p>
                        Jamk may suspend the Service partially, entirely, or for specific Users. Jamk aims to minimize
                        downtime and provide advance notice where possible.
                    </p>
                    <p>
                        Jamk may suspend, cancel, terminate, or modify the AIRe service without notice. Jamk is not
                        liable if the Service is unavailable.
                    </p>
                    <h4>10 Jamk’s responsibility</h4>
                    <p>
                        Technical maintenance is provided by GoodLife Technology on behalf of Jamk. Some content is
                        produced by Jamk, while other content and services are provided by partners and third parties,
                        who are responsible for their own content.
                    </p>
                    <p>
                        Jamk does not guarantee uninterrupted or error-free operation. It is not responsible for the
                        accuracy, completeness, or reliability of the content.
                    </p>
                    <p>
                        Jamk is not liable for direct or indirect damages, data loss, or service interruptions.
                    </p>
                    <h4>11 Governing law and dispute resolution</h4>
                    <p>
                        These Terms of Use and the Privacy Statement are governed by Finnish law. Disputes will be
                        resolved primarily through negotiation. If no agreement is reached, disputes will be settled in
                        the District Court of Central Finland, except for copyright matters, which are handled by the
                        Market Court.
                    </p>
                    <h4>12 Contact</h4>
                    <p>
                        If you have questions about these Terms of Use, contact Jamk’s data protection officer
                        at
                        <a href="mailto:tietosuoja@jamk.fi">tietosuoja@jamk.fi</a> or
                        <a href="mailto:aire@jamk.fi">aire@jamk.fi</a>.
                    </p>
                </div>
            </div>
            <div class="about-subcontainer" v-else-if="state.privacyOpen">
                <div class="about-content" v-if="lang === 'fi'">
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
                <div class="about-content" v-else>
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

                        <a
                            href="https://learn.microsoft.com/en-us/legal/cognitive-services/openai/data-privacy?tabs=azure-portal">
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
    background-color: var(--page-background);
    border-left: 2px solid var(--panel-border-color);
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    align-items: center;
    overflow-y: auto;
}

.about-subcontainer {
    background-color: #FFF;
    color: black;
    width: 80%;
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

.theme-default {
    #goodlife-logo {
        background-color: var(--button-color);
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
        border-top: 2px solid var(--panel-border-color);
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
