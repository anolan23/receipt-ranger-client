# Motion and delight

Durations are `dur-fast` 120ms (colour), `dur-base` 220ms (hover, drawer) and `dur-slow` 420ms (pop, bars). Overshoot uses `ease-bounce`; everything else uses `ease-soft`. Under `prefers-reduced-motion: reduce` all animation and transition is removed, and each effect below still shows its end state.

| Moment | Effect |
| --- | --- |
| Hover on a button or card | Lift 2 to 3px and scale up to 1.02 with `ease-bounce`; a pressed button drops its `shadow-button` edge and moves down 1px. |
| Hover on a nav item | Slide 3px right and fill with `surface-raised`. |
| Scan in progress | A butter beam sweeps the viewfinder; Pip's receipt sways; the progress bar has moving diagonal stripes. |
| Scan success | The thumbnail pops in (scale .6 to 1.08 to 1 over `dur-slow`), a short burst of sparkles and confetti plays once, and Pip celebrates with the line "Nice, N receipts scanned!". |
| Chart load | Bars and merchant bars grow from the baseline or left edge over `dur-slow`. |
| Chart tooltip | Fades in over `dur-fast` above the hovered or focused mark with a friendly note ("Back-to-school month 🎒"); the mark scales up about 4%. |
| Donut hover | The slice scales up slightly and the centre swaps to that category's emoji, amount and percent. |
| Empty state | Pip bobs up and down 4px on a 3.2 second loop. |
| Loading | Skeletons shimmer left to right over 1.6 seconds while a squinting Pip says "Counting the coupons…". |
| Drawer | Slides in from the right over `dur-base` with a fade of the `scrim`. |
