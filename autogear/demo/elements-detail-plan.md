# Kế hoạch chi tiết elements (template-demo/elements/*) — v2

> Hiện trạng: catalog `elements.html` đủ 36 items, badge 100% done (demo tĩnh).
> Cấu trúc chuẩn mỗi file: `base.css` + `assets/css/elements/<slug>.css` + `site-nav.js` (+ `elements.js` nếu tương tác) + comment `PORT:` + hooks `data-el-*`.
> Mục tiêu v2: (1) chuẩn hóa chi tiết từng element theo cùng spec, (2) nối sang live Flatsome (native shortcode + skin), (3) thứ tự ưu tiên port.

## 1. Spec chung áp cho mọi element

- HTML: semantic (`section/article/figure/button`), `aria-label` cho controls, alt text cho ảnh (hiện `.ph` placeholder — thay ảnh thật khi port).
- CSS: class prefix `el-`, tokens `global-colors.css` (primary/radius), 3 breakpoint 1440/768/390, không lib ngoài.
- JS (nếu có): qua `data-el-*` trong `elements.js`, không inline `onclick`.
- Mỗi file giữ comment `PORT:` = shortcode Flatsome tương ứng + attrs gợi ý.

## 2. Chi tiết từng element (36)

### Batch 1 — Layout nền (7) — trạng thái: xong demo, chờ skin live

| # | Element | Variants đã có | Còn thiếu cho live |
|---|---|---|---|
| 1 | Sections | full/boxed/bg/padding | map padding Flatsome (`padding_top/bottom`) |
| 2 | Rows / Columns | cols 1–6, gap, valign | giữ nguyên (native `[row]/[col]`) |
| 3 | Sliders | arrows/dots/autoplay + vòng progress | autoplay mặc định theo UX (hiện 4s) |
| 4 | Banners | trái/giữa/phải, overlay, hover zoom | ảnh thật thay `.ph` |
| 5 | Typography | h1–h6/lead/quote/small | ép font Be Vietnam Pro |
| 6 | Buttons | solid/outline/dark, sm/md/lg, round | màu amber + chữ tối (skin) |
| 7 | Titles / Dividers | 3 kiểu title, 5 divider | vạch primary |

### Batch 2 — Content (16) — trạng thái: xong demo, cần JS đã có

| # | Element | Tương tác | Port live |
|---|---|---|---|
| 8 | Blog Posts | không | native `[blog_posts]` + skin card |
| 9 | Images | hover zoom (CSS) | native `[ux_image]` |
| 10 | Video | iframe embed | native `[ux_video]`, giới hạn domain |
| 11 | Galleries | lightbox (`data-full`) | native `[ux_gallery]` |
| 12 | Video Button | lightbox video (`data-video`) | native `[ux_video_button]` |
| 13 | Banner Grids | không | native `[ux_banner_grid]` 2–4 cols |
| 14 | Icon Box | không | native `[featured_box]` + icon tròn primary |
| 15 | Image Box | không | native `[ux_image_box]` |
| 16 | Lightbox | overlay chung, Esc/backdrop | native `[ux_lightbox]` (đã harden XSS: allowlist youtube/vimeo) |
| 17 | Scroll To | smooth CSS | native `[scroll_to]` |
| 18 | Message box | không | map 4 màu feedback global |
| 19 | Tabs | `data-el-tabs` (ngang/dọc) | native `[tabgroup]` |
| 20 | Team Member | không | native `[team_member]` |
| 21 | Testimonials | không (grid tĩnh) | native `[testimonials]` slider |
| 22 | Countdown | `data-el-countdown` + `data-end` | native `[ux_countdown date]` |
| 23 | Accordion | `<details>` native | native `[accordion]` |

### Batch 3 — Commerce & nâng cao (13)

| # | Element | Tương tác | Port live |
|---|---|---|---|
| 24 | Product Categories | slider `data-el-resp` 5/4/3/2/2 | native `[ux_product_categories]` (slider) |
| 25 | Products | card demo6 (hover đổi ảnh, actions, sao) | native box + `skin-flatsome.css` |
| 26 | Share / follow | không | native `[share]/[follow]` |
| 27 | Logo | không | native `[logo]` + custom_logo |
| 28 | Instagram feed | không | native `[ux_instagram_feed]` (cần token) |
| 29 | Search box | lọc live `data-el-search` | native `[search]` + AJAX |
| 30 | Price table | không | native `[price_table]` + cột nổi bật |
| 31 | Forms | submit giả `data-el-form` | Fluent Forms + `form_id` (xóa fake khi có form thật) |
| 32 | Portfolio | lọc `data-el-filter` | native `[ux_portfolio]` |
| 33 | Pages | không | `wp_list_pages` |
| 34 | Map | placeholder | iframe Google Maps + key |
| 35 | Hotspot | pins `data-el-hotspot` | native `[ux_hotspot]` |
| 36 | Flip Book | lật 3D `data-el-flip` | custom — port nguyên cụm khi có nhu cầu thật |

## 3. Lộ trình

1. **Chuẩn hóa demo (1 lượt):** rà 36 file theo spec §1 (alt/aria/breakpoint), sửa lệch.
2. **Skin live theo Batch 1→3:** mỗi element = CSS skin native + test trên trang nháp Builder.
3. **Thay ảnh thật:** `.ph` → media (SP/danh mục xong; còn blog/banners).
4. **Dọn:** form fake, countdown demo, placeholder khi data thật phủ hết.

## 4. Acceptance

- [ ] 36 file pass spec §1 (checklist từng file).
- [ ] Mỗi element có cặp demo tĩnh ↔ native live tương đương visual.
- [ ] Không shortcode raw, không JS lỗi, responsive 3 breakpoint.
