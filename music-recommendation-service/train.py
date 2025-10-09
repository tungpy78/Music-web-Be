import pandas as pd
from surprise import Dataset, Reader, SVD
from surprise import dump
from data_loader import load_data_as_dataframe

def train_and_save_model():
    """
    Tải dữ liệu, huấn luyện mô hình SVD và lưu ra file.
    """
    # 1. Tải dữ liệu
    df = load_data_as_dataframe()

    if df.empty:
        print("Không có đủ dữ liệu để huấn luyện.")
        return

    # 2. Chuẩn bị dữ liệu cho thư viện Surprise
    reader = Reader(rating_scale=(1, 5)) # Thang điểm rating đã định nghĩa
    data = Dataset.load_from_df(df[['userId', 'songId', 'rating']], reader)

    # Xây dựng trainset trên toàn bộ dữ liệu
    trainset = data.build_full_trainset()

    # 3. Chọn và huấn luyện thuật toán
    print("Bắt đầu huấn luyện mô hình...")
    algo = SVD(n_factors=100, n_epochs=20, lr_all=0.005, reg_all=0.02)
    algo.fit(trainset)
    print("Huấn luyện hoàn tất.")

    # 4. Lưu mô hình và trainset (cần trainset để lấy thông tin map id)
    # File này sẽ được API sử dụng
    dump.dump('/app/model/model.dump', algo=algo)
    print("Mô hình đã được lưu vào file model.dump")


if __name__ == '__main__':
    train_and_save_model()