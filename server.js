import { getAllOrganizations } from './src/models/organizations.js';
import { getAllCategories } from './src/models/categories.js';
import 'dotenv/config';
import { fileURLToPath } from 'url';
import path from 'path';
import express from 'express';
import { testConnection } from './src/models/db.js';

// Define the application environment
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';

// Define the port number the server will listen on
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// view engine & view directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

// static file
app.use(express.static(path.join(__dirname, 'public')));

// make current path available in templates
app.use((req, res, next) => {
    res.locals.path = req.path;
    next();
});

/**
 * Routes
 */
app.get('/', async (req, res) => {
    const title = 'Home';
    res.render('home', { title });
});

app.get('/organizations', async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Our Partner Organizations';

    res.render('organizations', { title, organizations });
});

app.get('/projects', async (req, res) => {
    const title = 'Service Projects';
    res.render('projects', { title });
});

app.get('/categories', async (req, res) => {
    const categories = await getAllCategories();
    const title = 'Categories';

    res.render('categories', { title, categories });
});

app.listen(PORT, async () => {
    try {
        await testConnection();
        console.log(`Server is running at http://127.0.0.1:${PORT}`);
        console.log(`Environment: ${NODE_ENV}`);
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
});