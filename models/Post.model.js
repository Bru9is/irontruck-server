import mongoose from 'mongoose'
const { Schema, model } = mongoose

const postSchema = new Schema({
    date: { type: Date, required: true },
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    truckType: { 
        type: String,
        enum: ['Small', 'Middle', 'Large'], //perguntar como colocar mais de uma escolha
        required : true 
    },
    

  });

const Post = model('Post', postSchema)
export default Post