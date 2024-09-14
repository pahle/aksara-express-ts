import { Prisma, PrismaClient } from "@prisma/client";
import express from "express";
import bcrypt from "bcrypt";
import { SignJWT } from "jose";

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const isValidPhone = (phone: string) => {
  return /^62\d{9,12}$/.test(phone);
};

const isValidPassword = (password: string) => {
  return /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/.test(
    password
  );
};

app.post(`/signin`, async (req, res) => {
  try {
    const { address, password } = await req.body;

    const errors: {
      addressError?: string;
      passwordError?: string;
    } = {};

    if (!address) {
      errors.addressError = "Address is required";
    }
    if (!password) {
      errors.passwordError = "Password is required";
    }

    if (
      address &&
      !isValidEmail(address) &&
      !isValidPhone(address)
    ) {
      errors.addressError = "Invalid email or phone format";
    }
    if (password && !isValidPassword(password)) {
      errors.passwordError =
        "Password must contain at least 8 characters, 1 uppercase letter, and 1 number";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).send({
        status: "error",
        code: 400,
        data: { address, password },
        message: errors,
      });
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: address }, { phone: address }],
      },
    });

    if (!user) {
      res.status(404).send({
        status: "error",
        code: 404,
        data: { address },
        message: {
          addressError: "User not found",
        },
      });
    }

    const isPasswordMatch = await bcrypt.compare(
      password,
      user?.password ?? ""
    );

    if (!isPasswordMatch) {
      res.status(400).send({
        status: "error",
        code: 400,
        data: { address },
        message: {
          passwordError: "Password is incorrect",
        },
      });
    }

    const secret = new TextEncoder().encode("aksara");
    const jwt = await new SignJWT({
      user: {
        id: user?.id,
        email: user?.email,
        phone: user?.phone,
      },
    })
      .setProtectedHeader({ alg: "HS256" })
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
      message: "Internal server error" + error.message,
    });
  }
});

app.post(`/signup`, async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    const errors: {
      emailError?: string;
      phoneError?: string;
      passwordError?: string;
    } = {};

    if (!email) {
      errors.emailError = "Email is required";
    }
    if (!phone) {
      errors.phoneError = "Phone is required";
    }
    if (!password) {
      errors.passwordError = "Password is required";
    }
    if (email && !isValidEmail(email)) {
      errors.emailError = "Invalid email format";
    }
    if (phone && !isValidPhone(phone)) {
      errors.phoneError = "Invalid phone format";
    }
    if (password && !isValidPassword(password)) {
      errors.passwordError =
        "Password must contain at least 8 characters, 1 uppercase letter, and 1 number";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).send({
        status: "error",
        code: 400,
        data: { email, phone, password },
        message: errors,
      });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { phone }],
      },
    });

    if (existingUser){
      return res.status(400).send({
        status: "error",
        code: 400,
        data: { email, phone },
        message: "User already exists with this email or phone",
      });
    }

    const newUser = await prisma.user.create({
      data: {
        email,
        phone,
        password: await bcrypt.hash(password, 10),
        profile: {
          create: {
            name: email.split("@")[0],
            username: email.split("@")[0],
            bio: "Halo, saya baru disini!",
          }
        }
      },
    });

    res.status(201).json({
      status: "success",
      code: 201,
      data: { newUser },
      message: "Successfully signed up",
    });
  } catch (error: any) {
    res.status(500).send({
      status: "error",
      code: 500,
      message: "Internal server error" + error.message,
    });
  }
});

const server = app.listen(3000, () =>
  console.log(`
🚀 Server ready at: http://localhost:3000
⭐️ See sample requests: http://pris.ly/e/ts/rest-express#3-using-the-rest-api`)
);
