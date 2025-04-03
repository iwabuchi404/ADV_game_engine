/**
 * アセットローダー
 * ゲーム内のアセット（画像、音声など）の読み込みを管理するクラス
 */
class AssetLoader {
  constructor() {
    // 読み込み済みアセットのキャッシュ
    this.cache = {
      images: {},
      audio: {}
    };
    
    // アセットの基本パス
    this.basePath = '/assets';
    
    // 読み込み中のアセットのプロミス
    this.loadingPromises = {};
  }

  /**
   * 画像を読み込む
   * @param {string} path - 画像のパス（/assets からの相対パス）
   * @returns {Promise<HTMLImageElement>} 画像要素のプロミス
   */
  loadImage(path) {
    const fullPath = `${this.basePath}${path}`;
    
    // キャッシュにあればそれを返す
    if (this.cache.images[fullPath]) {
      return Promise.resolve(this.cache.images[fullPath]);
    }
    
    // 読み込み中であればそのプロミスを返す
    if (this.loadingPromises[fullPath]) {
      return this.loadingPromises[fullPath];
    }
    
    // 新しく読み込む
    const promise = new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        this.cache.images[fullPath] = img;
        delete this.loadingPromises[fullPath];
        resolve(img);
      };
      
      img.onerror = (error) => {
        delete this.loadingPromises[fullPath];
        reject(error);
      };
      
      img.src = fullPath;
    });
    
    this.loadingPromises[fullPath] = promise;
    return promise;
  }

  /**
   * 音声を読み込む
   * @param {string} path - 音声のパス（/assets からの相対パス）
   * @returns {Promise<HTMLAudioElement>} 音声要素のプロミス
   */
  loadAudio(path) {
    const fullPath = `${this.basePath}${path}`;
    
    // キャッシュにあればそれを返す
    if (this.cache.audio[fullPath]) {
      return Promise.resolve(this.cache.audio[fullPath]);
    }
    
    // 読み込み中であればそのプロミスを返す
    if (this.loadingPromises[fullPath]) {
      return this.loadingPromises[fullPath];
    }
    
    // 新しく読み込む
    const promise = new Promise((resolve, reject) => {
      const audio = new Audio();
      
      audio.oncanplaythrough = () => {
        this.cache.audio[fullPath] = audio;
        delete this.loadingPromises[fullPath];
        resolve(audio);
      };
      
      audio.onerror = (error) => {
        delete this.loadingPromises[fullPath];
        reject(error);
      };
      
      audio.src = fullPath;
      audio.load();
    });
    
    this.loadingPromises[fullPath] = promise;
    return promise;
  }

  /**
   * 複数の画像を一括読み込み
   * @param {Array<string>} paths - 画像のパスの配列
   * @returns {Promise<Array<HTMLImageElement>>} 画像要素の配列のプロミス
   */
  preloadImages(paths) {
    return Promise.all(paths.map(path => this.loadImage(path)));
  }

  /**
   * 複数の音声を一括読み込み
   * @param {Array<string>} paths - 音声のパスの配列
   * @returns {Promise<Array<HTMLAudioElement>>} 音声要素の配列のプロミス
   */
  preloadAudio(paths) {
    return Promise.all(paths.map(path => this.loadAudio(path)));
  }

  /**
   * キャラクターの全表情画像を一括読み込み
   * @param {string} characterId - キャラクターID
   * @param {Array<string>} expressions - 表情の配列
   * @returns {Promise<Array<HTMLImageElement>>} 画像要素の配列のプロミス
   */
  preloadCharacterExpressions(characterId, expressions) {
    const paths = expressions.map(expression => 
      `/images/characters/${characterId}_${expression}.png`
    );
    return this.preloadImages(paths);
  }

  /**
   * キャッシュをクリア
   * @param {string} type - クリアするキャッシュのタイプ（'all', 'images', 'audio'）
   */
  clearCache(type = 'all') {
    if (type === 'all' || type === 'images') {
      this.cache.images = {};
    }
    
    if (type === 'all' || type === 'audio') {
      this.cache.audio = {};
    }
  }

  /**
   * JSONファイルを読み込む
   * @param {string} path - JSONのパス（/assets からの相対パス）
   * @returns {Promise<Object>} JSONオブジェクトのプロミス
   */
  async loadJSON(path) {
    const fullPath = `${this.basePath}${path}`;
    
    try {
      const response = await fetch(fullPath);
      return await response.json();
    } catch (error) {
      console.error(`Failed to load JSON from ${fullPath}:`, error);
      throw error;
    }
  }
}

export default AssetLoader;
