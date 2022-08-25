import mongoose from 'mongoose'
const { Schema, model } = mongoose

const postSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    companyId: [{ type: mongoose.Schema.Types.ObjectId, ref: "Company" }],
    date: { type: Date, required: true },
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    truckType: { 
        type: String,
        enum: ['small', 'middle', 'large'],
        required : true 
    },
    boxing: {type: Boolean},
    unboxing: {type: Boolean},
    material: {type: Boolean},
    comment: {type: String},
    floor: {type: Number}
  });

const Post = model('Post', postSchema)
export default Post