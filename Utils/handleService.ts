import { BaseResponse } from "../types/BaseResponse";
import { AppError } from "./AppError";

export const handleService = async <T>(serviceFn: () => Promise<T>): Promise<BaseResponse<T>> => {
    try {
        const data = await serviceFn();
        return {
            status: 200,
            message: "Success",
            data
        };
    } catch (error: any) {
        if (error instanceof AppError) {
            return {
                status: error.statusCode,
                message: error.message,
                error: error.name
            };
        }

        // fallback nếu lỗi không rõ
        return {
            status: 500,
            message: "Unexpected error occurred",
            error: error.message || "Unknown"
        };
    }
};