# Sử dụng base image Debian để có sẵn cron
FROM python:3.9-slim-bullseye

# Cài đặt cron VÀ các công cụ build cần thiết (gcc, g++, build-essential)
RUN apt-get update && apt-get install -y cron gcc g++ build-essential

# Đặt thư mục làm việc
WORKDIR /app

# Copy file requirements và cài đặt dependencies trước để tận dụng cache
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy toàn bộ code của service vào (app.py, train.py, crontab, ...)
COPY . .

# Copy file crontab vào đúng vị trí của hệ thống
COPY crontab /etc/cron.d/training-cron

# Cấp quyền đúng cho file crontab
RUN chmod 0644 /etc/cron.d/training-cron

# Tạo thư mục và file log để tiện theo dõi
RUN mkdir -p /app/model
RUN touch /var/log/cron.log

# Command mặc định để khởi động cron ở foreground.
# Service `model-trainer` sẽ chạy command này.
# Service `recommendation-service` sẽ ghi đè nó để chạy `python app.py`.
CMD ["cron", "-f"]