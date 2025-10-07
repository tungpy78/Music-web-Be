# data_loader.py (phiên bản cuối cùng, đã dọn dẹp)

import os
import pandas as pd
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

def load_data_as_dataframe():
    MONGO_URI = os.getenv("MONGO_URI")
    client = MongoClient(MONGO_URI)
    db = client.get_default_database()

    # Tên collection chính xác từ database của bạn
    history_collection = db['History']
    playlist_collection = db['Playlist']
    favorite_collection = db['Favorite']

    weights = {
        'history': 1.0,
        'playlist': 3.0,
        'favorite': 5.0
    }

    # Lấy dữ liệu từ các collection
    history_df = pd.DataFrame(list(history_collection.find({}, {'userId': 1, 'songId': 1})))
    if not history_df.empty:
        history_df['rating'] = weights['history']

    playlists = list(playlist_collection.find({}, {'userId': 1, 'songs.songId': 1}))
    playlist_data = []
    for p in playlists:
        for s in p.get('songs', []):
            playlist_data.append({'userId': p['userId'], 'songId': s['songId']})
    playlist_df = pd.DataFrame(playlist_data)
    if not playlist_df.empty:
        playlist_df['rating'] = weights['playlist']

    favorite_df = pd.DataFrame(list(favorite_collection.find({}, {'userId': 1, 'songId': 1})))
    if not favorite_df.empty:
        favorite_df['rating'] = weights['favorite']

    # Kết hợp và xử lý dữ liệu
    all_dfs = [df for df in [history_df, playlist_df, favorite_df] if not df.empty]
    if not all_dfs:
        return pd.DataFrame(columns=['userId', 'songId', 'rating'])

    final_df = pd.concat(all_dfs, ignore_index=True)
    final_df = final_df.groupby(['userId', 'songId'])['rating'].max().reset_index()
    
    final_df['userId'] = final_df['userId'].astype(str)
    final_df['songId'] = final_df['songId'].astype(str)
    
    print(f"Đã xử lý xong {len(final_df)} dòng dữ liệu tương tác.")
    
    return final_df
