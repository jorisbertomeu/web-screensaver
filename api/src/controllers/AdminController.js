export class AdminController {
    constructor(db) {
        this.db = db;
    }

    async getSettings(req, res, next) {
        try {
            const data = await this.db.get('settings');
            res.json(data?.[0] || {});
        } catch(e) {
            next(e);
        }
    }

    async updateSettings(req, res, next) {
        try {
            if (req.params.id) {
                console.log('Update', req.params.id);
                await this.db.update('settings', req.params.id, req.body);
            }
            else {
                console.log('Create')
                await this.db.add('settings', req.body);
            }
            res.json(req.body);
        } catch(e) {
            next(e);
        }
    }

    async getWidgets(req, res, next) {
        try {
            const data = await this.db.get('widgets');
            res.json(
                data.filter(item => item.settingsId === req.params.settingsId) || []
            );
        } catch(e) {
            next(e);
        }
    }

    async updateWidgets(req, res, next) {
        try {
            const { settingsId } = req.params;
            const updates = req.body;

            for (const widget of updates) {
                if (!widget.id) {
                    await this.db.add('widgets', { ...widget, settingsId });
                } else {
                    await this.db.update('widgets', widget.id, widget);
                }
            }

            res.json(updates);
        } catch(e) {
            next(e);
        }
    }
}