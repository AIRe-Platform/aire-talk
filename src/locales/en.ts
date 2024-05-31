import { Locale } from ".";

const en: Locale = {
    title: "AIRe Talk",
    footer: "Development",
    not_found: "Page not found",

    aire_bot: "AIRe Bot",
    aire_system: "AIRe System",
    system_greeting:
        "Welcome to AIRe Talk! Begin by describing what aid you need or what symptoms you have.",
    system_topic: "You have selected a topic: ",

    start_greeting: "Welcome to the AIRe platform",
    start_first_paragraph:
        "Partner for better functioning and wellbeing",
    start_second_paragraph:
        "Proceed by logging in or creating a new profile for yourself.",
    start_footer:
        "AIRe is an AI-assisted solution that helps you identify your rehabilitation needs and guides you to personalized rehabilitation services and content.",
    start_disclaimer: "AIRe is not a medical diagnostic tool.",

    home_start_new_chat: "Start new chat instance",
    home_continue_chat: "Continue previous chat",

    login_form_title: "Login",
    login_form_submit: "Login",
    login_label_username: "Email or username",
    login_label_password: "Password",
    login_failure_message: "Failed to login",
    login_forgot_password: "I forgot my password",

    signup_form_title: "Create account",
    signup_form_submit: "Sign up",
    signup_label_email: "Email",
    signup_label_password: "Password",
    signup_label_confirm_password: "Confirm password",

    nav_start: "Hello!",
    nav_home: "Home",
    nav_chat: "Chat",
    nav_chat_history: "Chat history",
    nav_chat_new: "New chat",
    nav_content_catalogue: "Content catalogue",
    nav_profile: "Profile",
    nav_login: "Log in",
    nav_logout: "Logout",
    nav_signup: "Sign up",
    nav_theme: "Change theme",
    nav_preferences: "Settings",
    nav_main_menu: "Main menu",
    nav_catalogue: "Content Catalogue",

    profile_title: "User account",
    profile_label_first_name: "First Name",
    profile_label_last_name: "Last Name",
    profile_label_gender: "Gender",
    profile_label_age: "Age",
    profile_label_language: "Language",
    profile_label_country: "Country",
    profile_label_bio: "Bio",
    profile_button_save: "Update",

    profile_heading_connected_services: "Connected Services",
    profile_empty_service_list: "No connected services",

    profile_heading_password: "Change Password",
    profile_description_password:
        "Password must be at least 6 characters and contain both lower and upper case letters as well as numbers.",
    profile_label_current_password: "Current password",
    profile_label_new_password: "New password",
    profile_button_change_password: "Change password",

    profile_heading_delete_account: "Delete Account",
    profile_description_delete_account:
        "This deletes your account from AIRe platform. Confirm deletion by entering your password.",
    profile_label_password_confirm: "Confirm password",
    profile_label_keep_anonymized_data:
        "Anonymize my data instead of deleting it. This helps the development of AIRe platform. This is completely optional.",
    profile_user_info_intro:
        "The current user information according to AIRe analysis:",
    profile_years_old: " years old.",
    profile_from: " From ",
    profile_speaks: " Who speaks ",
    profile_button_delete: "Delete account",

    gender_male: "male",
    gender_female: "female",
    gender_other: "other",

    profile_question_button: "Complete profile",
    profile_question_confirm:
        "Do you want to answer some questions about your personal information?",
    profile_question_completion:
        "Click continue if you information is correct. You can edit your information later on your profile page.",
    profile_question_first_name: "What is your first name?",
    profile_question_last_name: "What is your last name?",
    profile_question_gender: "What is your gender?",
    profile_question_age: "How old are you?",
    profile_question_language: "What is your primary language?",
    profile_question_country: "Which country you live in?",

    verification_heading: "Verify Your Account",
    verification_description:
        "Enter the verification code you received in your email",
    verification_button_verify: "Verify",
    verification_code_resend: "Send me a new code",
    verification_code_resend_done: "A new code is on its way!",

    recovery_heading: "Account Recovery",
    recovery_label_email: "Email address",
    recovery_label_code: "Recovery code",
    recovery_label_password: "New password",
    recovery_enter_code: "Enter the recovery code we just sent you.",
    recovery_not_available: "Account recovery is not available currently.",
    recovery_failure: "This account cannot be recovered.",
    recovery_password_changed: "The password was changed successfully.",
    recovery_back_to_login: "Back to login",

    settings_title: "Settings",
    settings_language: "User interface language",
    settings_ui_size: "User interface size",
    settings_ui_size_normal: "Normal",
    settings_ui_size_large: "Large",
    settings_ui_screen_size: "Screen resolution preference",
    settings_ui_screen_size_mobile: "Mobile",
    settings_ui_screen_size_tablet: "Tablet",
    settings_ui_screen_size_desktop: "Desktop",
    settings_ui_screen_size_dynamic: "Dynamic",

    error_generic: "An unknown error occurred!",
    error_ai_not_responding: `The bot failed to respond. This might occur due to content filtering.
        If the problem persists, please try again later.`,
    error_signup_password_mismatch: "The passwords do not match!",
    error_signup_bad_request: `Registration failed. 
 
    The email may already be registered or the password does not meet the minimum requirements.
    
    The password must contain at least lower and upper case letter as well as numbers.`,
    error_signup_general: "Registration failed. Please, try again later.",
    error_profile_edit: "Save failed.",
    error_profile_password:
        "Failed to change password. Check that the password you entered is correct and that the new password meets the requirements.",
    error_profile_delete_account:
        "Failed to delete the account. Try again later.",

    landing_view_title: "Welcome to the AIRe platform!",
    landing_view_text:
        "Let's begin by filling the following preliminary information about yourself.",
    landing_label_age: "Your age",
    landing_label_occupation:
        "Your current and past occupations (Use commas to separate the occupations)",

    onboarding_greetings: "Hello there!",
    onboarding_question: "Would you like to discuss about these topics?",
    topic_backpain: "Back pain",
    topic_neckpain: "Neck pain",
    topic_sleep_apnea: "Sleep apnea",
    topic_increased_weight: "Increased weight",
    topic_trouble_talking: "Trouble talking",

    summary_chag_log_title: "Summary",
    summary_generate_summary: "Summarize",
    summary_query_surveys_button: "Query surveys",
    summary_send_survey_button: "Send survey answers",

    error_verification_failure: "Could not verify the code. It may be expired.",
    error_verification_resend_failed:
        "Could not resend the code. Try again later",

    chat_history_title: "Chat History",
    chat_history_image: "Image file:",
    chat_history_video: "Video file:",
    chat_history_loading: "Loading...",
    chat_history_tokens: "{0} tokens",
    chat_input_title: "What would you like to ask or tell?",

    popup_confirm_revert_message:
        "Are you sure you want to revert the chat to this message?",
    popup_confirm_remove_chat: "Are you sure you want to remove this chat?",
    popup_confirm_logout: "Are you sure you want to logout?",
    popup_logout_message: "You are now logout.",

    no_questionnaires_found: "Could not find suitable questionnaires.",
    confirm_questionnaire_start:
        'Would you like to fill a questionnaire "{0}"?',
    confirm_questionnaire_completion:
        "When you are happy with your answers, choose continue.",
    questionnaire: "Questionnaire",
    questionnaire_start: "Start of questionnaire",
    questionnaire_end: "End of questionnaire",
    questionnaire_explanation:
        "The following questions are being recorded for analysis",
    question_answer: "Your answer",

    button_accept: "Accept",
    button_cancel: "Cancel",
    button_back: "Back",
    button_continue: "Continue",
    button_close: "Close",
    button_delete_content: "Delete content",
    button_display: "Display",

    en: "English",
    fi: "Finnish",
    es: "Spanish",
    vi: "Vietnamese"
};

export default en;
