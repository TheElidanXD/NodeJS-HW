import { Sequelize } from 'sequelize';
import * as dotenv from 'dotenv';
dotenv.config();

export const db = new Sequelize(process.env.DATABASE_URL);
db.authenticate().then(() => {
    console.log('Connected');
}).catch(err => {
    console.error('Connection error:', err);
});
