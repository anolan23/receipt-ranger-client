Receipt Ranger turns receipts into spending insights for busy parents running a household. It should feel like a cheerful helper, never a stern bank: cozy, upbeat, playful, and still easy to scan. Build every screen mobile-first, then scale up to desktop.

## Design rationale

- **Warm over corporate.** Backgrounds are cream (`surface-100`) in light and deep plum (`surface-100` in the dark theme), never white-on-black. Text is cocoa `ink`, never black. There is no corporate blue; the only blue-green is the small `focus` ring.
- **One friendly accent.** `primary` (tomato coral) is for the single main action on a view, the Scan button and the current month. Everything else is soft pastels: `blob-peach`, `blob-butter`, `blob-sage`, `blob-lavender`, `blob-sky`.
- **Sticker shapes.** Corners are very round (`radius-lg` 28px for cards, `radius-xl` 36px for frames, `radius-pill` for buttons, badges, chips and inputs). Marks in charts and badges carry a 2px `ink` outline so pastels stay visible. Large organic `blob-*` shapes sit behind headers at 50 to 60 percent opacity, never behind text that is smaller than the headline.
- **Wins, not warnings.** Frame spending as progress: "You spent 8% less on dining out than last month!" Decreases use `win-bg` and `win-ink` with a ▼. Increases use warm amber `rise-bg` and `rise-ink` with a ▲ and context ("mostly fresh produce"). Never use red for spending. Failures use the soft `oops-bg` and `oops-ink` pair.
- **Delight, kept tasteful.** Pip the mascot appears once per screen at most. Confetti and sparkles happen only when a scan batch finishes.

## Colour

- Body copy is `ink` on `surface-100`, `surface-200` and `surface-raised`. Secondary text is `ink-muted` on those same three surfaces, and never on a `blob-*` fill; use `ink` there.
- Every filled pair is paired by name: `on-primary` on `primary`, `win-ink` on `win-bg`, `rise-ink` on `rise-bg`, `info-ink` on `info-bg`, `oops-ink` on `oops-bg`, `on-cat` on every `cat-*`. All text pairs hold at least 4.5:1 in both themes; `outline`, `focus` and `primary` hold at least 3:1 against the surfaces they touch.
- The dark theme stays warm: plum surfaces, a lighter coral `primary` with dark `on-primary` text, and deeper muted `blob-*` fills. Do not use pure black.
- Category colours are fixed per category and never cycle: `cat-groceries` 🛒, `cat-kids` 🧸, `cat-eating` 🍕, `cat-home` 🏠, `cat-school` 🎒, `cat-other` ✨ (always last, labelled "Everything else"). They are told apart by lightness as well as hue, and always shown with the emoji and the name.
- Never rely on colour alone: status always has an icon and a word, and a delta always has an arrow and words.

## Typography

- Headings use `display` (Fredoka, rounded) at `h1`, `h2`, `h3`, `display-xl`. Body text uses `sans` (Nunito) at `body`, `body-sm`, `label`, `caption`. Both load from Google Fonts; the stacks fall back to `ui-rounded` and system fonts.
- All money uses tabular numerals: add `font-variant-numeric: tabular-nums` (the `.num` class in `bundle.css`) to every amount, KPI value, table total and chart label. Use `money-xl` for the hero total and `money` in lists.
- Never set text below 12px (`caption`). Phone greeting drops to 26px / 32px.

## Layout and navigation

- Desktop: a 224px left sidebar of pill nav items (`primary-soft` for the current page) and a persistent "Scan a receipt" button. Phone: a bottom tab bar (Overview, Receipts, centre Scan, Insights, Me) with the raised round Scan button.
- Cards are `surface-raised` with a 1px `line` border and `shadow-soft`, padded `space-5`. Gaps between cards are `space-4`; desktop main padding is `space-8`; phone side gutter is `space-4`.
- Interactive targets are at least 44px, primary buttons 48px. Focus is a solid 3px `focus` ring with a 2px offset on every control.
- Respect `prefers-reduced-motion`: remove all animation and transitions, keep the content.

## Screens

- **Overview:** friendly greeting ("Good morning! Here's how October is going"), five KPI cards (spent this month as the hero, change vs. last month, receipts scanned, top category, average per receipt), monthly totals with a 3M / 6M / 12M selector, category donut with a full legend, top merchants and recent receipts.
- **Receipts:** search, category and date filters over a sortable table (date, merchant, category badge, total, status) with pagination; a row opens the drawer with the scanned image, parsed line items and an editable category. Phones show receipt cards instead of a table.
- **Scan:** a camera-first viewfinder with butter corner guides, a large "Scan a receipt" button, "Choose from photos", a desktop drop zone, a batch tray of thumbnails each with a status pill, tips ("Lay it flat and make sure the total is visible"), and a review step with the image beside editable merchant, category and line items.
- **Insights:** switch between Categories and Merchants, pick one, then read the headline amount, a six-month trend and the top line items.
- **States:** empty, skeleton loading, read error, camera permission denied, reading in progress and low-confidence read, all with Pip and kind copy.

## Content fundamentals

- Voice: a cheerful helper. First-person "I" for Pip's notes ("I wasn't sure about the apples"), "you" for the parent. Sentence case everywhere. Exclamation marks sparingly, one emoji at most per message, and always a real word beside it.
- Real examples: "Let's scan your first receipt!", "Nice, 12 receipts scanned!", "Oops, that receipt was tricky to read. Try scanning it again?", "Can you double-check this one?", "Counting the coupons…", "Looks good!".
- Never scold. Say "$33.60 more on produce", not "Overspent". Never blame the user for a failed scan.

## Iconography

- UI icons are a 24px rounded-stroke set (2px stroke, round caps and joins, `currentColor`), always with a text label except the tab-bar Scan button. Category icons are emoji. Spot illustrations use Pip in the same soft, outlined style (`ink` outline 2.5px, flat fills, no gradients).
- There is no brand logo file; the mark is Pip's head beside the name "Receipt Ranger" set in `display`.
