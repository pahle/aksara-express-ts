import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { SignJWT } from "jose";
import { isValidEmail, isValidPhone, isValidPassword } from '../utils/validation';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export const signUp = async (req: Request, res: Response) => {
    try {
      const { email, phone, password } = req.body;
      const errors: { emailError?: string; phoneError?: string; passwordError?: string } = {};
  
      if (!email) errors.emailError = "Email is required";
      if (!phone) errors.phoneError = "Phone is required";
      if (!password) errors.passwordError = "Password is required";
  
      if (email && !isValidEmail(email)) errors.emailError = "Invalid email format";
      if (phone && !isValidPhone(phone)) errors.phoneError = "Invalid phone format";
      if (password && !isValidPassword(password)) errors.passwordError = "Password must contain at least 8 characters, 1 uppercase letter, and 1 number";
  
      if (Object.keys(errors).length > 0) {
        return res.status(400).send({
          status: "error",
          message: errors,
        });
      }
  
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ email }, { phone }],
        },
      });
  
      if (existingUser) {
        return res.status(400).send({
          status: "error",
          message: "User already exists with this email or phone",
        });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = await prisma.user.create({
        data: {
          email,
          phone,
          password: hashedPassword,
          profile: {
            create: {
              name: email.split("@")[0],
              username: email.split("@")[0],
              bio: "Halo, saya baru disini!",
            },
          },
        },
      });
  
      res.status(201).json({
        status: "success",
        data: { newUser },
        message: "Successfully signed up",
      });
    } catch (error: any) {
      res.status(500).send({
        status: "error",
        message: "Internal server error: " + error.message,
      });
    }
  };