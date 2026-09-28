# Triển khai backend Kiln lên FastAPI Cloud — hướng dẫn chi tiết

> Tài liệu này viết lại và mở rộng từ Quick Start chính thức của FastAPI Cloud (fastapicloud.com/docs), điều chỉnh cho đúng bối cảnh project của bạn: backend API đứng sau trang demo tĩnh `index.html` đã dựng ở phần trước. Nếu cần bản gốc đầy đủ, tham khảo trực tiếp tại `https://fastapicloud.com/docs/getting-started/`.

## 0. FastAPI Cloud có phù hợp không?

Trước khi bắt đầu, một lưu ý quan trọng đã nêu ở phần trước: FastAPI Cloud hiện đang **miễn phí toàn bộ vì còn trong giai đoạn phát triển**, do chính team tạo ra FastAPI xây dựng. Điều đó nghĩa là:

- Phù hợp: demo, POC, môi trường thử nghiệm trước stakeholder — đúng mục đích bạn đang làm với trang Kiln.
- Chưa phù hợp: cam kết uptime production thật, vì nhiều tính năng còn đang hoàn thiện.
- Vì free có thể đổi chính sách bất kỳ lúc nào (đang ở giai đoạn beta), nên đây là **kế hoạch demo nhanh**, không phải kế hoạch hạ tầng dài hạn. Nếu sau này cần production, cân nhắc Google Cloud Run hoặc Render đã so sánh ở phần trước.

## 1. Yêu cầu trước khi bắt đầu

| Cần | Vì sao |
|---|---|
| `uv` đã cài (`https://docs.astral.sh/uv/getting-started/installation/`) | Dùng để scaffold project và chạy môi trường ảo không cần activate thủ công |
| Python phiên bản còn được hỗ trợ chính thức (`devguide.python.org/versions`) | Nếu không dùng `uv`, cần Python hệ thống đủ mới |
| Tài khoản FastAPI Cloud | Cần để `fastapi deploy` xác thực qua trình duyệt ở bước 3 |

Nếu team bạn không dùng `uv`, có thể dùng `pip` + `venv` như bình thường — chỉ riêng lệnh scaffold ở bước 1 là tiện lợi hơn khi có `uv`, không bắt buộc.

## 2. Tạo project

### Cách nhanh — dùng `fastapi-new`

```bash
uvx fastapi-new kiln-api
cd kiln-api
```

Lệnh này tự sinh cấu trúc project cơ bản (một app FastAPI mẫu + file cấu hình), và tự thêm `fastapi[standard]` vào dependency — gói này đã gồm CLI của FastAPI Cloud, nên không cần cài thêm gì để deploy ở bước sau.

Mặc định, `fastapi-new` lấy phiên bản Python toàn cục bạn đã pin bằng `uv`. Muốn chỉ định phiên bản khác:

```bash
uvx fastapi-new kiln-api --python 3.11
cd kiln-api
```

### Cách thủ công — tự dựng cấu trúc

Nếu muốn kiểm soát cấu trúc project (ví dụ để khớp với `packages/*` trong kiến trúc monorepo đã mô tả ở `DEVELOPMENT_WORKFLOW.md`), tự tạo:

```
kiln-api/
├── app/
│   └── main.py
├── pyproject.toml
└── .venv/          # tạo bằng `uv venv` hoặc `python -m venv`
```

Trong `pyproject.toml`, thêm `fastapi[standard]` vào phần dependencies — gói này mang theo CLI deploy, nên bỏ qua bước này sẽ không có lệnh `fastapi deploy` ở bước 3.

### Kích hoạt môi trường ảo

| Hệ điều hành | Lệnh |
|---|---|
| Linux / macOS | `source .venv/bin/activate` |
| Windows PowerShell | `.venv\Scripts\Activate.ps1` |
| Windows (Git Bash) | `source .venv/Scripts/activate` |

Nếu dùng `uv`, có thể **bỏ qua việc activate** và thêm tiền tố `uv run` trước mọi lệnh — ví dụ `uv run fastapi dev` để chạy local, `uv run fastapi deploy` để deploy. Cách này tiện khi nhiều người trong team dùng shell khác nhau, không cần nhớ activate theo từng OS.

## 3. Gắn API vào cấu trúc demo Kiln

Trang tĩnh đã có (`index.html`, `css/styles.css`, `js/scripts.js`) hiện chưa gọi API nào — mọi dữ liệu trong `preview-body`, `code-panel` đều là nội dung tĩnh viết sẵn. Để nối vào backend thật, gợi ý cấu trúc `app/main.py` tối thiểu:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Kiln API")

# Cho phép trang tĩnh (mở từ file hoặc từ domain khác) gọi API này.
# Thu hẹp allow_origins lại thành domain thật khi lên production.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health():
    return {"status": "ok"}

@app.post("/api/workflows/{workflow_id}/run")
def run_workflow(workflow_id: str):
    # Thay bằng logic thật; đây chỉ là stub để demo có phản hồi thật
    return {"workflow_id": workflow_id, "status": "succeeded", "steps_run": 3}
```

Đây là stub tối thiểu để `js/scripts.js` có endpoint thật để gọi (ví dụ khi bấm nút "Start building" trong demo), tránh tình trạng nút bấm không dẫn tới đâu — đúng nguyên tắc "clarity before cleverness" đã áp trong `DEVELOPMENT_WORKFLOW.md`.

## 4. Chạy thử ở local trước khi deploy

```bash
fastapi dev
```

hoặc nếu dùng `uv` mà chưa activate:

```bash
uv run fastapi dev
```

Kiểm tra `http://127.0.0.1:8000/docs` hoạt động đúng trước khi deploy — deploy một API chưa chạy được ở local sẽ chỉ mang lỗi đó lên cloud.

## 5. Deploy

```bash
fastapi deploy
```

CLI sẽ tự nhận diện app FastAPI trong project và deploy lên cloud. Nếu chưa đăng nhập, trình duyệt sẽ tự mở để bạn xác thực tài khoản FastAPI Cloud. Quá trình deploy hiển thị tiến trình theo từng bước trên terminal; khi hoàn tất, CLI in ra URL public dạng:

```
https://<tên-app>.fastapicloud.dev
```

Ghi lại URL này — đây là địa chỉ backend thật sẽ thay cho dữ liệu tĩnh trong `js/scripts.js` ở bước 6.

**Nếu dùng editor có extension FastAPI Cloud:** có thể deploy trực tiếp bằng lệnh "Deploy Application" trong extension, không cần rời khỏi editor.

## 6. Nối frontend tĩnh vào API vừa deploy

Trong `js/scripts.js`, thêm một lệnh gọi tới URL vừa có được, ví dụ khi người dùng bấm nút "Start building":

```javascript
const API_BASE = "https://<tên-app>.fastapicloud.dev";

async function runDemoWorkflow() {
  const res = await fetch(`${API_BASE}/api/workflows/onboarding/run`, {
    method: "POST",
  });
  return res.json();
}
```

Nhớ thay `allow_origins=["*"]` ở bước 3 thành domain thật (ví dụ domain host `index.html`) trước khi chia sẻ demo rộng hơn nội bộ — để hở `*` chỉ nên dùng tạm trong lúc test.

## 7. Xem API docs

FastAPI tự sinh tài liệu tương tác. Truy cập:

```
https://<tên-app>.fastapicloud.dev/docs
```

để thử trực tiếp từng endpoint không cần viết code gọi thử.

## 8. Theo dõi log

1. Vào dashboard: `https://dashboard.fastapicloud.com/`
2. Mở mục **Apps** ở sidebar bên trái.
3. Chọn app vừa deploy.
4. Vào tab **Logs** để xem log thời gian thực.

Việc theo dõi log này khớp với nguyên tắc "bằng chứng hơn lời khẳng định" trong `DEVELOPMENT_WORKFLOW.md` — trước khi báo "demo chạy ổn" cho ai, kiểm log thật thay vì chỉ nhìn UI.

## 9. Nếu gặp lỗi

Tham khảo trang troubleshooting chính thức: `https://fastapicloud.com/docs/troubleshooting-and-faqs`. Vài lỗi thường gặp khi mới deploy:

- **App chạy local được nhưng deploy lỗi:** thường do thiếu biến môi trường — FastAPI Cloud không tự copy file `.env` local lên cloud, cần khai báo biến môi trường riêng trong dashboard.
- **CORS bị chặn khi gọi từ `index.html` mở trực tiếp bằng `file://`:** một số trình duyệt chặn `fetch` từ file cục bộ sang domain khác dù đã cho phép CORS ở server. Giải pháp: chạy `index.html` qua một local server đơn giản (`python -m http.server`) thay vì mở file trực tiếp.

## 10. Việc cần làm tiếp, không nằm trong quick start

Quick start chính thức dừng ở "deploy thành công". Với project demo Kiln, còn vài việc nên làm thêm trước khi gửi link cho người khác xem:

- [ ] Thu hẹp `allow_origins` từ `"*"` về domain thật.
- [ ] Thêm biến môi trường (API key, DB URL nếu có) qua dashboard, không hard-code trong code.
- [ ] Test endpoint `/api/health` từ máy khác (không phải máy vừa deploy) để chắc chắn URL public thật sự truy cập được.
- [ ] Ghi lại URL deploy vào README của project, vì đây là free-beta — không nên tin URL này ổn định mãi mãi mà không có kế hoạch chuyển sau này (xem mục 0).
