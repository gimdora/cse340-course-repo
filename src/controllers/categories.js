import { getAllCategories } from '../models/categories.js';

const showCategoriesPage = async (req, res, next) => {
    try {
        const categories = await getAllCategories();
        const title = 'Categories';

        res.render('categories', { title, categories });
    } catch (error) {
        next(error);
    }
};

export { showCategoriesPage };