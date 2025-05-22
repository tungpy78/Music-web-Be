export function removeVietnameseTones(str: string): string {
  return str
    .normalize("NFD")                      // tách các dấu
    .replace(/[\u0300-\u036f]/g, "")      // loại bỏ dấu
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}