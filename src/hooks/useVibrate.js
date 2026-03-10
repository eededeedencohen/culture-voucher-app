import { useCallback } from 'react';

export function useVibrate() {
  const vibrate = useCallback((pattern) => {
    if (navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  }, []);

  // Soft tap for page transitions
  const tapVibrate = useCallback(() => vibrate(15), [vibrate]);

  // Success pattern - two short pulses
  const successVibrate = useCallback(() => vibrate([50, 80, 50, 80, 120]), [vibrate]);

  // Scan detected - quick buzz
  const scanVibrate = useCallback(() => vibrate([30, 40, 30]), [vibrate]);

  // Error - long buzz
  const errorVibrate = useCallback(() => vibrate([200, 100, 200]), [vibrate]);

  // Redemption confirmed - celebration pattern
  const redeemVibrate = useCallback(() => vibrate([50, 50, 50, 50, 100, 80, 200]), [vibrate]);

  return { tapVibrate, successVibrate, scanVibrate, errorVibrate, redeemVibrate };
}
