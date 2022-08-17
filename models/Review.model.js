import mongoose from 'mongoose'
const { Schema, model } = mongoose

const reviewSchema = new Schema({
    comment: { type: String, maxlength: 200 },
    companyId: { type: Schema.Types.ObjectId, ref: "Company" },
    userId: { type: Schema.Types.ObjectId, ref: "User" }
  });

const Review = model('Review', reviewSchema)

export default Review