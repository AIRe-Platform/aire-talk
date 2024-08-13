import { Locale } from ".";

const fi: Locale = {
    title: "AIRe Talk",
    footer: "Kehitysversio",
    not_found: "Sivua ei löytynyt",

    aire_bot: "AIRe-botti",
    aire_system: "AIRe-järjestelmä",
    system_greeting:
        "Tervetuloa AIRe Talk -palveluun! Aloita kuvailemalla tarvitsemaasi apua tai oireitasi.",
    system_topic: "Olet valinnut aiheeksi: ",
    system_found_content: "Löysin sisältöä, joka saattaa kiinnostaa sinua!",

    start_greeting: "Tervetuloa AIRe Talk -palveluun",
    start_first_paragraph:
        "Kumppani parempaan toimintakykyyn ja hyvinvointiin",
    start_second_paragraph:
        "Jatka kirjautumalla sisään tai luomalla itsellesi uusi profiili.",
    start_footer:
        "AIRe on tekoälyavusteinen sovellus, joka auttaa sinua tunnistamaan kuntoutuksen tarpeitasi ja opastaa sinut yksilöllisten kuntoutuksen palveluiden ja sisällön pariin.",
    start_disclaimer: "AIRe ei ole lääketieteellinen diagnostinen työkalu.",
    
    home_start_new_chat: "Aloita uusi keskustelu",
    home_continue_chat: "Jatka edellistä keskustelua",

    login_form_title: "Kirjaudu sisään",
    login_form_submit: "Kirjaudu",
    login_label_username: "Sähköpostiosoite tai käyttäjänimi",
    login_label_password: "Salasana",
    login_failure_message: "Kirjautuminen epäonnistui",
    login_forgot_password: "Unohdin salasanani",

    signup_form_title: "Luo tili",
    signup_form_submit: "Rekisteröidy",
    signup_label_email: "Sähköpostiosoite",
    signup_password_instructions: "Salasanassa on oltava vähintään 8 merkkiä ja sisältää isoja sekä pieniä kirjaimia ja numeroita.",
    signup_label_password: "Salasana",
    signup_label_confirm_password: "Vahvista salasana",

    nav_start: "Moi!",
    nav_home: "Koti",
    nav_chat: "Chat",
    nav_chat_history: "Historia",
    nav_chat_new: "Uusi keskustelu",
    nav_content_catalogue: "Sisältöluettelo",
    nav_profile: "Profiili",
    nav_login: "Kirjaudu sisään",
    nav_logout: "Kirjaudu ulos",
    nav_signup: "Luo tili",
    nav_theme: "Vaihda teema",
    nav_preferences: "Asetukset",
    nav_main_menu: "Päävalikko",
    nav_catalogue: "Sisältökatalogi",

    profile_title: "Käyttäjätili",
    profile_label_first_name: "Etunimi",
    profile_label_last_name: "Sukunimi",
    profile_label_gender: "Sukupuoli",
    profile_label_age: "Ikä",
    profile_label_language: "Kieli",
    profile_label_country: "Maa",
    profile_label_bio: "Tietoja",
    profile_button_save: "Tallenna",
    profile_characters_max: '{0} merkkejä maksimissaan.',
    profile_remaining: "jäljellä olevat merkit.",
    
    profile_heading_connected_services: "Yhdistetyt palvelut",
    profile_empty_service_list: "Ei yhdistettyjä palveluita",

    profile_heading_password: "Vaihda salasana",
    profile_description_password:
        "Salasanassa on oltava vähintään 8 merkkiä ja sisältää isoja sekä pieniä kirjaimia ja numeroita.",
    profile_label_current_password: "Nykyinen salasana",
    profile_label_new_password: "Uusi salasana",
    profile_button_change_password: "Vaihda salasana",

    profile_heading_delete_account: "Tilin poistaminen",
    profile_description_delete_account:
        "Tämä poistaa tilisi AIRe-alustalta. Syötä salasanasi vahvistaaksesi poiston.",
    profile_label_password_confirm: "Salasana",
    profile_label_keep_anonymized_data:
        "Anonymisoi tietoni poistamisen sijaan. Tämä auttaa AIRe-alustan kehittämisessä. Tämä on täysin vapaaehtoista.",
    profile_user_info_intro: "Nykyiset käyttäjätiedot AIRe-analyysin mukaan:",
    profile_years_old: " vuotta vanha.",
    profile_from: " Mistä ",
    profile_speaks: " Puhuu ",
    profile_button_delete: "Poista tili",

    gender_male: "mies",
    gender_female: "nainen",
    gender_other: "muu",

    profile_question_button: "Täydennä profiilitiedot",
    profile_question_confirm:
        "Haluatko vastata muutamaan kysymykseen koskien henkilökohtaisia tietojasi?",
    profile_question_completion:
        "Klikkaa jatka jos tietosi ovat oikein. Voit myöhemmin muokata tietojasi profiilissasi",
    profile_question_first_name: "Mikä on etunimesi?",
    profile_question_last_name: "Mikä on sukunimesi?",
    profile_question_gender: "Mikä on sukupuolesi?",
    profile_question_age: "Kuinka vanha olet?",
    profile_question_language: "Mikä on ensisijainen kielesi?",
    profile_question_country: "Mikä on asuinmaasi?",

    profile_experiments_title: "Kokeilut",
    profile_experiments_text: "Ohita chatbotin järjestelmä kehote",
    profile_experiments_add: "Lisätä",
    profile_experiments_description: "kehotteeseen, jos haluat lisätä yhteenvedon käyttäjäprofiilistasi.",
    profile_experiments_apply: "Ota muutokset käyttöön",

    verification_heading: "Vahvista tilisi",
    verification_description: "Syötä sähköpostiisi saama vahvistuskoodi",
    verification_button_verify: "Tarkista",
    verification_code_resend: "Lähetä minulle uusi vahvistuskoodi",
    verification_code_resend_done: "Uusi koodi on matkalla!",

    recovery_heading: "Tilin palautus",
    recovery_label_email: "Sähköpostiosoite",
    recovery_label_code: "Palautuskoodi",
    recovery_label_password: "Uusi salasana",
    recovery_enter_code: "Syötä sinulle lähettämämme palautuskoodi",
    recovery_not_available: "Tilinpalautus ei ole käytettävissä",
    recovery_failure: "Tätä tiliä ei voitu palauttaa.",
    recovery_password_changed: "Salasana vaihdettu",
    recovery_back_to_login: "Takaisin kirjautumiseen",

    settings_title: "Asetukset",
    settings_language: "Käyttöliittymän kieli",
    settings_ui_size: "Käyttöliittymän koko",
    settings_ui_size_normal: "Normaali",
    settings_ui_size_large: "Suuri",
    settings_ui_screen_size: "Näytön resoluution asetus",
    settings_ui_screen_size_mobile: "Mobiili",
    settings_ui_screen_size_tablet: "Tabletti",
    settings_ui_screen_size_desktop: "Työpöytä",
    settings_ui_screen_size_dynamic: "Dynamic",

    switch_color_mode: "Teematila",

    error_generic: "Tapahtui tuntematon virhe!",
    error_ai_not_responding: `Vastauksen saaminen epäonnistui. Tämä voi johtua sisältösuodattimesta.
        Mikäli virhe toistuu useasti, yritä myöhemmin uudelleen.`,
    error_signup_password_mismatch: "Salasanat eivät täsmää",
    error_signup_bad_request: `Rekisteröityminen epäonnistui.

Sähköpostiosoite saattaa olla jo rekisteröity tai salasanasi ei täytä vähimmäisvaatimuksia. 

Salasanan tulee olla vähintään 8 merkkiä pitkä sekä sisältää pieniä ja isoja kirjaimia sekä numeroita.`,
    error_signup_general:
        "Rekisteröityminen epäonnistui. Yritä myöhemmin uudelleen.",
    error_profile_edit: "Tallentaminen epäonnistui.",
    error_profile_password:
        "Salasanan vaihtaminen epäonnistui. Tarkista, että antamasi salasana on oikein ja uusi salasana täyttää vaatimukset",
    error_profile_delete_account:
        "Tilin poistaminen epäonnistui. Yritä myöhemmin uudelleen.",

    landing_view_title: "Tervetuloa AIReen!",
    landing_view_text:
        "Aloitetaan täyttämällä seuraavat taustatiedot itsestäsi.",
    landing_label_age: "Ikäsi",
    landing_label_occupation:
        "Nykyinen ja aiemmat ammattisi (Voit erottaa ammatit pilkulla)",

    onboarding_greetings: "Hei!",
    onboarding_question: "Haluaisitko keskustella esimerkiksi näistä aiheista?",
    topic_backpain: "Selkäkipu",
    topic_neckpain: "Niskakipu",
    topic_sleep_apnea: "Uniapnea",
    topic_increased_weight: "Painonnousu",
    topic_trouble_talking: "Puhevaikeudet",

    summary_chag_log_title: "Yhteenveto",
    summary_generate_summary: "Luo yhteenveto",
    summary_query_surveys_button: "Hae kyselyitä",
    summary_send_survey_button: "Lähetä kyselyn vastaukset",

    error_verification_resend_failed:
        "Vahvistuskoodin lähettäminen epäonnistui. Yritä myöhemmin uudelleen.",
    error_verification_failure:
        "Vahvistaminen epäonnistui. Vahvistuskoodi voi olla vahnentunut.",

    chat_history_title: "Keskusteluhistoria",
    chat_history_image: "Kuvatiedosto:",
    chat_history_video: "Videotiedosto:",
    chat_history_loading: "Ladataan...",
    chat_history_tokens: "{0} tokenia",
    chat_input_title: "Mitä haluaisit kysyä tai kertoa?",

    popup_confirm_revert_message:
        "Haluatko varmasti palauttaa keskustelun tähän viestiin?",
    popup_confirm_remove_chat: "Haluatko varmasti poistaa tämän keskustelun?",
    popup_confirm_logout: "Haluatko varmasti kirjautua ulos?",
    popup_logout_message: "Olet nyt kirjautunut ulos.",
    popup_confirm_profile_updated: "Profiili päivitetty.",

    no_questionnaires_found: "Sopivia kyselyitä ei löytynyt.",
    confirm_questionnaire_start: 'Haluaisitko täyttää kyselyn "{0}"?',
    confirm_questionnaire_completion:
        "Kun olet tyytyväinen vastauksiisi, valitse jatka.",
    questionnaire: "Kysely",
    questionnaire_start: "Kyselyn alku",
    questionnaire_end: "Kyselyn loppu",
    questionnaire_explanation:
        "Seuraavat kysymykset tallennetaan analysoitavaksi",
    question_answer: "Vastauksesi",

    reminder_start_question: "Haluatko jatkaa jotakin aikaisempaa keskustelua?",
    reminder_keyword_question: "Haluatko jatkaa keskustelua joistakin seuraavista aiheista?",
    reminder_summary_question: "Onko tämä aihe vielä ajankohtainen, josta haluaisit keskustella?",

    button_accept: "Hyväksy",
    button_cancel: "Peruuta",
    button_yes: "Kyllä",
    button_no: "Ei",
    button_back: "Takaisin",
    button_continue: "Jatka",
    button_close: "Sulje",
    button_delete_content: "Poista sisältö",
    button_display: "Näytä",

    en: "Englanti",
    fi: "Suomi",
    es: "Espanja",
    vi: "Vietnam",
    id: "Indonesia",
    sw: "Swahili"
};

export default fi;
