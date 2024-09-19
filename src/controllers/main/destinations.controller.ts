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

    if (!destinations || destinations.length === 0) {
      return res.status(404).send({
        status: "error",
        code: 404,
        message: "No destination found",
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

export const createDestination = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      name,
      location,
      description,
      address,
      hours,
      prices,
      contact,
      facilities,
      images,
    } = req.body;

    const errors: {
      nameError?: string;
      locationError?: string;
      descriptionError?: string;
      addressError?: string;
      hoursError?: string;
      pricesError?: string[];
      contactError?: string;
      facilitiesError?: string[];
      imagesError?: string[];
    } = {};

    if (!name) errors.nameError = "Name is required";
    if (!location)
      errors.locationError = "Location is required";
    if (!description)
      errors.descriptionError = "Description is required";
    if (!address)
      errors.addressError = "Address is required";
    if (!hours) errors.hoursError = "Hours is required";
    if (!prices)
      errors.pricesError = ["Prices are required"];
    if (!contact)
      errors.contactError = "Contact is required";
    if (!facilities)
      errors.facilitiesError = ["Facilities are required"];
    if (!images)
      errors.imagesError = ["Images are required"];

    if (Object.keys(errors).length > 0) {
      return res.status(400).send({
        status: "error",
        code: 400,
        data: {
          name,
          location,
          description,
          address,
          hours,
          prices,
          contact,
          facilities,
          images,
        },
        message: errors,
      });
    }

    const destination = await prisma.destination.findFirst({
      where: {
        name,
      },
    });

    if (destination) {
      return res.status(409).send({
        status: "error",
        code: 409,
        message: "Destination already exists",
      });
    }

    const newDestination = await prisma.destination.create({
      data: {
        name,
        location,
        description,
        address,
        hours,
        prices,
        contact,
        facilities,
        images,
      },
    });

    res.status(201).json({
      status: "success",
      code: 201,
      data: { destination: newDestination },
      message: "Destination created",
    });
  } catch (error: any) {
    res.status(500).send({
      status: "error",
      code: 500,
      message: "Internal server error: " + error.message,
    });
  }
};

export const updateDestination = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      id,
      name,
      location,
      description,
      address,
      hours,
      prices,
      contact,
      facilities,
      images,
    } = req.body;

    const errors: {
      idError?: string;
      nameError?: string;
      locationError?: string;
      descriptionError?: string;
      addressError?: string;
      hoursError?: string;
      pricesError?: string;
      contactError?: string;
      facilitiesError?: string;
      imagesError?: string;
    } = {};

    if (!id) {
      errors.idError = "ID is required";
    }
    if (!name) errors.nameError = "Name is required";
    if (!location)
      errors.locationError = "Location is required";
    if (!description)
      errors.descriptionError = "Description is required";
    if (!address)
      errors.addressError = "Address is required";
    if (!hours) errors.hoursError = "Hours is required";
    if (!prices) errors.pricesError = "Prices are required";
    if (!contact)
      errors.contactError = "Contact is required";
    if (!facilities)
      errors.facilitiesError = "Facilities are required";
    if (!images) errors.imagesError = "Images are required";

    if (Object.keys(errors).length > 0) {
      return res.status(400).send({
        status: "error",
        code: 400,
        data: {
          id,
          name,
          location,
          description,
          address,
          hours,
          prices,
          contact,
          facilities,
          images,
        },
        message: errors,
      });
    }

    const destination = await prisma.destination.findUnique(
      {
        where: {
          id: id,
        },
      }
    );

    if (!destination) {
      return res.status(404).send({
        status: "error",
        code: 404,
        message: "Destination not found",
      });
    }

    const updatedDestination =
      await prisma.destination.update({
        where: {
          id: id,
        },
        data: {
          name,
          location,
          description,
          address,
          hours,
          prices,
          contact,
          facilities,
          images,
        },
      });

    res.status(200).json({
      status: "success",
      code: 200,
      data: { destination: updatedDestination },
      message: "Destination updated",
    });
  } catch (error: any) {
    res.status(500).send({
      status: "error",
      code: 500,
      message: "Internal server error: " + error.message,
    });
  }
};

export const deleteDestination = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).send({
        status: "error",
        code: 400,
        message: "Destination ID is required",
      });
    }

    const destination = await prisma.destination.findUnique(
      {
        where: {
          id: id,
        },
      }
    );

    if (!destination) {
      return res.status(404).send({
        status: "error",
        code: 404,
        message: "Destination not found",
      });
    }

    await prisma.destination.delete({
      where: {
        id: id,
      },
    });

    res.status(200).json({
      status: "success",
      code: 200,
      message: "Destination deleted",
    });
  } catch (error: any) {
    res.status(500).send({
      status: "error",
      code: 500,
      message: "Internal server error: " + error.message,
    });
  }
};
