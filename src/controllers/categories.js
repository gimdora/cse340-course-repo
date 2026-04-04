import {
    getAllCategories,
    getCategoryDetails,
    getProjectsByCategoryId,
    updateCategoryAssignments
} from '../models/categories.js';
import {
    getProjectDetails,
    getCategoriesByProjectId
} from '../models/projects.js';

const showCategoriesPage = async (req, res, next) => {
    try {
        const categories = await getAllCategories();
        const title = 'Categories';

        res.render('categories', { title, categories });
    } catch (error) {
        next(error);
    }
};

const showCategoryDetailsPage = async (req, res, next) => {
    try {
        const categoryId = req.params.id;
        const categoryDetails = await getCategoryDetails(categoryId);
        const projects = await getProjectsByCategoryId(categoryId);

        if (!categoryDetails) {
            const err = new Error('Category not found');
            err.status = 404;
            return next(err);
        }

        const title = 'Category Details';
        res.render('category', { title, categoryDetails, projects });
    } catch (error) {
        next(error);
    }
};

const showAssignCategoriesForm = async (req, res, next) => {
    try {
        const projectId = req.params.projectId;

        const projectDetails = await getProjectDetails(projectId);
        if (!projectDetails) {
            const err = new Error('Project not found');
            err.status = 404;
            return next(err);
        }

        const categories = await getAllCategories();
        const assignedCategories = await getCategoriesByProjectId(projectId);

        const title = 'Assign Categories to Project';

        res.render('assign-categories', {
            title,
            projectId,
            projectDetails,
            categories,
            assignedCategories
        });
    } catch (error) {
        next(error);
    }
};

const processAssignCategoriesForm = async (req, res, next) => {
    try {
        const projectId = req.params.projectId;
        const selectedCategoryIds = req.body.categoryIds || [];

        const categoryIdsArray = Array.isArray(selectedCategoryIds)
            ? selectedCategoryIds
            : [selectedCategoryIds];

        await updateCategoryAssignments(projectId, categoryIdsArray);

        req.flash('success', 'Categories updated successfully!');
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        next(error);
    }
};

export {
    showCategoriesPage,
    showCategoryDetailsPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm
};