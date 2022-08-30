import mongoose from 'mongoose'
const { Schema, model } = mongoose

const proposalSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    company: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
    total: { type: Number, required: true},
    status: {type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  }, {timestamps: true});

const Proposal = model('Proposal', proposalSchema)

export default Proposal