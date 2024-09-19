// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.


export enum LocalizationKey {
    aire_bot = "aire_bot",
    aire_system = "aire_system",

    footer = "footer",
    not_found = "not_found",

    system_greeting = "system_greeting",
    system_topic = "system_topic",
    system_found_content = "system_found_content",

    home_start_new_chat = "home_start_new_chat",
    home_continue_chat = "home_continue_chat",
    
    start_greeting = "start_greeting",
    start_first_paragraph = "start_first_paragraph",
    start_second_paragraph = "start_second_paragraph",
    start_footer = "start_footer",
    start_disclaimer = "start_disclaimer",

    login_redirect = "login_redirect",
    login_failure = "login_failure",
    login_callback_failure = "login_callback_failure",
    login_callback_button = "login_callback_button",
    login_callback_error_description = "login_callback_error_description",

    signup_form_title = "signup_form_title",
    signup_form_submit = "signup_form_submit",
    signup_label_email = "signup_label_email",
    signup_password_instructions = "signup_password_instructions",
    signup_label_password = "signup_label_password",
    signup_label_confirm_password = "signup_label_confirm_password",

    nav_start = "nav_start",
    nav_home = "nav_home",
    nav_chat = "nav_chat",
    nav_chat_history = "nav_chat_history",
    nav_chat_new = "nav_chat_new",
    nav_content_catalogue = "nav_content_catalogue",
    nav_profile = "nav_profile",
    nav_login = "nav_login",
    nav_logout = "nav_logout",
    nav_signup = "nav_signup",
    nav_preferences = "nav_preferences",
    nav_main_menu = "nav_main_menu",
    nav_catalogue = "nav_catalogue",

    profile_title = "profile_title",
    profile_label_first_name = "profile_label_first_name",
    profile_label_last_name = "profile_label_last_name",
    profile_label_gender = "profile_label_gender",
    profile_label_age = "profile_label_age",
    profile_label_language = "profile_label_language",
    profile_label_country = "profile_label_country",
    profile_label_bio = "profile_label_bio",
    profile_button_save = "profile_button_save",

    profile_heading_connected_services = "profile_heading_connected_services",
    profile_empty_service_list = "profile_empty_service_list",

    profile_heading_password = "profile_heading_password",
    profile_description_password = "profile_description_password",
    profile_label_current_password = "profile_label_current_password",
    profile_label_new_password = "profile_label_new_password",
    profile_button_change_password = "profile_button_change_password",

    profile_heading_personal_data = "profile_heading_personal_data",
    profile_description_personal_data = "profile_description_personal_data",
    profile_button_download_personal_data = "profile_button_download_personal_data",

    profile_heading_delete_account = "profile_heading_delete_account",
    profile_description_delete_account = "profile_description_delete_account",
    profile_label_password_confirm = "profile_label_password_confirm",
    profile_label_keep_anonymized_data = "profile_label_keep_anonymized_data",
    profile_button_delete = "profile_button_delete",

    gender_male = "gender_male",
    gender_female = "gender_female",
    gender_other = "gender_other",

    profile_question_button = "profile_question_button",
    profile_question_confirm = "profile_question_confirm",
    profile_question_completion = "profile_question_completion",
    profile_question_first_name = "profile_question_first_name",
    profile_question_last_name = "profile_question_last_name",
    profile_question_gender = "profile_question_gender",
    profile_question_age = "profile_question_age",
    profile_question_country = "profile_question_country",
    profile_characters_max = "profile_characters_max",
    profile_remaining = "profile_remaining",
    
    profile_experiments_title = "profile_experiments_title",
    profile_experiments_text = "profile_experiments_text",
    profile_experiments_add = "profile_experiments_add",
    profile_experiments_description = "profile_experiments_description",
    profile_experiments_apply = "profile_experiments_apply",

    settings_title = "settings_title",
    settings_language = "settings_language",
    settings_ui_size = "settings_ui_size",
    settings_ui_size_normal = "settings_ui_size_normal",
    settings_ui_size_large = "settings_ui_size_large",

    switch_color_mode = "switch_color_mode",

    error_generic = "error_generic",
    error_ai_not_responding = "error_ai_not_responding",
    error_signup_password_mismatch = "error_signup_password_mismatch",
    error_signup_bad_request = "error_signup_bad_request",
    error_signup_general = "error_signup_general",
    error_profile_edit = "error_profile_edit",
    error_profile_delete_account = "error_profile_delete_account",

    landing_view_title = "landing_view_title",
    landing_view_text = "landing_view_text",
    landing_label_age = "landing_label_age",
    landing_label_occupation = "landing_label_occupation",

    onboarding_greetings = "onboarding_greetings",
    onboarding_question = "onboarding_question",
    topic_backpain = "topic_backpain",
    topic_neckpain = "topic_neckpain",
    topic_sleep_apnea = "topic_sleep_apnea",
    topic_increased_weight = "topic_increased_weight",
    topic_trouble_talking = "topic_trouble_talking",

    summary_chag_log_title = "summary_chag_log_title",
    summary_generate_summary = "summary_generate_summary",
    summary_query_surveys_button = "summary_query_surveys_button",
    summary_suggestions = "summary_suggestions",
    
    suggestion_check_for_more = "suggestion_check_for_more",

    chat_history_loading = "chat_history_loading",
    chat_history_tokens = "chat_history_tokens",
    chat_input_title = "chat_input_title",

    popup_confirm_revert_message = "popup_confirm_revert_message",
    popup_confirm_remove_chat = "popup_confirm_remove_chat",
    popup_confirm_logout = "popup_confirm_logout",
    popup_confirm_profile_updated = "popup_confirm_profile_updated",

    confirm_questionnaire_start = "confirm_questionnaire_start",
    confirm_questionnaire_completion = "confirm_questionnaire_completion",
    questionnaire = "questionnaire",
    questionnaire_start = "questionnaire_start",
    questionnaire_end = "questionnaire_end",
    questionnaire_explanation = "questionnaire_explanation",
    question_answer = "question_answer",

    reminder_start_question = "reminder_start_question",
    reminder_keyword_question = "reminder_keyword_question",
    reminder_summary_question = "reminder_summary_question",

    button_accept = "button_accept",
    button_cancel = "button_cancel",
    button_yes = "button_yes",
    button_no = "button_no",
    button_back = "button_back",
    button_continue = "button_continue",
    button_close = "button_close",
    button_mark_as_read = "button_mark_as_read",

    content_catalogue_empty = "content_catalogue_empty",
    
    en = "en",
    fi = "fi",
    es = "es",
    vi = "vi",
    id = "id",
    sw = "sw",
    rw = "rw"
}
