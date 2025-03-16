import bcrypt from "bcryptjs";
import Admin from "../models/admin.model.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const adminSignup = async (req, res) => {
    try {
        const { name, email, password, confirmPassword, gender } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Password does not match"});
        }

        const admin = await Admin.findOne({name});

        if (admin) {
          return res.status(400).json({error:"Admin already exits"})
        }

        // Hashed password.
        const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

        // https://avatar-placeholder.iran.liara.run/
  
        const boyProfilePic  = `https://avatar.iran.liara.run/public/boy?username=${name}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${name}`;

        const newAdmin = new Admin({
            name,
            email,
            password: hashedPassword,
            gender,
            profilePic: gender === "male" ? boyProfilePic : girlProfilePic
        })
        if (newAdmin) {
        // Generate JWT token here. 
        generateTokenAndSetCookie(newAdmin._id, res) ;
        await newAdmin.save();

        res.status(201).json({
          _id: newAdmin._id,
          name: newAdmin.name,
          email: newAdmin.email,
          password: newAdmin.password,
          gender: newAdmin.gender,
          profilePic: newAdmin.profilePic
        })
    } else {
      res.status(400).json({error: "Invalid admin data"});
    }

    } catch (error) {
        console.log("Error in adminSignup controller", error.message);
        res.status(500).json({error:"Invalid server error"});
    }
};

export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({email});
        const isPasswordCorrect = await bcrypt.compare(password, admin?.password || "");

        if (!admin || !isPasswordCorrect) {
            return res.status(400).json({error: "Invalid email or password."});
        }

        generateTokenAndSetCookie(admin._id, res);

        res.status(200).json({
          _id: admin._id,
          name: admin.name,
          email: admin.email,
          password: admin.password,
          gender: admin.gender,
          profilePic: admin.profilePic
        });
    } catch (error) {
        console.log("Error in adminLogin controller", error.message);
        res.status(500).json({error:"Invalid server error"});
    }
};


export const adminLogout = (req, res) => {
    try {
      res.cookie("jwt","", {maxAge:0});
      res.status(200).json({message:"Logged out successfully"});
    } catch (error) {
      console.log("Error in adminLogout controller", error.message);
      res.status(500).json({error:"Internal server error"});
    }
};