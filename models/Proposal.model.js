import mongoose from 'mongoose'
const { Schema, model } = mongoose

const proposalSchema = new Schema({
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
    total: { type: Number, required: true}
  },{timestamps: true});

const Proposal = model('Proposal', proposalSchema)

export default Proposal