import { Animation, createAnimation } from '@ionic/react';

export const stackSlideAnimation = (
    baseEl: HTMLElement,
    opts?: any
): Animation => {
    const enteringEl: HTMLElement = opts?.enteringEl;
    const leavingEl: HTMLElement = opts?.leavingEl;
    const direction: 'forward' | 'back' = opts?.direction ?? 'forward';

    const DURATION = 250;
    const EASING = 'cubic-bezier(0.25, 0.8, 0.25, 1)';

    const root = createAnimation();

    // safety guards
    if (!enteringEl && !leavingEl) return root;

    // Ensure pages are visible and on top correctly
    if (enteringEl) {
        enteringEl.style.willChange = 'transform, opacity';
    }
    if (leavingEl) {
        leavingEl.style.willChange = 'transform, opacity';
    }

    if (direction === 'forward') {
        // Entering: from right -> center
        const enterAnim = createAnimation()
            .addElement(enteringEl)
            .duration(DURATION)
            .easing(EASING)
            .fromTo('transform', 'translateX(100%)', 'translateX(0%)')
            .fromTo('opacity', '0.9', '1');

        // Leaving: small slide to left and slight fade
        const leaveAnim = createAnimation()
            .addElement(leavingEl)
            .duration(DURATION)
            .easing(EASING)
            .fromTo('transform', 'translateX(0%)', 'translateX(-30%)')
            .fromTo('opacity', '1', '0.9');

        root.addAnimation([enterAnim, leaveAnim]);
    } else {
        // direction === 'back'
        // Entering (the page underneath) comes slightly from left -> center
        const enterAnim = createAnimation()
            .addElement(enteringEl)
            .duration(DURATION)
            .easing(EASING)
            .fromTo('transform', 'translateX(-30%)', 'translateX(0%)')
            .fromTo('opacity', '0.9', '1');

        // Leaving (current) slides out to the right
        const leaveAnim = createAnimation()
            .addElement(leavingEl)
            .duration(DURATION)
            .easing(EASING)
            .fromTo('transform', 'translateX(0%)', 'translateX(100%)')
            .fromTo('opacity', '1', '0.9');

        root.addAnimation([enterAnim, leaveAnim]);
    }

    return root;
};
