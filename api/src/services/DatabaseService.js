import fs from 'fs';

export class DatabaseService {
    constructor(dbPath) {
        this.dbPath = dbPath;
    }

    async readData() {
        try {
            const data = fs.readFileSync(this.dbPath, 'utf-8');
            return JSON.parse(data);
        } catch (err) {
            if (err.code === 'ENOENT') {
                return {};
            }
            throw err;
        }
    }

    async writeData(data) {
        try {
            fs.writeFileSync(this.dbPath, JSON.stringify(data, null, 2), 'utf-8');
        } catch (err) {
            console.error('Error while writing JSON DB File:', err);
            throw err;
        }
    }

    async add(collection, data) {
        const db = await this.readData();
        db[collection] = db[collection] || [];
        const newItem = { ...data, id: generateRandomID() };
        db[collection].push(newItem);
        await this.writeData(db);
        return newItem;
    }

    async get(collection) {
        const db = await this.readData();
        return db[collection] || [];
    }

    async delete(collection, id) {
        const db = await this.readData();
        if (!db[collection]) return false;

        const initialLength = db[collection].length;
        db[collection] = db[collection].filter(item => item.id !== id);

        if (db[collection].length === initialLength) return false;
        await this.writeData(db);
        return true;
    }

    async update(collection, id, newData) {
        const db = await this.readData();
        if (!db[collection]) return false;

        const index = db[collection].findIndex(item => item.id === id);
        if (index === -1) return false;

        db[collection][index] = { ...db[collection][index], ...newData };
        await this.writeData(db);
        return true;
    }
}