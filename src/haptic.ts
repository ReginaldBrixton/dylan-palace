/**
 * Haptic Feedback Utility using the Web Vibration API.
 * Provides a tactile, premium feel for mobile users.
 */

export type HapticType = 'light' | 'medium' | 'heavy' | 'selection' | 'none';

export const triggerHaptic = (type: HapticType = 'light') => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    try {
      switch (type) {
        case 'none':
          break;
        case 'selection':
          // Subtle, almost imperceptible tab/toggle click
          navigator.vibrate(10);
          break;
        case 'light':
          // Standard tactile feedback for positive actions
          navigator.vibrate(15);
          break;
        case 'medium':
          // Feedback for secondary buttons, cart additions, quantity increase
          navigator.vibrate(30);
          break;
        case 'heavy':
          // Large actions like checkout success or order confirmation
          navigator.vibrate([40, 20, 40]);
          break;
        default:
          navigator.vibrate(15);
      }
    } catch (e) {
      // Safely ignore vibration blocker policies or permission issues
    }
  }
};

// Initialize global haptic listener for automatic button feedback
export const initGlobalHaptics = () => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const handleGlobalClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement | null;
    if (!target) return;

    // Resolve closest interactive element up to 4 parents deep
    const interactive = target.closest('button, [role="button"], a, input[type="radio"], input[type="checkbox"], select');
    if (!interactive) return;

    // Check if a custom haptic configuration or override is specified
    const hapticAttr = interactive.getAttribute('data-haptic') as HapticType | null;
    
    if (hapticAttr === 'none') return;
    
    if (hapticAttr) {
      triggerHaptic(hapticAttr);
    } else {
      // Default interactive items get light/selection haptic feedback
      const isSelectableOrCheckbox = interactive.tagName === 'INPUT' || interactive.tagName === 'SELECT';
      triggerHaptic(isSelectableOrCheckbox ? 'selection' : 'light');
    }
  };

  // Attach to capture phase to intercept actions early and feel responsive
  document.addEventListener('click', handleGlobalClick, { capture: true, passive: true });
};
