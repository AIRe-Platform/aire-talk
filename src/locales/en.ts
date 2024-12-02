// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.


import { Locale } from ".";

const en: Locale = {
    aire_bot: "AIRe",
    aire_system: "AIRe System",

    footer: "Development",
    not_found: "Page not found",

    system_greeting:
        "Welcome to AIRe Talk! Begin by describing what aid you need or what symptoms you have.",
    system_topic: "You have selected a topic: ",
    system_found_content: "I found some content that may interest you. Take a look!",
    system_end_of_conversation: "The conversation has ended",
    system_end_of_conversation_options: "What would you like to do?",
    system_reminder_set: "A new reminder '{subject}' at {time} was created.",

    conversation_option_continue: "Continue conversation",
    conversation_option_new_chat: "Start a new conversation",

    notification_keyword: "Theme \"{keyword}\" recognized",

    home_title: "AIRe homepage",
    home_start_new_chat: "Start new chat",
    home_continue_chat: "Continue previous chat",

    start_signup_success: "Sign up successful. You can now log in.",
    start_greeting: "Welcome to the AIRe platform",
    start_first_paragraph: "Partner for better functioning and wellbeing",
    start_second_paragraph: "Proceed by logging in or creating a new profile for yourself.",
    start_footer: "AIRe is an AI-assisted solution that helps you identify your rehabilitation needs and guides you to personalized rehabilitation services and content.",
    start_disclaimer: "AIRe is not a medical diagnostic tool.",

    login_redirect: "Redirecting to login page...",
    login_failure: "The login service is unavailable at the moment. Please try again later.",
    login_callback_failure: "Login attempt failed.",
    login_callback_error_description: "Details:",
    login_callback_button: "Back to home page",

    signup_form_title: "Create account",
    signup_form_submit: "Sign up",
    signup_label_email: "Email",
    signup_password_instructions: "Password must contain at least 8 characters and contain both lower and upper case letters as well as numbers.",
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
    nav_preferences: "Settings",
    nav_main_menu: "Main menu",
    nav_catalogue: "Content Catalogue",
    nav_about: "About",

    profile_title: "User account",
    profile_label_first_name: "First Name",
    profile_label_last_name: "Last Name",
    profile_label_gender: "Gender",
    profile_label_year_of_birth: "Year of Birth",
    profile_label_language: "Language",
    profile_label_country: "Country",
    profile_label_bio: "Bio",
    profile_button_save: "Update profile",
    profile_characters_max: '{0} characters maximum.',
    profile_remaining: "remaining characters.",
    profile_placeholder_year_of_birth: "Enter your year of birth in the format YYYY, for example 1990.",

    profile_heading_connected_services: "Connected Services",
    profile_empty_service_list: "No connected services",

    profile_heading_password: "Change Password",
    profile_description_password: "Password must be at least 8 characters and contain both lower and upper case letters as well as numbers.",
    profile_label_current_password: "Current password",
    profile_label_new_password: "New password",
    profile_button_change_password: "Change password",

    profile_heading_personal_data: "Personal Data",
    profile_description_personal_data: "All your information is encrypted in a way that only you have access to it. The AIRe services can use your data only when you are using the services. Here, you can download all of your data saved in AIRe. Please note that collecting the data may take a while.",
    profile_button_download_personal_data: "Download personal data",

    profile_heading_delete_account: "Delete Account",
    profile_description_delete_account: "This deletes your account from AIRe platform. Confirm deletion by entering your password.",
    profile_label_password_confirm: "Confirm password",
    profile_label_keep_anonymized_data: "Anonymize my data instead of deleting it. This helps the development of AIRe platform. This is completely optional.",
    profile_button_delete: "Delete account",

    gender_male: "male",
    gender_female: "female",
    gender_other: "other",

    profile_question_button: "Complete profile",
    profile_question_confirm: "Do you want to answer some questions about your personal information?",
    profile_question_completion: "Click continue if you information is correct. You can edit your information later on your profile page.",
    profile_question_first_name: "What is your first name?",
    profile_question_last_name: "What is your last name?",
    profile_question_gender: "What is your gender?",
    profile_question_year_of_birth: "What year were you born?",
    profile_question_country: "Which country you live in?",

    profile_experiments_title: "Experiments",
    profile_experiments_text: "Override chatbot system prompt",
    profile_experiments_prompt: "Custom prompt",
    profile_experiments_add: "Add",
    profile_experiments_description: "into your prompt if you wish to inject a summary of your user profile.",
    profile_experiments_apply: "Apply changes",

    profile_chat_history_tokens_heading: "Chat history tokens",
    profile_chat_history_tokens_label: "Show tokens on chat history",

    settings_title: "Settings",
    settings_language: "User interface language",
    settings_ui_size: "User interface size",
    settings_ui_size_normal: "Normal",
    settings_ui_size_large: "Large",

    switch_color_mode: "Theme color",

    error_generic: "An unknown error occurred!",
    error_ai_not_responding: `The bot failed to respond. This might occur due to content filtering.
        If the problem persists, please try again later.`,
    error_signup_password_mismatch: "The passwords do not match!",
    error_signup_bad_request: `Registration failed. 
 
    The email may already be registered or the password does not meet the minimum requirements.
    
    The password must contain at least 8 characters including lower and upper case letter as well as numbers.`,
    error_signup_general: "Registration failed. Please, try again later.",
    error_profile_edit: "Save failed.",
    error_profile_delete_account: "Failed to delete the account. Try again later.",
    error_profile_password: "Failed to change password. Check that the password you entered is correct and that the new password meets the requirements.",

    landing_view_title: "Welcome to the AIRe platform!",
    landing_view_text: "Let's begin by filling the following preliminary information about yourself.",
    landing_label_age: "Your age",
    landing_label_occupation: "Your current and past occupations (Use commas to separate the occupations)",

    onboarding_greetings: "Hello there!",
    onboarding_question: "Would you like to discuss about these topics?",

    topic_backpain: "Back pain",
    topic_neckpain: "Neck pain",
    topic_sleep_apnea: "Sleep apnea",
    topic_increased_weight: "Increased weight",
    topic_trouble_talking: "Trouble talking",

    summary_title: "Summary",
    summary_acceptation_question: "Is the summary correct?",

    suggestions_title: "Suggestions",

    tools_title: "Tools",
    tools_button_summarize: "Summarize",
    tools_button_query_surveys: "Query surveys",
    tools_button_suggestions: "Suggestions",

    suggestion_check_for_more: "Check here for more",

    chat_history_loading: "Loading...",
    chat_history_delete_success: "Chat removed successfully.",
    chat_history_tokens: "{0} tokens",
    chat_title: "AIRe chat",
    chat_input_title: "What would you like to ask or tell?",

    popup_confirm_revert_message: "Are you sure you want to revert the chat to this message?",
    popup_confirm_remove_chat: "Are you sure you want to remove this chat?",
    popup_confirm_logout: "Are you sure you want to logout?",
    popup_confirm_profile_updated: "Profile updated.",

    confirm_questionnaire_start: 'Would you like to fill a questionnaire "{0}"?',
    confirm_questionnaire_completion: "When you are happy with your answers, choose continue.",
    questionnaire: "Questionnaire",
    questionnaire_start: "Start of questionnaire",
    questionnaire_end: "End of questionnaire",
    questionnaire_explanation: "The following questions are being recorded for analysis",
    question_answer: "Your answer",

    recall_start_question: "Do you want to continue some earlier conversation?",
    recall_keyword_question: "Do you want to continue chatting about some of the following topics?",
    recall_summary_question: "Is this topic still relevant that you would like to chat about?",

    button_accept: "Accept",
    button_cancel: "Cancel",
    button_yes: "Yes",
    button_no: "No",
    button_back: "Back",
    button_continue: "Continue",
    button_close: "Close",
    button_mark_as_read: "Mark as read",
    button_return_to_conversation: "Return to conversation",

    content_catalogue_empty: "Here you can see content related to the conversations you will have with AIRe Talk.",
    content_catalogue_filters: "filters",
    content_catalogue_clear_filter: "Clear filter",
    content_catalogue_newest_filter: "Newest First",
    content_catalogue_oldest_filter: "Oldest First",
    content_catalogue_search_by: "Search by:",
    content_catalogue_query_placeholder: "Type to filter...",
    content_catalogue_sort_by: "Sort by:",
    content_catalogue_apply_filter: "Apply filters!",

    content_modal_continue_to_chat: "Return to chat",
    content_modal_description: "Description:",
    content_modal_themes: "Themes:",

    logout_inactivity_message: "You have been logged out due to inactivity.",
    logout_inactivity_warning_message: "You will be logged out in {duration} second(s) due to inactivity.",

    tooltip_edit: "Edit",
    tooltip_delete: "Delete your account.",
    tooltip_save: "Save changes.",
    tooltip_download: "Download your personal data.",
    tooltip_close: "Close",
    tooltip_override: "override/not override",
    tooltip_delete_chat: "Delete this chat.",
    tooltip_suggestions: "Generate new suggestions.",
    tooltip_summarize: "Generate new summary.",
    tooltip_personal_information: "Ask personal questions.",
    tooltip_query_surveys: "Do questionnare.",
    tooltip_open_chat_side_panel: "Open/close panel.",
    tooltip_open_catalogue_content: "Open catalogue content.",
    tooltip_send_message: "Send.",
    tooltip_message_options: "Open/close message options.",
    tooltip_thumbs_up: "You like it.",
    tooltip_thumbs_down: "You do not like it.",
    tooltip_copy_message: "Copy this message in the copyboard.",
    tooltip_message_copied: "Message copied.",
    tooltip_revert_message: "Remove the next messages from here.",
    tooltip_remove_keyword: "Remove this theme.",
    tooltip_accept_summary: "I accept this summary.",
    tooltip_reject_summary: "I do not accept this summary.",
    tooltip_mark_reminder_read: "And remove from here this reminder.",
    tooltip_reminder_back_to_chat: "To continue chating about this reminder.",
    tooltip_onboarding_button: "Talk about new topics.",
    tooltip_nav_home: "Go to home view.",
    tooltip_nav_chat: "Chat with the bot.",
    tooltip_nav_chat_history: "Go to check old chats.",
    tooltip_nav_chat_new: "Start a new chat.",
    tooltip_nav_content_catalogue: "Check all content shown to you in the AIRe platform.",
    tooltip_nav_profile: "Go to profile.",
    tooltip_nav_login: "Go to login.",
    tooltip_nav_log_out: "Get logout.",
    tooltip_nav_signup: "Start using AIRe.",
    tooltip_nav_preferences: "Go to your own settings.",
    tooltip_nav_main_menu: "Go to main menu.",
    tooltip_nav_catalogue: "Description catalogue.",
    tooltip_nav_about: "Go to about us.",
    tooltip_menu_language: "Choose UI language.",
    tooltip_menu_ui_mode: "Switch UI color interface.",
    tooltip_chat_speech_recognition_off: "Stop speech recognition",
    tooltip_chat_speech_recognition_on: "Start speech recognition",
    tooltip_chat_tts_read_message: "Read message",
    tooltip_chat_tts_stop_reading: "Stop reading",
    tooltip_chat_tts_read_new_messages_off: "Stop reading new messages",
    tooltip_chat_tts_read_new_messages_on: "Read new messages",

    tutorial_home_welcome_message: "Welcome to AIRe! Would you like to take a quick tour on how to use the app?",
    tutorial_chat_welcome_message: "On this page, you can chat with AIRe bot. Would you like a quick tour about chatting with the bot?",
    tutorial_start_chat_message: "Click here to start a new chat with AIRe bot.",
    tutorial_menu_message: "Click here to find your chat history, profile, settings, and more.",
    tutorial_history_message: "Once you have chatted with AIRe, you can find your chat history here.",
    tutorial_profile_message: "Here you can see and edit your profile information.",
    tutorial_settings_message: "Here you can change the UI language, theme, and size.",
    tutorial_input_message: "Let's start by typing 'Hello AIRe' in this input field and see what happens...",
    tutorial_sidepanel_message: "Click here to open the side panel for additional chat tools.",
    tutorial_next: "Next",
    tutorial_skip: "Skip",
    tutorial_done: "Done",

    language_default_message: "Select UI Default Language:",

    screen_recorder_bot_writing: "The bot is writing a response.",
    screen_recorder_bot_stop_writing: "The bot has finished responding.",
    screen_recorder_loading: "Page is loading, please wait.",
    screen_recorder_stop_text_to_speech: "Stop text to speech.",
    screen_recorder_play_text_to_speech: "Play text to speech.",

    en: "English",
    fi: "Finnish",
    es: "Spanish",
    vi: "Vietnamese",
    id: "Indonesian",
    sw: "Swahili",
    rw: "kinyarwanda"
};

export default en;
