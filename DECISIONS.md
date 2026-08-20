# DECISIONS.md

## Decision 1 — Visual Direction: Flat, Clean & Typographically Premium
To move away from a plain, generic layout while avoiding the use of distracting gradient backgrounds or shadow glows, we introduced a premium typography hierarchy:
- **Inter** (sans-serif) for body text to maintain optimal readability.
- **Lora** (serif) from Google Fonts for headers, using mixed weights and styling specific words with `italic` (e.g., Lora medium italic). This editorial typography style immediately makes the landing page look high-end, intentional, and cohesive.
- All primary call-to-actions (CTAs) and tab selectors have been given a universal border radius of `rounded-full` to match the "Sign in" pill-button in the navbar.
- Customized focus styles to suppress ugly rectangular default outlines on text input components.

## Decision 2 — Warm Paper-Cream Color Scheme & 7-Section Sequence
We converted the light theme design system variables inside `globals.css` from cool slates to a premium, warm paper-cream off-white color scheme.
- The background is set to a cozy off-white `#FBF9F4` (`251 249 244`).
- Transitioned secondary surfaces, borders, and card outlines to matching warm grey-cream tones (`#F6F2EB` and `#EAE4DA`) to ensure layout layers blend naturally.

We structured the landing page into a sequential 7-section funnel to present the product contextually:
1. **Hero ("Meet Dia"):** Immediate value statement, solid sign-in CTAs, and a clean, gated interactive mock preview.
2. **Product Showcase ("See Dia in Action"):** A larger interactive browser mock demonstrating conversations mapped to specific user pain points (e.g. overthinking, burnt out).
3. **What Makes Dia Different:** A simple, non-card list detailing three emotional/Gen Z qualities.
4. **How It Works:** Frictionless 3-step timeline.
5. **Deeper Showcase ("More than a chat box"):** Visual alternating mocks explaining Saved Sessions, Engine selection, and On-Device Cache control settings.
6. **Trust & Safety:** A transparent section discussing boundaries and privacy policies without fake certificates.
7. **Final CTA:** A clean wrap-up block leading users directly to sign-in.

We expanded the footer into a comprehensive 4-column system (Product, Company, and More). Under "Company", we linked the `dialabs.tech` organisation, and under "More" we linked sub-products `PatentIQ` and `Dia Mod` alongside the core legal pages. The massive faded "DiaLabs" watermark text is layered *behind* the text links using absolute positioning (`z-0`) to avoid taking up vertical flow layout space, keeping the layout compact and clean.

## Decision 3 — Mindela-Inspired Hero, Hover-Triggered Highlight Underline & Animated Scroll Indicator
We refactored the Hero section to align with the Mindela-inspired visual layout. On initial load, the large message history box is hidden, leaving only the headline, subtext, CTA buttons, and a wide, minimalist mock input box.
- The input box was widened to `max-w-4xl` (spanning 70-75% screen width on desktop).
- Restored `+ Add` and `History` buttons on the bottom-left of the input box, matching the Send button size. Clicking either button triggers a clean, floating sign-in popover menu.
- **Button Uniformity:** All buttons (`Add`, `History`, `Send`, and the popover's `Sign in with Google` button) share a uniform design language: identical height (`h-10`), font size (`text-sm`), font weight (`font-semibold`), and capsule pill-shape (`rounded-full`) to look cohesive and balanced.
- The `Send` button is styled with the primary brand color (`bg-primary text-neutral-900`).
- **Animated Sparse Crumpled Paper Background:** Integrated a procedurally generated crumpled paper shadow background using custom SVG `<feTurbulence>` and `<feDiffuseLighting>` filters. Set base frequency to `0.007` to create large, sparse, organic folds/creases instead of dense noise, detail complexity to `numOctaves="4"`, and surface shadow depth to `surfaceScale="4"`. Added a `<feGaussianBlur stdDeviation="1.5">` to blur and soften crease details so folds look natural rather than crisp/pixelated. Built a slow `requestAnimationFrame` render loop that gently oscillates both the lighting angle (`azimuth` variable between 40° and 80°) and elevation (`elevation` variable between 30° and 46°), causing the shadows of the paper wrinkles to shift smoothly and dynamically over time. Opacity was increased to `0.28` (light theme) and `0.1` (dark theme) for distinct visibility.
- The message bubble panel smoothly slides down only *after* the user types and sends their first mock prompt. 
- **Typography Sizing & Hover Highlight Underline:** Scaled the headline size back down to `text-7xl` on desktop to fix line wrapping issues. The hand-drawn single-stroke **SVG underline** (`M3 5 Q 50 1 97 5`) sits closely below the italicized phrase *"don't have to"* (using `px-1` padding for tight text spacing) and animates when the user hovers over the span. The path uses a thicker marker stroke (`strokeWidth="4"`) and fades in via CSS transitions upon mouse entry.
- **Layout Spacing & Centered Viewport Lock:** The Hero maintains a full-screen bounds (`min-h-screen pb-24`) to lock the section visually. Reverted to a centered vertical layout flow (`flex flex-col justify-center items-center`) where the chat input box sits at a tight, controlled margin (`mt-6` on mobile, `mt-8` on desktop) directly below the CTA buttons. This eliminates the massive empty vertical gap while keeping the entire content layout compact enough to fit inside `100vh` on mobile, preventing vertical overflows and keeping absolute components locked in view.
- **Mobile Highlight Auto-Draw:** Integrated a `useEffect` hook to detect mobile viewports (`window.innerWidth < 768`) and automatically set `highlightHovered` to `true` after a `200ms` delay on mount, ensuring the draw animation plays instantly when the headline loads.
- **Animated Scroll Mouse Indicator:** Replaced the generic chevron arrow with a premium, CSS-animated computer mouse icon featuring a scrolling wheel dot animation and a subtle `"Scroll"` text tag. It is visible on all screen sizes at the bottom of the viewport fold (`absolute bottom-6`).

## Decision 4 — Fading Denser Grid Background
We modified the background grid inside `globals.css` to make the pattern denser (changing the size from `80px` to `40px`). Additionally, we implemented a linear gradient mask (`mask-image` and `-webkit-mask-image`) to smoothly fade out the grid lines starting from the 60% mark of the viewport height, ensuring the grid blends naturally into the solid layout below.

## Decision 5 — Enlarged Navbar, Frosted Glass & Mobile Layout Centers
We refactored the navbar properties to optimize layout prominence and visual blending:
- **Navbar Elements Size & Mobile Centers:** Enlarged the navigation gap (`gap-8`) and scaled desktop text sizes. Re-engineered the header container to use a standard 3-column flexgrid system (`flex items-center justify-between w-full`) instead of using absolute positioning for mobile items. This aligns the menu icon, logo link, and auth buttons along their vertical center-lines.
- **Mobile Scale Adjustments:** On mobile screens, logo text sizing is reduced to `text-lg` (scaling up to `text-2xl` on desktop) and the logo icon is scaled down to `w-7 h-7` (`w-9 h-9` on desktop). The mobile sign-in button is padded to `px-5 py-2` using a `text-sm` font size to keep the interface balanced and prevent text squishing.
- **Frosted Glass Transition & Border Flash Fix:** Reconfigured `.navbar-floating` in `globals.css` to reduce background opacity to `0.65` using backdrop filter blurs (`16px`). To prevent a black border flash when transitioning to the floated state, we declared a persistent `1px solid transparent` border on the base `.navbar` class and only transition `border-color` to its soft cream tone (`rgb(var(--border) / 0.6)`) on scroll.

## Decision 6 — Frosted Glass Mobile Hamburger Drawer
We redesigned the mobile menu inside [Header.tsx](file:///home/iteshxt/Documents/1.Projects/dia-chat) to match the visual design system of the floated header:
- **Frosted Float Design:** The menu container floating below the navbar is rendered as a rounded capsule (`rounded-2xl`) using frosted glass parameters: `backdrop-blur-xl bg-surface/65` and a soft border wrapper (`border border-border/60`).
- **Clean Navigation Links:** Employs standard sans-serif weights (`text-base font-semibold py-2.5`) with hoverable glass backgrounds (`hover:bg-neutral-100/50`) to match navbar link configurations.

## Decision 7 — CTA Buttons Mobile Layout & Scroll Hiding
We updated the Hero Section CTAs to adapt gracefully to mobile displays:
- **Side-by-Side Flex Layout:** Configured the "Start talking" and "Try preview" buttons to render side-by-side (`flex-row` instead of wrapping vertically) on mobile viewports. The buttons share equivalent widths (`w-1/2`) and use compressed padding and font bounds (`px-4 py-2.5 text-sm`) to prevent text truncation on narrow mobile panels.
- **Scroll Indicator Visibility:** The animated mouse scroll indicator is configured to be hidden on mobile viewports (`hidden md:flex`) since it is a desktop-centric micro-interaction.

## Decision 8 — Seamless Preloader, Scroll Lock & Staggered Hero Load
We coordinated a unified initial load sequence using a custom `Preloader` component and staggered Framer Motion layout states:
1. **Seamless Initial Load:** Replaced the white auth checking screen with a full yellow background (`bg-primary`) and a white pulsing logo. This matches the Preloader's aesthetic to eliminate the white flash before hydration.
2. **Scroll Lock:** On mount, `Preloader` applies `overflow: hidden` to the document body and sets `.lenis-stopped` on the HTML root, completely hiding page scrollbars and disabling scrolling during the entrance.
3. **Dia Logo line tracing:** A white line-art representation of the Dia chat-bubble logo draws itself in `800ms`. The logo container is enlarged to `w-36 h-36 sm:w-48 sm:h-48` and its central heart path animates its `fill` property from transparent to solid white after the border traces.
4. **Preloader Slide Exit:** Once drawing is complete, the preloader container transitions upwards (`y: '-100%'`) in `800ms`.
5. **Hero Staggered Animation Trigger:** The preloader calls `onComplete`, unlocking `startAnimation` inside `HeroSection.tsx` and restoring scrolling behaviors:
   - **Headline (h1)** animates, fading in and sliding up (`y: 25` to `0`) using ease curve `[0.16, 1, 0.3, 1]`.
   - **Subtext (p)** fades in with a `0.15s` delay.
   - **CTA Buttons** fade in with a `0.3s` delay.
   - **Interactive Chat Input Box** fades in with a `0.4s` delay.

## Decision 9 — Dynamic Navbar Logo Heart Fill on Hover
We updated [Logo.tsx](file:///home/iteshxt/Documents/1.Projects/dia-chat/src/components/Logo.tsx) and [Header.tsx](file:///home/iteshxt/Documents/1.Projects/dia-chat/src/components/Header.tsx) to introduce a hover micro-interaction on the main branding Link:
- Hovering over the logo container triggers a state update (`logoHovered`), animating the inner heart's SVG path fill from transparent to solid `currentColor` (yellow in the header) in `0.25s`.
- The logo scales up by `5%` (`group-hover:scale-105`) with a smooth CSS transition to reinforce navigation clickability.

## Decision 10 — Kinetic / Smooth Scroll Integration
We integrated the **Lenis** library globally inside the main React `Providers.tsx` context, running a client-side requestAnimationFrame loop. This implements kinetic, momentum-based scrolling for all viewports, creating a smooth and responsive velocity curve when navigating down the page. Native scrolling behavior is suppressed via `html.lenis` CSS styles to avoid double-scroll jitter.

## Decision 11 — Sticky Card-Reveal Scroll Effect
We set up a sticky scroll stacking layout for the Hero section:
- The Hero section container is held sticky (`sticky top-0 z-0`) in [page.tsx](file:///home/iteshxt/Documents/1.Projects/dia-chat/src/app/page.tsx).
- All subsequent landing sections are wrapped inside a single container that has a higher stack order (`relative z-10`), a solid cream background (`bg-background`), a custom top shadow (`shadow-[0_-20px_50px_rgba(0,0,0,0.05)]`), a top border, and rounded card header corners (`rounded-t-[32px] sm:rounded-t-[48px]`). As the user scrolls, the Hero page remains pinned in place while the rest of the site slides up cleanly on top of it like a floating card.

## Decision 12 — AI usage
- **Gemini / Claude:** Guided the modular implementation of the 7 sections, generating simple semantic JSX layout structures and mapping flat responsive column boundaries.
- **Tailwind v4 theme debugging:** Restored custom colors within the pipeline by mapping custom properties into Tailwind’s `@theme` directive, allowing flat elements to parse custom styling variables correctly.
- **Manual Verification:** Personally verified spacing constraints, text contrast compliance (ensuring readable contrast at 390px mobile views), and that no horizontal overflow exists under strict viewport simulation.
