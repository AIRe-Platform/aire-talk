// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.


import { Locale } from ".";

const fi: Locale = {
    aire_bot: "AIRe",
    aire_system: "AIRe-järjestelmä",

    footer: "Kehitysversio",
    not_found: "Sivua ei löytynyt",

    system_greeting:
        "Tervetuloa AIRe-palveluun! Aloita kuvailemalla tilannettasi tai tarvitsemaasi apua.",
    system_topic: "Olet valinnut aiheeksi: ",
    system_found_content: "Löysin sisältöä, joka saattaa kiinnostaa sinua!",
    system_end_of_conversation: "Keskustelu on päättynyt",
    system_end_of_conversation_options: "Miten haluat jatkaa?",
    system_reminder_set: "Luotiin muistutus '{subject}' ajankohdalle {time}.",

    conversation_option_continue: "Jatka tätä keskustelua",
    conversation_option_new_chat: "Aloita uusi keskustelu",

    notification_keyword: "\"{keyword}\" teema tunnistettu",

    start_greeting: "Tervetuloa AIRe-palveluun",
    start_first_paragraph:
        "Kumppanisi parempaan toimintakykyyn ja hyvinvointiin",
    start_second_paragraph:
        "Jatka kirjautumalla sisään tai luomalla itsellesi uusi käyttäjätili.",
    start_footer:
        "AIRe on tekoälyavusteinen sovellus, joka auttaa sinua tunnistamaan kuntoutumisen tarpeitasi ja opastaa sinut yksilöllisesti kuntoutuksen palveluiden ja sisällön pariin.",
    start_disclaimer: "AIRe ei ole lääketieteellinen diagnostinen työkalu.",

    home_start_new_chat: "Aloita uusi keskustelu",
    home_continue_chat: "Jatka edellistä keskustelua",

    login_redirect: "Siirrytään kirjautumissivulle...",
    login_failure: "Kirjautuminen ei juuri nyt onnistu. Yritä myöhemmin uudelleen.",
    login_callback_failure: "Kirjautuminen epäonnistui",
    login_callback_error_description: "Lisätiedot:",
    login_callback_button: "Takaisin etusivulle",

    signup_form_title: "Luo tili",
    signup_form_submit: "Rekisteröidy",
    signup_label_email: "Sähköpostiosoite",
    signup_password_instructions: "Salasanassa on oltava vähintään 8 merkkiä, ja sen tulee sisältää isoja ja pieniä kirjaimia, sekä numeroita.",
    signup_label_password: "Salasana",
    signup_label_confirm_password: "Vahvista salasana",

    nav_start: "Hei!",
    nav_home: "Koti",
    nav_chat: "Keskustelu",
    nav_chat_history: "Keskusteluhistoria",
    nav_chat_new: "Uusi keskustelu",
    nav_content_catalogue: "Sisältökirjasto",
    nav_profile: "Käyttäjätiedot",
    nav_login: "Kirjaudu sisään",
    nav_logout: "Kirjaudu ulos",
    nav_signup: "Luo tili",
    nav_preferences: "Asetukset",
    nav_main_menu: "Päävalikko",
    nav_catalogue: "Oma sisältökirjasto",
    nav_about: "Tietoa AIRe-palvelusta",

    profile_title: "Käyttäjätili",
    profile_label_first_name: "Etunimi",
    profile_label_last_name: "Sukunimi",
    profile_label_gender: "Sukupuoli",
    profile_label_year_of_birth: "Syntymävuosi",
    profile_label_language: "Kieli",
    profile_label_country: "Maa",
    profile_label_bio: "Tietoja",
    profile_button_save: "Tallenna",
    profile_characters_max: 'Enintään {0} merkkiä.',
    profile_remaining: "jäljellä olevat merkit.",

    profile_heading_connected_services: "Yhdistetyt palvelut",
    profile_empty_service_list: "Ei yhdistettyjä palveluita",

    profile_heading_password: "Vaihda salasana",
    profile_description_password:
        "Salasanassa on oltava vähintään 8 merkkiä, ja sen tulee sisältää isoja ja pieniä kirjaimia, sekä numeroita.",
    profile_label_current_password: "Nykyinen salasana",
    profile_label_new_password: "Uusi salasana",
    profile_button_change_password: "Vaihda salasana",

    profile_heading_personal_data: "Henkilökohtaiset tiedot",
    profile_description_personal_data:
        "Kaikki keräämämme yksilöivät tiedot ovat salattuja siten, että vain sinulla on pääsy niihin. Tietosi ovat AIRe-palvelujen käytettävissä vain silloin, kun sinä käytät niitä. Voit ladata kaikki tietosi tästä. Huomioithan, että tietojen keräämisessä voi kestää pieni hetki.",
    profile_button_download_personal_data: "Lataa",

    profile_heading_delete_account: "Tilin poistaminen",
    profile_description_delete_account:
        "Tämä poistaa tilisi AIRe-palvelusta. Syötä salasana vahvistaaksesi poisto.",
    profile_label_password_confirm: "Vahvista salasana",
    profile_label_keep_anonymized_data:
        "Anonymisoi tietoni poistamisen sijaan. Tämä auttaa AIRe-palvelun kehittämisessä ja on täysin vapaaehtoista.",
    profile_button_delete: "Poista tili",

    gender_male: "mies",
    gender_female: "nainen",
    gender_other: "muu",

    profile_question_button: "Täydennä käyttäjätiedot",
    profile_question_confirm:
        "Vastaisitko muutamaan kysymykseen, joilla voin täydentää käyttäjätietojasi?",
    profile_question_completion:
        "Valitse 'Jatka', jos tietosi ovat oikein. Voit voit muokata niitä myöhemmin käyttäjätiedoissasi.",
    profile_question_first_name: "Mikä on etunimesi?",
    profile_question_last_name: "Mikä on sukunimesi?",
    profile_question_gender: "Mikä on sukupuolesi?",
    profile_question_year_of_birth: "Minä vuonna synnyit?",
    profile_question_country: "Missä maassa asut?",

    profile_experiments_title: "Oman kehotteen kokeilut (admin-käyttäjille)",
    profile_experiments_text: "Ohita AIRen järjestelmäkehote",
    profile_experiments_add: "Lisää",
    profile_experiments_description: "kehotteeseen, jos haluat lisätä yhteenvedon käyttäjäprofiilistasi.",
    profile_experiments_apply: "Ota oma kehote käyttöön",

    settings_title: "Asetukset",
    settings_language: "Kielivalinta",
    settings_ui_size: "Näkymän koko",
    settings_ui_size_normal: "Normaali",
    settings_ui_size_large: "Suuri",

    switch_color_mode: "Teema (vaalea/tumma)",

    error_generic: "Tapahtui tuntematon virhe!",
    error_ai_not_responding: `Vastauksen saaminen epäonnistui. Mikäli virhe toistuu useasti, yritä myöhemmin uudelleen.`,
    error_signup_password_mismatch: "Salasanat eivät täsmää. Varmista salasanan kirjoitusasu.",
    error_signup_bad_request: `Rekisteröityminen epäonnistui.

Sähköpostiosoite saattaa olla jo rekisteröity tai salasanasi ei täytä vähimmäisvaatimuksia. 

Salasanan tulee olla vähintään 8 merkkiä pitkä sekä sisältää pieniä ja isoja kirjaimia sekä numeroita.`,
    error_signup_general:
        "Rekisteröityminen epäonnistui. Yritä myöhemmin uudelleen.",
    error_profile_edit: "Tallentaminen epäonnistui.",
    error_profile_delete_account:
        "Tilin poistaminen epäonnistui. Yritä myöhemmin uudelleen.",
    error_profile_password:
        "Salasanan vaihtaminen epäonnistui. Tarkista, että antamasi salasana on oikein ja uusi salasana täyttää vaatimukset.",

    landing_view_title: "Tervetuloa AIRe-palveluun!",
    landing_view_text:
        "Aloita täyttämällä seuraavat taustatiedot itsestäsi.",
    landing_label_age: "Syntymävuosi",
    landing_label_occupation:
        "Nykyinen ja aiemmat ammattisi (Voit erottaa ammatit pilkulla)",

    onboarding_greetings: "Hei!",
    onboarding_question: "Haluaisitko keskustella esimerkiksi näistä aiheista?",

    topic_backpain: "Selkäkipu",
    topic_neckpain: "Niskakipu",
    topic_sleep_apnea: "Uniapnea",
    topic_increased_weight: "Painonnousu",
    topic_trouble_talking: "Puhevaikeudet",

    summary_title: "Yhteenveto",
    summary_acceptation_question: "Onko tiivistelmä oikein?",

    suggestions_title: "Ehdotuksia",
    suggestion_check_for_more: "Katso lisää täältä",

    tools_title: "Työkalut",
    tools_button_summarize: "Luo yhteenveto",
    tools_button_query_surveys: "Hae kyselyitä",
    tools_button_suggestions: "Sisältöehdotuksia",

    chat_history_loading: "Ladataan...",
    chat_history_tokens: "{0} tokenia",
    chat_input_title: "Mitä haluaisit kysyä tai kertoa?",

    popup_confirm_revert_message:
        "Haluatko varmasti poistaa tämän viestin jälkeen käydyn keskustelun? ",
    popup_confirm_remove_chat: "Haluatko varmasti poistaa tämän keskustelun?",
    popup_confirm_logout: "Haluatko varmasti kirjautua ulos?",
    popup_confirm_profile_updated: "Käyttäjätiedot päivitetty.",

    confirm_questionnaire_start: 'Haluaisitko täyttää kyselyn "{0}"?',
    confirm_questionnaire_completion:
        "Kun olet tyytyväinen vastauksiisi, valitse jatka.",
    questionnaire: "Kysely",
    questionnaire_start: "Kyselyn alku",
    questionnaire_end: "Kyselyn loppu",
    questionnaire_explanation:
        "Seuraavat kysymykset tallennetaan analysoitavaksi",
    question_answer: "Vastauksesi",

    recall_start_question: "Haluatko jatkaa jotain aiempaa keskustelua?",
    recall_keyword_question: "Haluatko jatkaa keskustelua joistakin seuraavista aiheista?",
    recall_summary_question: "Onko tämä vielä ajankohtainen aihe, josta keskustelua haluat jatkaa?",

    button_accept: "Hyväksy",
    button_cancel: "Peruuta",
    button_yes: "Kyllä",
    button_no: "Ei",
    button_back: "Takaisin",
    button_continue: "Jatka",
    button_close: "Sulje",
    button_mark_as_read: "Merkitse luetuksi",
    button_return_to_conversation: "Palaa keskusteluun",

    content_catalogue_empty: "Tämä on oma sisältökirjastosi, joka täydentyy AIRen ehdottamien sisältöjen perusteella.",
    content_catalogue_filters: "suodattimet",
    content_catalogue_clear_filter: "Tyhjennä suodatin",
    content_catalogue_newest_filter: "Uusimmat ensin",
    content_catalogue_oldest_filter: "Vanhimmat ensin",
    content_catalogue_search_by: "Hae seuraavasti:",
    content_catalogue_query_placeholder: "Kirjoita suodattaaksesi...",
    content_catalogue_sort_by: "Järjestä:",
    content_catalogue_apply_filter: "Suodata!",

    content_modal_continue_to_chat: "Palaa chattiin",
    content_modal_description: "Kuvaus:",
    content_modal_themes: "Teemat:",

    logout_inactivity_message: "Sinut on kirjattu ulos passiivisuuden vuoksi.",
    logout_inactivity_warning_message: "Passiivisuuden vouksi sinut kirjaudutaan ulos {duration} sekunnin kuluttua.",

    tooltip_edit: "Muokkaa",
    tooltip_delete: "Poista tilisi.",
    tooltip_save: "Tallenna muutokset.",
    tooltip_download: "Lataa henkilökohtaiset tietosi.",
    tooltip_close: "Sulje",
    tooltip_override: "ohita/älä ohita",
    tooltip_delete_chat: "Poista tämä keskustelu.",
    tooltip_suggestions: "Luo uusia ehdotuksia.",
    tooltip_summarize: "Luo uusi yhteenveto.",
    tooltip_personal_information: "Kysy henkilökohtaisia kysymyksiä.",
    tooltip_query_surveys: "Tee kysely.",
    tooltip_open_chat_side_panel: "Avaa/sulje paneeli.",
    tooltip_open_catalogue_content: "Avaa sisältöluettelo.",
    tooltip_send_message: "Lähetä.",
    tooltip_message_options: "Avaa/sulje viestivaihtoehdot.",
    tooltip_thumbs_up: "Tykkäät tästä.",
    tooltip_thumbs_down: "Et pidä tästä.",
    tooltip_copy_message: "Kopioi tämä viesti leikepöydälle.",
    tooltip_message_copied: "Viesti kopioitu.",
    tooltip_revert_message: "Poista seuraavat viestit tästä.",
    tooltip_remove_keyword: "Poista tämä teema.",
    tooltip_accept_summary: "Hyväksyn tämän yhteenvedon.",
    tooltip_reject_summary: "En hyväksy tätä yhteenvetoa.",
    tooltip_mark_reminder_read: "Ja poista tämä muistutus täältä.",
    tooltip_reminder_back_to_chat: "Jatka keskustelua tästä muistutuksesta.",
    tooltip_onboarding_button: "Keskustele uusista aiheista.",
    tooltip_nav_home: "Siirry kotinäkymään.",
    tooltip_nav_chat: "Keskustele botin kanssa.",
    tooltip_nav_chat_history: "Tarkastele vanhoja keskusteluja.",
    tooltip_nav_chat_new: "Aloita uusi keskustelu.",
    tooltip_nav_content_catalogue: "Tarkastele kaikkea AIRe-alustalla näkyvää sisältöä.",
    tooltip_nav_profile: "Siirry profiiliin.",
    tooltip_nav_login: "Siirry kirjautumiseen.",
    tooltip_nav_log_out: "Kirjaudu ulos.",
    tooltip_nav_signup: "Aloita AIRekäyttö.",
    tooltip_nav_preferences: "Siirry omiin asetuksiisi.",
    tooltip_nav_main_menu: "Siirry päävalikkoon.",
    tooltip_nav_catalogue: "Sisältöluettelon kuvaus.",
    tooltip_nav_about: "Siirry tietoja meistä -sivulle.",
    tooltip_menu_language: "Valitse käyttöliittymän kieli.",
    tooltip_menu_ui_mode: "Vaihda käyttöliittymän väriteema.",
    tooltip_chat_speech_recognition_off: "Pysäytä puheentunnistus",
    tooltip_chat_speech_recognition_on: "Aloita puheentunnistus",
    tooltip_chat_tts_read_message: "Lue viesti",
    tooltip_chat_tts_stop_reading: "Lopeta lukeminen",
    tooltip_chat_tts_read_new_messages_off: "Lopeta uusien viestien automaattinen lukeminen",
    tooltip_chat_tts_read_new_messages_on: "Lue uudet viestit",

    tutorial_home_welcome_message: "Tervetuloa AIReen! Haluaisitko opastusta sovelluksen käytöstä?",
    tutorial_chat_welcome_message: "Tällä sivulla voit keskustella AIRe-botin kanssa. Haluaisitko nopean opastuksen keskustelusta botin kanssa?",
    tutorial_start_chat_message: "Klikkaa tästä aloittaaksesi uuden keskustelun AIRe-botin kanssa.",
    tutorial_menu_message: "Klikkaa tästä löytääksesi keskusteluhistoriasi, profiilisi, asetukset ja paljon muuta.",
    tutorial_history_message: "Kun olet keskustellut AIRe-botin kanssa, löydät keskusteluhistoriasi täältä.",
    tutorial_profile_message: "Täältä voit nähdä ja muokata profiilitietojasi.",
    tutorial_settings_message: "Täältä voit muuttaa käyttöliittymän kieltä, teemaa ja kokoa.",
    tutorial_input_message: "Aloitetaan kirjoittamalla 'Hei AIRe' tähän kenttään ja katsotaan mitä tapahtuu...",
    tutorial_sidepanel_message: "Klikkaa tästä avataksesi sivupaneelin lisäkeskustelutyökaluja varten.",
    tutorial_next: "Seuraava",
    tutorial_skip: "Ohita",
    tutorial_done: "Valmis",

    Language_default_message: "Valitse käyttöliittymän oletuskieli:",

    en: "Englanti",
    fi: "Suomi",
    es: "Espanja",
    vi: "Vietnam",
    id: "Indonesia",
    sw: "Swahili",
    rw: "Ruandan kieli"
};

export default fi;
