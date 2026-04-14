-- ========================================
-- Organization Table
-- ========================================
CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

-- ========================================
-- Insert sample data: Organization
-- ========================================
INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');

-- ========================================
-- Service Project Table
-- ========================================
CREATE TABLE service_project (
    project_id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
-- ========================================
-- Service Project Table
-- ========================================
CREATE TABLE service_project (
    project_id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(200),
    "date" DATE,
    FOREIGN KEY (organization_id) REFERENCES organization(organization_id)
);

-- ========================================
-- Insert data: Service Project
-- ========================================
INSERT INTO service_project (organization_id, name, description, location, "date")
VALUES
(
    1,
    'Community Playground Build',
    'Help build and improve safe playground spaces for local children and families.',
    'Boise Community Park',
    '2026-05-10'
),
(
    2,
    'Neighborhood Garden Program',
    'Support urban gardening projects that provide fresh food and community education.',
    'Downtown Urban Garden',
    '2026-05-17'
),
(
    3,
    'Charity Event Support',
    'Assist with volunteer coordination and event support for local charity programs.',
    'City Volunteer Center',
    '2026-05-24'
);

-- ========================================
-- Category Table
-- ========================================
CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- ========================================
-- Insert data: Category
-- ========================================
INSERT INTO category (name)
VALUES
('Construction'),
('Agriculture'),
('Community Service');

-- ========================================
-- Project-Category Table
-- ========================================
CREATE TABLE project_category (
    project_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    PRIMARY KEY (project_id, category_id),
    FOREIGN KEY (project_id) REFERENCES service_project(project_id),
    FOREIGN KEY (category_id) REFERENCES category(category_id)
);

-- ========================================
-- Insert data: Project-Category
-- ========================================
INSERT INTO project_category (project_id, category_id)
VALUES
(1, 1),
(1, 3),
(2, 2),
(2, 3),
(3, 3);

-- ========================================
-- Roles Table
-- ========================================
CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    role_description TEXT
);

-- ========================================
-- Insert initial roles
-- ========================================
INSERT INTO roles (role_name, role_description)
VALUES
('user', 'Standard user with basic access'),
('admin', 'Administrator with full system access');

-- ========================================
-- Users Table
-- ========================================
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id INTEGER NOT NULL REFERENCES roles(role_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);