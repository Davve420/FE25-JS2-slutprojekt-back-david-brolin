type Category = 'ux'| 'dev-frontend' | 'dev-backend';
type Status = 'new' | 'doing' | 'done';

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

export const isNewAssignment = (obj: any) =>{
    return ( typeof obj === 'object' &&
        typeof obj.title === 'string' &&
        typeof obj.description === 'string' &&
        (obj.category === 'ux' || obj.category === 'dev-frontend' || obj.category === 'dev-backend')
    )
}

export type Member = {
    id: `${string}-${string}-${string}-${string}-${string}`,
    name: string,
    category: Category
}

export type NewMember = {
    name: string,
    category: Category
}

export const isNewMember = (obj: any) =>{
    return ( typeof obj === 'object' &&
        typeof obj.name === 'string' &&
        (obj.category === 'ux' || obj.category === 'dev-frontend' || obj.category === 'dev-backend')
    )
}

export type Data = {
    assignments: Assignment[],
    members: Member[]
}