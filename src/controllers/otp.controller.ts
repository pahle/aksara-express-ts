import { PrismaClient } from "@prisma/client";
import {
  isValidEmail,
  isValidPhone,
} from "../utils/validation";
import { Request, Response } from "express";
import { sendOtpToEmail } from "../utils/mailer";

const prisma = new PrismaClient();

export const createOtp = async (
  req: Request,
  res: Response
) => {
  try {
    const { address, createdFor } = req.body;

    const errors: {
      addressError?: string;
      createdForError?: string;
    } = {};

    if (!address)
      errors.addressError = "Address is required";
    if (!createdFor)
      errors.createdForError = "Created for is required";

    if (
      address &&
      !isValidEmail(address) &&
      !isValidPhone(address)
    ) {
      errors.addressError = "Invalid email or phone format";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).send({
        status: "error",
        code: 400,
        data: {
          address,
          createdFor,
        },
        message: errors,
      });
    }

    const sentTo = isValidEmail(address) ? "email" : "phone";

    if (sentTo === "email") {
      const user = await prisma.user.findFirst({
        where: {
          email: address,
        },
        include: {
          otp: true,
        },
      });

      if (!user) {
        return res.status(404).send({
          status: "error",
          code: 404,
          data: {
            address,
          },
          message: { addressError: "User not found" },
        });
      }

      if (user.otp) {
        if (user.otp.validUntil > new Date()) {
          return res.status(400).send({
            status: "error",
            code: 400,
            data: {
              address,
            },
            message: "OTP already exists",
          });
        }
        await prisma.otp.delete({
          where: {
            id: user.otp.id,
          },
        });
      }

      const otp = Math.floor(
        100000 + Math.random() * 900000
      ).toString();

      const updatedUser = await prisma.user.update({
        where: { email: address },
        data: {
          otp: {
            create: {
              code: otp,
              createdFor: createdFor,
              validUntil: new Date(
                Date.now() + 5 * 60 * 1000
              ), // Set validUntil property to 5 minutes from now
              sentTo: sentTo,
            },
          },
        },
      });

      await sendOtpToEmail(address, otp);

      res.status(200).json({
        status: "success",
        code: 200,
        data: { email: updatedUser.email },
        message: "OTP sent to email",
      });
    }
  } catch (error: any) {
    res.status(500).send({
      status: "error",
      code: 500,
      message: "Internal server error: " + error.message,
    });
  }
};

export const verifyOtp = async (
  req: Request,
  res: Response
) => {
  try {
    const { address, code } = req.body;

    const errors: {
      addressError?: string;
      codeError?: string;
    } = {};

    if (!address)
      errors.addressError = "Address is required";
    if (!code) errors.codeError = "Code is required";

    if (
      address &&
      !isValidEmail(address) &&
      !isValidPhone(address)
    ) {
      errors.addressError = "Invalid email or phone format";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).send({
        status: "error",
        code: 400,
        data: {
          address,
          code,
        },
        message: errors,
      });
    }

    const user = await prisma.user.findFirst({
      where: {
        email: address,
      },
      include: {
        otp: true,
      },
    });

    if (!user) {
      return res.status(404).send({
        status: "error",
        code: 404,
        data: {
          address,
        },
        message: { addressError: "User not found" },
      });
    }

    if (!user.otp) {
      return res.status(404).send({
        status: "error",
        code: 404,
        data: {
          address,
        },
        message: "OTP not found",
      });
    }

    if (user.otp.code !== code) {
      return res.status(400).send({
        status: "error",
        code: 400,
        data: {
          address,
          code,
        },
        message: "Invalid OTP",
      });
    }

    if (user.otp.validUntil < new Date()) {
      return res.status(400).send({
        status: "error",
        code: 400,
        data: {
          address,
        },
        message: "OTP expired",
      });
    }

    await prisma.otp.delete({
      where: {
        id: user.otp.id,
      },
    });

    res.status(200).json({
      status: "success",
      code: 200,
      data: { email: user.email },
      message: "OTP verified",
    });
  } catch (error: any) {
    res.status(500).send({
      status: "error",
      code: 500,
      message: "Internal server error: " + error.message,
    });
  }
};
