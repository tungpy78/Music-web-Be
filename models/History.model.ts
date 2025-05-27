import mongoose from "mongoose";


const historyScheme = new mongoose.Schema({
    userId:{type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true},
    songId:{type: mongoose.Schema.Types.ObjectId, ref: 'Song', require: true},
    listenedAt: {type:Date, default:Date.now}
})
const History = mongoose.model('History',historyScheme,'History')
export default History