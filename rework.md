# Dia Chat — Frontend Assessment Rework

## 1. Assessment Brief

### Selected Track: Part 2 — The Premium Home Page

We are completing **Part 2 — The Premium Home Page** of the Acdyon Technologies Frontend Challenge, titled **“Build It Like You Mean It.”**

The assessment explicitly requires choosing **one** track rather than completing both:

- Part 1 — Scraper
- Part 2 — Home Page

We are choosing **Part 2 — The Premium Home Page**.

The goal of Part 2 is to take an existing product, real or credibly invented, and redesign its home page as if a Product Hunt front page depended on it. The intended outcome is a strong **“wow, I want an account”** reaction within the first few seconds.

### Assessment Deliverable

Build a **working, responsive home page** and deploy it to a live URL.

The implementation may use any reasonable frontend technology. The assessment states that the choice of stack is less important than engineering judgment and execution.

### Required Homepage Elements

The redesigned homepage must include:

1. **Hero section**
   - Clear value proposition.
   - One strong call to action.

2. **Product demonstration**
   - At least one section must actually show the product rather than only making marketing claims.
   - Acceptable approaches include a screenshot, mock dashboard/card, or demo interaction.
   - For Dia, prefer showing the real existing chat product/interface rather than fabricating a product mockup.

3. **Motion or micro-interaction**
   - Include at least one purposeful interaction.
   - Examples from the assessment include scroll reveal, hover state, or animated stat.
   - The animation should have a purpose and should not become visual noise.

4. **Responsive behavior**
   - Must work at approximately **390px mobile width**.
   - Must work at approximately **1440px desktop width**.
   - Must not produce horizontal scrolling.

5. **Dark mode**
   - If dark mode is implemented, it must be real and complete.
   - Do not ship a partially implemented or inconsistent dark mode.
   - Since Dia already has dark-mode styling, preserve/rework it properly rather than removing it without reason.

### Critical Honesty Constraint

Do **not** fabricate:

- Testimonials
- User counts
- Company/customer logos
- Reviews
- Social proof
- Any other unsupported metrics

If real numbers are not available, use honest product-focused copy instead.

This is explicitly identified by the assessment as one of the biggest grading signals.

### Required Written Explanation

Submit a `DECISIONS.md` file of **1 page maximum** answering:

1. Why was the chosen approach used instead of the obvious alternative?
2. What was one trade-off made because of the time limit, and what would be done with a real week?
3. Where were AI tools used, and what was personally verified or changed afterward?

### Submission

The assessment requires:

- Deployed URL
- GitHub repository link
- `DECISIONS.md`

The submission is made through the assessment form.

### How the Assessment Is Graded

The assessment evaluates:

- **Systems thinking** — for the scraper track, whether ingestion survives detection/blocking.
- **UI craft & taste** — whether the homepage looks shipped rather than scaffolded, including spacing, typography, and restrained motion.
- **Honesty** — whether the implementation avoids fabricated social proof and instead uses real product/screens/data.
- **Ownership** — whether the candidate can defend every implementation decision during the follow-up call.

For our selected Part 2 track, the primary focus is:

> **UI craft & taste + honesty + ownership.**

### Optional Bonus

The assessment includes an optional bonus round:

- Add one Easter egg to the homepage.
- Examples include a Konami code or hidden hover interaction.
- It provides no grading penalty if skipped and no grading points are guaranteed if found.

This should only be added after the core homepage is complete and polished.

---

# 2. Project We Are Reworking

## Existing Product

We are using the existing **Dia Chat** project as the product for this assessment.

Repository:

`https://github.com/DiaLabs/dia-chat`

Existing deployed product:

`https://chat.dialabs.tech`

The repository describes Dia as:

> AI Therapist tailored for genZ

The current project is already a functioning product rather than a fabricated concept.

## Existing Technology

The existing repository uses:

- Next.js
- React
- TypeScript
- Tailwind CSS
- Framer Motion
- Firebase
- Lucide React
- Existing authentication
- Existing chat experience

The project already contains:

- Public homepage
- `/chat` application
- Authentication flow
- Header
- Footer
- Logo
- Chat interface
- Model selector
- Settings
- Privacy page
- Terms page
- Existing visual assets
- Existing dark-mode styling

## Core Strategy

**Do not rebuild Dia from scratch.**

The goal is to redesign the **public acquisition/marketing experience** while preserving the actual existing product.

The new experience should feel like:

> A polished landing page for an existing, real product that naturally leads into the actual Dia chat application.

The existing chat application should remain functional.

---

# 3. Rework Objective

The current homepage should not merely receive cosmetic changes.

Treat this as a **substantial homepage redesign**.

The goal is to transform the existing page from a conventional informational landing page into a premium, Product-Hunt-quality product homepage.

The redesign should communicate the product immediately:

1. What is Dia?
2. Why should I care?
3. What does Dia actually look like?
4. Why should I trust/use it?
5. What should I do next?

The user should understand the product and see its value without having to read a large amount of text.

---

# 4. Core Design Direction

## Overall Feel

The page should feel:

- Premium
- Modern
- Calm
- Human
- Product-focused
- Minimal
- Intentional
- Visually distinctive
- Polished enough to feel shipped

Avoid:

- Generic SaaS landing-page patterns
- Excessive gradients
- Excessive rounded cards
- Huge amounts of copy
- Stock illustrations
- Fake social proof
- Generic “AI-powered” marketing language
- Excessive animations
- Decorative elements that do not communicate anything

The design should make the **actual Dia product** the visual focus.

---

# 5. Proposed Homepage Structure

Implement the homepage in the following general order.

## Section 0 — Navigation

Create a clean, minimal navigation bar.

Suggested structure:

```text
Dia logo                         [What is Dia] [How it works] [Sign in]
```

Potential CTA:

```text
Start talking
```

Requirements:

- Responsive.
- No unnecessary navigation items.
- Preserve access to authentication.
- Navigation should remain visually consistent with the rest of the page.
- If a sticky/floating navbar is used, keep it subtle.
- Do not introduce unnecessary UI complexity.

---

# 6. Hero Section

## Objective

The hero must communicate Dia's value within the first few seconds.

It should answer:

> What is this?

and:

> Why would I want it?

### Direction

Use concise, emotionally clear copy.

Possible direction:

```text
Your thoughts don't have to
stay in your head.

Talk to Dia — an AI companion
built for the way Gen Z talks.
```

CTA:

```text
Start talking →
```

Do not blindly copy this wording if a stronger version is found during implementation. The important requirement is the communication hierarchy.

### Hero Visual

The hero should include an actual representation of Dia.

Prefer:

- Real chat UI
- Realistic existing Dia interface
- Existing product screenshot
- Carefully composed live/mock conversation using actual UI components

Avoid:

- Generic AI robot illustration
- Stock image
- Fake dashboard
- Decorative illustration with no product information

### Hero Composition

Desktop:

```text
Left:
  headline
  supporting copy
  CTA

Right:
  Dia chat/product visual
```

Alternative:

```text
Centered headline
CTA
Large product preview underneath
```

Choose whichever produces the strongest visual hierarchy.

Mobile:

```text
Headline
Supporting copy
CTA
Product preview
```

No horizontal overflow.

---

# 7. Product Demonstration Section

This section is one of the most important requirements because the assessment explicitly asks for a section that **shows the product rather than simply claiming what it does**.

## Objective

Let the evaluator immediately see what using Dia feels like.

## Preferred Implementation

Reuse the existing `ChatInterface` or an appropriately isolated version of it.

The repository already contains:

```text
src/components/ChatInterface.tsx
```

Use the existing UI where practical.

Possible presentation:

```text
See Dia in action

┌────────────────────────────────────┐
│ Dia                                │
│                                    │
│ You: I've been feeling overwhelmed │
│                                    │
│ Dia: That sounds like a lot to     │
│      carry...                      │
│                                    │
│                         [message]  │
└────────────────────────────────────┘
```

Important:

- Use honest demonstration content.
- Do not claim that a conversation occurred with real users if it did not.
- Do not fabricate usage statistics.
- Clearly present any static/demo conversation as a product demonstration if necessary.

## Interaction

If feasible, allow a small interaction such as:

- Typing a demo message.
- Selecting a suggested prompt.
- Revealing a response.
- Switching between example conversations.

Do not build a complete second chat application solely for the landing page.

The goal is to demonstrate the product, not duplicate `/chat`.

---

# 8. Value / Capability Section

Replace the current generic feature-card presentation with a more intentional explanation of Dia.

Focus on actual product characteristics.

Potential themes:

### Empathetic

Dia is designed for conversations involving feelings, reflection, and emotional support.

### Relatable

Dia is designed around a conversational style that feels natural to its intended Gen Z audience.

### Private

Explain privacy carefully and only according to what the actual product supports.

Do not make absolute privacy/security claims that cannot be verified.

### Important

Every statement must be defensible from the actual implementation/product.

Do not write:

```text
100% private
Trusted by 50,000 people
Clinically proven
Better than therapy
```

unless there is real evidence supporting the statement.

---

# 9. “How It Works” Section

Keep this section short.

Possible structure:

```text
01  Start a conversation
    Tell Dia what's on your mind.

02  Talk naturally
    Have a conversation without rigid forms or workflows.

03  Keep going
    Come back whenever you need a space to reflect.
```

The exact copy should be based on actual product behavior.

Avoid turning this into a large instructional block.

---

# 10. Product/Feature Showcase

Include another visual section if needed to create stronger visual rhythm.

Possible concept:

```text
A conversation that feels natural.

[large chat UI]

Message
Response
Suggested prompt
```

Or:

```text
Designed around conversation.

[product visual]       [short explanation]
```

Use this section only if it improves the page. Avoid adding sections merely to increase page length.

The assessment rewards taste and restraint.

---

# 11. Final CTA

End with a clear, focused CTA.

Example direction:

```text
Sometimes you just need
someone to talk to.

[ Start talking to Dia → ]
```

The CTA should lead into the existing authentication/application flow.

Do not create a fake signup system.

Use the actual existing authentication implementation.

---

# 12. Footer

Preserve useful existing footer functionality.

Include relevant:

- Dia branding
- Privacy
- Terms
- Existing legal links
- Relevant product links

Avoid filling the footer with unnecessary marketing links.

---

# 13. Authentication / Existing Application

Do not break the existing authentication flow.

The current homepage already uses the existing authentication context and redirects authenticated users toward `/chat`.

Preserve this behavior unless there is a strong UX reason to change it.

CTA behavior should eventually lead to:

```text
Landing page
      ↓
Google sign-in
      ↓
/chat
```

For already authenticated users:

```text
Landing page
      ↓
/chat
```

Avoid replacing the existing authentication implementation with a mock.

---

# 14. Responsive Requirements

The assessment explicitly tests:

- 390px mobile
- 1440px desktop

Implement responsive behavior intentionally.

## 390px

Verify:

- No horizontal scrolling.
- Navigation remains usable.
- Hero typography does not overflow.
- CTA fits naturally.
- Product preview scales correctly.
- Chat UI does not become unusable.
- Sections have appropriate horizontal padding.
- Cards/components do not force desktop widths.
- Text remains readable.
- Footer works correctly.

## 1440px

Verify:

- Content does not become excessively wide.
- Main sections use controlled max-widths.
- Hero composition has strong visual balance.
- Product preview has enough visual presence.
- Typography scales appropriately.
- Whitespace feels intentional.

Do not simply rely on browser scaling.

Test the actual dimensions.

---

# 15. Dark Mode

The current project already contains dark-mode styling.

Therefore:

- Preserve dark mode.
- Audit every redesigned section.
- Ensure text contrast is appropriate.
- Ensure borders/backgrounds/cards work in both modes.
- Ensure product screenshots/previews do not become visually broken.
- Ensure hover states work in both modes.
- Ensure the navbar, hero, CTA and footer all transition correctly.

Do not leave individual sections with accidental light-mode colors.

The assessment states that dark mode is all-or-nothing if attempted.

---

# 16. Motion System

Use motion deliberately.

The project already has Framer Motion.

Recommended motion:

### Primary interaction

A product-preview/chat animation.

For example:

```text
User message appears
        ↓
Dia response appears
        ↓
UI settles
```

This directly communicates the product instead of being decorative.

### Secondary motion

Small scroll reveals are acceptable if they improve hierarchy.

Use:

- opacity
- small vertical movement
- subtle scale
- restrained stagger

Avoid:

- constant floating
- excessive parallax
- large rotations
- bouncing UI
- animated backgrounds everywhere
- every card animating independently

The assessment specifically asks for a motion/micro-interaction that “earns its keep.”

---

# 17. Typography

Establish a clear hierarchy.

Recommended hierarchy:

```text
Hero headline
↓
Hero supporting text
↓
Primary CTA
↓
Section headline
↓
Section supporting text
↓
Product content
↓
Small metadata
```

Do not make every section heading enormous.

Typography should communicate premium quality through:

- scale
- weight
- spacing
- line-height
- controlled line length

not through excessive decoration.

---

# 18. Color System

Use the existing Dia identity as the starting point.

Do not completely discard the brand unless there is a compelling design reason.

The final palette should have:

- Clear primary accent.
- Neutral backgrounds.
- Strong text contrast.
- Distinct dark-mode palette.
- Accessible CTA states.

Avoid creating a rainbow palette.

The accent color should primarily guide:

- CTA
- Logo
- Important highlights
- Selected states
- Small visual emphasis

---

# 19. Components and Code Organization

Do not put the entire new homepage into one giant component.

Prefer reusable components.

Suggested structure:

```text
src/
├── app/
│   └── page.tsx
│
└── components/
    ├── Header.tsx
    ├── Hero.tsx
    ├── ProductPreview.tsx
    ├── ValueProps.tsx
    ├── HowItWorks.tsx
    ├── FinalCTA.tsx
    └── Footer.tsx
```

Use existing components where they already solve the problem.

Do not duplicate:

- Logo
- Header logic
- Authentication logic
- Chat UI
- Theme logic

unless there is a clear reason.

---

# 20. Existing Code to Preserve

Before modifying anything, inspect the existing implementation.

Important existing areas include:

```text
src/app/page.tsx
src/app/chat/page.tsx
src/components/ChatInterface.tsx
src/components/Header.tsx
src/components/Footer.tsx
src/components/Logo.tsx
src/components/Providers.tsx
src/components/Settings.tsx
src/app/globals.css
```

The repository also already contains privacy and terms pages.

Preserve functionality unless the redesign requires a change.

---

# 21. What NOT to Do

Do not:

- Build the scraper track.
- Build a new backend solely for the landing page.
- Replace the actual Dia application with a static fake application.
- Add fake testimonials.
- Add fake user numbers.
- Add fake company logos.
- Add fake reviews.
- Invent unsupported claims.
- Add excessive animations.
- Add unnecessary dependencies.
- Rewrite working authentication without need.
- Break `/chat`.
- Break privacy/terms pages.
- Introduce horizontal scrolling.
- Build separate desktop and mobile implementations unless absolutely necessary.
- Turn the homepage into an oversized wall of text.
- Add sections merely to make the page longer.
- Use generic stock imagery when actual product UI can be shown.

---

# 22. Development Process

Follow this order.

## Phase 1 — Audit

Before coding:

1. Inspect the current homepage.
2. Inspect `Header`.
3. Inspect `Footer`.
4. Inspect `ChatInterface`.
5. Inspect authentication behavior.
6. Inspect global styles.
7. Inspect dark-mode implementation.
8. Identify reusable components.
9. Run the existing project locally.
10. Confirm the existing `/chat` flow works.

Do not start deleting existing code before understanding dependencies.

## Phase 2 — Design Structure

Define:

```text
Header
Hero
Product Preview
Value Props
How It Works
Optional Product Showcase
Final CTA
Footer
```

Confirm visual hierarchy before implementing details.

## Phase 3 — Implement Desktop

Target 1440px first.

Focus on:

- spacing
- typography
- visual hierarchy
- product preview
- CTA
- section rhythm

## Phase 4 — Implement Mobile

Target 390px.

Fix:

- navigation
- text wrapping
- product preview
- button sizing
- section padding
- card layouts
- overflow

## Phase 5 — Dark Mode

Audit every section.

## Phase 6 — Motion

Add the minimum meaningful motion required to make the page feel polished.

## Phase 7 — Product Flow

Verify:

```text
CTA → Authentication → /chat
```

## Phase 8 — QA

Test:

- 390px
- 1440px
- Light mode
- Dark mode
- Unauthenticated state
- Authenticated state
- CTA
- Navigation
- `/chat`
- Privacy
- Terms
- No horizontal overflow
- No console errors
- Production build

---

# 23. Quality Bar

The final result should not feel like:

```text
developer portfolio project
```

It should feel like:

```text
real product landing page
```

The evaluator should be able to understand:

```text
What is Dia?
        ↓
Why is Dia useful?
        ↓
What does Dia actually look like?
        ↓
How do I try it?
```

within a short interaction with the page.

---

# 24. DECISIONS.md Preparation

After implementation, create a separate `DECISIONS.md`.

It must remain within the assessment's **1-page maximum**.

Prepare to answer:

## Decision 1 — Why this approach?

Explain why we chose to redesign the existing Dia homepage and reuse the actual Dia product UI instead of creating a new fictional product/demo.

Key idea:

- Dia is already a functioning product.
- Reusing the actual product provides stronger evidence than fabricating a concept.
- The redesign focuses effort on UI craft and product presentation, which matches Part 2.

## Decision 2 — Time trade-off

Document one concrete trade-off.

Example:

> Instead of building a fully interactive marketing demo that duplicates the entire chat application, we reused the existing chat UI and focused the available time on responsive layout, typography, visual hierarchy and product presentation.

Only use this if it accurately reflects the implementation.

## Decision 3 — AI usage

Be honest about AI usage.

Document:

- Where AI assisted.
- What code/design suggestions were generated.
- What was personally reviewed.
- What was changed.
- What was tested manually.

Never claim that AI was not used if it was used.

---

# 25. Optional Easter Egg

Only after the core assessment is complete.

Possible ideas:

- Konami code.
- Hidden interaction on the Dia logo.
- Secret keyboard shortcut.
- Small hover interaction.

The Easter egg must not interfere with:

- Accessibility
- Navigation
- Mobile behavior
- Performance
- Core product flow

If time is limited, skip it.

Core polish is more important.

---

# 26. Definition of Done

The task is complete only when all of the following are true:

- [ ] Part 2 homepage redesign is implemented.
- [ ] Existing Dia product remains functional.
- [ ] Hero has a clear value proposition.
- [ ] Hero has one strong CTA.
- [ ] CTA connects to the real authentication/application flow.
- [ ] Actual Dia product is visibly demonstrated.
- [ ] At least one meaningful motion/micro-interaction exists.
- [ ] Page works at 390px.
- [ ] Page works at 1440px.
- [ ] No horizontal scrolling.
- [ ] Dark mode is complete and consistent.
- [ ] No fabricated testimonials.
- [ ] No fabricated user counts.
- [ ] No fabricated logos.
- [ ] No unsupported claims.
- [ ] Existing privacy and terms pages remain accessible.
- [ ] Existing `/chat` remains functional.
- [ ] No unnecessary dependency additions.
- [ ] Production build succeeds.
- [ ] No obvious console/runtime errors.
- [ ] Homepage feels polished and shipped rather than scaffolded.
- [ ] `DECISIONS.md` is prepared and kept within one page.
- [ ] Final project is deployed.
- [ ] Deployed URL is tested.
- [ ] GitHub repository is updated.

---

# 27. Final Implementation Principle

The central principle for this rework is:

> **Do not manufacture a better-looking fake Dia. Present the real Dia product better.**

The assessment rewards product taste, honest presentation and ownership.

Therefore, prioritize:

1. Strong visual hierarchy.
2. Excellent responsive behavior.
3. Real product UI.
4. Clear copy.
5. Restrained motion.
6. Honest claims.
7. Functional CTA.
8. Production quality.

Do not optimize for the number of sections.

Optimize for the quality of the experience.
