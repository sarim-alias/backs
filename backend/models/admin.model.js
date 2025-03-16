import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    email: {
        type: String,
        unique: true,  
        lowercase: true, 
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'], 
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female"],
    },
    profilePic: {
      type: String,
      default: "",
    },
    // createdAt, updatedAt
}, { timestamps: true });

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;