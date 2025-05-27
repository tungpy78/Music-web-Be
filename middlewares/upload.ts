
import multer from 'multer';

const storage = multer.memoryStorage(); // lưu vào RAM

const upload = multer({ storage });

export default upload;
