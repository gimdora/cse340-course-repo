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

const getProjectsByOrganizationId = async (organizationId) => {
    const query = `
        SELECT
            project_id,
            organization_id,
            name,
            description
        FROM service_project
        WHERE organization_id = $1
        ORDER BY project_id;
    `;

    const query_params = [organizationId];
    const result = await db.query(query, query_params);

    return result.rows;
};

export { getAllProjects, getProjectsByOrganizationId };