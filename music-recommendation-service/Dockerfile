# Dockerfile cho Service Python

# Sử dụng image Python chính thức, phiên bản 3.9
FROM python:3.9-slim

# Set thư mục làm việc bên trong container
WORKDIR /app

# Copy file requirements và cài đặt các thư viện
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy toàn bộ code của service Python (app.py, train.py, model.dump, v.v.) vào
COPY . .

# --- LỆNH KHỞI ĐỘNG THÔNG MINH ---
# Khi server khởi động, nó sẽ chạy `train.py` để tạo file model.dump mới nhất,
# SAU ĐÓ mới chạy server Gunicorn để phục vụ API.
# $PORT là biến môi trường do Render tự động cung cấp.
CMD python train.py && gunicorn --bind 0.0.0.0:$PORT app:app