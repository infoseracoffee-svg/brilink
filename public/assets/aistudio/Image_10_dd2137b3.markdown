---
name: Agro Ledger System
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#424751'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#727782'
  outline-variant: '#c2c6d3'
  surface-tint: '#1d5fa9'
  primary: '#003b73'
  on-primary: '#ffffff'
  primary-container: '#00529c'
  on-primary-container: '#a5c7ff'
  inverse-primary: '#a7c8ff'
  secondary: '#4c5e87'
  on-secondary: '#ffffff'
  secondary-container: '#bccefe'
  on-secondary-container: '#465780'
  tertiary: '#00442d'
  on-tertiary: '#ffffff'
  tertiary-container: '#005e3f'
  on-tertiary-container: '#4ddda2'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d5e3ff'
  primary-fixed-dim: '#a7c8ff'
  on-primary-fixed: '#001b3b'
  on-primary-fixed-variant: '#004788'
  secondary-fixed: '#d9e2ff'
  secondary-fixed-dim: '#b4c6f5'
  on-secondary-fixed: '#041a40'
  on-secondary-fixed-variant: '#34466e'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-lg-medium:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-md-medium:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.04em
  metric-currency:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 28px
    letterSpacing: -0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  margin: 1rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system delivers a high-utility, trustworthy, and pragmatic experience engineered for retail agents, grocery store proprietors, and mobile reload counters operating in bustling physical environments. The aesthetic pairs the authoritative stability of state-backed banking with the rapid scannability required in high-turnover retail transactions.

The visual style is **Corporate Modern with Tactile Clarity**:
- **Clarity under Pressure:** Screen layouts prioritize glanceable metrics (cash-in-hand, digital floating balances, today's commission) with zero ambiguity in numerical hierarchies.
- **Physical Counter Ergonomics:** High-contrast touch targets, generous hit boxes (minimum 48px), and bottom-weighted controls designed for single-handed thumb operation on mid-range Android devices under fluctuating store lighting.
- **Transactional Assurance:** Every financial interaction provides immediate, high-fidelity visual confirmation. Color coding follows strict universal accounting rules: incoming capital is unmistakably positive, outbound balances and receivables demand disciplined attention.

## Colors

The palette balances institutional banking credibility with functional transactional feedback. High contrast ratios (exceeding WCAG AAA for core typography and AA for badges) are enforced to maintain legibility under harsh storefront sunlight or dim indoor counters.

### Primary & Brand Anchor
- **Primary (`#00529C`):** Deep Royal Blue. Anchors the primary app bars, main CTAs, active states, and banking balance indicators. Communicates institutional security.
- **Secondary / Deep Navy (`#0B2046`):** Midnight Navy. Applied to deep navigation headers, key ledger container backgrounds, primary data headlines, and structural boundaries.

### Semantic Transaction Tokens
- **Success / Profit Green (`#10B981`):** Applied strictly to incoming funds, earned margins/admin fees, completed transfers, and healthy balance states. Surface tint: `#ECFDF5`.
- **Warning / Pending Amber (`#F59E0B`):** Reserved for low-balance thresholds, pending bank settlements, token sync delays, and outstanding credit. Surface tint: `#FFFBEB`.
- **Danger / Expense Crimson (`#EF4444`):** Strictly designates cash outflow, operational expenses, bad debts/receivables (*bon/hutang*), and failed transactions. Surface tint: `#FEF2F2`.

### Neutral & Surfaces
- **Canvas Base:** `#F8FAFC` (Cool Off-White) prevents glare during 12-hour shifts.
- **Card Surface:** `#FFFFFF` (Pure White).
- **Text Primary:** `#0F172A` (Slate 900) for maximum typographic contrast.
- **Text Secondary / Muted:** `#64748B` (Slate 500) for labels and timestamps.
- **Dividers & Outlines:** `#E2E8F0` (Slate 200).

## Typography

The type scale is built entirely on **Inter** to leverage its uniform tabular figures (`tnum`), crisp x-height, and superior legibility across micro-screens. 

- **Tabular Numerals (`tnum`):** All financial figures, transaction logs, and timestamps must render with fixed-width tabular numbers enabled. This prevents visual shifting in running balance sheets and transaction streams.
- **Hierarchy Rules:** Large ledger totals use `metric-currency` or `headline-lg` in semi-bold and bold weights. Contextual descriptors (e.g., "Keuntungan Bersih", "Saldo Kas Tunai") consistently use `label-md` uppercase or `body-sm` to maintain a distinct visual boundary between amount and label.
- **Truncation Policy:** Monetary amounts must never truncate with ellipses. If viewport constraints occur, scale font downwards from `metric-currency` to `headline-sm` rather than clipping trailing digits.

## Layout & Spacing

The layout model emphasizes a fluid mobile-first grid, built to accommodate fast handheld inputs with thumb-zone safety buffers.

- **Mobile Canvas (< 768px):** Single-column layout with fixed `1rem` (16px) outer horizontal margins and `1rem` column gutters. Bottom padding must enforce a persistent `5rem` (80px) clearance to prevent the fixed bottom navigation bar and floating entry buttons from masking data.
- **Tablet & POS Terminals (768px - 1024px):** Adapts to an 8-column layout. Split-view workflow becomes active: left pane displays quick-input cash register / product matrix (pulsa, PLN token, transfer), right pane maintains the active ledger stream.
- **Desktop / Admin Dashboard (L
NŠŠˆL‹XÛÛ[[ˆš^YÜšYÚ]HX^ÚYÙˆLŽ[™œ™[X
Ìœ
HX\™Ú[œË‚‹H
Š”š]NŠŠˆ[\›˜[ÛÛ\Û™[ÜXÚ[™È›ÛÝÜÈHÎ[Ù[\ˆØØ[KˆÛÛ\XÝÛÛ\Û™[È\ÙHÜXÙK^Ø

H[™ÜXÙK\ÛX

NÈØ\™Y[™ÈÝšXÝH\Ù\ÈÜXÙK[Y
Mœ
HÛˆ[Øš[H[™ÜXÙK[Ø

HÛˆÚY\ˆÛÛZ[™\œË‚‚ˆÈÈ[]˜][Ûˆ	ˆ\‚•š\ÝX[Y\˜\˜ÚH\Ù\ÈHXœšYÙˆ
Š•Û˜[^Y\š[™ÊŠˆ[™
Š”ÛÙ[XšY[ÚYÝÜÊŠˆÈ[œÝ\™HØ\™È™Y[Ù\\˜]Yœ›ÛHH˜\ÙHØ[˜\ÈÚ]Ý]›ÙXÚ[™Èš\ÝX[Û]\‹‚‚‹H
Š“]™[
›]Ý\™˜XÙJNŠŠˆ˜\ÙHØÜ™Y[ˆ˜XÚÙÜ›Ý[™
ÑŽQØ
Kˆ›ÈÚYÝË›ÈÝ][™K‚‹H
Š“]™[H
Y˜][]HØ\™È	ˆX›\ÊNŠŠˆÚ]HÝ\™˜XÙH
Ñ‘‘‘‘‘˜
HÚ]HÝXH›Ü™\ˆ
\ÛÛYÑL‘NŒ
H[™[ˆ[XšY[ÚYÝÎˆ›Þ\ÚYÝÎˆ\Ü™Ø˜JLKÌ‹ÌŒ
K\œL\™Ø˜JLKÌ‹ÌŒ
X‚‹H
Š“]™[ˆ
Ý[[X\žHš[˜[œÚX[	ˆXÝ]™HY]šXÜÊNŠŠˆ[]˜]Yš[X\žHØ\™Îˆ›Þ\ÚYÝÎˆœL\™Ø˜JLKÌ‹ÌŒŠKœLœ™Ø˜JLKÌ‹ÌŒ
X‚‹H
Š“]™[È
[Ù[Ë›ÝÛHÚY]È	ˆ\œÚ\Ý[˜]ŠNŠŠˆ›Þ\ÚYÝÎˆMMœ™Ø˜JLKÌ‹ÌŒ
Xˆ[œÝ\™\ÈÝ[]XÚY[œ›ÛHØÜ›ÛX›H\ÝÈ[™\›™X]‚‹H
Š“]™[
›Ø][™ÈXÝ[Ûˆ]ÛˆH	Õ[X˜Z˜[œØZÜÚIÊNŠŠˆYÚXÛÛ˜\Ý[]˜]Y[[Y[ˆ›Þ\ÚYÝÎˆLM\LÜ™Ø˜J‹MM‹ŒJKœM™Ø˜J‹MM‹ŒŠX‚‚ˆÈÈÚ\\Â‚•H[\™˜XÙH˜[[˜Ù\È[Ù\›ˆ\™ÛÛ›ÛZXÜÈÚ]ÛX[ˆÙ[ÛY]žKˆHÝ[™\™ÛÜ›™\ˆ˜Y]\È\Èš^Y]]™[ˆ
˜\ÙKØØ[[™ÈÈLœLMœ›Üˆš[X\žHÝ\™˜XÙ\ÊK‚‚‹H
Š”š[X\žHØ\™È	ˆš[˜[˜ÚX[ÛÛZ[™\œÎŠŠˆMœ
›Ý[™Y^
KˆÜ™X]\ÈÛX[ˆš\ÝX[ÛÛZ[™\œÈ]ÛÙ[ˆ[œÙHX[\ˆYÙ\œË‚‹H
Š“™\ÝY[›™\ˆ›ØÚÜÈ	ˆ›Ü›HšY[ÎŠŠˆLœ
›Ý[™Y[Ø
Kˆ\YYÈ^[œ]šY[Ë˜[œØXÝ[Ûˆ][H›ÝÜË[™Ý[[X\žHY]šXÜÈ™\ÝY[œÚYH›ÛÝØ\™Ë‚‹H
Š]ÛœÈ	ˆXÝ[ÛˆšYÙÙ\œÎŠŠˆLÈLœˆXÝ[H[™ÛX\›H™\ÜØX›K‚‹H
Š˜YÙ\ËÝ]\ÈÚ\È	ˆ›Ø][™ÈXÝ[Ûˆ]ÛœÎŠŠˆ[[Ú\H
NNN\
KˆÚYÛ˜[È[\˜XÝ]š]H[™Ý]\ÈÚ]Ý]ÛÛ\][™ÈÚ]ÝXÝ\˜[™XÝ[™Û\Ë‚‚ˆÈÈÛÛ\Û™[Â‚ˆÈÈÈš[˜[˜ÚX[Ý[[X\žHØ\™È
Ø\™š[™ÚØ\Ø[ˆš[˜[œÚX[
B‹H
Š”š[X\žH\›ÈØ\™
Ø[È˜[šÈ	ˆØ\ÊNŠŠˆY\˜]žH
ÌŒŒ˜
HÜˆš[X\žH›YH
ÌLŽPØ
H˜XÚÙÜ›Ý[™Ú]Üš\ÜÚ]H\ÙÜ˜\Kˆ]šYY[ÈH‹XÛÛ[[ˆÜˆÙYÛY[Y\Ü^Nˆ”Ø[È™ZÙ[š[™È”’HˆœËˆ’Ø\È[˜ZHHXÚH‹ˆ™X]\™\ÈHÙXÛÛ™\žH›ÝÈYÚYÚ[™È’Ù][[™Ø[ˆ\šH[šHˆ[ˆ›ÛÜ™Y[ˆ
ÌLŽNX
H^YØZ[œÝ[ˆ[\›˜[\šÈ[Üˆ˜[œÛXÙ[ÛÛZ[™\‹‚‹H
Š“Y]šXÈZXÜ›ËPØ\™ÎŠŠˆÚ]HÝ\™˜XÙHÚ]\›Ü™\ˆ
ÑL‘NŒ
KMœ›Ü™\‹\˜Y]\ËˆÛÛZ[œÈH]]YZXÜ›Ë[X™[
X™[[Y
K›ÛÝÙYžHYÚXÛÛ˜\Ý›Û[[Ý[ÈÚ]ÛÛÜ‹XÛÙYXY[™ÈXÛÛœË‚‚ˆÈÈÈÝ]\È˜YÙ\È	ˆÚ\Â‹H
Š”ÝXØÙ\ÜÈÈ™\š\Ú[ŠŠˆ˜XÚÙÜ›Ý[™ÑPÑ‘X^ÌQ˜›Ü™\ˆ\ÛÛYÐMÑŒÑ‚‹H
Š”[™[™ÈÈ\›ÜÙ\ÎŠŠˆ˜XÚÙÜ›Ý[™Ñ‘‘‘P˜^ÎLX›Ü™\ˆ\ÛÛYÑ‘MŽX‚‹H
Š‘^[œÙHÈØ\ÈÙ[X\ŽŠŠˆ˜XÚÙÜ›Ý[™Ñ‘QŒ‘Œ˜^ÎNLPŒP˜›Ü™\ˆ\ÛÛYÑ‘PÐPÐX‚‹H
Š•][™ÈÈ]][™È
™XÙZ]˜X›\ÊNŠŠˆYÚ]š\ÚXš[]H[˜YÙHÚ][X™\ˆÜˆ™Y[™XØ]ÜˆÝÈ›Û\[Y[HYÙ[ÛÛXÝ[Û‹‚‚ˆÈÈÈ]ÛœÈ	ˆ[\˜XÝ]™HÛÛ›ÛÂ‹H
Š”š[X\žHXÝ[Ûˆ
K™Ë‹Ø]]˜[œØZÜÚJNŠŠˆ[]ÚYÛˆ[Øš[KÈLœZYÚˆÛÛYÌLŽPØ^Ñ‘‘‘‘‘˜›ÛÙZYÚŒˆXÝ]™HÝ]H\Ù\ÈÌÐX‚‹H
Š”]ZXÚËP[[Ý[Ú\È
›ÛZ[˜[[ØH	ˆ˜[œÙ™\ŠNŠŠˆÝ][™Y[]ÛœÈ
\ÛÛYÐÐ‘QLX
HÚ]˜XÚÙÜ›Ý[™Ñ‘‘‘‘‘˜ˆÙ[XÝYÝ]H˜[œÚ][ÛœÈÈÌLŽPØÝ][™H[™^Ú]ÑQ‘‘‘˜˜XÚÙÜ›Ý[™š[‚‚ˆÈÈÈ[œ]šY[È
]ZXÚËQ[žHØ\ÚY\ˆ›Ü›\ÊB‹H
ŠÛÛZ[™\ŽŠŠˆZ[š[][HZYÚ›Ý[™YLœ›Ü™\ˆ\ÛÛYÐÐ‘QLX˜XÚÙÜ›Ý[™Ñ‘‘‘‘‘˜ˆ›ØÝ\ÙYÝ]H™[™\œÈHœš[™È[ˆÌLŽPØ‚‹H
ŠÝ\œ™[˜ÞH[œ]ÎŠŠˆš^Y™Yš^”œ˜[ˆ›ÛÍÍ˜ˆ\™ÙH›Û
XY[™K[Y
H\Ú[™ÈX[\ˆšYÝ\™\È
[X
H›Üˆ\œ›Ü‹Yœ™YH™\šYšXØ][ÛˆÙˆ™\›ÜË‚‚ˆÈÈÈ˜[œØXÝ[Ûˆ\Ý][\È
š]Ø^X][XZÝX[ŠB‹H
Š”›ÝÈ\˜Ú]XÝ\™NŠŠˆËXÛÛ[[ˆ›^^[Ý]ˆˆHYˆ›Ý[™YXÛÛˆÛÛZ[™\ˆÛÛÜ‹XÛÙYžHØ]YÛÜžH
˜[œÙ™\‹\šZÈ[˜ZK[ØKŠK‚ˆHÙ[\Žˆ]H
›ÙK[Y[YY][X
KÝ\ÝÛY\ˆ˜[YKÜÛ™K[™[Y\Ý[\
›ÙK\ÛX]]Y
K‚ˆHšYÚˆ™]˜[œØXÝ[Ûˆ[[Ý[
ÜÚ]]™HÜ™Y[ˆÜˆ™]]˜[Û]JHÝXÚÙYX›Ý™HHYÙ[™YKÛX\™Ú[ˆ

Ôœ‹L[ˆÜ™Y[ˆX™[\ÛX
K‚‚ˆÈÈÈ›ÝÛH˜]šYØ][Ûˆ˜\ˆ
[Øš[H\™ÛÛ›ÛZXÜÊB‹H
Š”ÜXÜÎŠŠˆš^Y›ÝÛH˜\‹ZYÚÚ]H˜XÚÙÜ›Ý[™
Ñ‘‘‘‘‘˜
KÜ›Ü™\ˆ\ÛÛYÑL‘NŒÚ]]™[ÈÚYÝÈ[]˜][Û‹‚‹H
Š’][\ÎŠŠˆš[X\žH\Ý[˜][ÛœÈ
™\˜[™K[XZÝX[‹ÐZÝHØ\Ë]]\ÚKÓ\Ü˜[‹ZÝ[ˆYÙ[ŠH›[šÚ[™ÈH›ÛZ[™[Ù[\‹YØÚÙYÜˆ[]˜]Y]ZXÚËY[žH]Ûˆ

ÈØ]]
KˆXÝ]™HXÛÛœÈYÚYÚ[ˆÌLŽPØÚ]X™[[ˆX™[\ÛXÙZYÚÌ