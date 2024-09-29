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
exports.deleteDestination = exports.updateDestination = exports.createDestination = exports.getDestinations = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getDestinations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const destinationId = (_a = req.query.id) === null || _a === void 0 ? void 0 : _a.toString();
        if (destinationId) {
            const destination = yield prisma.destination.findUnique({
                where: {
                    id: destinationId,
                },
                include: {
                    reviews: true,
                }
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
        const destinations = yield prisma.destination.findMany({
            include: {
                reviews: true,
            }
        });
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
    }
    catch (error) {
        res.status(500).send({
            status: "error",
            code: 500,
            message: "Internal server error: " + error.message,
        });
    }
});
exports.getDestinations = getDestinations;
const createDestination = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, location, description, address, hours, prices, contact, facilities, images, } = req.body;
        const errors = {};
        if (!name)
            errors.nameError = "Name is required";
        if (!location)
            errors.locationError = "Location is required";
        if (!description)
            errors.descriptionError = "Description is required";
        if (!address)
            errors.addressError = "Address is required";
        if (!hours)
            errors.hoursError = "Hours is required";
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
        const destination = yield prisma.destination.findFirst({
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
        const newDestination = yield prisma.destination.create({
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
    }
    catch (error) {
        res.status(500).send({
            status: "error",
            code: 500,
            message: "Internal server error: " + error.message,
        });
    }
});
exports.createDestination = createDestination;
const updateDestination = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, name, location, description, address, hours, prices, contact, facilities, images, } = req.body;
        const errors = {};
        if (!id) {
            errors.idError = "ID is required";
        }
        if (!name)
            errors.nameError = "Name is required";
        if (!location)
            errors.locationError = "Location is required";
        if (!description)
            errors.descriptionError = "Description is required";
        if (!address)
            errors.addressError = "Address is required";
        if (!hours)
            errors.hoursError = "Hours is required";
        if (!prices)
            errors.pricesError = "Prices are required";
        if (!contact)
            errors.contactError = "Contact is required";
        if (!facilities)
            errors.facilitiesError = "Facilities are required";
        if (!images)
            errors.imagesError = "Images are required";
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
        const destination = yield prisma.destination.findUnique({
            where: {
                id: id,
            },
        });
        if (!destination) {
            return res.status(404).send({
                status: "error",
                code: 404,
                message: "Destination not found",
            });
        }
        const updatedDestination = yield prisma.destination.update({
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
    }
    catch (error) {
        res.status(500).send({
            status: "error",
            code: 500,
            message: "Internal server error: " + error.message,
        });
    }
});
exports.updateDestination = updateDestination;
const deleteDestination = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.body;
        if (!id) {
            return res.status(400).send({
                status: "error",
                code: 400,
                message: "Destination ID is required",
            });
        }
        const destination = yield prisma.destination.findUnique({
            where: {
                id: id,
            },
        });
        if (!destination) {
            return res.status(404).send({
                status: "error",
                code: 404,
                message: "Destination not found",
            });
        }
        yield prisma.destination.delete({
            where: {
                id: id,
            },
        });
        res.status(200).json({
            status: "success",
            code: 200,
            message: "Destination deleted",
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
exports.deleteDestination = deleteDestination;
//# sourceMappingURL=destinations.controller.js.map