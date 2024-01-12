import { Locale } from ".";

const en: Locale = {
    title: "AIRe Talk",
    footer: "Development",
    not_found: "Page not found",

    aire_bot: "AIRe Bot",
    aire_system: "AIRe System",
    system_greeting: "Welcome to AIRe Talk! Begin by describing what aid you need or what symptoms you have.",
    system_greeting_header: "Welcome to AIRe platform!",
    system_greeting_text: `AIRe is an AI powered heathcare chat service that will help you to better understand your active symptoms, the possible underlying condition and who you should contact in order to get better.
    
    Before proceeding;
    to speed up the onboarding process, please answer a couple of questions:
    `,

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

    nav_chat: "Chat",
    nav_profile: "Profile",
    nav_login: "Log in",
    nav_logout: "Logout",
    nav_signup: "Sign up",
    nav_theme: "Change theme",

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

    landing_view_title: "Welcome to the AIRe paltform",
    landing_view_text: `AIRe is an AI powered healthcare chat service that will help you to better understand your active symptoms, the possible underlying condition and who you should contact in orther to get better.
  
    Before proceeding,
    to speed up the onboarding process pelase ansert a couple of questions.`,
    landing_view_first_question: "Your age",
    landing_view_second_question: "Your current occupation (if you have noteworthy past occuptions you can also list them here by separating them with a comma).",
    landing_view_form_continue_button: "Verify and proceed",
    landing_view_form_button_cancel: "Cancel",
    landing_view_occupations: "occupations",

    home_start_landing_button: "START LANDING",
    home_checkbox_button: "Checkbox View",

    chat_data: "Data",
    chat_age: "Age",
    chat_occupation: "Occupation",
    chat_topic: "Topic",
    chat_topic_onboarding: "Topic onboarding",

    checkbox_title:  "Welcome to the AIRe paltform",
    checkbox_text: "I see you have been on the AIRe platform before and it is nice to see you again.",
    checkbox_question: "Is there a topic that you would like to continue from?",
    checkbox_continue_button: "Verify and proceed",
    checkbox_button_cancel: "Cancel",

    chat_input_title: "Ask a question",

    burger_menu_chat_log_history: "Chat log history",
    burger_menu_content_catalogue: "Content catalogue",
    burger_menu_current_user: "Current user",
    burger_menu_settings: "Settings",

    onboarding_greetings: "Hello there",
    onboarding_question: "Are you looking for information of any of this topics?",

    summary_chag_log_title: "Chat log summary",
    summary_classification_title: "CBR / ICF classification",
    summary_log_button: "catalogue log",
    error_verification_failure: "Could not verify the code. It may be expired.",
    error_verification_resend_failed: "Could not resend the code. Try again later"
}

export default en
