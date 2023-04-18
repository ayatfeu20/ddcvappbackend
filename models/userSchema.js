import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
//mongoose genererar ett _id automatiskt
const userSchema = mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  isadmin: { type: Boolean, required: true, default: false },
  isactive: { type: Boolean, required: true, default: true },
  date: { type: Date, default: Date.now },
  employeename: { type: String, default: null },
  profilepicture: { type: String, default: null },
  summary: { type: String, default: null },
  designation: { type: String, default: null },
  phonenumber: { type: Number, default: null },
  location: { type: String, default: null },
  technologies: [
    {
      techtools: { type: String, default: null },
      key_id: { type: String, default: uuidv4() },
    },
  ],
  projects: [
    {
      projectname: { type: String, default: null },
      tools: { type: String, default: null },
      startdate: { type: Date, default: Date.now },
      enddate: { type: Date, default: Date.now },
      projectdescription: { type: String, default: null },
      key_id: { type: String, default: uuidv4() },
    },
  ],
  experience: [
    {
      designation: { type: String, default: null },
      companyname: { type: String, default: null },
      startdate: { type: Date, default: Date.now },
      enddate: { type: Date, default: Date.now },
      tools: { type: String, default: null },
      description: { type: String, default: null },
      key_id: { type: String, default: uuidv4() },
    },
  ],
  education: [
    {
      program: { type: String, default: null },
      universityname: { type: String, default: null },
      startdate: { type: Date, default: Date.now },
      enddate: { type: Date, default: Date.now },
      description: { type: String, default: null },
      key_id: { type: String, default: uuidv4() },
    },
  ],
});

userSchema.pre("save", async function (next) {
  const user = this;
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.getPublicProfile = async function () {
  delete this.password;
  return this;
};

export const user = mongoose.model("user", userSchema);
