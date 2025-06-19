# Changelog

## 2025-06-19
- Hid development version footer bar
- Translation fixes
- Fix UI size setting not taking effect

## 2024-12-20
### Fixed
- Completed and finalized content for the About page.
- Updated TTS buttons to display in white in dark mode.
- Refreshed voice-control icons for better clarity.
- Modified NavMenu to display only one active navigation item at a time.
- Improved responsiveness of the ChatInput component.
- Applied minor updates to accessibility attributes across the app.
- Stabilized the positioning of ChatInput buttons for consistent layout.
- Fixed and adjusted the instruction prompt for continuing conversations.
- Refactored and tidied up the language selection feature.
- Made subtle appearance improvements to the content catalogue.
- Tweaked scaling in the Home view for better display.
- Replaced the background texture with a clean solid color.
- Resolved an issue where unsaved but concluded conversations were continued unexpectedly after being saved.
- Incorporated new localizations suggested by Yamk.

### Added
- Introduced functionality for collecting questionnaire feedback.
- Created a new event system to support dynamic features.
- Forwarded current keywords to the chatbot, enabling keyword detection and notification.

## 2024-12-05
### Fixed
- Welcome and error messages now display in the UI interface language.  
- Refactored `div` elements into buttons, links, labels, etc., to improve screen reader accessibility.  
- Fixed a bug in the navigation menu where the content catalog wouldn't set to active when opened.  
- Made styling adjustments to hover effects and fixed contrast ratio issues for better accessibility.  
- Updated heading-like text in HTML to proper headings and ensured a logical heading order.  
- Changed the microphone icon for better clarity.  
- Fixed minor styling issues on small devices.  
- Resolved layout issues in landscape view on small devices.  
- Removed edit buttons in the profile view.  
- Improved contrast ratio for the Aire logo in the navigation menu in dark mode.  
- Fixed a bug with the document icon in the content modal.  
- Adjusted some localizations to make them more precise and descriptive.  
- Ensured that focus (tabbing) is trapped within each modal.
- Ensured that elements not in view can not be focussed.
- Improved interractions in nav menu, e.g. settings panel doens't close on selecting language.
- Improved accessibility of switch component.

### Added
- Added ARIA attributes (`aria-label`, `aria-live`, `aria-hidden`, `aria-describedby`, `aria-labelledby`) and roles for better screen reader accessibility.  
- Implemented accessible keyboard navigation.  
- Enabled tooltips to be hidden using the `Esc` key.  
- Added localizations for ARIA-label elements to enhance accessibility.  
- Notification for when creating an account and deleting a chat.
- Landmarks (nav, main, footer)

## 2024-11-21
### Fixed
- When starting a new chat, it won't ask you to talk about previuos ones.
- Filter button style and position fixed in the catalogue content.
- Keywordfilter is now scrollable.
- Removed redundant cancel button from the side chat panel.
- Some fixed in small device layout in the home view.
- The content panel now shows the themes always.
- Suggestions now appear only after the summary is completed or when triggered by the button in the side panel.

### Added
- content modal now also opens with urls and documents.
- Created a basic structure in the about view.

## 2024-11-15
### Added
- Content modal: copyright, description, themes and a button to chat where it comes.
- Content catalogue: a new filter, with all themes that user has found in all chats.

## 2024-11-08
### Added
- Tutorial

## 2024-11-07
### Fixed
- Some Finnish localisations changed.
- Some buttons changed from Accept/Reject to Yes/no.
- Tooltip has been refactor to a new Component.

## 2024-11-05
### Fixed
- Introduce a delay to the chat response only if it would otherwise be instant.
- The chat input is blocked until the response is ready.

## 2024-11-01
### Fixed
Some localizations changed.
Adjust the style of tooltip text in the NavMenu.

### Added
Adjust the AI's response to 100-400ms delay.

## 2024-10-31
### Fixed
Localizations changed for all languages realted to tooltips, and some others.

### Added
- More keyboard navigatable elements/parts and some changes to UI behaviour when navigating.

## 2024-10-27
### Fixed
- Minor UI alignment issues on the setttings panel for a layout smaller than a normal desktop 1920x1080p.

### Added
- created a new Popup menu to choose UI language for user.
- Generate a random delay between between 1000ms and 500ms for bot to respond to make the bot more human.

## 2024-05-21
### Added
- Initial release of this changelog.

