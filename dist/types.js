"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNewMember = exports.isNewAssignment = void 0;
const isNewAssignment = (obj) => {
    return (typeof obj === 'object' &&
        typeof obj.title === 'string' &&
        typeof obj.description === 'string' &&
        (obj.category === 'ux' || obj.category === 'dev-frontend' || obj.category === 'dev-backend'));
};
exports.isNewAssignment = isNewAssignment;
const isNewMember = (obj) => {
    return (typeof obj === 'object' &&
        typeof obj.name === 'string' &&
        (obj.category === 'ux' || obj.category === 'dev-frontend' || obj.category === 'dev-backend') &&
        (obj.role === 'admin' || obj.role === 'member'));
};
exports.isNewMember = isNewMember;
