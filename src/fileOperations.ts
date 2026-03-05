import fs from 'fs/promises';
import crypto from 'crypto';
import type { Member, Assignment, NewAssignment, NewMember, Data } from "./types";

const DATA_PATH = './public/data.json';

type RawDataShape = Array<{
    assignments?: Assignment[];
    Members?: Member[];
}>;

export const getData = async (): Promise<Data> => {
    try {
        const jsonData = await fs.readFile(DATA_PATH, 'utf-8');
        const parsedData = JSON.parse(jsonData) as RawDataShape;

        if (!Array.isArray(parsedData) || parsedData.length === 0) {
            throw new Error('Data file has invalid structure');
        }

        const dataObject = parsedData[0];
        const assignments = dataObject.assignments;
        const members = dataObject.Members;

        if (!Array.isArray(assignments) || !Array.isArray(members)) {
            throw new Error('Data file is missing assignments or Members arrays');
        }

        return { assignments, members };
    }
    catch(error) {
        throw new Error(error instanceof Error ? `Failed to read data: ${error.message}` : 'Failed to read data');
    }
}

const writeData = async (data: Data): Promise<void> => {
    try {
        const dataToWrite = [{ assignments: data.assignments, Members: data.members }];
        await fs.writeFile(DATA_PATH, JSON.stringify(dataToWrite, null, 2));
    }
    catch(error) {
        throw new Error(error instanceof Error ? `Failed to write data: ${error.message}` : 'Failed to write data');
    }
}

//          ASSIGNMENTS

export const addAssignment = async (assingment: NewAssignment): Promise<Assignment> => {
    const data = await getData();

    const newAssignment: Assignment = {
        id: crypto.randomUUID(), ...assingment,
        status: 'new',
        assignedTo: undefined,
        timestamp: new Date().toISOString()
    }

    data.assignments.push(newAssignment);

    try {
    await writeData(data);
    return newAssignment;
    }
    catch(error){
        throw new Error(error instanceof Error ? `Failed to add assignment: ${error.message}` : 'Failed to add assignment');
    }
}

export const deleteAssignment = async (id: string): Promise<void> => {
    const data = await getData();
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
}

export const updateAssignment = async (
    id: string, 
    updates: Partial<Assignment>
): Promise<Assignment> => {
    try {
        const data = await getData();
        const assignment = data.assignments.find(a => a.id === id);
        
        if (!assignment) {
            throw new Error('Assignment not found');
        }
        
        Object.assign(assignment, updates);
        await writeData(data);

        return assignment;
        
    } catch (error) {
        throw new Error(error instanceof Error ? `Failed to update assignment: ${error.message}` : 'Failed to update assignment');
    }
}

//          MEMBERS

export const addMember = async (member: NewMember): Promise<Member> => {
    const data = await getData();

    const newMember: Member = {
        id: crypto.randomUUID(), ...member,
    }

    data.members.push(newMember);
    try {
        await writeData(data);
        return newMember;
    }
    catch (error) {
        throw new Error(error instanceof Error ? `Failed to add member: ${error.message}` : 'Failed to add member');
    }
}
