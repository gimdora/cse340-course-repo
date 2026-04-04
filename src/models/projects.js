import db from './db.js';

const getAllProjects = async () => {
    const query = `
        SELECT
            sp.project_id,
            sp.organization_id,
            sp.name,
            sp.description,
            sp.location,
            sp."date" AS date,
            o.name AS organization_name
        FROM public.service_project sp
        JOIN public.organization o
            ON sp.organization_id = o.organization_id
        ORDER BY sp.project_id DESC;
    `;

    const result = await db.query(query);
    return result.rows;
};

const getProjectsByOrganizationId = async (organizationId) => {
    const query = `
        SELECT
            project_id,
            organization_id,
            name,
            description,
            location,
            "date" AS date
        FROM public.service_project
        WHERE organization_id = $1
        ORDER BY project_id;
    `;

    const query_params = [organizationId];
    const result = await db.query(query, query_params);

    return result.rows;
};

const getProjectDetails = async (projectId) => {
    const query = `
        SELECT
            sp.project_id,
            sp.organization_id,
            sp.name,
            sp.description,
            sp.location,
            sp."date" AS date,
            o.name AS organization_name
        FROM public.service_project sp
        JOIN public.organization o
            ON sp.organization_id = o.organization_id
        WHERE sp.project_id = $1;
    `;

    const query_params = [projectId];
    const result = await db.query(query, query_params);

    return result.rows.length > 0 ? result.rows[0] : null;
};

const getCategoriesByProjectId = async (projectId) => {
    const query = `
        SELECT
            c.category_id,
            c.name
        FROM public.project_category pc
        JOIN public.category c
            ON pc.category_id = c.category_id
        WHERE pc.project_id = $1
        ORDER BY c.category_id;
    `;

    const query_params = [projectId];
    const result = await db.query(query, query_params);

    return result.rows;
};

const createProject = async (title, description, location, date, organizationId) => {
    const query = `
        INSERT INTO public.service_project (name, description, location, "date", organization_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING project_id;
    `;

    const query_params = [title, description, location, date, organizationId];
    const result = await db.query(query, query_params);

    if (result.rows.length === 0) {
        throw new Error('Failed to create project');
    }

    return result.rows[0].project_id;
};

export {
    getAllProjects,
    getProjectsByOrganizationId,
    getProjectDetails,
    getCategoriesByProjectId,
    createProject
};