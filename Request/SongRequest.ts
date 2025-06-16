export interface  SongRequest {
    title: string,
    fileavatar: Buffer, 
    description: string,
    lyrics: string,
    fileaudio: Buffer,
    artist: string[],
    genre: string
}