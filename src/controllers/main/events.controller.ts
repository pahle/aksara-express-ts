import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const getEvents = async (
  req: Request,
  res: Response
) => {
  try {
    const eventId = req.query.id?.toString();

    if (eventId) {
      const event = await prisma.event.findUnique({
        where: {
          id: eventId,
        },
      });

      if (!event) {
        return res.status(404).send({
          status: "error",
          code: 404,
          message: "Event not found",
        });
      }

      return res.status(200).send({
        status: "success",
        code: 200,
        data: { event },
        message: "Event found",
      });
    }

    const events = await prisma.event.findMany();

    if (!events) {
      return res.status(404).send({
        status: "error",
        code: 404,
        message: "No events found",
      });
    }

    res.status(200).json({
      status: "success",
      code: 200,
      data: { events },
      message: "Events found",
    });
  } catch (error: any) {
    res.status(500).send({
      status: "error",
      code: 500,
      message: "Internal server error: " + error.message,
    });
  }
};

export const createEvent = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      name,
      description,
      address,
      hours,
      prices,
      contact,
      images,
    } = req.body;

    const errors: {
      name?: string;
      description?: string;
      address?: string;
      hours?: string;
      prices?: string;
      contact?: string;
      images?: string;
    } = {};

    if (!name) errors.name = "Name is required";
    if (!description)
      errors.description = "Description is required";
    if (!address) errors.address = "Address is required";
    if (!hours) errors.hours = "Hours is required";
    if (!prices) errors.prices = "Prices is required";
    if (!contact) errors.contact = "Contact is required";
    if (!images) errors.images = "Images is required";

    if (Object.keys(errors).length > 0) {
      return res.status(400).send({
        status: "error",
        code: 400,
        data: {
          name,
          description,
          address,
          hours,
          prices,
          contact,
          images,
        },
        message: errors,
      });
    }

    const event = await prisma.event.create({
      data: {
        name,
        description,
        address,
        hours,
        prices,
        contact,
        images,
      },
    });

    res.status(201).send({
      status: "success",
      code: 201,
      data: { event },
      message: "Event created",
    });
  } catch (error: any) {
    res.status(500).send({
      status: "error",
      code: 500,
      message: "Internal server error: " + error.message,
    });
  }
};

export const updateEvent = async (
  req: Request,
  res: Response
) => {
  try {
    const eventId = req.params.id;
    const {
      name,
      description,
      address,
      hours,
      prices,
      contact,
      images,
    } = req.body;

    const errors: {
      name?: string;
      description?: string;
      address?: string;
      hours?: string;
      prices?: string;
      contact?: string;
      images?: string;
    } = {};

    if (!name) errors.name = "Name is required";
    if (!description)
      errors.description = "Description is required";
    if (!address) errors.address = "Address is required";
    if (!hours) errors.hours = "Hours is required";
    if (!prices) errors.prices = "Prices is required";
    if (!contact) errors.contact = "Contact is required";
    if (!images) errors.images = "Images is required";

    if (Object.keys(errors).length > 0) {
      return res.status(400).send({
        status: "error",
        code: 400,
        data: {
          name,
          description,
          address,
          hours,
          prices,
          contact,
          images,
        },
        message: errors,
      });
    }

    const event = await prisma.event.update({
      where: {
        id: eventId,
      },
      data: {
        name,
        description,
        address,
        hours,
        prices,
        contact,
        images,
      },
    });

    res.status(200).send({
      status: "success",
      code: 200,
      data: { event },
      message: "Event updated",
    });
  } catch (error: any) {
    res.status(500).send({
      status: "error",
      code: 500,
      message: "Internal server error: " + error.message,
    });
  }
};

export const deleteEvent = async (
  req: Request,
  res: Response
) => {
  try {
    const eventId = req.params.id;

    const event = await prisma.event.delete({
      where: {
        id: eventId,
      },
    });

    res.status(200).send({
      status: "success",
      code: 200,
      data: { event },
      message: "Event deleted",
    });
  } catch (error: any) {
    res.status(500).send({
      status: "error",
      code: 500,
      message: "Internal server error: " + error.message,
    });
  }
};
