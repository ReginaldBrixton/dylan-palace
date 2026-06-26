export type HapticType = 'light' | 'medium' | 'heavy' | 'selection' | 'none';

export const triggerHaptic = (type: HapticType = 'light') => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    try {
      switch (type) {
        case 'none':
          break;
        case 'selection':
          navigator.vibrate(10);
          break;
        case 'light':
          navigator.vibrate(15);
          break;
        case 'medium':
          navigator.vibrate(30);
          break;
        case 'heavy':
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

export const initGlobalHaptics = () => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const handleGlobalClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement | null;
    if (!target) return;

    const interactive = target.closest('button, [role="button"], a, input[type="radio"], input[type="checkbox"], select');
    if (!interactive) return;

    const hapticAttr = interactive.getAttribute('data-haptic') as HapticType | null;

    if (hapticAttr === 'none') return;

    if (hapticAttr) {
      triggerHaptic(hapticAttr);
    } else {
      const isSelectableOrCheckbox = interactive.tagName === 'INPUT' || interactive.tagName === 'SELECT';
      triggerHaptic(isSelectableOrCheckbox ? 'selection' : 'light');
    }
  };

  document.addEventListener('click', handleGlobalClick, { capture: true, passive: true });
};
