import { createApi } from 'unsplash-js';
import * as nodeFetch from 'node-fetch';

export class UnsplashService {
    constructor(credentials) {
        this.api = createApi({
            accessKey: credentials.accessKey,
            secretKey: credentials.secretKey,
            fetch: nodeFetch.default
        });
    }

    async getRandomPhotos(collections = [], count = 30) {
        try {
            const { response } = await this.api.photos.getRandom({
                orientation: 'landscape',
                collectionIds: collections,
                count
            });
            return response || [];
        } catch (error) {
            console.error("Error fetching photos from Unsplash:", error);
            return [];
        }
    }
}