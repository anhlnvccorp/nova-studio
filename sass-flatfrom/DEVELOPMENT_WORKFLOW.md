# Quy trình phát triển (v2)

> **Triết lý:** TDD trước tiên · Làm việc có hệ thống thay vì đoán mò · Giảm độ phức tạp · Ưu tiên bằng chứng hơn lời khẳng định

> **Đổi so với v1:** khi rà lại `BACKLOG.md`, phát hiện DoR của backlog yêu cầu visual regression snapshot ở tầng component — mâu thuẫn với hướng dẫn TDD ở §5 dưới đây. Bản v2 này **giữ nguyên** hướng dẫn gốc (không snapshot pixel ở tầng component) và làm rõ thành một chính sách tường minh ở phần "Vòng đời component", để hai tài liệu không còn nói hai điều khác nhau. Ngoài ra bổ sung một mục nhỏ về consent/tracking dưới nguyên tắc "Trust is a feature" (§3), vì backlog có epic bắn CTA-tracking nhưng tài liệu này chưa nói gì về cơ sở pháp lý cho việc đó.

---

## Nguyên tắc nền tảng

Bốn nguyên tắc dưới đây áp dụng cho **mọi** bước trong quy trình. Khi có mâu thuẫn giữa quy trình và nguyên tắc, nguyên tắc thắng.

| Nguyên tắc | Nghĩa là gì trong thực tế | Vi phạm điển hình |
|---|---|---|
| **TDD** | Không có dòng code production nào được viết trước khi có một test đang FAIL vì đúng lý do | "Viết code trước, test bổ sung sau" |
| **Có hệ thống, không đoán mò** | Mỗi thay đổi bắt nguồn từ một giả thuyết được ghi ra và được kiểm chứng | Sửa lung tung cho đến khi hết lỗi |
| **Giảm độ phức tạp** | Giải pháp đơn giản nhất vượt qua test là giải pháp đúng | Thêm abstraction "phòng khi cần sau này" |
| **Bằng chứng > lời khẳng định** | "Đã xong" phải kèm output test, log, diff hoặc số đo | "Tôi đã kiểm tra rồi, chạy ổn" |

**Quy tắc bằng chứng:** mọi khẳng định về trạng thái code đều phải kèm artifact có thể kiểm chứng lại được. Không có artifact = chưa xong.

---

## Sơ đồ tổng thể

```
1. brainstorming                 → làm rõ ý tưởng, chốt phạm vi
        ↓
2. using-git-worktrees           → tạo workspace tách biệt
        ↓
3. writing-plans                 → chia nhỏ thành các đơn vị kiểm chứng được
        ↓
4. subagent-driven-development   → triển khai
   HOẶC executing-plans
        ↓  (vòng lặp nội tại cho từng task)
5. test-driven-development       → RED → GREEN → REFACTOR
        ↓
6. requesting-code-review        → kiểm tra chất lượng
        ↓
7. finishing-a-development-branch → merge, dọn dẹp, đóng nhánh
```

Các bước **không** được phép nhảy cóc. Nếu một bước lộ ra rằng bước trước sai, quay ngược lại bước đó thay vì vá tạm ở bước hiện tại.

---

## Bước 1 — `brainstorming`

**Mục tiêu:** chuyển một yêu cầu mơ hồ thành một phát biểu vấn đề đủ rõ để lập kế hoạch.

**Đầu vào:** yêu cầu thô từ người dùng / stakeholder / issue.

**Hoạt động:**

1. Phát biểu lại vấn đề bằng ngôn ngữ của chính mình và xin xác nhận.
2. Liệt kê các giả định ngầm. Đánh dấu cái nào đã được kiểm chứng, cái nào chưa.
3. Xác định ràng buộc: hiệu năng, dữ liệu, tương thích ngược, thời hạn, phụ thuộc bên ngoài.
4. Đề xuất **tối thiểu 2 hướng tiếp cận** kèm phân tích đánh đổi trung thực (không có hướng nào "hoàn hảo").
5. Chốt tiêu chí thành công **đo được** — câu hỏi phải trả lời được là: *làm sao biết việc này đã xong?*
6. Ghi rõ những gì **không** nằm trong phạm vi.

**Đầu ra:** `docs/brainstorm/<slug>.md` gồm: phát biểu vấn đề, giả định, ràng buộc, các phương án + đánh đổi, phương án được chọn + lý do, tiêu chí thành công, phạm vi loại trừ.

**Điều kiện thoát:**
- [ ] Tiêu chí thành công có thể kiểm chứng bằng máy (test, số đo), không phải bằng cảm nhận
- [ ] Mỗi giả định chưa kiểm chứng đều có kế hoạch kiểm chứng hoặc được chấp nhận rủi ro một cách rõ ràng
- [ ] Đã ghi lý do **loại bỏ** các phương án khác, không chỉ lý do chọn phương án thắng

**Chống mẫu:** nhảy thẳng sang giải pháp; đưa ra một phương án duy nhất rồi biện minh ngược; tiêu chí thành công kiểu "hoạt động tốt hơn".

---

## Bước 2 — `using-git-worktrees`

**Mục tiêu:** cô lập công việc để nhánh chính luôn ở trạng thái chạy được, và để nhiều luồng công việc song song không giẫm chân nhau.

**Hoạt động:**

```bash
# Từ repo chính
git fetch origin
git worktree add ../<repo>-<slug> -b feat/<slug> origin/main

cd ../<repo>-<slug>
# Cài đặt môi trường riêng cho worktree này
cp ../<repo>/.env.example .env        # KHÔNG copy .env thật
<cài dependencies: uv sync / npm ci / composer install>
```

**Quy ước đặt tên nhánh:**

| Tiền tố | Dùng cho |
|---|---|
| `feat/` | Tính năng mới |
| `fix/` | Sửa lỗi |
| `refactor/` | Thay đổi cấu trúc, không đổi hành vi |
| `perf/` | Tối ưu hiệu năng có số đo |
| `chore/` | Hạ tầng, công cụ, phụ thuộc |

**Nguyên tắc:**
- Một worktree = một mục tiêu. Phát sinh việc không liên quan → worktree mới, không nhét chung.
- `.env` và secret **không bao giờ** được copy nguyên trạng giữa các worktree.
- Chạy đầy đủ test suite **ngay sau khi tạo worktree** để có đường cơ sở (baseline) xanh. Nếu baseline đã đỏ, sửa baseline trước — đừng bắt đầu việc mới trên nền đỏ.

**Đầu ra:** worktree sạch, dependencies đã cài, test suite xanh, ghi lại kết quả baseline.

**Điều kiện thoát:**
- [ ] `git status` sạch
- [ ] Baseline test được ghi lại (số test pass/fail, thời gian chạy)

---

## Bước 3 — `writing-plans`

**Mục tiêu:** biến phương án đã chốt thành một danh sách các task nhỏ, có thứ tự, mỗi task kiểm chứng được độc lập.

**Hoạt động:**

1. Chia công việc thành các task, mỗi task ước lượng **dưới nửa ngày**. Task lớn hơn nghĩa là chưa hiểu đủ — quay lại chia tiếp.
2. Với **mỗi** task, ghi rõ:
   - **Mục tiêu** — một câu
   - **File chạm vào** — đường dẫn cụ thể, không phải "các file liên quan"
   - **Test sẽ viết trước** — tên test và điều kiện fail của nó
   - **Định nghĩa hoàn thành** — bằng chứng cụ thể
   - **Phụ thuộc** — task nào phải xong trước
3. Sắp thứ tự sao cho repo **luôn ở trạng thái chạy được** sau mỗi task.
4. Đánh dấu task nào có thể chạy song song (đầu vào cho bước 4 nếu dùng subagent).
5. Ghi các điểm rủi ro: nơi kế hoạch có nhiều khả năng sai nhất.

**Đầu ra:** `docs/plans/<slug>.md` — checklist có thể tick từng dòng.

**Điều kiện thoát:**
- [ ] Mỗi task có test được đặt tên trước khi có code
- [ ] Không task nào ước lượng quá nửa ngày
- [ ] Thứ tự task giữ được test suite xanh ở từng mốc
- [ ] Kế hoạch đủ rõ để **người khác** thực thi mà không cần hỏi lại

**Chống mẫu:** task kiểu "triển khai backend"; kế hoạch mô tả kết quả thay vì các bước; bỏ qua test trong mô tả task.

---

## Bước 4 — Triển khai

Chọn **một** trong hai chế độ tuỳ đặc điểm kế hoạch.

### 4a — `executing-plans` (tuần tự)

Dùng khi: các task phụ thuộc chặt chẽ, phạm vi vừa/nhỏ, cần giữ ngữ cảnh liên tục.

- Thực thi tuần tự theo đúng thứ tự kế hoạch.
- Sau mỗi task: chạy test → commit → tick checklist.
- Mỗi commit tương ứng **một** task. Commit message tham chiếu ID task.
- Kế hoạch sai giữa chừng → **dừng, cập nhật kế hoạch, rồi mới tiếp tục.** Không sửa ngầm trong đầu.

### 4b — `subagent-driven-development` (song song)

Dùng khi: các task độc lập rõ ràng, phạm vi lớn, ranh giới file không chồng lấn.

- Mỗi subagent nhận **một** task với ngữ cảnh khép kín: mục tiêu, file, test, định nghĩa hoàn thành.
- Không giao hai subagent chạm cùng một file trong cùng một đợt.
- Subagent **phải** trả về bằng chứng: diff + output test. Báo cáo không có bằng chứng bị coi là chưa hoàn thành.
- Tích hợp tuần tự: gộp từng kết quả một, chạy full suite sau mỗi lần gộp.
- Xung đột giữa các kết quả → quay lại bước 3, tách task lại cho đúng.

**Điều kiện thoát (cả hai chế độ):**
- [ ] Mọi task trong kế hoạch đã tick
- [ ] Full test suite xanh
- [ ] Lịch sử commit sạch, mỗi commit là một đơn vị logic
- [ ] Mọi sai lệch so với kế hoạch đã được ghi lại vào file kế hoạch

---

## Bước 5 — `test-driven-development`

Đây là **vòng lặp bên trong** của bước 4, áp dụng cho từng task. Không phải một giai đoạn riêng diễn ra sau khi code xong.

### RED

1. Viết **một** test mô tả hành vi mong muốn.
2. Chạy test. Nó **phải** fail.
3. **Đọc thông báo lỗi.** Nó fail có đúng lý do không? Fail vì import sai hay typo là test hỏng, không phải RED hợp lệ.
4. Ghi lại output fail — đây là bằng chứng RED.

> Nếu test pass ngay từ đầu: hoặc hành vi đã tồn tại (bỏ task này), hoặc test không kiểm tra gì cả (viết lại).

### GREEN

1. Viết lượng code **tối thiểu** để test pass. Xấu cũng được ở giai đoạn này.
2. Chạy test. Pass.
3. Chạy **toàn bộ** suite. Không được có regression.
4. Ghi lại output pass.

> Không thêm chức năng nào test không yêu cầu. Cần chức năng khác → viết test khác.

### REFACTOR

1. Dọn code: đặt tên, xoá trùng lặp, gỡ abstraction thừa.
2. Chạy test sau **mỗi** thay đổi nhỏ. Luôn giữ xanh.
3. Hành vi không được đổi. Đổi hành vi = quay lại RED.

**Commit** ở cuối mỗi vòng REFACTOR xanh.

**Điều kiện thoát mỗi vòng:**
- [ ] Có bằng chứng RED: output test fail kèm lý do fail đúng
- [ ] Có bằng chứng GREEN: output test pass + full suite xanh
- [ ] Đã refactor, hoặc ghi rõ lý do không cần refactor

**Chống mẫu:** viết test sau code; test giả (`assert True`, mock đến mức không kiểm tra gì); bỏ qua RED vì "chắc chắn nó sẽ fail"; refactor trong lúc suite đang đỏ.

---

## Bước 6 — `requesting-code-review`

**Mục tiêu:** phát hiện vấn đề mà test không bắt được — độ phức tạp thừa, sai lệch thiết kế, khoảng trống bảo mật.

**Trước khi mở review, tự kiểm tra:**

```bash
git diff origin/main...HEAD --stat    # Phạm vi có khớp kế hoạch không?
<lệnh chạy full test suite>
<lệnh lint / typecheck / format>
```

**Nội dung mô tả review — bắt buộc có:**

1. **Vấn đề** đã giải quyết, link tới file brainstorm
2. **Phương án** đã chọn và các phương án bị loại
3. **Bằng chứng:** output test, số đo trước/sau nếu là công việc hiệu năng
4. **Vùng rủi ro:** phần nào reviewer nên soi kỹ nhất
5. **Nợ kỹ thuật** cố ý để lại và lý do

**Checklist cho reviewer:**

- [ ] Test có thật sự fail nếu gỡ bỏ phần code tương ứng không?
- [ ] Có abstraction nào chưa được sử dụng ở hiện tại không?
- [ ] Có đường thực thi nào đơn giản hơn cho cùng kết quả không?
- [ ] Input từ bên ngoài đã được validate chưa?
- [ ] Lỗi được xử lý hay bị nuốt?
- [ ] Phạm vi diff có khớp phạm vi kế hoạch không? Có gì bị nhét thêm?
- [ ] Tài liệu đã cập nhật theo hành vi mới chưa?

**Quy tắc phản hồi:** mọi góp ý đều được xử lý — hoặc sửa, hoặc trả lời bằng lập luận có bằng chứng. Không có góp ý nào bị bỏ qua im lặng.

**Điều kiện thoát:**
- [ ] Mọi góp ý chặn (blocking) đã xử lý
- [ ] CI xanh trên commit cuối
- [ ] Nợ kỹ thuật còn lại đã được ghi thành issue, không để trong đầu

---

## Bước 7 — `finishing-a-development-branch`

**Mục tiêu:** đóng nhánh sạch sẽ, không để lại rác trong repo cũng như trong máy làm việc.

**Trình tự:**

```bash
# 1. Đồng bộ với main mới nhất
git fetch origin
git rebase origin/main          # hoặc merge, theo quy ước của repo

# 2. Xác minh lại sau khi rebase — bắt buộc, không bỏ qua
<full test suite>
<lint / typecheck>

# 3. Dọn lịch sử commit nếu cần
git rebase -i origin/main

# 4. Merge (theo quy ước repo: squash / merge commit / fast-forward)

# 5. Dọn worktree
cd ../<repo>
git worktree remove ../<repo>-<slug>
git branch -d feat/<slug>
git push origin --delete feat/<slug>
git worktree prune
```

**Trước khi đóng:**

- [ ] Kế hoạch đã tick hết; các mục bị bỏ được ghi rõ lý do
- [ ] Tài liệu (README, docs, CHANGELOG) đã phản ánh hành vi mới
- [ ] Cờ tính năng, code tạm, log debug đã gỡ
- [ ] Migration đã chạy thử trên dữ liệu giống production
- [ ] Rollback plan đã được ghi ra
- [ ] Nợ kỹ thuật còn lại đã thành issue có chủ

**Hồi cứu ngắn** (ghi vào cuối file kế hoạch, 5 phút):

1. Chỗ nào kế hoạch sai và sai vì sao?
2. Task nào ước lượng lệch nhiều nhất?
3. Test nào đáng lẽ phải bắt được lỗi nhưng đã không bắt được?
4. Một điều sẽ làm khác ở lần sau.

---

## Khi nào được rút gọn quy trình

Quy trình đầy đủ dành cho công việc thay đổi hành vi hệ thống. Các trường hợp rút gọn hợp lệ:

| Loại công việc | Bước bắt buộc | Bước có thể bỏ |
|---|---|---|
| Sửa typo, đổi nội dung tĩnh | 2, 7 | 1, 3, 4, 5, 6 |
| Hotfix production | 2, 5, 6, 7 | 1, 3 (viết kế hoạch **sau** khi đã chữa cháy) |
| Nâng phiên bản dependency | 2, 5 (regression test), 6, 7 | 1, 3 |
| Spike / nghiên cứu khả thi | 1, 2 | 3–7 — **bắt buộc vứt bỏ code spike**, không merge |

Mọi trường hợp khác: chạy đủ bảy bước.

---

## Tham chiếu nhanh

```
brainstorming                → tiêu chí thành công đo được + ≥2 phương án
using-git-worktrees          → workspace cô lập + baseline xanh
writing-plans                → task < nửa ngày, có test đặt tên trước
executing-plans              → tuần tự, 1 commit / 1 task
subagent-driven-development  → song song, bắt buộc nộp bằng chứng
test-driven-development      → RED (fail đúng lý do) → GREEN (tối thiểu) → REFACTOR (xanh)
requesting-code-review       → bằng chứng + vùng rủi ro + xử lý hết góp ý
finishing-a-dev-branch       → rebase, xác minh lại, dọn worktree, hồi cứu
```

**Câu hỏi kiểm tra ở mọi bước:** *Bằng chứng cho khẳng định này nằm ở đâu?*

---

# Nguyên tắc thiết kế sản phẩm

Sáu nguyên tắc dưới đây chi phối mọi quyết định UI/UX. Chúng đứng song song với bốn nguyên tắc kỹ thuật ở đầu tài liệu và được áp dụng từ bước `brainstorming`, không phải ở khâu "làm đẹp" cuối cùng.

## 1. Clarity before cleverness

User phải hiểu **trạng thái hiện tại**, **hành động tiếp theo** và **hậu quả của hành động** trước khi nhìn thấy animation đẹp.

- Thứ tự ưu tiên khi thiết kế một màn hình: trạng thái → hành động → hậu quả → thẩm mỹ.
- Animation chỉ được phép giải thích sự thay đổi (từ đâu đến đâu), không được che giấu độ trễ.
- Nếu phải viết tooltip để giải thích một control, control đó đang sai — sửa control, đừng thêm tooltip.

**Kiểm tra:** một user mới nhìn màn hình trong 5 giây có nói được "hệ thống đang ở trạng thái gì" và "tôi bấm cái gì tiếp theo" không?

## 2. Progressive disclosure

Default phải đơn giản. Cấu hình nâng cao nằm trong `Advanced`, drawer, side panel hoặc route riêng.

| Tầng | Chứa gì | Nơi đặt |
|---|---|---|
| Tầng 1 | Thứ 80% user cần trong 80% trường hợp | Ngay trên màn hình chính |
| Tầng 2 | Tuỳ chỉnh thường gặp | `Advanced` collapse / drawer |
| Tầng 3 | Cấu hình hiếm, nguy hiểm, không thể hoàn tác | Route riêng, có bước xác nhận |

- Mỗi option thêm vào tầng 1 phải chứng minh được tần suất sử dụng, không phải "phòng khi cần".
- Giá trị default phải an toàn: chọn default sao cho user bỏ qua toàn bộ cấu hình vẫn ra kết quả đúng.

## 3. Trust is a feature

Với SaaS B2B, **không che giấu trạng thái**. Các trạng thái bắt buộc phải hiển thị được:

- **Loading** — phân biệt rõ "đang tải lần đầu" (skeleton) với "đang làm mới" (indicator không chặn nội dung cũ)
- **Sync** — lần đồng bộ cuối lúc nào, đang chờ gì, dữ liệu đang xem là cũ hay mới
- **Permission** — vì sao một hành động bị khoá, ai có quyền cấp, đường dẫn để xin quyền
- **Billing** — hạn mức hiện tại, phần đã dùng, chuyện gì xảy ra khi vượt
- **Deployment** — phiên bản đang chạy, thời điểm deploy, trạng thái rollout
- **Audit** — ai đã làm gì, lúc nào, thay đổi giá trị từ đâu sang đâu
- **Error** — chuyện gì hỏng, hệ quả là gì, user làm gì tiếp theo, mã lỗi để đưa cho support

**Chống mẫu:** nút disabled không giải thích lý do; toast "Something went wrong"; ẩn hạn mức cho đến khi user chạm trần; optimistic UI không có đường lùi khi request thất bại.

**Consent & tracking là một phần của Trust, không phải việc riêng của marketing [v2 — bổ sung]:** bất kỳ event tracking nào (click CTA, signup start, page view) đều là một hành động thu thập dữ liệu — cùng logic với Audit ở trên: user phải biết ai đang xem gì. Trước khi bắn event đầu tiên trong một luồng, phải có:

- Consent banner hoặc cơ sở pháp lý (legitimate interest) đã xác định, đặc biệt với traffic EU (GDPR).
- Đường tắt để user rút lại consent, không chỉ để cho.
- Không bắn event nào trước khi điều kiện trên thoả — kể cả ở môi trường staging, vì log staging vẫn là dữ liệu thật nếu domain public.

## 4. Dense when working, spacious when deciding

M��t độ thông tin là hàm của ngữ cảnh, không phải một hằng số toàn hệ thống.

| Ngữ cảnh | Chế độ | Đặc điểm |
|---|---|---|
| Marketing, onboarding, empty state, pricing | **Spacious** | Nhiều khoảng thở, cỡ chữ lớn, một hành động chính mỗi màn |
| Dashboard, table, editor, ops screen, log viewer | **Dense** | Row height thấp, cỡ chữ nhỏ hơn, nhiều dữ liệu trong một tầm nhìn |

- Cùng một token scale, khác nhau ở **density multiplier** — không fork component.
- Màn hình dense vẫn phải giữ target size tối thiểu ở mục 6; tăng mật độ không được đánh đổi bằng khả năng bấm trúng.
- Cho phép user chuyển density trên các bảng lớn (comfortable / compact), lưu theo người dùng.

## 5. One semantic role, one visual contract

M��t màu không được "vừa là warning, vừa là CTA, vừa là tag". Một component không được "vừa là card, vừa là button, vừa là menu".

**Với màu:**

```
color.intent.primary      → chỉ dành cho hành động chính
color.intent.danger       → chỉ dành cho hành động phá huỷ / lỗi
color.intent.warning      → chỉ dành cho cảnh báo cần chú ý
color.intent.success      → chỉ dành cho xác nhận thành công
color.surface.*           → nền, không bao giờ mang ý nghĩa trạng thái
```

**Với component:**

- Card không nhận `onClick` toàn khối. Cần bấm được → đặt một link/button rõ ràng bên trong.
- Component nào cũng có **một** trách nhiệm được ghi trong docs. Prop mới làm lệch trách nhiệm đó → tạo component mới.
- Không có prop kiểu `variant="secondary-ghost-link-icon"` — dấu hiệu đang gộp nhiều vai trò.

**Kiểm tra:** nhìn một màu hoặc một component bất kỳ và nói được duy nhất một ý nghĩa. Nếu phải trả lời "tuỳ chỗ", hợp đồng đã vỡ.

## 6. Accessible by construction

Accessibility nằm trong **token và primitive**, không phải việc sửa ở cuối sprint.

**Ngưỡng áp dụng:**

| Hạng mục | Ngưỡng | Nguồn |
|---|---|---|
| Tương phản chữ thường | 4.5:1 | WCAG 2.2 — 1.4.3 (AA) |
| Tương phản chữ lớn (≥18.66px bold / ≥24px) | 3:1 | WCAG 2.2 — 1.4.3 (AA) |
| Tương phản thành phần UI và đồ hoạ (gồm focus indicator) | 3:1 | WCAG 2.2 — 1.4.11 (AA) |
| Diện tích focus indicator | ≥ chu vi 2 CSS px bao quanh, tương phản 3:1 so với trạng thái chưa focus | WCAG 2.2 — 2.4.13 (AAA) |
| Target size tối thiểu | 24×24 CSS px | WCAG 2.2 — 2.5.8 (AA) |
| Target size cho touch UI | 44×44 CSS px — mục tiêu thực tế | WCAG 2.2 — 2.5.5 (AAA) |

> Lưu ý về mức tuân thủ: `2.5.8` (24×24) là **AA** và là ngưỡng bắt buộc. `2.4.13 Focus Appearance` và `2.5.5 Target Size (Enhanced)` (44×44) thuộc mức **AAA** — chọn chúng là quyết định sản phẩm, không phải nghĩa vụ pháp lý ở mức AA. Tài liệu này chọn 44×44 cho touch UI vì chi phí thấp và lợi ích đo được.

**Ép ở tầng hạ tầng:**

- Token màu sinh ra kèm **contrast pair đã tính sẵn**; build fail nếu một cặp foreground/background dưới ngưỡng.
- Primitive `Button`, `IconButton`, `Checkbox` có `min-height`/`min-width` mặc định đạt ngưỡng target size — không thể vô tình tạo nút 16px.
- Focus ring là một token dùng chung (`focus.ring.*`), không viết lại ở từng component; cấm `outline: none` nếu không có thay thế tương đương.
- Mọi component interactive đi kèm test keyboard trong Storybook: tab order, Enter/Space, Escape.

**Kiểm tra tự động trong CI:** axe-core trên Storybook stories + script `validate-tokens.mjs` kiểm tra tương phản.

---

# Kiến trúc hệ thống

Đề xuất **monorepo** để marketing, dashboard, docs và shared UI phát triển độc lập nhưng không bị lệch brand.

```text
saas-platform/
├── apps/
│   ├── web/                         # Marketing: Vite/Next.js
│   ├── app/                         # Product dashboard
│   ├── docs/                        # Documentation portal
│   └── storybook/                   # Visual catalog
│
├── packages/
│   ├── tokens/                      # DTCG JSON + generated CSS/TS
│   ├── ui/                          # Headless + styled shared primitives
│   ├── icons/                       # Icon wrapper, app icons
│   ├── charts/                      # Dashboard chart patterns
│   ├── config/                      # ESLint, Tailwind, TS configs
│   └── utils/                       # cn(), formatters, a11y helpers
│
├── tooling/
│   ├── scripts/
│   │   ├── build-tokens.mjs
│   │   └── validate-tokens.mjs
│   └── generators/
│       └── component-generator/
│
├── docs/
│   ├── design-principles.md
│   ├── content-style.md
│   ├── accessibility.md
│   ├── component-status.md
│   └── contribution-guide.md
│
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

## Đánh đổi của monorepo

| Được | Mất |
|---|---|
| Một nguồn sự thật cho token → không lệch brand giữa marketing và app | Thời gian CI tăng; cần caching (`turbo`) để không chờ toàn bộ build |
| Thay đổi primitive thấy ngay tác động lên mọi app trong cùng một PR | Blast radius lớn — một PR hỏng `packages/ui` chặn cả ba app |
| Refactor xuyên package trong một commit nguyên tử | Quyền truy cập khó phân tách nếu có agency/contractor bên ngoài |
| Không cần publish/version nội bộ cho đến khi thực sự cần | Onboarding nặng hơn: dev phải cài toàn bộ workspace |

**Điều kiện để lựa chọn này còn đúng:** cả ba app cùng một team hoặc cùng một nhóm quyền. Nếu marketing được giao cho agency bên ngoài, tách `apps/web` ra repo riêng và tiêu thụ `packages/tokens` + `packages/ui` qua registry nội bộ — chi phí publish rẻ hơn chi phí quản lý quyền trong monorepo.

## Hướng phụ thuộc

```
apps/*        →  packages/ui  →  packages/tokens
                 packages/charts →  packages/tokens
                 packages/icons
                 packages/utils
```

Quy tắc bất biến:

- **Phụ thuộc chỉ đi một chiều.** `packages/*` không bao giờ import từ `apps/*`.
- `packages/tokens` là lá — không phụ thuộc gì ngoài công cụ build.
- `packages/ui` không chứa logic nghiệp vụ và không gọi API. Cần dữ liệu → nhận qua props.
- Vi phạm hướng phụ thuộc được chặn bằng ESLint rule trong `packages/config`, không dựa vào review thủ công.

## Pipeline token

```
packages/tokens/src/*.json     (DTCG format — nguồn sự thật duy nhất)
        │
        ├─ build-tokens.mjs    → CSS custom properties  → packages/ui
        │                      → TypeScript consts      → apps/*
        │                      → Tailwind theme         → packages/config
        │
        └─ validate-tokens.mjs → kiểm tra tương phản, tên token, giá trị mồ côi
                                 (chạy trong CI, fail = chặn merge)
```

- Token **không bao giờ** được sửa trực tiếp ở file CSS/TS đã sinh ra; các file đó nằm trong `.gitignore` hoặc được đánh dấu generated.
- Mỗi token có `$description` giải thích vai trò ngữ nghĩa — phục vụ nguyên tắc số 5.

## Vòng đời component

`docs/component-status.md` theo dõi trạng thái từng component:

| Trạng thái | Nghĩa | Được dùng trong production? |
|---|---|---|
| `draft` | Đang thiết kế, API chưa ổn định | Không |
| `beta` | API tạm ổn, thiếu test hoặc docs | Có, kèm ghi chú rủi ro |
| `stable` | Đủ test, docs, a11y check | Có |
| `deprecated` | Có thay thế, sẽ gỡ | Không cho code mới |

Component mới tạo bằng `tooling/generators/component-generator` — generator sinh sẵn khung test, story và mục docs, để việc làm đúng rẻ hơn việc làm tắt.

**Chính sách visual regression [v2 — tường minh hoá]:** trạng thái `stable` **không** yêu cầu visual regression snapshot ở tầng component. Lý do: trong giai đoạn token còn đổi (đặc biệt 1–2 sprint đầu khi hệ token vừa dựng), snapshot component vỡ liên tục → dev approve hàng loạt không nhìn → snapshot mất giá trị làm bằng chứng. Thay vào đó:

- Tầng **component**: interaction test (keyboard, role, focus) + axe-core. Đây là điều kiện đủ cho `stable`.
- Tầng **page/section**: 6–8 visual regression snapshot cho các trang/luồng quan trọng nhất, chạy sau khi hệ token đã ổn định (không chạy trong sprint token còn thay đổi hàng ngày).
- Nếu một team đủ lớn để nhiều dev cùng sửa `packages/ui` song song và lo regression chéo giữa các PR: đó là lý do hợp lệ để bật lại snapshot component cho riêng những primitive có rủi ro cao (ví dụ `Button`, `Dialog`) — nhưng phải là quyết định ghi rõ ràng, không phải mặc định cho toàn bộ hệ thống.

## Áp quy trình 7 bước vào kiến trúc này

| Bước | Áp dụng riêng cho monorepo |
|---|---|
| `brainstorming` | Xác định thay đổi thuộc tầng nào: token, primitive, hay app. Thay đổi token có blast radius lớn nhất — cần bằng chứng mạnh nhất |
| `using-git-worktrees` | Một worktree cho cả monorepo; baseline = `turbo run build test lint` xanh trên toàn workspace |
| `writing-plans` | Sắp thứ tự theo hướng phụ thuộc: tokens → ui → apps. Không đảo ngược |
| `executing-plans` / subagent | Ranh giới package là ranh giới subagent tự nhiên — hợp với điều kiện "không chồng lấn file" ở bước 4b |
| `test-driven-development` | Với UI: test hành vi và a11y (role, keyboard, focus), không snapshot pixel. Snapshot pixel là bằng chứng yếu và gãy liên tục |
| `requesting-code-review` | Diff phải kèm link Storybook preview và kết quả axe-core |
| `finishing-a-development-branch` | Cập nhật `docs/component-status.md` trước khi merge; component `beta` không được coi là xong |
