import { fileURLToPath } from 'url';
import path from 'path';
import express from 'express';

// Define the the application environment
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';

// Define the port number the server will listen on
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// /**
//   * Configure Express middleware
//   */

// // Serve static files from the public directory
// app.use(express.static(path.join(__dirname, 'public')));

// // Set EJS as the templating engine
// app.set('view engine', 'ejs');

// // Tell Express where to find your templates
// app.set('views', path.join(__dirname, 'src/views'));


// view engine & view directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

// static file
app.use(express.static(path.join(__dirname, 'public')));

// 현재 경로를 템플릿에서 사용할 수 있도록 locals에 주입
app.use((req, res, next) => {
  res.locals.path = req.path;  // header.ejs에서 active 표시에 사용
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
    const title = 'Our Partner Organizations';
    res.render('organizations', { title });
});

app.get('/projects', async (req, res) => {
    const title = 'Service Projects';
    res.render('projects', { title });
});

app.get('/categories', async (req, res) => {
    const title = 'Categories';
    res.render('categories', { title });
});


app.listen(PORT, () => {
    console.log(`Server is running at http://127.0.0.1:${PORT}`);
    console.log(`Environment: ${NODE_ENV}`);
});

