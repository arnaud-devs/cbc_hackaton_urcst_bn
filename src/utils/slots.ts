export const VALID_SLOTS = [
  "08:00", "08:30", "09:00",
  "17:00", "17:30", "18:00", "18:30", "19:00", "19:30",
  "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00",
];

export const isValidSlot = (slot: string): boolean => VALID_SLOTS.includes(slot);
