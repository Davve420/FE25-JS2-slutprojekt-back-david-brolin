type Category = 'ux'| 'dev-frontend' | 'dev-backend';
type Status = 'new' | 'doing' | 'done';
type Role = 'admin' | 'member';

export type Assignment = {
    id: `${string}-${string}-${string}-${string}-${string}`,
    title: string,
    description: string,
    category: Category,
    status: Status,
    assignedTo: undefined | string,
    timestamp: string
}

export type NewAssignment = {
    title: string,
    description: string,
    category: Category
}

function isObjectRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
}

export const isNewAssignment = (obj: unknown): obj is NewAssignment => {
    if (!isObjectRecord(obj)) {
        return false;
    }

    return (
        typeof obj.title === 'string' &&
        typeof obj.description === 'string' &&
        (obj.category === 'ux' || obj.category === 'dev-frontend' || obj.category === 'dev-backend')
    );
}

export type Member = {
    id: `${string}-${string}-${string}-${string}-${string}`,
    name: string,
    category: Category,
    role: Role
}

export type NewMember = {
    name: string,
    category: Category,
    role: Role
}

export const isNewMember = (obj: unknown): obj is NewMember => {
    if (!isObjectRecord(obj)) {
        return false;
    }

    return (
        typeof obj.name === 'string' &&
        (obj.category === 'ux' || obj.category === 'dev-frontend' || obj.category === 'dev-backend') &&
        (obj.role === 'admin' || obj.role === 'member')
    );
}

export type Data = {
    assignments: Assignment[],
    members: Member[]
}