import express from 'express';
import cors from 'cors';
import path from 'path';
import { DatabaseService } from './services/DatabaseService.js';
import { FileService } from './services/FileService.js';
import { PhotoService } from './services/PhotoService.js';
import { AdminController } from './controllers/AdminController.js';
import { PhotoController } from './controllers/PhotoController.js';
import { createAdminRouter } from './routes/admin.js';
import { createPhotoRouter } from './routes/photos.js';

const initApp = () => {
    const app = express();
    
    // Middleware
    app.use(cors('*'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Services
    const db = new DatabaseService(path.resolve('./res/db.json'));
    const fileService = new FileService(path.resolve('./res'));
    
    // Controllers
    const adminController = new AdminController(db);
    const photoController = new PhotoController(
        db,
        new PhotoService(fileService)
    );

    // Routes
    app.use('/admin', createAdminRouter(adminController));
    app.use('/photos', createPhotoRouter(photoController));

    // Error handling
    app.use((err, req, res, next) => {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    });

    return app;
};

export { initApp };