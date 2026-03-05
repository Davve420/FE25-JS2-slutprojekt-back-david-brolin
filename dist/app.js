"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const fileOperations_1 = require("./fileOperations");
const types_1 = require("./types");
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
exports.app.use((0, cors_1.default)());
exports.app.get('/data', async (req, res) => {
    try {
        const data = await (0, fileOperations_1.getData)();
        console.log('Get all Data');
        res.json(data);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'failed to get data' });
    }
});
//          ASSIGNMENTS
exports.app.post('/assignments', async (req, res) => {
    console.log(req.body);
    try {
        if ((0, types_1.isNewAssignment)(req.body)) {
            const newAssignment = await (0, fileOperations_1.addAssignment)(req.body);
            res.json({ message: 'success', newAssignment });
        }
        else {
            res.status(400).json({ message: 'Wrong format' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'failed to add assignment' });
    }
});
exports.app.delete('/assignments/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // deleteAssignment kastar fel om statusen inte är "done"
        await (0, fileOperations_1.deleteAssignment)(id);
        res.json({ message: 'Assignment deleted successfully' });
    }
    catch (error) {
        // Om den kastar "Can only delete assignments with status done"
        if (error instanceof Error && error.message.includes('status')) {
            res.status(400).json({ message: error.message });
        }
        // Om assignment inte finns
        else if (error instanceof Error && error.message.includes('not found')) {
            res.status(404).json({ message: 'Assignment not found' });
        }
        // Annat fel
        else {
            res.status(500).json({ message: 'Failed to delete assignment' });
        }
    }
});
exports.app.patch('/assignments/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const updatedAssignment = await (0, fileOperations_1.updateAssignment)(id, updates);
        res.json({ message: 'Assignment updated', updatedAssignment });
    }
    catch (error) {
        if (error instanceof Error && error.message.includes('not found')) {
            res.status(404).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: 'Failed to update assignment' });
        }
    }
});
//          ASSIGN/UNASSIGN MEMBERS
exports.app.patch('/assignments/:id/assign', async (req, res) => {
    //assignment id i endpointen - member id i req.body (det du skriver i postman body)
    try {
        const { id } = req.params;
        const { memberId } = req.body;
        const data = await (0, fileOperations_1.getData)();
        // Validera assignment existerar
        const assignment = data.assignments.find(a => a.id === id);
        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }
        // Validera medlem existerar
        const member = data.members.find(m => m.id === memberId);
        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }
        //Medlem måste ha samma category som assignment
        if (member.category !== assignment.category) {
            return res.status(400).json({
                message: `Cannot assign member with category "${member.category}" to assignment with category "${assignment.category}"`
            });
        }
        const updatedAssignment = await (0, fileOperations_1.updateAssignment)(id, {
            assignedTo: memberId,
            status: 'doing'
        });
        res.json({ message: 'Assignment assigned', updatedAssignment });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to assign assignment' });
    }
});
exports.app.patch('/assignments/:id/unassign', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedAssignment = await (0, fileOperations_1.updateAssignment)(id, {
            assignedTo: undefined,
            status: 'new'
        });
        res.json({ message: 'Assignment unassigned', updatedAssignment });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to unassign' });
    }
});
//          MEMBERS
exports.app.post('/members', async (req, res) => {
    console.log(req.body);
    try {
        if ((0, types_1.isNewMember)(req.body)) {
            const newMember = await (0, fileOperations_1.addMember)(req.body);
            res.json({ message: 'success', newMember });
        }
        else {
            res.status(400).json({ message: 'Wrong format' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'failed to add member' });
    }
});
