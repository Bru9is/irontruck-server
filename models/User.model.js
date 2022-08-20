import mongoose from 'mongoose';
import {cpf, cnpj} from 'cpf-cnpj-validator'
const { Schema, model } = mongoose

const userSchema = new Schema({
  
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  passwordHash: { type: String, required: true },
    address: { 
    street: { type: String, required: true, trim: true },
    number: { type: Number, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    zip: { type: Number, required: true, trim: true }, 
  }, 
   phone: { type: String, required: true, trim: true },
   role: { type: String, enum: ['user', 'company'], required: true },
   document: { 
    validate: {
      validator: function(value) {
        return (( this.role === "user" && cpf.isValid(value)) || ( this.role === "company" && cnpj.isValid(value)))
      },
      message: "Invalid document"
    },
    type: String, 
    required: true, 
    trim: true, 
    unique: true 
  }, 
   postIds: [{ type: Schema.Types.ObjectId, ref: "Post" }],
   companyIds: [{ type: Schema.Types.ObjectId, ref: "User" }],
   reviewIds: [{ type: Schema.Types.ObjectId, ref: "Review" }],
});

const User = model("User", userSchema);

export default User


