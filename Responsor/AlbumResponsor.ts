
type Artist ={
    _id:string,
    name: string,
    imageUrl: string
}

type Song ={
    _id: string,
    title: string,
    avatar:string,
}
export interface AlbumResponsor {
    _id: string,
    album_name: string,
    decription: string,
    release_day: Date,
    avatar: string,
    artist: Artist;
    songs: Song[];
}