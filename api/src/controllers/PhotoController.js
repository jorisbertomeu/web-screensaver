export class PhotoController {
    constructor(db, photoService) {
        this.db = db;
        this.photoService = photoService;
    }

    async getRandomPhoto(req, res, next) {
        try {
            const data = await this.db.get('settings');
            const settings = data.find(item => item.id === req.params.settingsId);
            
            if (!settings?.unsplash) {
                return res.status(400).json({ error: 'Invalid settings' });
            }

            let collections = settings.unsplash.collectionsId;
            if (collections) {
                collections = Array.isArray(collections) ? collections : [collections];
            }

            const photo = await this.photoService.pickPictureFromFile(collections, false);
            
            if (!photo) {
                return res.status(500).json({ error: 'Failed to fetch photo' });
            }

            res.json(photo);
        } catch(e) {
            next(e);
        }
    }
}