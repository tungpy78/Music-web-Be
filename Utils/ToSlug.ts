
export const toSlug= (str: string): string =>{
  return str
    .toLowerCase()
    .normalize('NFD') // tách các dấu
    .replace(/[\u0300-\u036f]/g, '') // loại bỏ các dấu
    .replace(/\s+/g, '-') // thay dấu cách thành dấu -
    .replace(/[^\w-]+/g, '') // loại bỏ ký tự đặc biệt (nếu có)
    .replace(/--+/g, '-') // thay nhiều dấu - liền nhau bằng 1 dấu -
    .replace(/^-+|-+$/g, ''); // bỏ dấu - ở đầu và cuối chuỗi
}
 