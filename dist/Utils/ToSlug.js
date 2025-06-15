"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toSlug = void 0;
const toSlug = (str) => {
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-')
        .replace(/^-+|-+$/g, '');
};
exports.toSlug = toSlug;
