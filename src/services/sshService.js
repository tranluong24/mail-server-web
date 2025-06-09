import { NodeSSH } from 'node-ssh';

import dotenv from 'dotenv';
dotenv.config();

export const createMailDirectories = async (emails) => {
    console.log('📁 Creating mail directories for emails:', emails);
    const ssh = new NodeSSH();
    
    try {
        console.log('🔌 Connecting to SSH server...');
        await ssh.connect({
            host: process.env.SSH_HOST,
            port: process.env.SSH_PORT,
            username: process.env.SSH_USERNAME,
            password: process.env.SSH_PASS,
            forceIPv4: true,
            forceIPv6: false
        });
        console.log('✅ SSH connection established');

        // Create directories for each email
        for (const email of emails) {
            const username = email.split('@')[0];
            console.log(`📁 Creating directories for email: ${email}`);
            
            const userPath = `/var/mail/vhosts/email.tekmonk.edu.vn/${username}`;
            const commands = [
                `maildirmake ${userPath}`,
                `chown -R vmail:vmail ${userPath}`,
                `chmod -R 700 ${userPath}`
            ];

            for (const command of commands) {
                console.log('▶ Executing:', command);
                const result = await ssh.execCommand(command);
                if (result.code !== 0) {
                    throw new Error(`Command failed: ${command}\nError: ${result.stderr}`);
                }
                console.log('✅ Command executed successfully:', command);
            }
            console.log(`✅ Directories created for email: ${email}`);
        }

        console.log('🎉 All directories created successfully');
    } catch (error) {
        console.error('❌ SSH error:', {
            message: error.message,
            code: error.code,
            stack: error.stack
        });
        throw error;
    } finally {
        console.log('🔒 Closing SSH connection');
        ssh.dispose();
    }
};
