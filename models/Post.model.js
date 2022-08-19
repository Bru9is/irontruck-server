import mongoose from 'mongoose'
const { Schema, model } = mongoose

const postSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    date: { type: Date, required: true },
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    truckType: { 
        type: String,
        enum: ['small', 'middle', 'large'],
        required : true 
    },
    
  });

const Post = model('Post', postSchema)
export default Post