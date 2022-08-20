import { Router } from 'express'
import bcrypt from 'bcryptjs'

import User from '../models/User.model.js'
import generateToken from '../config/jwt.config.js';
import isAuthenticated from '../middlewares/isAuthenticated.js'
import attachCurrentUser from '../middlewares/attachCurrentUser.js';
import { cnpj, cpf } from 'cpf-cnpj-validator';

const salt_rounds = process.env.SALT_ROUNDS;
const userRouter = Router()

userRouter.post("/signup", async (req, res) => {

  try {
    const { password, role, document } = req.body;

    if (
      !password ||
      !password.match(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/
      )
    ) {
      return res.status(400).json({
        msg: "Password is required and must have at least 8 characters, uppercase and lowercase letters, numbers and special characters.",
      });
    }

    const salt = bcrypt.genSaltSync(+salt_rounds);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const result = await User.create({
      ...req.body,
      passwordHash: hashedPassword,
    });
    return res.status(201).json(result);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: JSON.stringify(err) });
    }
});

userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "This email is not yet registered in our website;" });
    }

    if (bcrypt.compareSync(password, user.passwordHash)) {
      const token = generateToken(user);

      return res.status(200).json({
        user: {
          name: user.name,
          email: user.email,
          _id: user._id,
        },
        token,
      });
    } else {
      return res.status(401).json({ msg: "Wrong password or email" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: JSON.stringify(err) });
  }
});

userRouter.get("/profile", isAuthenticated, attachCurrentUser, (req, res) => {
  try {
    const loggedInUser = req.currentUser;

    if (loggedInUser) {
      return res.status(200).json(loggedInUser);
    } else {
      return res.status(404).json({ msg: "User not found." });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: JSON.stringify(err) });
  }
});

userRouter.put("/edit-profile", isAuthenticated, attachCurrentUser, async (req, res) => {
    const id = req.currentUser._id;
    const editedUser = req.body;
    if (!editedUser) return res.status(422).json({ msg: "Please provide a user to edit" }) 
    const user = await User.findOneAndUpdate(
      { _id: id },
      { $set: editedUser },
      {
        new: true,
      }
    );
    return res.status(200).json(user); 
  });

export default userRouter;