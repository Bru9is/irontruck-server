import mongoose from 'mongoose'
const { Schema, model } = mongoose

const reviewSchema = new Schema({
    comment: { type: String, maxlength: 200 },
    companyId: { type: Schema.Types.ObjectId, ref: "User" },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    rating:{type: Number, enum: [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5], required: true} 
  });

const Review = model('Review', reviewSchema)

export default Review