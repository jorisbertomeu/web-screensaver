import express from 'express';

export const createAdminRouter = (adminController) => {
    const router = express.Router();

    router.get('/settings', adminController.getSettings.bind(adminController));
    router.post('/settings/:id', adminController.updateSettings.bind(adminController));
    router.get('/widgets/:settingsId', adminController.getWidgets.bind(adminController));
    router.post('/widgets/:settingsId', adminController.updateWidgets.bind(adminController));

    return router;
};
