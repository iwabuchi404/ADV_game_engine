/**
 * シナリオエンジン
 * ゲームのシナリオデータを管理し、ストーリーの進行や分岐を制御するクラス
 */
class ScenarioEngine {
  constructor() {
    // シナリオデータ
    this.scenario = null;
    // 現在のシーンのインデックス
    this.currentSceneIndex = 0;
    // 現在のシーン
    this.currentScene = null;
    // シーン履歴
    this.history = [];
    // ゲーム変数・フラグ
    this.state = {
      variables: {},
      flags: {}
    };
  }

  /**
   * シナリオデータを読み込む
   * @param {string} scenarioId - シナリオID
   * @returns {Promise<boolean>} 読み込み成功したかどうか
   */
  async loadScenario(scenarioId) {
    try {
      const response = await fetch(`/assets/scenarios/${scenarioId}.json`);
      this.scenario = await response.json();
      this.currentSceneIndex = 0;
      this.currentScene = this.scenario.scenes[0];
      return true;
    } catch (error) {
      console.error('Failed to load scenario:', error);
      return false;
    }
  }

  /**
   * 現在のシーンの初期状態を取得
   * @returns {Object} シーンの状態
   */
  getInitialState() {
    const scene = this.currentScene;
    return {
      currentScene: scene.id,
      background: scene.background,
      bgm: scene.bgm || null,
      characters: scene.characters || [],
      text: scene.dialog ? scene.dialog.text : '',
      speaker: scene.dialog ? scene.dialog.speaker : '',
      choices: scene.choices || [],
    };
  }

  /**
   * テキストを次に進める
   * @returns {Object|null} 次のシーンの状態またはnull
   */
  advance() {
    // 現在のシーンに選択肢がある場合は進めない
    if (this.currentScene.choices && this.currentScene.choices.length > 0) {
      return null;
    }

    // 履歴に現在のシーンを追加
    this.history.push(this.currentSceneIndex);

    // 次のシーンIDを取得
    const nextSceneId = this.currentScene.next;
    if (!nextSceneId) {
      // 次のシーンがない場合はnullを返す
      return null;
    }

    // 次のシーンを検索
    const nextSceneIndex = this.scenario.scenes.findIndex(scene => scene.id === nextSceneId);
    if (nextSceneIndex === -1) {
      console.error(`Scene with id ${nextSceneId} not found`);
      return null;
    }

    this.currentSceneIndex = nextSceneIndex;
    this.currentScene = this.scenario.scenes[nextSceneIndex];

    return {
      currentScene: this.currentScene.id,
      background: this.currentScene.background,
      bgm: this.currentScene.bgm || null,
      characters: this.currentScene.characters || [],
      text: this.currentScene.dialog ? this.currentScene.dialog.text : '',
      speaker: this.currentScene.dialog ? this.currentScene.dialog.speaker : '',
      choices: this.currentScene.choices || [],
    };
  }

  /**
   * 選択肢を選択
   * @param {number} choiceIndex - 選択肢のインデックス
   * @returns {Object|null} 次のシーンの状態またはnull
   */
  selectChoice(choiceIndex) {
    const choice = this.currentScene.choices[choiceIndex];
    if (!choice) {
      console.error(`Choice with index ${choiceIndex} not found`);
      return null;
    }

    // 選択肢の効果を適用（変数の変更など）
    if (choice.effects) {
      this.applyEffects(choice.effects);
    }

    // 選択肢に対応する次のシーンIDを取得
    const nextSceneId = choice.next;
    if (!nextSceneId) {
      console.error('Next scene id not found for choice');
      return null;
    }

    // 次のシーンを検索
    const nextSceneIndex = this.scenario.scenes.findIndex(scene => scene.id === nextSceneId);
    if (nextSceneIndex === -1) {
      console.error(`Scene with id ${nextSceneId} not found`);
      return null;
    }

    // 履歴に現在のシーンを追加
    this.history.push(this.currentSceneIndex);

    this.currentSceneIndex = nextSceneIndex;
    this.currentScene = this.scenario.scenes[nextSceneIndex];

    return {
      currentScene: this.currentScene.id,
      background: this.currentScene.background,
      bgm: this.currentScene.bgm || null,
      characters: this.currentScene.characters || [],
      text: this.currentScene.dialog ? this.currentScene.dialog.text : '',
      speaker: this.currentScene.dialog ? this.currentScene.dialog.speaker : '',
      choices: this.currentScene.choices || [],
    };
  }

  /**
   * 効果を適用
   * @param {Array} effects - 効果の配列
   */
  applyEffects(effects) {
    for (const effect of effects) {
      if (effect.type === 'setVariable') {
        this.state.variables[effect.name] = effect.value;
      } else if (effect.type === 'setFlag') {
        this.state.flags[effect.name] = effect.value;
      }
      // 他のエフェクトタイプを追加可能
    }
  }

  /**
   * ゲーム状態をセット
   * @param {Object} state - ゲーム状態
   */
  setState(state) {
    // 保存されたゲーム状態から現在のシーンを復元
    const sceneId = state.currentScene;
    const sceneIndex = this.scenario.scenes.findIndex(scene => scene.id === sceneId);
    if (sceneIndex !== -1) {
      this.currentSceneIndex = sceneIndex;
      this.currentScene = this.scenario.scenes[sceneIndex];
    }
    
    // 他の状態も復元
    if (state.variables) this.state.variables = state.variables;
    if (state.flags) this.state.flags = state.flags;
    if (state.history) this.history = state.history;
  }

  /**
   * ゲーム状態を取得
   * @returns {Object} ゲーム状態
   */
  getState() {
    return {
      currentScene: this.currentScene.id,
      variables: this.state.variables,
      flags: this.state.flags,
      history: this.history
    };
  }

  /**
   * 前のシーンに戻る
   * @returns {Object|null} 前のシーンの状態またはnull
   */
  goBack() {
    if (this.history.length === 0) {
      return null;
    }

    const previousSceneIndex = this.history.pop();
    this.currentSceneIndex = previousSceneIndex;
    this.currentScene = this.scenario.scenes[previousSceneIndex];

    return {
      currentScene: this.currentScene.id,
      background: this.currentScene.background,
      bgm: this.currentScene.bgm || null,
      characters: this.currentScene.characters || [],
      text: this.currentScene.dialog ? this.currentScene.dialog.text : '',
      speaker: this.currentScene.dialog ? this.currentScene.dialog.speaker : '',
      choices: this.currentScene.choices || [],
    };
  }
}

export default ScenarioEngine;
