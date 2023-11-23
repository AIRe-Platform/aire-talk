import { Locale } from ".";

const en: Locale = {
    title: "AIRe Talk",
    footer: "Development",
    not_found: "Page not found",

    aire_bot: "AIRe Bot",
    aire_system: "AIRe System",
    system_greeting: "Welcome to AIRe Talk! Begin by describing what aid you need or what symptoms you have.",

    chat_link_button_label: "New chat",

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

    error_generic: "An unknown error occurred!",
    error_ai_not_responding: "Something went wrong when talking to the Bot. If it answers, don't trust it!",    
    error_signup_password_mismatch: "The passwords do not match!",
    error_signup_bad_request: `Registration failed. 
    
The email may already be registered or the password does not meet the minimum requirements.

The password must contain at least lower and upper case letter as well as numbers.`,
    error_signup_general: "Registration failed. Please, try again later."
}

export default en
