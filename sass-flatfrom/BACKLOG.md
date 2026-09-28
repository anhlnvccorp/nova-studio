# Backlog v2 — sass-flatform (B2B SaaS Design System & Marketing Site)

> Mục tiêu: xây design system B2B SaaS theo tinh thần Tailscale — **học hierarchy, CTA, trust architecture, motion có chủ đích; KHÔNG sao chép logo, copy, illustration, asset hay mã nguồn của họ.**
> Stack: React + TypeScript + Vite, Tailwind, Storybook. Token-first, accessible by construction.

> **Đây là bản v2.** So với v1, bản này: thêm nhóm primitive form/overlay còn thiếu; sửa 4 acceptance criteria không kiểm chứng được; hạ `S-01` xuống P1; sắp lại thứ tự epic theo đúng hướng phụ thuộc (content → token → primitive → section); **chọn dứt khoát** lộ trình theo chuẩn `stable` (bỏ phương án rút gọn 5 ngày); thống nhất chính sách visual‑regression với `DEVELOPMENT_WORKFLOW.md` (không snapshot ở tầng component); và bổ sung dark‑mode token, consent/GDPR, SEO, i18n. Những chỗ đổi so với v1 được đánh dấu **[v2]**.

---

## Quyết định đã chốt cho bản v2 (đọc trước khi code)

| # | Vấn đề ở v1 | Quyết định v2 |
|---|---|---|
| 1 | Thiếu Input/Field/Dialog/Tooltip/Skeleton/EmptyState/Alert/Link | Thêm **EPIC 1.5**, `Input`/`Field`/`FormError`/`Dialog` là **P0** |
| 2 | Lộ trình 5 ngày mâu thuẫn với DoR (Figma spec + visual regression + interaction test cho mọi component Stable) | **Giữ DoR đầy đủ.** Bỏ lộ trình 5 ngày, dùng lộ trình 4 sprint (~15–20 ngày/dev) ở cuối file |
| 3 | 18/48 item là P0 (38%) | Giảm về **9 item P0** thật sự chặn được release; còn lại chuyển P1/P2 |
| 4 | DoR ghi "contrast ≥ 4.5:1" cho mọi thứ | Tách rõ theo bảng ngưỡng của `DEVELOPMENT_WORKFLOW.md` §6 (4.5:1 chữ thường, 3:1 UI/graphics/focus, 24×24 target size AA, 44×44 mục tiêu touch) |
| 5 | 4 AC chủ quan, không đo được (`M-03`, `T-02`, `S-04`, `Q-01`) | Viết lại thành số đo hoặc quy trình kiểm chứng cụ thể |
| 6 | EPIC 5 (Content) nằm sau EPIC 2 (Marketing shell) dù M-03 phụ thuộc C-01/C-02 | Tách `C-01`, `C-02` thành **EPIC 0.5**, chạy trước EPIC 1 |
| 7 | DoR yêu cầu visual regression snapshot cho mọi component Stable — mâu thuẫn với `DEVELOPMENT_WORKFLOW.md` (khuyến nghị không snapshot pixel ở tầng component) | Visual regression **chỉ ở tầng page/section** (6–8 snapshot tổng). Tầng component: interaction test + axe‑core. Xem `EPIC 6` |
| 8 | Thiếu dark mode token, GDPR/consent cho tracking, SEO/meta, i18n | Thêm `F-06`, `Q-06`, `M-07`; ghi chú i18n vào `C-01` |

---

## Nguyên tắc chung (Definition of Ready cho mọi item)

- Outcome-first: copy nói kết quả trước, kỹ thuật sau.
- Token-only: không hard-code hex/spacing/font-size; chỉ dùng semantic/component token.
- **A11y [v2 — sửa]:** áp đúng bảng ngưỡng theo hạng mục, không dùng một số 4.5:1 cho mọi thứ:

  | Hạng mục | Ngưỡng |
  |---|---|
  | Chữ thường | 4.5:1 |
  | Chữ lớn (≥18.66px bold / ≥24px) | 3:1 |
  | Thành phần UI & đồ hoạ (border, icon, focus indicator) | 3:1 |
  | Target size tối thiểu | 24×24 CSS px (AA, bắt buộc) |
  | Target size touch | 44×44 CSS px (mục tiêu sản phẩm, không phải nghĩa vụ AA) |

  Keyboard đầy đủ, focus rõ (dùng `focus.ring.*` token chung), `prefers-reduced-motion` tắt animation.
- **Definition of Done cho component `stable` [v2 — sửa]:** Figma spec, Storybook stories (default/variants/disabled/loading/dark), interaction test (keyboard, role, focus), axe-core pass. **Không yêu cầu visual regression snapshot ở tầng component** — xem `EPIC 6` cho chính sách visual regression ở tầng page/section. Component chưa đạt đủ 4 mục trên ở trạng thái `beta`, ghi rõ trong `docs/component-status.md`, không coi là xong.

---

## EPIC 0.5 — Content trước (P0) `[v2 — epic mới, kéo lên trước Foundations]`

> Chuyển từ EPIC 5 lên đây vì `M-03 Hero` (P0) phụ thuộc trực tiếp vào `C-01`/`C-02`. Không viết content trước, không ai biết token/spacing cần bao nhiêu chỗ.

| ID | Item | Mô tả | Acceptance Criteria | Ưu tiên |
|----|------|------|---------------------|---------|
| C-01 | Content objects | Mọi text marketing nằm trong `src/content/*.ts`, không hard-code trong JSX. **[v2]** Cấu trúc file tách theo locale từ đầu (`content/home.vi.ts` / `content/home.en.ts` hoặc object có key locale) để không phải retrofit i18n sau | Thêm page mới không sửa component; thêm locale mới không sửa cấu trúc file, chỉ thêm object | P0 |
| C-02 | Outcome-first rewrite | Viết lại hero/features theo công thức Outcome → Use case → Cơ chế → Proof | Không mở đầu bằng list tech (RAG, vector DB...); mỗi section có đúng 1 outcome chính | P0 |
| C-03 | Engineering section | Kiến trúc kỹ thuật dời xuống "Built for engineering teams"/docs | Developer vẫn tìm được chi tiết qua link rõ, không cần scroll quá 1 màn | P1 |
| C-04 | CTA copy audit | "Create workspace", "Run agent", "Try playground" — không dùng "Submit" | Mọi button đều verb + object; audit list toàn bộ CTA trong `content/*.ts`, 0 vi phạm | P1 |

---

## EPIC 0 — Foundations (token system)

| ID | Item | Mô tả | Acceptance Criteria | Ưu tiên |
|----|------|------|---------------------|---------|
| F-01 | `tokens.css` baseline | Font, màu ink/surface/line, brand 50–700, accent, semantic states, radius, shadow, container, spacing scale | File `src/styles/tokens.css` đúng scale đã chốt; không còn hex rời trong code | P0 |
| F-02 | Typography scale | xs→display, leading, tracking; quy tắc eyebrow/nav/body/hero/mono | Áp dụng nhất quán hero/section/body; hero dùng clamp | P0 |
| F-03 | Tailwind theme config | Map token → `tailwind.config.ts` (colors, font, radius, shadow, maxWidth) | Build Tailwind sinh đúng utilities; zero giá trị hard-code | P0 |
| F-04 | Global base + reduced motion | Base layer, focus-visible, selection, `prefers-reduced-motion` | Tab focus thấy rõ mọi nơi (≥3:1 so với nền, theo DoR); animation tắt khi user yêu cầu | P0 |
| F-05 | Storybook setup | Storybook + stories cho tokens (colors, type, spacing, radius, shadow) | Chạy `storybook` xem được catalog foundation | P1 |
| F-06 | Dark theme token layer **[v2 — mới]** | Token set cho dark mode (surface/ink/line/brand đảo tối), contrast pair tính sẵn cho cả 2 theme | Mọi component story có variant `dark` pass cùng ngưỡng contrast như light; build fail nếu thiếu cặp dark cho 1 token | P1 |

---

## EPIC 1 — UI primitives

| ID | Item | Mô tả | Acceptance Criteria | Ưu tiên |
|----|------|------|---------------------|---------|
| UI-01 | Button | primary/secondary/ghost (+destructive/link nếu cần), sm/md/lg, loading/disabled/focus | Storybook đủ states; `aria-busy` khi loading; hit target ≥24×24px | P0 |
| UI-02 | Badge | category, status, New, compatibility tags | Không dùng làm CTA (one semantic role — xem `DEVELOPMENT_WORKFLOW.md` §5) | P1 |
| UI-03 | Container | max-width content, padding responsive | Dùng chung mọi section | P0 |
| UI-04 | SectionHeader | eyebrow/title/description/optional action | Hierarchy h2 đúng, spacing chuẩn | P0 |
| UI-05 | Card + FeatureCard | icon/title/text/visual/footer-link, hover elevation nhẹ | Keyboard-focusable khi clickable; **không** dùng `onClick` toàn khối — link/button rõ bên trong (§5) | P0 |
| UI-06 | IconTile | tile icon thống nhất 1 set (Lucide) | Size 16/20/24 theo context; có accessible name khi đứng một mình | P1 |
| UI-07 | LogoCloud / ProofBar | logo hoặc metric **thật** | Không dùng logo fake; fallback = `EmptyState` (UI-11), không phải khoảng trắng | P1 |
| UI-08 | Stat | KPI + comparison/trend | Không animate số liên tục | P2 |

---

## EPIC 1.5 — Form & overlay primitives `[v2 — epic mới]`

> Bản v1 tự đặt ra quy tắc "toast thay field error" ở mục Không làm nhưng không có primitive nào để tuân theo quy tắc đó. Nhóm này bù lại. `Input`/`Field`/`FormError`/`Dialog` là P0 vì `M-01` (mobile menu, P0) cần focus trap của `Dialog`, và không có trang signup nào chuyển đổi được nếu không có form hợp lệ.

| ID | Item | Mô tả | Acceptance Criteria | Ưu tiên |
|----|------|------|---------------------|---------|
| UI-09 | Input / Field / FormError | Input text/email/password + label, hint, error state; Field bọc label+control+error theo 1 contract | Error hiển thị tại field, không toast; `aria-describedby` nối input↔error; contrast border ≥3:1 | P0 |
| UI-10 | Dialog / Sheet | Modal + slide-over dùng chung; focus trap, Escape để đóng, trả focus về trigger khi đóng | `M-01` mobile menu dùng chính component này; axe-core pass focus management | P0 |
| UI-11 | EmptyState | Icon/illustration + message + action khi chưa có data | `UI-07 LogoCloud`, dashboard rỗng đều dùng lại | P1 |
| UI-12 | Tooltip | Hover/focus reveal, dùng cho `S-02` node hover | Không dùng để giải thích control đang khó hiểu (§1 clarity before cleverness) — nếu cần tooltip để hiểu control, sửa control | P1 |
| UI-13 | Alert / Callout | info/warning/danger/success banner cho docs, security card | Màu theo `color.intent.*`, không tự chế màu mới | P1 |
| UI-14 | Skeleton / LoadingState | Section-level loading, phân biệt "tải lần đầu" vs "đang làm mới" (§3 Trust is a feature) | Không dùng spinner che toàn màn khi chỉ 1 phần đang tải | P1 |
| UI-15 | Select / Checkbox / Radio / Textarea | Bộ input còn lại, cùng contract với `UI-09` | Cùng error/label pattern; keyboard đầy đủ (Space/Arrow) | P2 |

---

## EPIC 2 — Marketing shell

| ID | Item | Mô tả | Acceptance Criteria | Ưu tiên |
|----|------|------|---------------------|---------|
| M-01 | MarketingHeader | Logo + ≤6 nhóm menu + 1 CTA chính; sticky + blur khi scroll | Mobile menu dùng `UI-10 Dialog/Sheet` (focus trap có sẵn), CTA luôn thấy | P0 |
| M-02 | Navigation taxonomy | Product/Solutions/Developers/Resources; mega-menu có title + 4–8 link/group + featured card | Không biến thành sitemap | P1 |
| M-03 | Hero (data-driven) | eyebrow/title/description/≤2 CTA từ `content/home.ts`; trả lời: là gì / kết quả gì / làm gì tiếp | **[v2 — sửa]** 5 người ngoài dự án đọc hero trong 10 giây rồi viết lại một câu "sản phẩm này làm gì"; ≥4/5 người viết đúng ý chính (test này chạy 1 lần trước khi merge, ghi kết quả vào PR) | P0 |
| M-04 | ProductPreview | Preview workflow thật (workspace/files/agents/deploy), không screenshot trang trí | Responsive; kể được flow Prompt→Preview→Deploy | P0 |
| M-05 | Footer | Sitemap gọn + status/social/docs links | Không duplicate toàn bộ header nav | P1 |
| M-06 | FinalCta + CTA lặp lại | CTA lặp cuối page + giữa page dài | Không bắt user scroll lên đầu | P1 |
| M-07 | SEO / meta / OG **[v2 — mới]** | Title/description/canonical per page, OG image + Twitter card, sitemap.xml, robots.txt | Lighthouse SEO ≥95; mỗi page marketing có OG image riêng, không dùng ảnh mặc định | P1 |

---

## EPIC 3 — Product storytelling & motion

| ID | Item | Mô tả | Acceptance Criteria | Ưu tiên |
|----|------|------|---------------------|---------|
| S-01 | NetworkCanvas (SVG/CSS) | 5–9 node (User/Agent/Files/Tool/Preview/DB/Deploy), edge gradient + dash animation chậm | **[v2 — hạ từ P0 xuống P1]** lý do: §1 clarity before cleverness — user phải hiểu trạng thái/hành động trước khi thấy animation; không có form hoạt động (`UI-09`) thì diagram đẹp không chuyển đổi được. `prefers-reduced-motion` tắt animation; SVG có aria-label hoặc aria-hidden | P1 |
| S-02 | Node states + hover | idle/thinking/running/success/error; hover highlight edge + tooltip (`UI-12`) | State không chỉ truyền bằng màu (có icon/text) | P1 |
| S-03 | DiagramFrame | Khung tái dùng cho flow/architecture/network | Dùng lại ≥2 section | P1 |
| S-04 | FeatureBento | Grid bất đối xứng + responsive rules rõ | **[v2 — sửa]** Định nghĩa trước 3 tier quan trọng (primary/secondary/supporting) với kích thước grid cố định cho mỗi tier; AC = mọi card map đúng 1 trong 3 tier, không có ngoại lệ không giải thích được | P1 |
| S-05 | Testimonial | Quote/case study **chỉ khi xác thực được** | Có nguồn (link tới người/công ty xác nhận), không bịa | P2 |
| S-06 | IntegrationGrid + IntegrationCard | logo/category/desc/tags/hover | Click target lớn (≥24×24px), focus được | P1 |
| S-07 | Reveal motion | Reveal on scroll cho section cần thiết (Framer Motion hoặc CSS) | Không overload; tôn trọng reduced-motion | P2 |

---

## EPIC 4 — Trust architecture

| ID | Item | Mô tả | Acceptance Criteria | Ưu tiên |
|----|------|------|---------------------|---------|
| T-01 | How-it-works (3–5 bước) | Sơ đồ + copy outcome | Bước nào cũng có action/next rõ | P0 |
| T-02 | Security card | encryption/isolation/retention/audit/access controls, dùng `UI-13 Alert` khi cần cảnh báo | **[v2 — sửa]** Mỗi claim bảo mật có link tới chính sách/chứng chỉ nội bộ thật; người chịu trách nhiệm bảo mật (CTO hoặc tương đương) ký duyệt nội dung trước khi merge — ghi tên người duyệt vào PR description | P1 |
| T-03 | Developer proof | API example, SDK, GitHub, deploy options, CodePanel có copy | Code chạy được, copy 1 click | P1 |
| T-04 | Metrics/status | Performance/status metrics **nếu có data thật** | Không bịa số; mỗi số có nguồn (dashboard/monitoring link) trong comment | P2 |
| T-05 | Architecture view | Diagram cho technical evaluator | Đủ sâu để kiểm chứng | P2 |
| T-06 | Comparison table | So sánh vs alternative / pricing tiers | Trung thực, có nguồn | P2 |

---

## EPIC 5 — Content & copy (còn lại)

> `C-01`/`C-02` đã chuyển sang `EPIC 0.5`. Phần còn lại ở đây là các mục phụ thuộc vào EPIC 2 đã chạy.

*(xem `C-03`, `C-04` ở EPIC 0.5 — giữ nguyên vị trí liệt kê, không tách rời khỏi C-01/C-02 để tránh 2 nguồn sự thật. EPIC 5 không còn item riêng ở v2.)*

---

## EPIC 6 — Quality pass & tracking

| ID | Item | Mô tả | Acceptance Criteria | Ưu tiên |
|----|------|------|---------------------|---------|
| Q-01 | Lighthouse pass | LCP/CLS/a11y trên hero + page dài | **[v2 — sửa]** Số cụ thể, đo trên 4G throttle, Lighthouse CI: LCP < 2.5s, CLS < 0.1, a11y score ≥ 95. Không có "baseline" mơ hồ — đây chính là baseline | P0 |
| Q-02 | Keyboard + SR audit | Tab order, labels, heading h1→h3, SVG semantics | Pass axe-core, không lỗi critical | P0 |
| Q-03 | Responsive + touch | 375/768/1024/1440 + touch device thật | Không chỉ DevTools; target size ≥24×24px mọi nơi, ≥44×44px cho control chính trên mobile | P1 |
| Q-04 | Asset audit | DOM size, image size, font loading | Font swap (`font-display: swap`), ảnh đúng kích thước responsive | P1 |
| Q-05 | CTA tracking | Click hero CTA, signup start, docs visit, integration interest | Event bắn đúng, kiểm bằng network tab + tool phân tích | P1 |
| Q-06 | Consent management **[v2 — mới]** | Consent banner + cơ sở pháp lý trước khi bắn `Q-05`; áp dụng khi có traffic EU | `Q-05` không bắn event nào trước khi user chấp thuận (hoặc trước khi xác định legitimate interest); banner dùng `UI-13 Alert`/`UI-10 Dialog` | P1 |
| Q-07 | Visual regression — tầng page/section **[v2 — chính sách mới, thay cho DoR v1]** | 6–8 snapshot ở tầng page/section (không phải component), cho các trang/section quan trọng nhất (home hero, pricing, docs landing...) | Thống nhất với `DEVELOPMENT_WORKFLOW.md` §5 test-driven-development: tầng component dùng interaction test + axe-core, KHÔNG snapshot pixel (vỡ liên tục khi token đổi trong 2 tuần đầu EPIC 0). Snapshot page/section chỉ chạy sau khi EPIC 0 (token) đã ổn định | P1 |

---

## Lộ trình `[v2 — thay hoàn toàn lộ trình 5 ngày của v1]`

> Quyết định: **giữ nguyên DoR** (Figma spec + stories đủ state + interaction test + axe-core cho mọi component `stable`). Lộ trình 5 ngày ở v1 không khả thi với chuẩn này (9 item/ngày ở Ngày 2 một mình). Chia lại theo 4 sprint, mỗi sprint ước lượng theo 1 dev full-time; nhân/chia theo số dev thực tế của team.

| Sprint | Nội dung | Ước lượng |
|---|---|---|
| **Sprint 1** | `EPIC 0.5` (content) → `EPIC 0` (token, F-01→F-06) → `EPIC 1` (UI-01→UI-08) | ~5–6 ngày |
| **Sprint 2** | `EPIC 1.5` (form/overlay primitives, UI-09→UI-15) → `EPIC 2` (M-01→M-07) | ~4–5 ngày |
| **Sprint 3** | `EPIC 3` (S-01→S-07) + `EPIC 4` (T-01→T-06) | ~4–5 ngày |
| **Sprint 4** | `EPIC 6` (Q-01→Q-07) + so sánh với spec của chính mình (không pixel-perfect Tailscale) | ~2–3 ngày |

**Tổng ước lượng:** ~15–19 ngày/dev. Đây là **spike/beta timeline khác** — nếu deadline thực tế ngắn hơn, quyết định phải được ghi lại rõ ràng ở đây (hạ chuẩn DoR có chủ đích cho epic nào, không hạ ngầm), không lặp lại mâu thuẫn của v1.

**Sắp thứ tự theo phụ thuộc (không đảo ngược):** content → token → primitive (kể cả form/overlay) → marketing shell → storytelling/trust → quality pass. Đây cũng đúng với nguyên tắc `writing-plans` trong `DEVELOPMENT_WORKFLOW.md`: *"Sắp thứ tự theo hướng phụ thuộc: tokens → ui → apps. Không đảo ngược."*

---

## Không làm

- Clone pixel-perfect + đổi logo/màu.
- Copy copywriting, claim, case study, illustration/Rive asset, CSS/HTML trực tiếp.
- Dùng màu/shape signature gây nhầm lẫn thương hiệu.
- Video nặng/3D/animation trang trí che latency.
- Toast thay field error — **[v2]** giờ có `UI-09 Input/Field/FormError` để tuân theo quy tắc này, không còn là quy tắc treo.
- Component 40 props; hard-code `bg-indigo-600` khắp nơi.
- **[v2 — mới]** Bắn tracking event trước khi có consent (`Q-06`) khi có traffic từ EU/khu vực yêu cầu GDPR.
- **[v2 — mới]** Snapshot pixel ở tầng component (xem `Q-07` — mâu thuẫn đã gỡ với `DEVELOPMENT_WORKFLOW.md`).
