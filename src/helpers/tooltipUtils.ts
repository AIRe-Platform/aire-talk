// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

/**
 * Adjusts the tooltip text position to avoid cropping by screen or parent borders.
 * @param event Mouse event in the element to show the tooltip
 * @param useMaxContent If true, sets width to max-content; else, auto
 * @param avoidCropPosition If cropping occurs, specifies where to move: 'top', 'bottom', 'left', or 'right'
 */
export function adjustTooltipPosition(
  event: MouseEvent, 
  useMaxContent: boolean, 
  avoidCropPosition?: 'top' | 'bottom' | 'left' | 'right'
): void {
  const targetElement = event.target as HTMLElement;
  const tooltip = targetElement.querySelector('.tooltiptext') as HTMLElement;

  if (!tooltip) return;

  // Skip recalculating if tooltip is already set
  if (tooltip.getAttribute('is-tooltip-set') === 'true') {
    return;
  }

  // Set width based on condition
  tooltip.style.width = useMaxContent ? 'max-content' : 'auto';

  // Adjust position if an avoidCropPosition is specified
  if (avoidCropPosition) {
    tooltip.setAttribute('data-avoid-crop-position', avoidCropPosition);
  }

  // Mark as adjusted to avoid recalculating
  tooltip.setAttribute('is-tooltip-set', 'true');
}
