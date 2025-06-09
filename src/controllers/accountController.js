import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();


// Save account information
export const saveAccount = async (req, res) => {
    let connection;
    try {
        const { username, password } = req.body;
        
        // Validate input
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username and password are required'
            });
        }

        // Create database connection
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            port: process.env.PORT_DB
        });

        // Insert account into database
        const [result] = await connection.execute(
            'INSERT INTO accounts (username, password) VALUES (?, ?)',
            [username, password]
        );

        return res.status(200).json({
            success: true,
            message: 'Account saved successfully',
            accountId: result.insertId
        });

    } catch (error) {
        console.error('Error saving account:', error);
        return res.status(500).json({
            success: false,
            message: 'Error saving account',
            error: error.message
        });
    } finally {
        if (connection) {
            await connection.end();
        }
    }
};
