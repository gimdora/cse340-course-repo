import bcrypt from 'bcrypt';
import db from './db.js';

const createUser = async (name, email, passwordHash) => {
    const defaultRole = 'user';

    const query = `
        INSERT INTO users (name, email, password_hash, role_id)
        VALUES ($1, $2, $3, (SELECT role_id FROM roles WHERE role_name = $4))
        RETURNING user_id, name, email, role_id, created_at
    `;

    const queryParams = [name, email, passwordHash, defaultRole];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create user');
    }

    return result.rows[0];
};

const findUserByEmail = async (email) => {
    const query = `
        SELECT
            u.user_id,
            u.name,
            u.email,
            u.password_hash,
            u.role_id,
            u.created_at,
            r.role_name,
            r.role_description
        FROM users u
        JOIN roles r
            ON u.role_id = r.role_id
        WHERE LOWER(u.email) = LOWER($1)
    `;

    const queryParams = [email];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        return null;
    }

    return result.rows[0];
};

const verifyPassword = async (password, passwordHash) => {
    return bcrypt.compare(password, passwordHash);
};

const authenticateUser = async (email, password) => {
    const user = await findUserByEmail(email);

    if (!user) {
        return null;
    }

    const passwordIsValid = await verifyPassword(password, user.password_hash);

    if (!passwordIsValid) {
        return null;
    }

    const { password_hash, ...safeUser } = user;
    return safeUser;
};

const getAllUsers = async () => {
    const query = `
        SELECT
            u.user_id,
            u.name,
            u.email,
            r.role_name,
            u.created_at
        FROM users u
        JOIN roles r
            ON u.role_id = r.role_id
        ORDER BY u.user_id ASC
    `;

    const result = await db.query(query);
    return result.rows;
};

export { createUser, authenticateUser, getAllUsers };