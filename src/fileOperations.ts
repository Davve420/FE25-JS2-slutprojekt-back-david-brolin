import fs from 'fs/promises';
import crypto from 'crypto';
import type { Member, Assignment, NewAssignment, NewMember, Data } from "./types";

const DATA_PATH = './public/data.json';

export const getData = async (): Promise<Data> => {
    try {
        const jsonData = await fs.readFile(DATA_PATH, 'utf-8');
        const [dataObject] = JSON.parse(jsonData); // Plockar första elementet från arrayen
        
        const { assignments, Members: members } = dataObject; // Destructure 
        
        return { assignments, members }; 
    }
    catch(error) {
        throw error;
    }
}

const writeData = async (data: Data): Promise<void> => {
    try {
        // Skriva tillbaka i samma format som JSON-filen förväntar
        const dataToWrite = [{ assignments: data.assignments, Members: data.members }];
        await fs.writeFile(DATA_PATH, JSON.stringify(dataToWrite, null, 2));
    }
    catch(error) {
        throw error;
    }
}

//          ASSIGNMENTS

export const addAssignment = async (assingment: NewAssignment): Promise<Assignment> => {
    const data = await getData();

    // Lägg till ett ID & timestamp
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
        throw error;
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
    updates: Partial<Assignment> // för att kunna uppdatera vad som helst i assignment utan att påverka de andra egenskaperna. 
): Promise<Assignment> => {
    try {
        const data = await getData();
        const assignment = data.assignments.find(a => a.id === id);
        
        if (!assignment) {
            throw new Error('Assignment not found');
        }
        
        //Merge updates in i objektet
        Object.assign(assignment, updates);
        await writeData(data);

        return assignment;
        
    } catch (error) {
        throw error;
    }
}

//          MEMBERS

export const addMember = async (member: NewMember): Promise<Member> => {
    const data = await getData();

    // Lägg till ett ID 
    const newMember: Member = {
        id: crypto.randomUUID(), ...member,
    }

    data.members.push(newMember);
    try {
        await writeData(data);
        return newMember;
    }
    catch (error) {
        throw error;
    }
}
