import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { SignJWT } from "jose";
import {
  isValidEmail,
  isValidPhone,
  isValidPassword,
} from "../../utils/validation";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const signIn = async (
  req: Request,
  res: Response
) => {
  try {
    const { address, password } = req.body;
    const errors: {
      addressError?: string;
      passwordError?: string;
    } = {};

    if (!address)
      errors.addressError = "Address is required";
    if (!password)
      errors.passwordError = "Password is required";

    if (
      address &&
      !isValidEmail(address) &&
      !isValidPhone(address)
    ) {
      errors.addressError = "Invalid email or phone format";
    }

    if (password && !isValidPassword(password)) {
      errors.passwordError = "Invalid password format";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).send({
        status: "error",
        code: 400,
        data: {
          address,
          password,
        },
        message: errors,
      });
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: address }, { phone: address }],
      },
    });

    if (!user) {
      return res.status(404).send({
        status: "error",
        code: 404,
        data: { address },
        message: { addressError: "User not found" },
      });
    }

    const isPasswordMatch = await bcrypt.compare(
      password,
      user.password
    );
    if (!isPasswordMatch) {
      return res.status(400).send({
        status: "error",
        code: 400,
        data: { password },
        message: { passwordError: "Password is incorrect" },
      });
    }

    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET
    );
    const jwt = await new SignJWT({
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
      },
    })
      .setProtectedHeader({ alg: process.env.JWT_ALGORITHM || "" })
      .setIssuedAt()
      .setExpirationTime("30m")
      .sign(secret);

    res.status(200).json({
      status: "success",
      code: 200,
      data: { jwt },
      message: "Successfully signed in",
    });
  } catch (error: any) {
    res.status(500).send({
      status: "error",
      code: 500,
      message: "Internal server error: " + error.message,
    });
  }
};
