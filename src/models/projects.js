import db from './db.js';

const getAllProjects = async () => {
    const query = `
        SELECT project_id, organization_id, name, description
        FROM public.service_project
        ORDER BY project_id;
    `;

    const result = await db.query(query);
    return result.rows;
};

export { getAllProjects };