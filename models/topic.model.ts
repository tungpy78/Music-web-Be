import mongoose from "mongoose";

const topicSchema = new mongoose.Schema(
    {
        title: {type: String, required: true, unique: true},
        avatar: String,
        description: String,
        status: String,
        slug: String,
        deleted: {
            type: Boolean,
            default: false,
        },
        deletedAt: Date,
    },
    {
        timestamps: true,
    }
);

const Topic = mongoose.model("Topic", topicSchema, "TOPIC");

export default Topic;