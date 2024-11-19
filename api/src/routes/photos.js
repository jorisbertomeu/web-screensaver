import express from 'express';

export const createPhotoRouter = (photoController) => {
    const router = express.Router();

    router.get('/random/:settingsId', photoController.getRandomPhoto.bind(photoController));

    return router;
};