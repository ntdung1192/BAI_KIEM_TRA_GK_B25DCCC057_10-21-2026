# MiniBlog

Blog nhỏ làm bằng React + TypeScript (Vite). Dữ liệu lấy từ https://jsonplaceholder.typicode.com

## Chạy

```
npm install
npm run dev
```

Mở http://localhost:5174 — đăng nhập: `admin` / `123456`

## Có gì

- Danh sách bài viết, tìm theo tiêu đề (từ khóa được tô vàng, lưu trên URL nên tải lại không mất), chia trang
- Xem bài viết: tên tác giả, thời gian đọc, bình luận
- Trạng thái đang tải và báo lỗi, có nút tải lại
- Đăng nhập / đăng xuất, có ô "Ghi nhớ đăng nhập"; trang viết bài phải đăng nhập mới vào được
- Viết bài có kiểm tra dữ liệu và xem trước, bài lưu vào localStorage, có thể xóa bài của mình
- Trang 404

## Cấu trúc

```
src/
  components/   Layout, PrivateRoute, Pager, Feedback (loading / lỗi)
  context/      AuthContext
  hooks/        useFetch, useAuth
  pages/        HomePage, PostPage, LoginPage, WritePage, NotFoundPage
  services/     storage.ts (localStorage)
```
