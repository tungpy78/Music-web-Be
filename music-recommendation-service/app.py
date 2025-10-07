# app.py (phiên bản cuối cùng đã được sửa lỗi)

import os
import pandas as pd
from flask import Flask, jsonify, request
from surprise import dump
from data_loader import load_data_as_dataframe
from pymongo import MongoClient

# --- THÊM PHẦN KẾT NỐI DB ĐỂ LẤY TOÀN BỘ BÀI HÁT ---
MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client.get_default_database()
# Hãy chắc chắn tên collection là 'Songs' theo model của bạn
# Dựa theo ảnh chụp màn hình của bạn, tên collection là 'Songs'
songs_collection = db['Songs']
# ---------------------------------------------------

# Khởi tạo ứng dụng Flask
app = Flask(__name__)

# Tải mô hình đã huấn luyện khi server khởi động
print("Đang tải mô hình...")
predictions, algo = dump.load('./model.dump')
print("Tải mô hình thành công.")

# Lấy dữ liệu tương tác để biết những bài người dùng đã nghe
interaction_df = load_data_as_dataframe()

# --- SỬA PHẦN NÀY: Lấy TOÀN BỘ songId từ collection Songs ---
all_song_ids_from_db = [str(song['_id']) for song in songs_collection.find({}, {'_id': 1})]
print(f"--- INFO: Đã tải {len(all_song_ids_from_db)} bài hát từ database.")
# -------------------------------------------------------------

@app.route('/recommendations/<user_id>', methods=['GET'])
def get_recommendations(user_id):
    try:
        limit = int(request.args.get('limit', 10))

        # 1. Tìm những bài hát người dùng này đã tương tác từ dataframe tương tác
        interacted_songs = interaction_df[interaction_df['userId'] == user_id]['songId'].unique()

        # 2. Lọc ra những bài hát người dùng CHƯA tương tác từ TOÀN BỘ danh sách bài hát
        songs_to_predict = [song_id for song_id in all_song_ids_from_db if song_id not in interacted_songs]

        if not songs_to_predict:
            return jsonify({'message': 'Người dùng đã tương tác với tất cả bài hát.', 'recommendations': []})

        # 3. Dự đoán điểm rating cho các bài hát đó
        predictions = [algo.predict(user_id, song_id) for song_id in songs_to_predict]

        # 4. Sắp xếp các dự đoán theo điểm số từ cao đến thấp
        predictions.sort(key=lambda x: x.est, reverse=True)

        # 5. Lấy top N bài hát có điểm dự đoán cao nhất
        top_n_recommendations = [pred.iid for pred in predictions[:limit]]

        return jsonify({'recommendations': top_n_recommendations})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5001, debug=True)