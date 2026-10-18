/**
 * Category colours are fixed per category and never cycle. They are told
 * apart by lightness as well as hue and always shown with emoji and name.
 * Backend categories are free-form labels, so we match them onto the six
 * design categories by keyword; anything else is "Everything else".
 */
export type CategoryKey =
  | 'groceries'
  | 'kids'
  | 'eating'
  | 'home'
  | 'school'
  | 'other';

export interface CategoryStyle {
  key: CategoryKey;
  emoji: string;
  /** CSS custom property holding the fill, e.g. `var(--cat-groceries)`. */
  color: string;
  /** Tailwind classes for a filled badge (static strings so Tailwind sees them). */
  badge: string;
  /** Tailwind class for a solid swatch. */
  swatch: string;
}

export const CATEGORY_STYLES: Record<CategoryKey, CategoryStyle> = {
  groceries: {
    key: 'groceries',
    emoji: '🛒',
    color: 'var(--cat-groceries)',
    badge: 'bg-cat-groceries',
    swatch: 'bg-cat-groceries',
  },
  kids: {
    key: 'kids',
    emoji: '🧸',
    color: 'var(--cat-kids)',
    badge: 'bg-cat-kids',
    swatch: 'bg-cat-kids',
  },
  eating: {
    key: 'eating',
    emoji: '🍕',
    color: 'var(--cat-eating)',
    badge: 'bg-cat-eating',
    swatch: 'bg-cat-eating',
  },
  home: {
    key: 'home',
    emoji: '🏠',
    color: 'var(--cat-home)',
    badge: 'bg-cat-home',
    swatch: 'bg-cat-home',
  },
  school: {
    key: 'school',
    emoji: '🎒',
    color: 'var(--cat-school)',
    badge: 'bg-cat-school',
    swatch: 'bg-cat-school',
  },
  other: {
    key: 'other',
    emoji: '✨',
    color: 'var(--cat-other)',
    badge: 'bg-cat-other',
    swatch: 'bg-cat-other',
  },
};

const KEYWORDS: [CategoryKey, RegExp][] = [
  ['eating', /dining|restaurant|eating|takeout|take-out|fast.?food|cafe|café|coffee|pizza|deli\b|bar\b|delivery/i],
  ['groceries', /grocer|supermarket|produce|food|market|meat|dairy|pantry|snack|beverage|drink/i],
  ['kids', /\bkid|child|baby|toy|diaper|infant|nursery|playground/i],
  ['school', /school|educat|book|stationer|office|supplies|tuition|class/i],
  ['home', /home|house|hardware|furnitur|utilit|garden|clean|decor|appliance|rent|improvement/i],
];

export function getCategoryStyle(label?: string | null): CategoryStyle {
  if (!label) return CATEGORY_STYLES.other;
  for (const [key, pattern] of KEYWORDS) {
    if (pattern.test(label)) return CATEGORY_STYLES[key];
  }
  return CATEGORY_STYLES.other;
}

const ORDER: CategoryKey[] = ['groceries', 'kids', 'eating', 'home', 'school'];

/**
 * Colours for a set of chart slices. Labels that match a design category keep
 * its fixed colour; unmatched labels take the unused palette colours in
 * order, and "Everything else" stays last in tan.
 */
export function assignCategoryColors(labels: string[]): Record<string, CategoryStyle> {
  const result: Record<string, CategoryStyle> = {};
  const used = new Set<CategoryKey>();
  const unmatched: string[] = [];
  for (const label of labels) {
    const style = getCategoryStyle(label);
    if (style.key !== 'other' && !used.has(style.key)) {
      used.add(style.key);
      result[label] = style;
    } else if (style.key === 'other' && /everything else|other/i.test(label)) {
      result[label] = CATEGORY_STYLES.other;
    } else {
      unmatched.push(label);
    }
  }
  const free = ORDER.filter((key) => !used.has(key));
  unmatched.forEach((label, index) => {
    result[label] = CATEGORY_STYLES[free[index] ?? 'other'];
  });
  return result;
}
