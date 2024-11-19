import fs from 'fs';
import path from 'path';

export class FileService {
    constructor(basePath) {
        this.basePath = basePath;
    }

    readJsonFile(filePath) {
        const fullPath = path.join(this.basePath, filePath);
        if (!fs.existsSync(fullPath)) {
            fs.writeFileSync(fullPath, JSON.stringify([]));
        }
        const data = fs.readFileSync(fullPath, 'utf-8');
        return JSON.parse(data || '[]');
    }

    writeJsonFile(filePath, data) {
        const fullPath = path.join(this.basePath, filePath);
        fs.writeFileSync(fullPath, JSON.stringify(data));
    }
}