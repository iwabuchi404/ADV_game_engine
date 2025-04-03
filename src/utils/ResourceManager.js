import logger from './logger';

class ResourceManager {
  constructor() {
    this.resources = new Map();
    this.loadingPromises = new Map();
  }

  async loadImage(src) {
    if (this.resources.has(src)) {
      return this.resources.get(src);
    }

    if (this.loadingPromises.has(src)) {
      return this.loadingPromises.get(src);
    }

    const loadPromise = new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.resources.set(src, img);
        this.loadingPromises.delete(src);
        resolve(img);
      };
      img.onerror = (error) => {
        this.loadingPromises.delete(src);
        logger.error(`画像の読み込みに失敗しました: ${src}`, error);
        reject(error);
      };
      img.src = src;
    });

    this.loadingPromises.set(src, loadPromise);
    return loadPromise;
  }

  releaseResource(src) {
    this.resources.delete(src);
    logger.debug(`リソースを解放しました: ${src}`);
  }

  releaseAll() {
    this.resources.clear();
    this.loadingPromises.clear();
    logger.info('全リソースを解放しました');
  }
}

export const resourceManager = new ResourceManager();
export default resourceManager;