import { generatePictureFilename } from '../utils/helper.js';

export class PhotoService {
    constructor(fileService, unsplashService) {
        this.fileService = fileService;
        this.unsplashService = unsplashService;
    }

    async pickPictureFromFile(collections = [], burnPic = true) {
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

            const newPics = await this.unsplashService.getRandomPhotos(collections);
            if (newPics.length === 0) return null;

            this.fileService.writeJsonFile(filename, newPics);
            return newPics[0];

        } catch (error) {
            console.error("Error in pickPictureFromFile:", error);
            return null;
        }
    }
}