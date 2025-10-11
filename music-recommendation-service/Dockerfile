# Dockerfile cho Service Python (Phiên bản đơn giản)

# Sử dụng image Python chính thức, phiên bản 3.9
FROM python:3.9-slim

# Cài đặt các công cụ build cần thiết cho scikit-surprise
RUN apt-get update && apt-get install -y gcc g++ build-essential

# Set thư mục làm việc bên trong container
WORKDIR /app

# Copy file requirements và cài đặt các thư viện
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy toàn bộ code của service Python vào
COPY . .

# --- THÊM DÒNG NÀY ĐỂ SỬA LỖI ---
# Tạo sẵn thư mục /app/model để script train.py có thể lưu file vào
RUN mkdir -p /app/model

# Command mặc định (có thể bị docker-compose ghi đè, nhưng là good practice)
CMD ["flask", "run", "--host=0.0.0.0", "--port=5001"]

