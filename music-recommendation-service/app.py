# app.py (Phiên bản TỐI ƯU - sử dụng ít RAM)

import os
from flask import Flask, jsonify, request
from surprise import dump
from pymongo import MongoClient

# --- CÁC KHỞI TẠO TOÀN CỤC (NHẸ NHÀNG, TỐN ÍT RAM) ---
app = Flask(__name__) 

MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client.get_default_database()
songs_collection = db['Songs']
# Giả sử collection lưu lịch sử tương tác của bạn tên là 'Interactions'
interactions_collection = db['Interactions'] 

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok'}), 200

@app.route('/recommendations/<user_id>', methods=['GET'])
def get_recommendations(user_id):
    try:
        limit = int(request.args.get('limit', 10))

        # --- TẢI MODEL VÀ DỮ LIỆU BÊN TRONG REQUEST ---
        # 1. Tải model (chỉ khi có request)
        model_path = '/app/model/model.dump'
        _predictions, algo = dump.load(model_path)

        # 2. Chỉ truy vấn DB để lấy dữ liệu cần thiết cho user này
        interacted_songs_cursor = interactions_collection.find({'userId': user_id}, {'songId': 1, '_id': 0})
        interacted_songs = {item['songId'] for item in interacted_songs_cursor}

        all_song_ids_from_db = {str(song['_id']) for song in songs_collection.find({}, {'_id': 1})}
        
        songs_to_predict = list(all_song_ids_from_db - interacted_songs)
        
        if not songs_to_predict:
            return jsonify({'recommendations': []})

        # --- Phần dự đoán giữ nguyên ---
        predictions = [algo.predict(user_id, song_id) for song_id in songs_to_predict]
        predictions.sort(key=lambda x: x.est, reverse=True)
        top_n_recommendations = [pred.iid for pred in predictions[:limit]]

        return jsonify({'recommendations': top_n_recommendations})

    except FileNotFoundError:
        return jsonify({'error': 'Model file not found. Please train the model first.'}), 503
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)