import { generatePictureFilename } from '../utils/helper.js';
import { UnsplashService } from './UnsplashService.js';

export class PhotoService {
    constructor(fileService) {
        this.fileService = fileService;
    }

    async pickPictureFromFile(collections = [], burnPic = true, unsplashCreds = null) {
        try {
            const filename = generatePictureFilename(collections.join(','));
            let pics = this.fileService.readJsonFile(filename);

            if (pics.length > 0) {
                const picIndex = Math.floor(Math.random() * pics.length);
                const pic = pics[picIndex];

                if (burnPic) {
                    pics.splice(picIndex, 1);
                    this.fileService.writeJsonFile(filename, pics);
                }

                return pic;
            }
            const unsplashService = new UnsplashService({
                accessKey: unsplashCreds?.accessKey || '',
                secretKey: unsplashCreds?.secretKey || ''
            });
            const newPics = await unsplashService.getRandomPhotos(collections);
            if (newPics.length === 0) {
                return null;
            }

            this.fileService.writeJsonFile(filename, newPics);
            return newPics[0];

        } catch (error) {
            console.error("Error in pickPictureFromFile:", error);
            return null;
        }
    }
}