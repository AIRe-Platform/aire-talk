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

    frontpage_greeting: "Tervetuloa AIRe-alustalle!",
    frontpage_paragraph: `AIRe on tekoälyavusteinen terveyspalvelualusta, joka auttaa sinua ymmärtämään oireitasi ja niiden tekijöitä. AIRe opastaa sinua sinua tarvittavissa jatkotoimenpiteissä sekä antaa hyödyllisiä vinkkejä, jotka ovat juuri sinulle suunniteltuja!`,

    chat_link_button_label: "Keskustelu",

    login_form_title: "Kirjaudu sisään",
    login_form_submit: "Kirjaudu",
    login_label_email: "Sähköpostiosoite",
    login_label_password: "Salasana",
    login_failure_message: "Kirjautuminen epäonnistui",

    signup_form_title: "Luo tili",
    signup_form_submit: "Rekisteröidy",
    signup_label_email: "Sähköpostiosoite",
    signup_label_password: "Salasana",
    signup_label_confirm_password: "Vahvista salasana",

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

    profile_title: "Käyttäjäprofiilisi",
    profile_label_first_name: "Etunimi",
    profile_label_last_name: "Sukunimi",
    profile_label_gender: "Sukupuoli",
    profile_label_age: "Ikä",
    profile_label_language: "Kieli",
    profile_label_country: "Maa",
    profile_label_bio: "Tietoja",
    profile_button_save: "Tallenna",

    profile_heading_connected_services: "Yhdistetyt palvelut",
    profile_empty_service_list: "Ei yhdistettyjä palveluita",

    profile_heading_password: "Vaihda salasana",
    profile_description_password:
        "Salasanassa on oltava vähintään 6 merkkiä ja sisältää isoja sekä pieniä kirjaimia ja numeroita.",
    profile_label_current_password: "Nykyinen salasana",
    profile_label_new_password: "Uusi salasana",
    profile_button_change_password: "Vaihda salasana",

    profile_heading_delete_account: "Tilin poistaminen",
    profile_description_delete_account:
        "Tämä poistaa tilisi AIRe-alustalta. Syötä salasanasi vahvistaaksesi poiston.",
    profile_label_password_confirm: "Salasana",
    profile_label_keep_anonymized_data:
        "Anonymisoi tietoni poistamisen sijaan. Tämä auttaa AIRe-alustan kehittämisessä. Tämä on täysin vapaaehtoista.",
    profile_button_delete: "Poista tili",

    gender_male: "mies",
    gender_female: "nainen",
    gender_other: "muu",

    verification_heading: "Vahvista tilisi",
    verification_description: "Syötä sähköpostiisi saama vahvistuskoodi",
    verification_button_verify: "Tarkista",
    verification_code_resend: "Lähetä minulle uusi vahvistuskoodi",
    verification_code_resend_done: "Uusi koodi on matkalla!",

    error_generic: "Tapahtui tuntematon virhe!",
    error_ai_not_responding:
        "Botti vastasi jotain odottamatonta. Älä luota vastauksiin.",
    error_signup_password_mismatch: "Salasanat eivät täsmää",
    error_signup_bad_request: `Rekisteröityminen epäonnistui.

Sähköpostiosoite saattaa olla jo rekisteröity tai salasanasi ei täytä vähimmäisvaatimuksia. 

Salasanan tulee olla vähintään 6 merkkiä pitkä sekä sisältää pieniä ja isoja kirjaimia sekä numeroita.`,
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

    chat_topic: "Topic",
    chat_topic_onboarding: "Topic onboarding",
    chat_input_title: "Mitä haluat kysyä?",

    onboarding_greetings: "Hei!",
    onboarding_question: "Haluaisitko keskustella esimerkiksi näistä aiheista?",
    topic_backpain: "Selkäkipu",
    topic_neckpain: "Niskakipu",
    topic_sleep_apnea: "Uniapnea",
    topic_increased_weight: "Painonnousu",
    topic_trouble_talking: "Puhevaikeudet",

    summary_chag_log_title: "Chat log yhteenveto",
    summary_classification_title: "CBR / ICF luokittelu",
    summary_generate_summary: "Tee yhteenveto",
    summary_query_surveys_button: "Hae kyselyitä",

    error_verification_resend_failed:
        "Vahvistuskoodin lähettäminen epäonnistui. Yritä myöhemmin uudelleen.",
    error_verification_failure:
        "Vahvistaminen epäonnistui. Vahvistuskoodi voi olla vahnentunut.",

    chat_history_title: "Keskusteluhistoria",
    chat_history_image: "Kuvatiedosto:",
    chat_history_video: "videotiedosto:",

    popup_confirm_revert_message:
        "Haluatko varmasti palauttaa keskustelun tähän viestiin?",
    popup_confirm_remove_chat: "Haluatko varmasti poistaa tämän keskustelun?",

    button_accept: "Hyväksy",
    button_cancel: "Peruuta",
    button_back: "Takaisin",
    button_continue: "Jatka",
    button_close: "Sulje",
};

export default fi;
