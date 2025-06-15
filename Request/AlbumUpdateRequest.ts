export interface AlbumUpdateRequest {
    album_name: string,
    decription: string,
    release_day: Date,
    avatar: Buffer,
    artist: string,
}