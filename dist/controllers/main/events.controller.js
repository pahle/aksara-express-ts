"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEvent = exports.updateEvent = exports.createEvent = exports.getEvents = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getEvents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const eventId = (_a = req.query.id) === null || _a === void 0 ? void 0 : _a.toString();
        if (eventId) {
            const event = yield prisma.event.findUnique({
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
        const events = yield prisma.event.findMany();
        if (!events || events.length === 0) {
            return res.status(404).send({
                status: "error",
                code: 404,
                message: "No event found",
            });
        }
        res.status(200).json({
            status: "success",
            code: 200,
            data: { events },
            message: "Events found",
        });
    }
    catch (error) {
        res.status(500).send({
            status: "error",
            code: 500,
            message: "Internal server error: " + error.message,
        });
    }
});
exports.getEvents = getEvents;
const createEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, address, hours, prices, contact, images, } = req.body;
        const errors = {};
        if (!name)
            errors.name = "Name is required";
        if (!description)
            errors.description = "Description is required";
        if (!address)
            errors.address = "Address is required";
        if (!hours)
            errors.hours = "Hours is required";
        if (!prices)
            errors.prices = "Prices is required";
        if (!contact)
            errors.contact = "Contact is required";
        if (!images)
            errors.images = "Images is required";
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
        const event = yield prisma.event.findFirst({
            where: {
                name: name,
            },
        });
        if (event) {
            return res.status(409).send({
                status: "error",
                code: 409,
                message: "Event already exists",
            });
        }
        const newEvent = yield prisma.event.create({
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
            data: { newEvent },
            message: "Event created",
        });
    }
    catch (error) {
        res.status(500).send({
            status: "error",
            code: 500,
            message: "Internal server error: " + error.message,
        });
    }
});
exports.createEvent = createEvent;
const updateEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, name, description, address, hours, prices, contact, images, } = req.body;
        const errors = {};
        if (!id)
            errors.id = "ID is required";
        if (!name)
            errors.name = "Name is required";
        if (!description)
            errors.description = "Description is required";
        if (!address)
            errors.address = "Address is required";
        if (!hours)
            errors.hours = "Hours is required";
        if (!prices)
            errors.prices = "Prices is required";
        if (!contact)
            errors.contact = "Contact is required";
        if (!images)
            errors.images = "Images is required";
        if (Object.keys(errors).length > 0) {
            return res.status(400).send({
                status: "error",
                code: 400,
                data: {
                    id,
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
        const event = yield prisma.event.findUnique({
            where: {
                id: id,
            },
        });
        if (!event) {
            return res.status(404).send({
                status: "error",
                code: 404,
                message: "Event not found",
            });
        }
        const updatedEvent = yield prisma.event.update({
            where: {
                id: id,
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
            data: { updatedEvent },
            message: "Event updated",
        });
    }
    catch (error) {
        res.status(500).send({
            status: "error",
            code: 500,
            message: "Internal server error: " + error.message,
        });
    }
});
exports.updateEvent = updateEvent;
const deleteEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.body;
        if (!id) {
            return res.status(400).send({
                status: "error",
                code: 400,
                message: "Event ID is required",
            });
        }
        const event = yield prisma.event.findUnique({
            where: {
                id: id,
            },
        });
        if (!event) {
            return res.status(404).send({
                status: "error",
                code: 404,
                message: "Event not found",
            });
        }
        yield prisma.event.delete({
            where: {
                id: id,
            },
        });
        res.status(200).json({
            status: "success",
            code: 200,
            message: "Event deleted",
        });
    }
    catch (error) {
        res.status(500).send({
            status: "error",
            code: 500,
            message: "Internal server error: " + error.message,
        });
    }
});
exports.deleteEvent = deleteEvent;
//# sourceMappingURL=events.controller.js.map