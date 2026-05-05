/**
 * Marketplace listing categories (canonical values stored on new products).
 */
export const MARKETPLACE_CATEGORY_VALUES = [
  'game_account',
  'social_account',
  'game_item',
  'giftcard',
  'digital_file',
  'other'
];

/** Legacy enum values still present in DB documents. */
export const LEGACY_CATEGORY_VALUES = ['game', 'software', 'mobile', 'service', 'account'];

export const ALL_CATEGORY_ENUM = [...MARKETPLACE_CATEGORY_VALUES, ...LEGACY_CATEGORY_VALUES];

export function normalizeCategoryForStore(input) {
  const raw = (input || '').toString().trim();
  const map = {
    game: 'game_item',
    software: 'digital_file',
    mobile: 'game_item',
    service: 'digital_file',
    account: 'game_account',
    giftcard: 'giftcard',
    game_account: 'game_account',
    social_account: 'social_account',
    game_item: 'game_item',
    digital_file: 'digital_file',
    other: 'other'
  };
  return map[raw] || 'other';
}

export function isAccountLikeCategory(category) {
  const c = category || '';
  return c === 'game_account' || c === 'social_account' || c === 'account';
}

export function sanitizeImageUrls(input, max = 5) {
  let list = [];
  if (Array.isArray(input)) {
    list = input.filter((u) => typeof u === 'string' && /^https?:\/\//i.test(u.trim()));
  } else if (typeof input === 'string' && input.trim()) {
    list = [input.trim()];
  }
  return [...new Set(list)].slice(0, max);
}
