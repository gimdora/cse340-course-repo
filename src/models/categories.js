import db from './db.js';

const getAllCategories = async () => {
    const query = `
        SELECT
            category_id,
            name
        FROM public.category
        ORDER BY category_id;
    `;

    const result = await db.query(query);
    return result.rows;
};

const getCategoryDetails = async (categoryId) => {
    const query = `
        SELECT
            category_id,
            name
        FROM public.category
        WHERE category_id = $1;
    `;

    const query_params = [categoryId];
    const result = await db.query(query, query_params);

    return result.rows.length > 0 ? result.rows[0] : null;
};

const getProjectsByCategoryId = async (categoryId) => {
    const query = `
        SELECT
            sp.project_id,
            sp.organization_id,
            sp.name,
            sp.description,
            o.name AS organization_name
        FROM public.project_category pc
        JOIN public.service_project sp
            ON pc.project_id = sp.project_id
        JOIN public.organization o
            ON sp.organization_id = o.organization_id
        WHERE pc.category_id = $1
        ORDER BY sp.project_id;
    `;

    const query_params = [categoryId];
    const result = await db.query(query, query_params);

    return result.rows;
};

export { getAllCategories, getCategoryDetails, getProjectsByCategoryId };