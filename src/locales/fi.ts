import { Locale } from ".";

const fi: Locale = {
    title : "AIRe Talk",
    footer: "Kehitysversio",
    not_found: "Sivua ei löytynyt",

    aire_bot: "AIRe-botti",
    aire_system: "AIRe-järjestelmä",
    system_greeting: "Tervetuloa AIRe Talk -palveluun! Aloita kuvailemalla tarvitsemaasi apua tai oireitasi.",
    system_greeting_header: "Welcome to AIRe platform!",
    system_greeting_text: `AIRe is an AI powered heathcare chat service that will help you to better understand your active symptoms, the possible underlying condition and who you should contact in order to get better.
    
    Before proceeding;
    to speed up the onboarding process, please answer a couple of questions:
    `,

    chat_link_button_label: "Uusi keskustelu",

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

    nav_chat: "Chat",
    nav_profile: "Profiili",
    nav_login: "Kirjaudu sisään",
    nav_logout: "Kirjaudu ulos",
    nav_signup: "Luo tili",
    nav_theme: "Vaihda teema",

    profile_title: "Käyttäjäprofiilisi",
    profile_label_first_name: "Etunimi",
    profile_label_last_name: "Sukunimi",
    profile_label_gender: "Sukupuoli",
    profile_label_age: "Ikä",
    profile_label_language: "Kieli",
    profile_label_country: "Maa",
    profile_label_bio: "Tietoja",
    profile_button_save: "Tallenna muutokset",

    profile_heading_connected_services: "Yhdistetyt palvelut",
    profile_empty_service_list: "Ei yhdistettyjä palveluita",

    profile_heading_password: "Vaihda salasana",
    profile_description_password: "Salasanassa on oltava vähintään 6 merkkiä ja sisältää isoja sekä pieniä kirjaimia ja numeroita.",
    profile_label_current_password: "Nykyinen salasana",
    profile_label_new_password: "Uusi salasana",
    profile_button_change_password: "Vaihda salasana",

    profile_heading_delete_account: "Tilin poistaminen",
    profile_description_delete_account: "Tämä poistaa tilisi AIRe-alustalta. Syötä salasanasi vahvistaaksesi poiston.",
    profile_label_password_confirm: "Salasana",
    profile_label_keep_anonymized_data: "Anonymisoi tietoni poistamisen sijaan. Tämä auttaa AIRe-alustan kehittämisessä. Tämä on täysin vapaaehtoista.",
    profile_button_delete: "Poista tili",

    gender_male: "mies",
    gender_female: "nainen",
    gender_other: "muu",

    error_generic: "Tapahtui tuntematon virhe!",
    error_ai_not_responding: "Botti vastasi jotain odottamatonta. Älä luota vastauksiin.",
    error_signup_password_mismatch: "Salasanat eivät täsmää",
    error_signup_bad_request: `Rekisteröityminen epäonnistui.

Sähköpostiosoite saattaa olla jo rekisteröity tai salasanasi ei täytä vähimmäisvaatimuksia. 

Salasanan tulee olla vähintään 6 merkkiä pitkä sekä sisältää pieniä ja isoja kirjaimia sekä numeroita.`,
    error_signup_general: "Rekisteröityminen epäonnistui. Yritä myöhemmin uudelleen.",
    error_profile_edit: "Tallentaminen epäonnistui.",
    error_profile_password: "Salasanan vaihtaminen epäonnistui. Tarkista, että antamasi salasana on oikein ja uusi salasana täyttää vaatimukset",
    error_profile_delete_account: "Tilin poistaminen epäonnistui. Yritä myöhemmin uudelleen.",

    landing_view_title: "Tervetuloa AIRe Talk -palveluun!",
    landing_view_text: `AIRe FINNISH is an AI powered healthcare chat service that will help you to better understand your active symptoms, the possible underlying condition and who you should contact in orther to get better.
    
    Before proceeding,
    to speed up the onboarding process pelase ansert a couple of questions.`,
    landing_view_first_question: "Ikäisi",
    landing_view_second_question: "Nykyinen ammattisi (jos sinulla on huomionarvoisia menneitä ammatteja, voit myös luetella ne tähän erottamalla ne pilkulla).",
    landing_view_form_continue_button: "jatka",
    landing_view_form_button_cancel: "perutta",
    landing_view_occupations: "ammatit",

    home_start_landing_button: "ALOITAA LANDING",
    home_checkbox_button: "Checkbox kautta",

    chat_data: "data",
    chat_age: "Ikä",
    chat_occupation: "Ammati",
    chat_topic: "Topic",

    checkbox_title:  "Tervetuloa AIRe Talk -palveluun!",
    checkbox_text: "Näen, että olet ollut AIRe-alustalla aiemmin ja on mukava nähdä sinut taas.",
    checkbox_question: "Onko sinulla aihe, josta haluaisit jatkaa?",
    checkbox_continue_button: "jatka",
    checkbox_button_cancel: "perutta",
    
    chat_input_title: "Kusu talla",

    burger_menu_chat_log_history: "Chat-lokihistoria",
    burger_menu_content_catalogue: "Sisältöluettelo",
    burger_menu_current_user: "Käyttäjä",
    burger_menu_settings: "Asetukset",
}

export default fi