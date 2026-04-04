import {
    getAllProjects,
    getProjectDetails,
    getCategoriesByProjectId,
    createProject,
    updateProject
} from '../models/projects.js';
import { getAllOrganizations } from '../models/organizations.js';
import { body, validationResult } from 'express-validator';

const projectValidation = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Title is required')
        .bail()
        .isLength({ min: 3, max: 200 })
        .withMessage('Title must be between 3 and 200 characters')
        .escape(),

    body('description')
        .trim()
        .notEmpty()
        .withMessage('Description is required')
        .bail()
        .isLength({ max: 1000 })
        .withMessage('Description must be less than 1000 characters')
        .escape(),

    body('location')
        .trim()
        .notEmpty()
        .withMessage('Location is required')
        .bail()
        .isLength({ max: 200 })
        .withMessage('Location must be less than 200 characters')
        .escape(),

    body('date')
        .notEmpty()
        .withMessage('Date is required')
        .bail()
        .isISO8601()
        .withMessage('Date must be a valid date format'),

    body('organizationId')
        .notEmpty()
        .withMessage('Organization is required')
        .bail()
        .isInt()
        .withMessage('Organization must be a valid integer')
];

const showProjectsPage = async (req, res, next) => {
    try {
        const projects = await getAllProjects();
        const title = 'Service Projects';

        res.render('projects', { title, projects });
    } catch (error) {
        next(error);
    }
};

const showProjectDetailsPage = async (req, res, next) => {
    try {
        const projectId = req.params.id;
        const projectDetails = await getProjectDetails(projectId);
        const categories = await getCategoriesByProjectId(projectId);

        if (!projectDetails) {
            const err = new Error('Project not found');
            err.status = 404;
            return next(err);
        }

        const title = 'Project Details';
        res.render('project', { title, projectDetails, categories });
    } catch (error) {
        next(error);
    }
};

const showNewProjectForm = async (req, res, next) => {
    try {
        const organizations = await getAllOrganizations();
        const title = 'Add New Service Project';

        res.render('new-project', { title, organizations });
    } catch (error) {
        next(error);
    }
};

const processNewProjectForm = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            errors.array().forEach((error) => {
                req.flash('error', error.msg);
            });

            return res.redirect('/new-project');
        }

        const { title, description, location, date, organizationId } = req.body;

        await createProject(title, description, location, date, organizationId);

        req.flash('success', 'New service project created successfully!');
        res.redirect('/projects');
    } catch (error) {
        next(error);
    }
};

const showEditProjectForm = async (req, res, next) => {
    try {
        const projectId = req.params.id;
        const projectDetails = await getProjectDetails(projectId);
        const organizations = await getAllOrganizations();

        if (!projectDetails) {
            const err = new Error('Project not found');
            err.status = 404;
            return next(err);
        }

        const title = 'Edit Service Project';
        res.render('edit-project', { title, projectDetails, organizations });
    } catch (error) {
        next(error);
    }
};

const processEditProjectForm = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            errors.array().forEach((error) => {
                req.flash('error', error.msg);
            });

            return res.redirect(`/edit-project/${req.params.id}`);
        }

        const projectId = req.params.id;
        const { title, description, location, date, organizationId } = req.body;

        await updateProject(projectId, title, description, location, date, organizationId);

        req.flash('success', 'Service project updated successfully!');
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        next(error);
    }
};

export {
    showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    showEditProjectForm,
    processEditProjectForm,
    projectValidation
};