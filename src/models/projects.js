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

    const queryParams = [organizationId];
    const result = await db.query(query, queryParams);

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

    const queryParams = [projectId];
    const result = await db.query(query, queryParams);

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

    const queryParams = [projectId];
    const result = await db.query(query, queryParams);

    return result.rows;
};

const isUserVolunteeringForProject = async (userId, projectId) => {
    const query = `
        SELECT 1
        FROM public.project_volunteer
        WHERE user_id = $1
          AND project_id = $2;
    `;

    const queryParams = [userId, projectId];
    const result = await db.query(query, queryParams);

    return result.rows.length > 0;
};

const addVolunteerToProject = async (userId, projectId) => {
    const query = `
        INSERT INTO public.project_volunteer (user_id, project_id)
        VALUES ($1, $2)
        ON CONFLICT (user_id, project_id) DO NOTHING
        RETURNING user_id, project_id;
    `;

    const queryParams = [userId, projectId];
    const result = await db.query(query, queryParams);

    return result.rows.length > 0;
};

const removeVolunteerFromProject = async (userId, projectId) => {
    const query = `
        DELETE FROM public.project_volunteer
        WHERE user_id = $1
          AND project_id = $2
        RETURNING user_id, project_id;
    `;

    const queryParams = [userId, projectId];
    const result = await db.query(query, queryParams);

    return result.rows.length > 0;
};

const getVolunteerProjectsByUserId = async (userId) => {
    const query = `
        SELECT
            sp.project_id,
            sp.organization_id,
            sp.name,
            sp.description,
            sp.location,
            sp."date" AS date,
            o.name AS organization_name
        FROM public.project_volunteer pv
        JOIN public.service_project sp
            ON pv.project_id = sp.project_id
        JOIN public.organization o
            ON sp.organization_id = o.organization_id
        WHERE pv.user_id = $1
        ORDER BY sp."date" ASC NULLS LAST, sp.project_id DESC;
    `;

    const queryParams = [userId];
    const result = await db.query(query, queryParams);

    return result.rows;
};

const createProject = async (title, description, location, date, organizationId) => {
    const query = `
        INSERT INTO public.service_project (name, description, location, "date", organization_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING project_id;
    `;

    const queryParams = [title, description, location, date, organizationId];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create project');
    }

    return result.rows[0].project_id;
};

const updateProject = async (projectId, title, description, location, date, organizationId) => {
    const query = `
        UPDATE public.service_project
        SET
            name = $1,
            description = $2,
            location = $3,
            "date" = $4,
            organization_id = $5
        WHERE project_id = $6
        RETURNING project_id;
    `;

    const queryParams = [title, description, location, date, organizationId, projectId];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Project not found');
    }

    return result.rows[0].project_id;
};

export {
    getAllProjects,
    getProjectsByOrganizationId,
    getProjectDetails,
    getCategoriesByProjectId,
    isUserVolunteeringForProject,
    addVolunteerToProject,
    removeVolunteerFromProject,
    getVolunteerProjectsByUserId,
    createProject,
    updateProject
};