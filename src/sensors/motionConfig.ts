/** Tunable constants for forward-thrust detection. Adjust on a real iPhone. */
export const MOTION_UPDATE_INTERVAL_MS = 50;

/** Peak user-acceleration magnitude (m/s²) required to count as a thrust. */
export const MOTION_THRESHOLD = 2.0;

/**
 * Forward axis in portrait DeviceMotion space is roughly −Z
 * (phone pushed away from the user). We require |z| to dominate.
 */
export const FORWARD_AXIS_DOMINANCE = 0.55;

/** Ignore further triggers after a successful detection. */
export const MOTION_COOLDOWN_MS = 1200;

export const MOTION_SETTINGS_KEY = 'food_slot_motion_enabled';
