import { Locale } from ".";

const es: Locale = {
    title: "AIRe Talk",
    footer: "Desarollo",
    not_found: "Página no encontrada",

    aire_bot: "AIRe bot",
    aire_system: "AIRe Sistema",
    system_greeting: "¡Bienvenido a AIRe Talk! Empiza por describir qué tipo de ayuda necesitas o cuáles son los síntomas que tienes.",
    system_greeting_header: "¡Bienvenido a la plataforma AIRe!",
    system_greeting_text: `AIRe eAIRe es un servicio de chat de atención médica impulsado por IA que le ayudará a comprender mejor sus síntomas activos, la posible condición subyacente y con quién debe comunicarse para mejorar.
    
    Antes de continuar;
     ara acelerar el proceso de incorporación, responda un par de preguntas:
    `,

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

    nav_chat: "Chat",
    nav_profile: "Perfil",
    nav_login: "Identifícate",
    nav_logout: "Salir",
    nav_signup: "Regístrate",
    nav_theme: "Cambiar tema",

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
    landing_view_text: `AIRe es un servicio de chat de atención médica impulsado por IA que lo ayudará a comprender mejor sus síntomas activos, la posible afección subyacente y con quién debe comunicarse para mejorar.
    
    Antes de continuar,
    para acelerar el proceso de incorporación, por favor responda un par de preguntas.`,
    landing_view_first_question: "Tu edad",
    landing_view_second_question: "Tu actual trabajo ( si tienes algun trabajo pasado que creas que merece la pena decir, puedes escribirlo también seaprado por comas).",
    landing_view_form_continue_button: "verificar y continuar",
    landing_view_form_button_cancel: "Cancelar",
    landing_view_occupations: "profesiones",

    home_start_landing_button: "EMPEZAR LANDING",
    home_checkbox_button: "Checkbox ver",
    
    chat_data: "Datos",
    chat_age: "Edad",
    chat_occupation: "Profesión",
    chat_topic: "Tema",
    chat_topic_onboarding: "Tema desde onboarding",

    checkbox_title:  "Bienvenido a la plataforma AIRe",
    checkbox_text: "Veo que has estado en la plataforma AIRe antes, está muy bien verte de nuevo.",
    checkbox_question: "¿Quieres continuar con algún tema?",
    checkbox_continue_button: "verificar y continuar",
    checkbox_button_cancel: "Cancelar",

    chat_input_title: "Pregunta aquí",

    burger_menu_chat_log_history: "Historial chat",
    burger_menu_content_catalogue: "catalogo contenido",
    burger_menu_current_user: "Usuario actual",
    burger_menu_settings: "Configuración",
    burger_menu_sign_in: "Identifícate",
    burger_menu_sign_up: "Regístrate",
    burger_menu_log_out: "Cerrar sesión",
    burger_menu_save_chat: "Guardar chat",
    burger_menu_restore_chat: "Cargar chat",
    burger_menu_chat_history: "Historial chat",
    burger_menu_catalogue_content: "Catálogo contenido",

    onboarding_greetings: "Hola",
    onboarding_question: "¿Estas interesado en alguno de estos temas?",

    summary_chag_log_title: "Resumen chat log",
    summary_classification_title: "CBR / ICF clasificación",
    summary_log_button: "catalogue log",

    error_verification_failure: "LOCALIZE TO ES: Could not verify the code. It may be expired.",
    error_verification_resend_failed: "LOCALIZE TO ES: Could not resend the code. Try again later",

    chat_history_image: "Imagen:",
    chat_history_video: "Vídeo:"
    
}

export default es