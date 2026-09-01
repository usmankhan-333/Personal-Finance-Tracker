import mongoose from "mongoose";
import user from "../models/user.js";

const categorySchema = new mongoose.Schema(
  {
    name: {
         type: String,
          required: true,
           trim: true 
        },
    type: {
         type: String,
          enum: ['income',
             'expense'],
              required: true
             },
    user: {
         type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
           required: true
         },
  },
  { timestamps: true }
);
export default mongoose.models.Category || mongoose.model('Category', categorySchema);

