import mongoose from "mongoose";

const historyActionScheme = new mongoose.Schema({
    userId:{type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true},
    content:{type: String, require: true},
    listenedAt: {type:Date, default:Date.now}
})
const HistoryAction = mongoose.model('HistoryAction',historyActionScheme,'HistoryAction')
export default HistoryAction