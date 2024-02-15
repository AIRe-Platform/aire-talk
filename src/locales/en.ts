import { Locale } from ".";

const en: Locale = {
    title: "AIRe Talk",
    footer: "Development",
    not_found: "Page not found",

    aire_bot: "AIRe Bot",
    aire_system: "AIRe System",
    system_greeting: "Welcome to AIRe Talk! Begin by describing what aid you need or what symptoms you have.",
    system_topic: "You have selected a topic: ",

    frontpage_greeting: "Welcome to the AIRe platform!",
    frontpage_paragraph: `AIRe is an AI powered healthcare chat service that will help you to better understand your active symptoms, the possible underlying conditions. AIRe guides you in follow-up procedures if necessary, and offers you helpful suggestions tailored just for you.`,

    chat_link_button_label: "Chat",

    login_form_title: "Login",
    login_form_submit: "Login",
    login_label_email: "Email",
    login_label_password: "Password",
    login_failure_message: "Failed to login",

    signup_form_title: "Create account",
    signup_form_submit: "Sign up",
    signup_label_email: "Email",
    signup_label_password: "Password",
    signup_label_confirm_password: "Confirm password",

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

    profile_title: "Your Account",
    profile_label_first_name: "First Name",
    profile_label_last_name: "Last Name",
    profile_label_gender: "Gender",
    profile_label_age: "Age",
    profile_label_language: "Language",
    profile_label_country: "Country",
    profile_label_bio: "Bio",
    profile_button_save: "Save changes",

    profile_heading_connected_services: "Connected Services",
    profile_empty_service_list: "No connected services",

    profile_heading_password: "Change Password",
    profile_description_password: "Password must be at least 6 characters and contain both lower and upper case letters as well as numbers.",
    profile_label_current_password: "Current password",
    profile_label_new_password: "New password",
    profile_button_change_password: "Change password",

    profile_heading_delete_account: "Delete Account",
    profile_description_delete_account: "This deletes your account from AIRe platform. Confirm deletion by entering your password.",
    profile_label_password_confirm: "Confirm password",
    profile_label_keep_anonymized_data: "Anonymize my data instead of deleting it. This helps the development of AIRe platform. This is completely optional.",
    profile_button_delete: "Delete account",

    gender_male: "male",
    gender_female: "female",
    gender_other: "other",

    verification_heading: "Verify Your Account",
    verification_description: "Enter the verification code you received in your email",
    verification_button_verify: "Verify",
    verification_code_resend: "Send me a new code",
    verification_code_resend_done: "A new code is on its way!",

    error_generic: "An unknown error occurred!",
    error_ai_not_responding: "Something went wrong when talking to the Bot. If it answers, don't trust it!",
    error_signup_password_mismatch: "The passwords do not match!",
    error_signup_bad_request: `Registration failed. 
 
    The email may already be registered or the password does not meet the minimum requirements.
    
    The password must contain at least lower and upper case letter as well as numbers.`,
    error_signup_general: "Registration failed. Please, try again later.",
    error_profile_edit: "Save failed.",
    error_profile_password: "Failed to change password. Check that the password you entered is correct and that the new password meets the requirements.",
    error_profile_delete_account: "Failed to delete the account. Try again later.",

    landing_view_title: "Welcome to the AIRe platform!",
    landing_view_text: "Let's begin by filling the following preliminary information about yourself.",
    landing_label_age: "Your age",
    landing_label_occupation: "Your current and past occupations (Use commas to separate the occupations)",

    chat_topic: "Topic",
    chat_topic_onboarding: "Topic onboarding",
    chat_input_title: "Ask a question",

    onboarding_greetings: "Hello there!",
    onboarding_question: "Would you like to discuss about these topics?",    
    topic_backpain: "Back pain",
    topic_neckpain: "Neck pain",
    topic_sleep_apnea: "Sleep apnea",
    topic_increased_weight: "Increased weight",
    topic_trouble_talking: "Trouble talking",

    summary_chag_log_title: "Chat summary",
    summary_classification_title: "CBR / ICF classification",
    summary_log_button: "catalogue log",
    summary_query_surveys_button: "Query surveys",

    error_verification_failure: "Could not verify the code. It may be expired.",
    error_verification_resend_failed: "Could not resend the code. Try again later",

    chat_history_title: "Chat History",
    chat_history_image: "Image file:",
    chat_history_video: "Video file:",

    popup_confirm_revert_message: "Are you sure you want to revert the chat to this message?",
    popup_confirm_remove_chat: "Are you sure you want to remove this chat?",

    button_accept: "Accept",
    button_cancel: "Cancel",
    button_back: "Back",
    button_continue: "Continue"
}

export default en
