import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const getDestinations = async (
  req: Request,
  res: Response
) => {
  try {
    const destinationId = req.query.id?.toString();

    if (destinationId) {
      const destination =
        await prisma.destination.findUnique({
          where: {
            id: destinationId,
          },
        });

      if (!destination) {
        return res.status(404).send({
          status: "error",
          code: 404,
          message: "Destination not found",
        });
      }

      return res.status(200).send({
        status: "success",
        code: 200,
        data: { destination },
        message: "Destination found",
      });
    }

    const destinations =
      await prisma.destination.findMany();

    if (!destinations) {
      return res.status(404).send({
        status: "error",
        code: 404,
        message: "No destinations found",
      });
    }

    res.status(200).json({
      status: "success",
      code: 200,
      data: { destinations },
      message: "Destinations found",
    });
  } catch (error: any) {
    res.status(500).send({
      status: "error",
      code: 500,
      message: "Internal server error: " + error.message,
    });
  }
};
