import express from "express";
import cors from "cors";
import {addAssignment, addMember, getData, deleteAssignment, updateAssignment} from "./fileOperations"
import { isNewAssignment, isNewMember } from "./types";
import type { Assignment } from "./types";

export const app = express();
app.use(express.json())
app.use(cors());


app.get('/data', async (req, res) => {
    try{
            const data = await getData();
            console.log('Get all Data')
            res.json(data);
        }
    catch (error) {
        console.log(error)
        res.status(500).json({ message: 'failed to get movie or movies' });
    }
})

//          ASSIGNMENTS

app.post('/assignments', async (req, res) => {

    console.log(req.body);

    try {
        if(isNewAssignment(req.body)){
            const newAssignment = await addAssignment(req.body);
            res.json({ message: 'success', newAssignment });
        }
        else{
            res.status(400).json({ message: 'Wrong format' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'failed to add assignment' });
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
})

app.patch('/assignments/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body; 
        
        const updatedAssignment = await updateAssignment(id, updates);
        res.json({ message: 'Assignment updated', updatedAssignment });
    }
    catch (error) {
        if (error instanceof Error && error.message.includes('not found')) {
            res.status(404).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Failed to update assignment' });
        }
    }
})

//          ASSIGN/UNASSIGN MEMBERS

app.patch('/assignments/:id/assign', async (req, res) => {
    //assignment id i endpointen - member id i req.body (det du skriver i postman body)
    try {
        const { id } = req.params;
        const { memberId } = req.body;
        
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
        res.status(500).json({ message: 'Failed to assign assignment' });
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
        res.status(500).json({ message: 'Failed to unassign' });
    }
})

//          MEMBERS

app.post('/members', async (req, res) => {

    console.log(req.body);

    try {
        if(isNewMember(req.body)){
            const newMember = await addMember(req.body);
            res.json({message: 'success', newMember});
        }
        else{
            res.status(400).json({ message: 'Wrong format' });
        }
    } catch (error) {
        res.status(500).json({ message: 'failed to add member' });
    }
})
