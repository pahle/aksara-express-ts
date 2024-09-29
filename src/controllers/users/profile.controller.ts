import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const getProfile = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.query.id?.toString();

    if (!userId) {
      return res.status(400).send({
        status: "error",
        code: 400,
        message: "User ID is required",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        profile: true,
      },
    });

    if (!user) {
      return res.status(404).send({
        status: "error",
        code: 404,
        message: "User not found",
      });
    }

    res.status(200).json({
      status: "success",
      code: 200,
      data: { user },
      message: "User found",
    });
  } catch (error: any) {
    res.status(500).send({
      status: "error",
      code: 500,
      message: "Internal server error: " + error.message,
    });
  }
};

export const updateProfile = async (
  req: Request,
  res: Response
) => {
  try {
    const { id, username, name, bio } = req.body;

    const exsistingUser = await prisma.user.findFirst({
        where: {
            profile:{
                username: username,
                name: name,
            }
        }
    })

    if(exsistingUser){
        return res.status(400).send({
            status: "error",
            code: 400,
            message: "Username or name already exists",
        });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id,
      },
      data: {
        profile: {
          update: {
            username,
            name,
            bio,
          },
        },
      },
      include: {
        profile: true,
      },
    });

    res.status(200).json({
      status: "success",
      code: 200,
      data: { user: updatedUser },
      message: "User updated"
    });
  } catch (error: any) {
    res.status(500).send({
      status: "error",
      code: 500,
      message: "Internal server error: " + error.message,
    });
  }
};
