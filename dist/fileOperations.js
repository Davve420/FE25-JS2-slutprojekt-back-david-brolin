"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addMember = exports.updateAssignment = exports.deleteAssignment = exports.addAssignment = exports.getData = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const crypto_1 = __importDefault(require("crypto"));
const DATA_PATH = './public/data.json';
const getData = async () => {
    try {
        const jsonData = await promises_1.default.readFile(DATA_PATH, 'utf-8');
        const [dataObject] = JSON.parse(jsonData); // Plockar första elementet från arrayen
        const { assignments, Members: members } = dataObject; // Destructure 
        return { assignments, members };
    }
    catch (error) {
        throw error;
    }
};
exports.getData = getData;
const writeData = async (data) => {
    try {
        // Skriva tillbaka i samma format som JSON-filen förväntar
        const dataToWrite = [{ assignments: data.assignments, Members: data.members }];
        await promises_1.default.writeFile(DATA_PATH, JSON.stringify(dataToWrite, null, 2));
    }
    catch (error) {
        throw error;
    }
};
//          ASSIGNMENTS
const addAssignment = async (assingment) => {
    const data = await (0, exports.getData)();
    // Lägg till ett ID & timestamp
    const newAssignment = {
        id: crypto_1.default.randomUUID(), ...assingment,
        status: 'new',
        assignedTo: undefined,
        timestamp: new Date().toISOString()
    };
    data.assignments.push(newAssignment);
    try {
        await writeData(data);
        return newAssignment;
    }
    catch (error) {
        throw error;
    }
};
exports.addAssignment = addAssignment;
const deleteAssignment = async (id) => {
    const data = await (0, exports.getData)();
    const assignment = data.assignments.find(a => a.id === id);
    // Validering - bara ta bort om status är "done"
    if (!assignment) {
        throw new Error('Assignment not found');
    }
    if (assignment.status !== 'done') {
        throw new Error('Can only delete assignments with status "done"');
    }
    data.assignments = data.assignments.filter(a => a.id !== id);
    await writeData(data);
};
exports.deleteAssignment = deleteAssignment;
const updateAssignment = async (id, updates // för att kunna uppdatera vad som helst i assignment utan att påverka de andra egenskaperna. 
) => {
    try {
        const data = await (0, exports.getData)();
        const assignment = data.assignments.find(a => a.id === id);
        if (!assignment) {
            throw new Error('Assignment not found');
        }
        //Merge updates in i objektet
        Object.assign(assignment, updates);
        await writeData(data);
        return assignment;
    }
    catch (error) {
        throw error;
    }
};
exports.updateAssignment = updateAssignment;
//          MEMBERS
const addMember = async (member) => {
    const data = await (0, exports.getData)();
    // Lägg till ett ID 
    const newMember = {
        id: crypto_1.default.randomUUID(), ...member,
    };
    data.members.push(newMember);
    try {
        await writeData(data);
        return newMember;
    }
    catch (error) {
        throw error;
    }
};
exports.addMember = addMember;
