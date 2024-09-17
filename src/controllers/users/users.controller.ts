import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import {
  isValidEmail,
  isValidPhone,
  isValidPassword,
} from "../../utils/validation";

const prisma = new PrismaClient();

export const getUsers = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.query.id?.toString();

    if (userId) {
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!user) {
        return res.status(404).send({
          status: "error",
          code: 404,
          message: "User not found",
        });
      }

      return res.status(200).send({
        status: "success",
        code: 200,
        data: { user },
        message: "User found",
      });
    }

    const users = await prisma.user.findMany();

    if (!users || users.length === 0) {
      return res.status(404).send({
        status: "error",
        code: 404,
        message: "No user found",
      });
    }

    res.status(200).json({
      status: "success",
      code: 200,
      data: { users },
      message: "Users found",
    });
  } catch (error: any) {
    res.status(500).send({
      status: "error",
      code: 500,
      message: "Internal server error: " + error.message,
    });
  }
};

export const updateUser = async (
  req: Request,
  res: Response
) => {
  try {
    const { id, email, phone, password } = req.body;
    const errors: {
      idError?: string;
      emailError?: string;
      phoneError?: string;
      passwordError?: string;
    } = {};

    if (!id) errors.idError = "ID is required";
    if (email && !isValidEmail(email))
      errors.emailError = "Invalid email format";
    if (phone && !isValidPhone(phone))
      errors.phoneError = "Invalid phone format";
    if (password && !isValidPassword(password))
      errors.passwordError = "Invalid password format";

    if (Object.keys(errors).length > 0) {
      return res.status(400).send({
        status: "error",
        code: 400,
        data: {
          id,
          email,
          phone,
          password,
        },
        message: errors,
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      return res.status(404).send({
        status: "error",
        code: 404,
        message: "User not found",
      });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id,
      },
      data: {
        email,
        phone,
        password,
      },
    });

    res.status(200).json({
      status: "success",
      code: 200,
      data: { user: updatedUser },
      message: "User updated",
    });
  } catch (error: any) {
    res.status(500).send({
      status: "error",
      code: 500,
      message: "Internal server error: " + error.message,
    });
  }
};

export const deleteUser = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).send({
        status: "error",
        code: 400,
        message: "ID is required",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      return res.status(404).send({
        status: "error",
        code: 404,
        message: "User not found",
      });
    }

    await prisma.user.delete({
      where: {
        id,
      },
    });

    res.status(200).json({
      status: "success",
      code: 200,
      message: "User deleted",
    });
  } catch (error: any) {
    res.status(500).send({
      status: "error",
      code: 500,
      message: "Internal server error: " + error.message,
    });
  }
};
