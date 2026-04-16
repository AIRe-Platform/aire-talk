<script setup lang="ts">
import { getUILanguage } from '@/locales';
const lang = getUILanguage();
</script>

<template>
    <template v-if="lang === 'fi'">
        <h4>SAAVUTETTAVUUSSELOSTE</h4>
        <p>
            <b>
                Tämä on Jyväskylän ammattikorkeakoulun kehittämän AIRe-alustaan kuuluvan AIRe Talk - palvelun
                saavutettavuusseloste. Palvelun tuotantoversio on julkaistu kesäkuussa 2025. Tämä saavutettavuusseloste
                on päivitetty 9.4.2026. Palvelun tulee noudattaa WCAG 2.2 -kriteeristön AA-tasoa.
            </b>
        </p>
        <h4>Saavutettavuuden arviointi</h4>
        <p>
            AIRe Talk -palvelun saavutettavuusauditoinnin toteutti EXOVE 21.11.2024. Auditointi kattoi käyttöliittymän
            keskusteluosuuden ja käyttöliittymän kokonaisuuden, mukaan lukien käyttäjätilin hallintapaneelin,
            käyttäjäprofiilin, käyttöliittymän asetukset, päävalikon, chat-historian ja chat-keskustelut. Tarkastus on
            suoritettu sekä sivuston työpöytä- että mobiiliversioilla.
        </p>
        <h4>Digipalvelun saavutettavuuden tila</h4>
        <p>
            AIRe-palvelu täyttää saavutettavuusvaatimukset osittain.
            Palvelun epäkohtia korjataan ja samoin sen sisällössä havaittuja saavutettavuuspuutteita.
        </p>
        <h4>Ei saavutettava sisältö</h4>
        <p>
            <b>Havaittava:</b> Tekstivastineet puuttuvat ei-tekstimuotoiselta sisällöltä, ja esitystavassa välittyvät
            informaatio, rakenne ja suhteet eivät ole ohjelmallisesti selvitettyjä. Tekstin visuaalinen esitys ei täytä
            vähintään 4,5:1 kontrastisuhdetta, eikä tekstin kokoa voi muuttaa 200% ilman sisällön tai toiminnallisuuden
            menettämistä.
        </p>
        <p>
            <b>Hallittava:</b> Kaikki sisällön toiminnallisuus ei ole hallittavissa näppäimistöllä. Navigoitavilla
            elementeillä ei ole loogista kohdistusjärjestystä, ja kaikilla navigoitavilla elementeillä ei ole näkyvää
            fokusindikaattoria.
        </p>
        <p>
            <b>Ymmärrettävä:</b> Sivun osien kieli ei ole ohjelmallisesti selvitetty. Elementtiin kohdistaminen
            aiheuttaa kontekstin muutoksen. Automaattinen syötevirhe ei ole tunnistettu ja kuvattu
            tekstimuotoisena.
        </p>
        <p>
            <b>Toimintavarma:</b> Kaikkien käyttöliittymäkomponenttien nimi, rooli ja arvo eivät ole ohjelmallisesti
            selvitettyjä. Merkkauskielisen sisällön tilasta kertovat viestit eivät ole ohjelmallisesti selvitettyjä.
        </p>
        <h4>Palaute saavutettavuuden puutteista</h4>
        <p>
            Otamme mielellämme vastaan ehdotuksia, huomioita, kysymyksiä ja parannusehdotuksia AIRe-palvelun
            saavutettavuuteen liittyen <a href="mailto:aire@jamk.fi">aire@jamk.fi</a>.
        </p>
        <h4>Valvontaviranomainen</h4>
        <p>
            Jos huomaat sivustolla saavutettavuusongelmia, annathan ensin palautetta meille. Vastauksessa voi mennä
            14 päivää. Jos et ole tyytyväinen saamaasi vastaukseen, voit tehdä ilmoituksen
            <a
                href="https://saavutettavuusvaatimukset.fi/fi/kayttajan-oikeudet/tee-saavutettavuuskantelu-tai-pyyda-selvitysta">
                Liikenne- ja viestintävirasto Traficomiin
            </a>.
        </p>
        <p>
            Liikenne- ja viestintävirasto Traficom<br />
            Digitaalisen esteettömyyden ja saavutettavuuden valvontayksikkö<br />
            <a href="www.saavutettavuusvaatimukset.fi">www.saavutettavuusvaatimukset.fi</a><br />
            <a href="mailto:saavutettavuus@traficom.fi">saavutettavuus@traficom.fi</a><br />
            Puh: 029 534 5000
        </p>
    </template>
    <template v-else>
        <h4>ACCESSIBILITY STATEMENT</h4>
        <p>
            <b>
                This is the accessibility statement for the AIRe Talk service of AIRe Platform developed by
                Jyväskylä University of Applied Sciences. The production version of the service was published
                in June 2025. This accessibility statement was updated on 9 April 2026. The service should be
                compliant with the WCAG 2.2 criteria at level AA.
            </b>
        </p>
        <h4>Accessibility evaluation</h4>
        <p>
            The accessibility audit of the AIRe Talk service was carried out by EXOVE on 21 November 2024.
            The audit covered the chat interface and the overall user interface, including the user account
            dashboard, user profile, interface settings, main menu, chat history and chats. The evaluation
            was conducted on both desktop and mobile versions of the service.
        </p>
        <h4>Accessibility status of the service</h4>
        <p>
            The AIRe Talk service partially meets the accessibility requirements. Accessibility issues
            identified in the service and its content are being addressed.
        </p>
        <h4>Non-accessible content</h4>
        <p>
            <b>Perceivable:</b> Text alternatives are missing for non-text content, and information, structure and
            relationships are not programmatically determined. The visual presentation of text does not
            meet the minimum contrast ratio of 4.5:1, and text cannot be resized up to 200% without loss of
            content or functionality.
        </p>
        <p>
            <b>Operable:</b> Not all functionality of the content is operable through a keyboard. Navigable
            elements do not follow a logical focus order, and not all navigable elements have a visible focus
            indicator.
        </p>
        <p>
            <b>Understandable:</b> The language of parts of the page is not programmatically determined.
            Focusing on an element causes a change of context. Automatic input errors are not identified
            and described in text form.
        </p>
        <p>
            <b>Robust:</b> The name, role and value of all user interface components are not programmatically
            determined. Status messages in markup language content are not programmatically determined.
        </p>
        <h4>Feedback on accessibility issues</h4>
        <p>
            We welcome feedback, questions and improvement suggestions regarding the accessibility of
            the AIRe service at <a href="mailto:aire@jamk.fi">aire@jamk.fi</a>.
        </p>
        <h4>Supervisory authority</h4>
        <p>
            If you notice accessibility problems on the site, please first provide feedback to us. We aim to
            respond within 14 days. If you are not satisfied with the response you receive, you may file a
            complaint with the
            <a
                href="https://saavutettavuusvaatimukset.fi/en/user-rights/submit-complaint-web-accessibility-or-request-clarification">
                Finnish Transport and Communications Agency Traficom
            </a>.
        </p>
        <p>
            Finnish Transport and Communications Agency Traficom<br />
            Digital Accessibility and Accessibility Supervision Unit<br />
            <a href="www.saavutettavuusvaatimukset.fi">www.saavutettavuusvaatimukset.fi</a><br />
            <a href="mailto:saavutettavuus@traficom.fi">saavutettavuus@traficom.fi</a><br />
            Tel: +358 29 534 5000
        </p>
    </template>
</template>