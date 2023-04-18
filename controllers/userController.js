dotenv.config();
import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { user } from '../models/userSchema.js';
import asyncHandler from '../middlewares/async.js';
import HttpException from '../utils/errorResponse.js';

export const getUsers = asyncHandler(async (req, res) => {
  const allUsers = await user.find({});
  res.status(200).json(allUsers);
});

export const getOneUser = asyncHandler(async (req, res, next) => {
  const dbUser = await user.findById(req.params.id, { password: 0 });
  if (!dbUser) return next(new HttpException(404, 'User not found.'));
  return res.status(200).json(dbUser);
});

export const createUser = asyncHandler(async (req, res, next) => {
  const signupUser = req.body;
  if (!signupUser.email && !signupUser.password) {
    return res.status(400).json({ message: 'Invalid body' });
  }

  const exists = await user.findOne({ email: signupUser.email });
  if (exists)
    res.status(409).json({
      message: 'Email is already taken',
      success: false,
    });

  const doc = await user.create(signupUser);

  const token = jwt.sign(
    { email: doc.email, userId: doc._id },
    process.env.TOKEN_KEY,
    { expiresIn: '90d' }
  );

  // doc.password = undefined;
  res.status(201).json({ token: token, user: doc });
});

export const login = asyncHandler(async (req, res, next) => {
  const loginUser = req.body;
  let User = await user.findOne({ email: loginUser.email });

  if (!User) return res.status(404).json({ message: 'Invalid Credentials' });

  const doesPasswordMatch = await bcrypt.compare(
    loginUser.password,
    User.password
  );

  if (!doesPasswordMatch)
    return res.status(404).json({ message: 'Invalid Credentials' });

  const token = jwt.sign(
    { email: User.email, userId: User._id },
    process.env.TOKEN_KEY,
    { expiresIn: '90d' }
  );

  // User.password = undefined;

  return res.status(200).json({ msg: `logged in`, token: token, user: User });
});

export const updateAnotherUser = asyncHandler(async (req, res, next) => {
  const Employeename = req.body.employeename;
  const Designation = req.body.designation;
  const Location = req.body.location;
  const PhoneNumber = req.body.phonenumber;
  const ProfilePicture = req.body.profilepicture;
  const Summary = req.body.summary;
  const Technologies = req.body.technologies;
  const Projects = req.body.projects;
  const Experience = req.body.experience;
  const Education = req.body.education;
  const id = req.params.id;
  const result = await user.findByIdAndUpdate(
    { _id: id },
    {
      employeename: Employeename,
      designation: Designation,
      location: Location,
      phonenumber: PhoneNumber,
      profilepicture: ProfilePicture,
      summary : Summary,
      technologies: Technologies,
      projects: Projects,
      experience: Experience,
      education: Education,
    },
    { new: true }
  );
  result.password = undefined;
  res.send(result);
});

export const update = asyncHandler(async (req, res) => {
  const Employeename = req.body.employeename;
  const Designation = req.body.designation;
  const Location = req.body.location;
  const PhoneNumber = req.body.phonenumber;
  const Summary = req.body.summary;
  const ProfilePicture = req.body.profilepicture;
  const Technologies = req.body.technologies;
  const Projects = req.body.projects;
  const Experience = req.body.experience;
  const Education = req.body.education;
  const id = req.body._id;

  const result = await user.findByIdAndUpdate(
    { _id: id },
    {
      employeename: Employeename,
      designation: Designation,
      location: Location,
      phonenumber: PhoneNumber,
      summary : Summary,
      profilepicture: ProfilePicture,
      technologies: Technologies,
      projects: Projects,
      experience: Experience,
      education: Education,
    },
    { new: true }
  );

  result.password = undefined;
  res.send(result);
});
