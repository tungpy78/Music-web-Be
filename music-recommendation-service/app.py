# app.py (phiên bản đã sửa lỗi để luôn tải model mới nhất)

import os
import pandas as pd
from flask import Flask, jsonify, request
from surprise import dump
from data_loader import load_data_as_dataframe # Giữ lại hàm này
from pymongo import MongoClient

# --- CÁC KHỞI TẠO TOÀN CỤC (CHỈ CHẠY 1 LẦN) ---
# Kết nối DB và khởi tạo ứng dụng có thể giữ ở ngoài
# vì chúng không thay đổi giữa các lần train.

app = Flask(__name__) # Khởi tạo ứng dụng Flask

MONGO_URI = os.getenv("MONGO_URI", "your_default_mongo_uri_here") # Thêm giá trị mặc định để dễ test
client = MongoClient(MONGO_URI)
db = client.get_default_database()
songs_collection = db['Songs']

# --- BỎ HẾT CÁC PHẦN TẢI DỮ LIỆU VÀ MODEL RA KHỎI PHẠM VI TOÀN CỤC ---
# print("Đang tải mô hình...")
# predictions, algo = dump.load('./model.dump') # <--- XÓA DÒNG NÀY
# interaction_df = load_data_as_dataframe() # <--- XÓA DÒNG NÀY
# all_song_ids_from_db = ... # <--- XÓA DÒNG NÀY


@app.route('/recommendations/<user_id>', methods=['GET'])
def get_recommendations(user_id):
    """
    Hàm này giờ sẽ chịu trách nhiệm tải model, dữ liệu mới nhất
    và trả về kết quả gợi ý.
    """
    try:
        limit = int(request.args.get('limit', 10))

        # === THAY ĐỔI QUAN TRỌNG: Tải model và dữ liệu bên trong request ===
        
        # 1. Tải model mới nhất từ file trên volume
        # Đường dẫn trỏ tới volume đã được map trong docker-compose
        model_path = '/app/model/model.dump' 
        print(f"INFO: Đang tải model từ {model_path}...")
        _predictions, algo = dump.load(model_path)
        print("INFO: Tải model thành công.")

        # 2. Tải dữ liệu tương tác mới nhất
        interaction_df = load_data_as_dataframe()
        
        # 3. Lấy danh sách toàn bộ bài hát mới nhất từ DB
        all_song_ids_from_db = [str(song['_id']) for song in songs_collection.find({}, {'_id': 1})]
        # =================================================================

        # 4. Tìm những bài hát người dùng này đã tương tác
        interacted_songs = interaction_df[interaction_df['userId'] == user_id]['songId'].unique()

        # 5. Lọc ra những bài hát người dùng CHƯA tương tác
        songs_to_predict = [song_id for song_id in all_song_ids_from_db if song_id not in interacted_songs]

        if not songs_to_predict:
            return jsonify({'message': 'Người dùng đã tương tác với tất cả bài hát.', 'recommendations': []})

        # 6. Dự đoán điểm rating cho các bài hát đó
        predictions = [algo.predict(user_id, song_id) for song_id in songs_to_predict]

        # 7. Sắp xếp các dự đoán
        predictions.sort(key=lambda x: x.est, reverse=True)

        # 8. Lấy top N bài hát gợi ý
        top_n_recommendations = [pred.iid for pred in predictions[:limit]]

        return jsonify({'recommendations': top_n_recommendations})

    except FileNotFoundError:
        # Xử lý trường hợp file model chưa được train lần nào
        return jsonify({'error': 'Model file not found. Please train the model first.'}), 503
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Chạy trên port 5001 và lắng nghe trên tất cả các interface
    app.run(host='0.0.0.0', port=5001, debug=True)