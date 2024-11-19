import fetch from "node-fetch";

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

            let collections = settings.unsplash?.HACollectionsId;

            if (collections && collections.length > 0) {
                const resp = await fetch(`${settings.hass.endpoint}/api/states/${collections}`, {
                    headers: {
                        Authorization: `Bearer ${settings.hass.token}`
                    }
                });
                const data = await resp?.json();
                collections = data.state;
                if (collections.includes(',')) {
                    collections = collections.split(',');
                }
            } else {
                collections = settings.unsplash.collectionsId;
            }
            if (collections) {
                collections = Array.isArray(collections) ? collections : [collections];
            }

            const photo = await this.photoService.pickPictureFromFile(collections, true, settings.unsplash);
            
            if (!photo) {
                return res.status(500).json({ error: 'Failed to fetch photo' });
            }

            res.json(photo);
        } catch(e) {
            next(e);
        }
    }
}