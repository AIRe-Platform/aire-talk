import { Locale } from ".";

const es: Locale = {
    title: "AIRe Talk",
    footer: "Desarollo",
    not_found: "Página no encontrada",

    aire_bot: "AIRe bot",
    aire_system: "AIRe Sistema",
    system_topic: "Has seleccionado un tema: ",
    system_greeting:
        "¡Bienvenido a AIRe Talk! Empiza por describir qué tipo de ayuda necesitas o cuáles son los síntomas que tienes.",
    system_found_content: "Encontré contenido que puede interesarte. ¡Echar un vistazo!",

    start_greeting: "{'Bienvenid@ a la plataforma AIRe'}",
    start_first_paragraph:
        "Tu aplicación número uno de IA para tu fuente de conocimiento y consejos médicos.",
    start_second_paragraph:
        "Continúa iniciando sesión o creando un nuevo perfil para tí.",
    start_footer:
        "AIRe es una solución asistida por IA que le ayuda a identificar sus necesidades de rehabilitación y le guía hacia servicios y contenidos de rehabilitación personalizados.",
    start_disclaimer: "AIRe no es una herramienta de diagnóstico médico.",

    home_start_new_chat: "Iniciar un nuevo chat",
    home_continue_chat: "Continúa el chat anterior",

    login_form_title: "Inicia sesión",
    login_form_submit: "Entrar",
    login_label_username: "Email o nombre de usuario",
    login_label_password: "Contraseña",
    login_failure_message: "Error al iniciar sesión",
    login_forgot_password: "Olvidé mi contraseña",

    signup_form_title: "Crear una cuenta",
    signup_form_submit: "Registrar",
    signup_label_email: "Email",
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
    nav_theme: "Cambiar tema",
    nav_preferences: "Configuración",
    nav_main_menu: "Menu",
    nav_catalogue: "Content Catalogue",

    profile_title: "Cuenta de usuario",
    profile_label_first_name: "Nombre",
    profile_label_last_name: "Apellido",
    profile_label_gender: "Género",
    profile_label_age: "Edad",
    profile_label_language: "Idioma",
    profile_label_country: "País",
    profile_label_bio: "Bio",
    profile_button_save: "Guardar",

    profile_heading_connected_services: "Connectado",
    profile_empty_service_list: "No Conectado",

    profile_heading_password: "Cambiar contraseña",
    profile_description_password:
        "La contraseña debe teber al menos 6 caracteres y contener al menos una mayúscula, una minúscula y un número.",

    profile_label_current_password: "Contraseña actual",
    profile_label_new_password: "Nueva contraseña",
    profile_button_change_password: "Cambiar contraseña",

    profile_heading_delete_account: "Borrar cuenta",
    profile_description_delete_account:
        "Esto borra tu cuenta de la plataforma AIRe. Confirma que realmente quieres borrar tu cuenta.",
    profile_label_password_confirm: "Confirma tu contraseña.",
    profile_label_keep_anonymized_data:
        "Haz mis datos anónimos en lugar de borrarlos. Esto ayudaría a desarroyar la plataforma AIRe. Esto es completamente opcional.",
    profile_user_info_intro:
        "La información actual del usuario según análisis de AIRe:",
    profile_years_old: " años.",
    profile_from: " De ",
    profile_speaks: " Quien habla en ",
    profile_button_delete: "Borrar cuenta",

    gender_male: "hombre",
    gender_female: "mujer",
    gender_other: "otro",

    profile_question_button: "Complete profile",
    profile_question_confirm:
        "Do you want to answer some questions about your personal information?",
    profile_question_completion:
        "Click done if you information is correct. You can edit your information later on your profile page.",
    profile_question_first_name: "What is your first name?",
    profile_question_last_name: "What is your last name?",
    profile_question_gender: "What is your gender?",
    profile_question_age: "How old are you?",
    profile_question_language: "What is your primary language?",
    profile_question_country: "Which country you live in?",

    verification_heading: "Verifica tu cuenta",
    verification_description:
        "Ingresa el código de verificación que recibiste en tu correo electrónico",
    verification_button_verify: "Verificar",
    verification_code_resend: "Envíame un nuevo código",
    verification_code_resend_done: "¡Un nuevo código está en camino!",

    recovery_heading: "Recuperación de cuenta",
    recovery_label_email: "Dirección de correo electrónico",
    recovery_label_code: "Código de recuperación",
    recovery_label_password: "Nueva contraseña",
    recovery_enter_code:
        "Ingresa el código de recuperación que te acabamos de enviar.",
    recovery_not_available:
        "La recuperación de cuenta no está disponible actualmente.",
    recovery_failure: "Esta cuenta no se puede recuperar.",
    recovery_password_changed: "La contraseña se cambió exitosamente.",
    recovery_back_to_login: "Atrás para iniciar sesión",

    settings_title: "Configuración",
    settings_language: "Idioma de la interfaz de usuario",
    settings_ui_size: "Tamaño de la interfaz de usuario",
    settings_ui_size_normal: "Normal",
    settings_ui_size_large: "Grande",
    settings_ui_screen_size: "Resolución de pantalla",
    settings_ui_screen_size_mobile: "Móvil",
    settings_ui_screen_size_tablet: "Tablet",
    settings_ui_screen_size_desktop: "Pantalla",
    settings_ui_screen_size_dynamic: "Dynamic",

    error_generic: "¡Sucedió un error desconocido!",
    error_ai_not_responding: `El chatbot no respondió. Esto puede ocurrir debido al filtrado de contenido.
        Si el problema persiste, inténtalo de nuevo más tarde.`,
    error_signup_password_mismatch: "¡Las contraseñas no coinciden!",
    error_signup_bad_request: `El registro ha fallado. 
    
    El correo puede que ya este registrado o que la contraseña no cumple los requisitos mínimos.

    La contraseña debe tener al menos una letra mayúscula, una letra minúscula y un número.`,

    error_signup_general:
        "El registro ha fallado. Por favor, inténtelo de nuevo más tarde.",
    error_profile_edit: "Error al guardar.",
    error_profile_password:
        "Error al cambiar la contraseña. Compruebe que la contraseña que has introducido es correcta y que la nueva contraseña cumple con los requisitos.",
    error_profile_delete_account:
        "Error al borrar la cuenta. Por favor, inténtelo más tarde.",

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

    summary_chag_log_title: "Resumen",
    summary_generate_summary: "Resumir",
    summary_query_surveys_button: "Consultar encuestas",
    summary_send_survey_button: "Enviar respuestas a la encuesta",

    error_verification_failure:
        "No se pudo verificar el código. Puede que esté caducado.",
    error_verification_resend_failed:
        "No se pudo reenviar el código. Vuelve a intentarlo más tarde.",

    chat_history_title: "Historial chat",
    chat_history_image: "Imagen:",
    chat_history_video: "Vídeo:",
    chat_history_loading: "Cargando...",
    chat_history_tokens: "{0} fichas",
    chat_input_title: "¿Qué te gustaría preguntar o contar?",

    popup_confirm_revert_message:
        "¿Estas seguro de que quieres revertir el chat hasta este mensaje?",
    popup_confirm_remove_chat: "¿Estas seguro de que quieres borrar este chat?",
    popup_confirm_logout: "¿Estas seguro de que quieres salir?",
    popup_logout_message: "Ya has cerrado sesión.",

    no_questionnaires_found:
        "No se pudieron encontrar los cuestionarios adecuados.",
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
    button_back: "Regresar",
    button_continue: "Continuar",
    button_close: "Cerrar",
    button_delete_content: "Eliminar contenido",
    button_display: "Mostrar",

    en: "Inglés",
    fi: "Finés",
    es: "Español",
    vi: "Vietnamita"
};

export default es;
