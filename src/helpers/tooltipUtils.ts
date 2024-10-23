// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

/**
 * Method to adjust the tooltip text not to be croped by the screen borders or parent borders.
 * @param event mouse event in the element to show the tooltip
 * @param useMaxContent if true width set to max-content else auto
 * @returns creates a setAttribute with a new value to get some extra css value from default.css
 */
export function adjustTooltipPosition(event: MouseEvent, useMaxContent: boolean): void {
  const targetElement = event.target as HTMLElement;
  const tooltip = targetElement.querySelector('.tooltiptext') as HTMLElement;
  const greatGreatGrandParentElement = targetElement.parentElement?.parentElement?.parentElement as HTMLElement; // Get the 4xparent element in case of the chat history delete element

  if (!tooltip) return;

  // Skip recalculating if is-tooltip-set is already set
  if (tooltip.getAttribute('is-tooltip-set') === 'true') {
    return;
  }

  // Set the width dynamically based on the attribute or condition
  tooltip.style.width = useMaxContent ? 'max-content' : 'auto';

  // Calculate the tooltip's and parent's bounding boxes
  const tooltipRect = tooltip.getBoundingClientRect();
  const greatGreatGrandParentRect = greatGreatGrandParentElement.getBoundingClientRect(); // Get 4xparent's rect

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  let position = 'bottom'; // Default position

  // Adjust position based on proximity to screen edges and parent boundaries
  if (tooltipRect.top < 0 || tooltipRect.top < greatGreatGrandParentRect.top) {
    position = 'top';
  } else if (tooltipRect.left < 0 || tooltipRect.left < greatGreatGrandParentRect.left) {
    position = 'right';
  } else if (tooltipRect.right > viewportWidth || tooltipRect.right > greatGreatGrandParentRect.right) {
    position = 'left';
  } 

  // Apply the new position to the tooltiptext element
  tooltip.setAttribute('data-position', position);

  // Mark as adjusted to avoid recalculating the position
  tooltip.setAttribute('is-tooltip-set', 'true');
}
