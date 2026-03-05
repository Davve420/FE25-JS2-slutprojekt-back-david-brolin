import express from "express";
import cors from "cors";
import {addAssignment, addMember, getData, deleteAssignment, updateAssignment} from "./fileOperations"
import { isNewAssignment, isNewMember } from "./types";
import type { Assignment } from "./types";

const VALID_STATUSES = new Set<Assignment['status']>(['new', 'doing', 'done']);

function getErrorMessage(error: unknown, fallback: string): string {
    return error instanceof Error && error.message ? error.message : fallback;
}

export const app = express();
app.use(express.json())
app.use(cors());


app.get('/data', async (req, res) => {
    try {
        const data = await getData();
        console.log('Get all Data')
        res.json(data);
    }
    catch (error) {
        console.error('Failed to get data:', error);
        res.status(500).json({ message: getErrorMessage(error, 'Failed to get data') });
    }
})

//          ASSIGNMENTS

app.post('/assignments', async (req, res) => {
    try {
        if(isNewAssignment(req.body)){
            const newAssignment = await addAssignment(req.body);
            res.status(201).json({ message: 'success', newAssignment });
        }
        else{
            res.status(400).json({ message: 'Wrong format' });
        }
    }
    catch (error) {
        console.error('Failed to add assignment:', error);
        res.status(500).json({ message: getErrorMessage(error, 'Failed to add assignment') });
    }
})

app.delete('/assignments/:id', async (req, res) => {
    try {
        const { id } = req.params; 
        
        // deleteAssignment kastar fel om statusen inte är "done"
        await deleteAssignment(id);
        
        res.json({ message: 'Assignment deleted successfully' });
    }
    catch (error) {
        console.error('Failed to delete assignment:', error);

        if (error instanceof Error && error.message.includes('status')) {
            res.status(400).json({ message: error.message });
        }
        else if (error instanceof Error && error.message.includes('not found')) {
            res.status(404).json({ message: 'Assignment not found' });
        }
        else {
            res.status(500).json({ message: getErrorMessage(error, 'Failed to delete assignment') });
        }
    }
})

app.patch('/assignments/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body as Partial<Assignment>;

        if (updates.status && !VALID_STATUSES.has(updates.status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }
        
        const updatedAssignment = await updateAssignment(id, updates);
        res.json({ message: 'Assignment updated', updatedAssignment });
    }
    catch (error) {
        console.error('Failed to update assignment:', error);
        if (error instanceof Error && error.message.includes('not found')) {
            res.status(404).json({ message: error.message });
        } else {
            res.status(500).json({ message: getErrorMessage(error, 'Failed to update assignment') });
        }
    }
})

//          ASSIGN/UNASSIGN MEMBERS

app.patch('/assignments/:id/assign', async (req, res) => {
    try {
        const { id } = req.params;
        const { memberId } = req.body;

        if (typeof memberId !== 'string' || memberId.trim().length === 0) {
            return res.status(400).json({ message: 'memberId is required' });
        }
        
        const data = await getData();
        
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
        
        const updatedAssignment = await updateAssignment(id, { 
            assignedTo: memberId,
            status: 'doing'
        });
        
        res.json({ message: 'Assignment assigned', updatedAssignment });
        
    } catch (error) {
        console.error('Failed to assign assignment:', error);
        res.status(500).json({ message: getErrorMessage(error, 'Failed to assign assignment') });
    }
})

app.patch('/assignments/:id/unassign', async (req, res) => {
    try {
        const { id } = req.params;
        
        const updatedAssignment = await updateAssignment(id, { 
            assignedTo: undefined,
            status: 'new'
        });
        
        res.json({ message: 'Assignment unassigned', updatedAssignment });
        
    } catch (error) {
        console.error('Failed to unassign assignment:', error);
        res.status(500).json({ message: getErrorMessage(error, 'Failed to unassign assignment') });
    }
})

//          MEMBERS

app.post('/members', async (req, res) => {
    try {
        if(isNewMember(req.body)){
            const newMember = await addMember(req.body);
            res.status(201).json({message: 'success', newMember});
        }
        else{
            res.status(400).json({ message: 'Wrong format' });
        }
    } catch (error) {
        console.error('Failed to add member:', error);
        res.status(500).json({ message: getErrorMessage(error, 'Failed to add member') });
    }
})
