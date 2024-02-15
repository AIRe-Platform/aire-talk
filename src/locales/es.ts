import { Locale } from ".";

const es: Locale = {
    title: "AIRe Talk",
    footer: "Desarollo",
    not_found: "Página no encontrada",

    aire_bot: "AIRe bot",
    aire_system: "AIRe Sistema",
    system_greeting: "¡Bienvenido a AIRe Talk! Empiza por describir qué tipo de ayuda necesitas o cuáles son los síntomas que tienes.",
    system_topic: "Has seleccionado un tema: ",

    frontpage_greeting: "¡Bienvenido a la plataforma AIRe!",
    frontpage_paragraph: `AIRe es un servicio de chat de atención médica impulsado por IA que lo ayudará a comprender mejor sus síntomas activos y las posibles afecciones subyacentes. AIRe le guía en los procedimientos de seguimiento si es necesario y le ofrece sugerencias útiles adaptadas exclusivamente a usted.`,

    chat_link_button_label: "Chat",

    login_form_title: "Inicia sesión",
    login_form_submit: "Entrar",
    login_label_email: "Email",
    login_label_password: "Contraseña",
    login_failure_message: "Error al iniciar sesión",

    signup_form_title: "Crear una cuenta",
    signup_form_submit: "Registrar",
    signup_label_email: "Email",
    signup_label_password: "Contraseña",
    signup_label_confirm_password: "Confirma contraseña",

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

    profile_title: "Tu cuenta",
    profile_label_first_name: "Nombre",
    profile_label_last_name: "Apellido",
    profile_label_gender: "Género",
    profile_label_age: "Edad",
    profile_label_language: "Idioma",
    profile_label_country: "País",
    profile_label_bio: "Bio",
    profile_button_save: "Guardar cambios",

    profile_heading_connected_services: "Connectado",
    profile_empty_service_list: "No Conectado",

    profile_heading_password: "Cambiar contraseña",
    profile_description_password: "La contraseña debe teber al menos 6 caracteres y contener al menos una mayúscula, una minúscula y un número.",

    profile_label_current_password: "Contraseña actual",
    profile_label_new_password: "Nueva contraseña",
    profile_button_change_password: "Cambiar contraseña",

    profile_heading_delete_account: "Borrar cuenta",
    profile_description_delete_account: "Esto borra tu cuenta de la plataforma AIRe. Confirma que realmente quieres borrar tu cuenta.",
    profile_label_password_confirm: "Confirma tu contraseña.",
    profile_label_keep_anonymized_data: "Haz mis datos anónimos en lugar de borrarlos. Esto ayudaría a desarroyar la plataforma AIRe. Esto es completamente opcional.",
    profile_button_delete: "Borrar cuenta",

    gender_male: "hombre",
    gender_female: "mujer",
    gender_other: "otro",

    verification_heading: "LOCALIZE TO ES: Verify Your Account",
    verification_description: "LOCALIZE TO ES: Enter the verification code you received in your email",
    verification_button_verify: "LOCALIZE TO ES: Verify",
    verification_code_resend: "LOCALIZE TO ES: Send me a new code",
    verification_code_resend_done: "LOCALIZE TO ES: A new code is on its way!",

    error_generic: "¡Sucedió un error desconocido!",
    error_ai_not_responding: "Algo fue mal mientras hablabas con el bot. Si el bot responde, ¡no te fies!",
    error_signup_password_mismatch: "¡Las contraseñas no coinciden!",
    error_signup_bad_request: `El registro ha fallado. 
    
    El correo puede que ya este registrado o que la contraseña no cumple los requisitos mínimos.

    La contraseña debe tener al menos una letra mayúscula, una letra minúscula y un número.`,

    error_signup_general: "El registro ha fallado. Por favor, inténtelo de nuevo más tarde.",
    error_profile_edit: "Error al guardar.",
    error_profile_password: "Error al cambiar la contraseña. Compruebe que la contraseña que has introducido es correcta y que la nueva contraseña cumple con los requisitos.",
    error_profile_delete_account: "Error al borrar la cuenta. Por favor, inténtelo más tarde.",

    landing_view_title: "Bienvenido a la plataforma AIRe",
    landing_view_text: "Comencemos completando la siguiente información preliminar sobre usted.",
    landing_label_age: "Tu edad",
    landing_label_occupation: "Tus ocupaciones actuales y pasadas. (Utilice comas para separar las ocupaciones)",

    chat_topic: "Tema",
    chat_topic_onboarding: "Tema desde onboarding",
    chat_input_title: "Pregunta aquí",

    onboarding_greetings: "¡Hola!",
    onboarding_question: "¿Le gustaría discutir sobre estos temas?",    
    topic_backpain: "Dolor de espalda",
    topic_neckpain: "Dolor de cuello",
    topic_sleep_apnea: "Apnea del sueño",
    topic_increased_weight: "Aumento de peso",
    topic_trouble_talking: "Problemas para hablar",

    summary_chag_log_title: "Resumen chat",
    summary_classification_title: "CBR / ICF clasificación",
    summary_log_button: "catalogue log",
    summary_query_surveys_button: "Consultar encuestas",

    error_verification_failure: "LOCALIZE TO ES: Could not verify the code. It may be expired.",
    error_verification_resend_failed: "LOCALIZE TO ES: Could not resend the code. Try again later",

    chat_history_title: "Historial chat",
    chat_history_image: "Imagen:",
    chat_history_video: "Vídeo:",

    popup_confirm_revert_message: "¿estas seguro de que quieres revertir el chat hasta este mensaje?",
    popup_confirm_remove_chat: "¿estas seguro de que quieres borrar este chat?",
    
    button_accept: "Aceptar",
    button_cancel: "Cancelar",
    button_back: "Regresar",
    button_continue: "Continuar"
}

export default es