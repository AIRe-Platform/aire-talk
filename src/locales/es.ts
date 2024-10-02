// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.


import { Locale } from ".";

const es: Locale = {
    aire_bot: "Bot AIRe",
    aire_system: "Sistema AIRe",
    
    footer: "Desarollo",
    not_found: "Página no encontrada",

    system_topic: "Has seleccionado un tema: ",
    system_greeting:
        "¡Bienvenido a AIRe Talk! Empiza por describir qué tipo de ayuda necesitas o cuáles son los síntomas que tienes.",
    system_found_content: "Encontré contenido que puede interesarte. ¡Echar un vistazo!",
    system_end_of_conversation: "La conversación ha finalizado",

    notification_keyword: "Tema \"{keyword}\" reconocido",

    start_greeting: "Bienvenid{'@'} a la plataforma AIRe",
    start_first_paragraph:
        "Tu aplicación número uno de IA para tu fuente de conocimiento y consejos médicos.",
    start_second_paragraph:
        "Continúa iniciando sesión o creando un nuevo perfil para tí.",
    start_footer:
        "AIRe es una solución asistida por IA que le ayuda a identificar sus necesidades de rehabilitación y le guía hacia servicios y contenidos de rehabilitación personalizados.",
    start_disclaimer: "AIRe no es una herramienta de diagnóstico médico.",

    home_start_new_chat: "Iniciar un nuevo chat",
    home_continue_chat: "Continúa el chat anterior",

    login_redirect: "Redireccionando a la página de inicio de sesión...",
    login_failure: "El servicio de inicio de sesión no está disponible en este momento. Inténtelo nuevamente más tarde.",
    login_callback_failure: "Intento de inicio de sesión fallido.",
    login_callback_error_description: "Detalles:",
    login_callback_button: "Volver a la página de inicio",

    signup_form_title: "Crear una cuenta",
    signup_form_submit: "Registrar",
    signup_label_email: "Email",
    signup_password_instructions: "La contraseña debe contener al menos 8 caracteres y contener al menos una mayúscula, una minúscula y un número.",
    signup_label_password: "Contraseña",
    signup_label_confirm_password: "Confirma contraseña",

    nav_start: "¡Hola!",
    nav_home: "Home",
    nav_chat: "Chat",
    nav_chat_history: "Historial chat",
    nav_chat_new: "Nuevo chat",
    nav_content_catalogue: "Catalogo contenido",
    nav_profile: "Perfil",
    nav_login: "Identifícate",
    nav_logout: "Salir",
    nav_signup: "Regístrate",
    nav_preferences: "Configuración",
    nav_main_menu: "Menu",
    nav_catalogue: "Catálogo de contenidos",

    profile_title: "Cuenta de usuario",
    profile_label_first_name: "Nombre",
    profile_label_last_name: "Apellido",
    profile_label_gender: "Género",
    profile_label_age: "Edad",
    profile_label_language: "Idioma",
    profile_label_country: "País",
    profile_label_bio: "Bio",
    profile_button_save: "Guardar",
    profile_characters_max: '{0} carácteres máximo.',
    profile_remaining: "carácteres restantes.",
    
    profile_heading_connected_services: "Connectado",
    profile_empty_service_list: "No Conectado",

    profile_heading_password: "Cambiar contraseña",
    profile_description_password:
        "La contraseña debe teber al menos 8 caracteres y contener al menos una mayúscula, una minúscula y un número.",

    profile_label_current_password: "Contraseña actual",
    profile_label_new_password: "Nueva contraseña",
    profile_button_change_password: "Cambiar contraseña",

    profile_heading_personal_data: "Datos personales",
    profile_description_personal_data: 
        "Toda su información está encriptada de manera que solo usted tiene acceso a ella. Los servicios de AIRe pueden usar sus datos solo cuando usted los usa. Aquí puede descargar todos sus datos guardados en AIRe. Tenga en cuenta que la recopilación de datos puede demorar un tiempo.",
    profile_button_download_personal_data: "Descargar",

    profile_heading_delete_account: "Borrar cuenta",
    profile_description_delete_account:
        "Esto borra tu cuenta de la plataforma AIRe. Confirma que realmente quieres borrar tu cuenta.",
    profile_label_password_confirm: "Confirma tu contraseña.",
    profile_label_keep_anonymized_data:
        "Haz mis datos anónimos en lugar de borrarlos. Esto ayudaría a desarroyar la plataforma AIRe. Esto es completamente opcional.",
    profile_button_delete: "Borrar cuenta",

    gender_male: "hombre",
    gender_female: "mujer",
    gender_other: "otro",

    profile_question_button: "Completa tu perfil",
    profile_question_confirm:
        "¿Quieres responder algunas preguntas sobre tu información personal?",
    profile_question_completion:
        "Click listo si tu informacion es correcta. Luego mas adelante puedes modificar tu informacion en tu perfil.",
    profile_question_first_name: "¿Cuál es tu nombre?",
    profile_question_last_name: "¿Cuál es tu apellido?",
    profile_question_gender: "¿Qué género eres?",
    profile_question_age: "¿Cuántos años tienes?",
    profile_question_country: "¿En qué país vives?",

    profile_experiments_title: "Experimentos",
    profile_experiments_text: "Sobrescribe el sistema de chatbot",
    profile_experiments_add: "Añade",
    profile_experiments_description: "en su mensaje si desea insertar un resumen de su perfil de usuario.",
    profile_experiments_apply: "Aplicar cambios",

    settings_title: "Configuración",
    settings_language: "Idioma de la interfaz de usuario",
    settings_ui_size: "Tamaño de la interfaz de usuario",
    settings_ui_size_normal: "Normal",
    settings_ui_size_large: "Grande",

    switch_color_mode: "Color del tema",

    error_generic: "¡Sucedió un error desconocido!",
    error_ai_not_responding: `El chatbot no respondió. Esto puede ocurrir debido al filtrado de contenido.
        Si el problema persiste, inténtalo de nuevo más tarde.`,
    error_signup_password_mismatch: "¡Las contraseñas no coinciden!",
    error_signup_bad_request: `El registro ha fallado. 
    
    El correo puede que ya este registrado o que la contraseña no cumple los requisitos mínimos.

    La contraseña debe tener al menos 8 caracteres y debe contener como mínimo una letra mayúscula, una letra minúscula y un número.`,

    error_signup_general:
        "El registro ha fallado. Por favor, inténtelo de nuevo más tarde.",
    error_profile_edit: "Error al guardar.",
    error_profile_delete_account:
        "Error al borrar la cuenta. Por favor, inténtelo más tarde.",
    error_profile_password:
        "Error al cambiar la contraseña. Compruebe que la contraseña que has introducido es correcta y que la nueva contraseña cumple con los requisitos.",

    landing_view_title: "Bienvenido a la plataforma AIRe",
    landing_view_text:
        "Comencemos completando la siguiente información preliminar sobre usted.",
    landing_label_age: "Tu edad",
    landing_label_occupation:
        "Tus ocupaciones actuales y pasadas. (Utilice comas para separar las ocupaciones)",

    onboarding_greetings: "¡Hola!",
    onboarding_question: "¿Le gustaría discutir sobre estos temas?",
    topic_backpain: "Dolor de espalda",
    topic_neckpain: "Dolor de cuello",
    topic_sleep_apnea: "Apnea del sueño",
    topic_increased_weight: "Aumento de peso",
    topic_trouble_talking: "Problemas para hablar",

    summary_title: "Resumen",
    suggestions_title: "Sugerencias",
    tools_title: "Herramientas",
    tools_button_summarize: "Resumir",
    tools_button_query_surveys: "Consultar encuestas",
    tools_button_suggestions: "Sugerencias",

    suggestion_check_for_more: "Obtén más sugerencias",

    chat_history_loading: "Cargando...",
    chat_history_tokens: "{0} fichas",
    chat_input_title: "¿Qué te gustaría preguntar o contar?",

    popup_confirm_revert_message:
        "¿Estas seguro de que quieres revertir el chat hasta este mensaje?",
    popup_confirm_remove_chat: "¿Estas seguro de que quieres borrar este chat?",
    popup_confirm_logout: "¿Estas seguro de que quieres salir?",
    popup_confirm_profile_updated: "Perfil actualizado.",

    confirm_questionnaire_start:
        '¿Le gustaría completar un cuestionario "{0}"?',
    confirm_questionnaire_completion:
        "Cuando esté satisfecho con sus respuestas, elija continuar.",
    questionnaire: "Cuestionario",
    questionnaire_start: "Principio del cuestionario",
    questionnaire_end: "Final del cuestionario",
    questionnaire_explanation:
        "Las siguientes preguntas se están registrando para su análisis.",
    question_answer: "Tu respuesta",

    reminder_start_question: "¿Quieres continuar alguna conversación anterior?",
    reminder_keyword_question: "¿Quieres seguir charlando sobre algunos de los siguientes temas?",
    reminder_summary_question: "¿Sigue siendo relevante este tema sobre el que le gustaría conversar?",

    button_accept: "Aceptar",
    button_cancel: "Cancelar",
    button_yes: "Sí",
    button_no: "No",
    button_back: "Regresar",
    button_continue: "Continuar",
    button_close: "Cerrar",
    button_mark_as_read: "Marcar como leído",

    content_catalogue_empty: "Aquí podrás ver contenido relacionado con las conversaciones que que vayas teniendo con AIRe Talk.",

    logout_inactivity_message: "Se ha cerrado la sesión debido a inactividad.",

    en: "Inglés",
    fi: "Finés",
    es: "Español",
    vi: "Vietnamita",
    id: "Indonesio",
    sw: "Swajili",
    rw: "Kinyarwanda"
};

export default es;
