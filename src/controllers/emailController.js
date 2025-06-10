import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import { createMailDirectories } from '../services/sshService.js';

import dotenv from 'dotenv';
dotenv.config();


// Create emails for new user
export const createEmails = async (req, res) => {
    let connection;
    try {
        console.log('📝 Request body:', req.body);
        const { username } = req.body;
        
        // Validate input
        if (!username) {
            console.log('❌ Username is missing');
            return res.status(400).json({ 
                success: false,
                message: 'Username is required' 
            });
        }

        // Generate 3 random emails
        // const emails = [
        //     `${username}1${Math.floor(Math.random() * 9000) + 1000}@email.tekmonk.edu.vn`,
        //     `${username}2${Math.floor(Math.random() * 9000) + 1000}@email.tekmonk.edu.vn`,
        //     `${username}3${Math.floor(Math.random() * 9000) + 1000}@email.tekmonk.edu.vn`
        // ];
        const emails = [
            `${username}a@email.tekmonk.edu.vn`,
            `${username}b@email.tekmonk.edu.vn`,
            `${username}c@email.tekmonk.edu.vn`
        ];
        console.log('📧 Generated emails:', emails);

        // Create database connection
        console.log('🔌 Connecting to database...');
        try {
            connection = await mysql.createConnection({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASS,
                database: process.env.DB_NAME,
                port: process.env.PORT_DB
            });
            console.log('✅ Database connected');
        } catch (error) {
            console.error('❌ Database connection error:', error);
            return res.status(500).json({
                success: false,
                message: 'Database connection failed',
                error: error.message
            });
        }

        // Create mail directories first
        try {
            console.log('📁 Creating mail directories for emails:', emails);
            await createMailDirectories(emails);
            console.log('✅ Mail directories created successfully');
        } catch (error) {
            console.error('❌ Error creating mail directories:', {
                message: error.message,
                code: error.code,
                stack: error.stack
            });
            return res.status(500).json({ 
                success: false,
                message: 'Failed to create mail directories',
                error: error.message 
            });
        }

        // Insert emails into database
        const createdEmails = [];
        const failedEmails = [];

        for (const email of emails) {
            try {
                console.log('💾 Inserting email into database:', email);
                const password = '123123';
                const hashedPassword = await bcrypt.hash(password, 10);
                
                // Create maildir path using the email username
                const emailUsername = email.split('@')[0];
                const maildir = `email.tekmonk.edu.vn/${emailUsername}/`;

                const [result] = await connection.execute(
                    'INSERT INTO virtual_users (email, password, maildir) VALUES (?, ?, ?)',
                    [email, hashedPassword, maildir]
                );
                createdEmails.push({
                    email,
                    password // Return the plain password to the user
                });
                console.log('✅ Email added to database successfully:', email);
            } catch (error) {
                console.error('❌ Error adding email to database:', {
                    email,
                    error: error.message
                });
                failedEmails.push({
                    email,
                    error: error.message
                });
            }
        }

        if (createdEmails.length === 0) {
            return res.status(500).json({
                success: false,
                message: 'Failed to create any emails',
                failures: failedEmails
            });
        }

        // Return success response
        return res.status(200).json({
            success: true,
            message: 'Emails created successfully',
            emails: createdEmails,
            failures: failedEmails
        });

    } catch (error) {
        console.error('❌ Unexpected error:', {
            message: error.message,
            code: error.code,
            stack: error.stack
        });
        return res.status(500).json({ 
            success: false,
            message: 'Error creating emails',
            error: error.message 
        });
    } finally {
        if (connection) {
            try {
                await connection.end();
                console.log('🔌 Database connection closed');
            } catch (error) {
                console.error('❌ Error closing database connection:', error);
            }
        }
    }
};

// Get user's emails
export const getEmails = async (req, res) => {
    let connection;
    try {
        const { username } = req.params;
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            port: process.env.PORT_DB
        });
        const [rows] = await connection.execute(
            'SELECT email FROM emails WHERE username = ?',
            [username]
        );

        res.json(rows.map(row => row.email));
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error getting emails' });
    } finally {
        if (connection) {
            await connection.end();
        }
    }
};
