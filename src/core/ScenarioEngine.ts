import { Scene, Scenario, Effect, Choice, Character, TextBlock } from '../types/scenario';

class ScenarioEngine {
  private scenario: Scenario | null = null;
  private currentSceneIndex: number = 0;
  private currentScene: Scene | null = null;
  private history: string[] = [];
  private currentTextBlockIndex: number = 0;
  private state: {
    variables: Record<string, number>;
    flags: Record<string, boolean>;
  } = {
    variables: {},
    flags: {},
  };

  /**
   * シナリオデータを読み込む
   * @param scenarioId - シナリオID
   * @returns 読み込み成功したかどうか
   */
  async loadScenario(scenarioId: string): Promise<boolean | Scene | null> {
    try {
      const response = await fetch(`/assets/scenarios/${scenarioId}.json`);
      this.scenario = await response.json();
      this.currentSceneIndex = 0;
      this.currentTextBlockIndex = 0;
      this.currentScene = this.scenario.scenes[this.currentSceneIndex];
      return this.scenario.scenes[0];
    } catch (error) {
      console.error('Failed to load scenario:', error);
      return false;
    }
  }

  /// シーンを取得する
  getCurrentScene(): Scene | null {
    return this.currentScene;
  }

  /// シーンを設定する
  setCurrentScene(sceneId: string): Scene | null {
    if (!this.scenario) {
      console.error('No scenario loaded.');
      return null;
    }

    // シーンIDからシーンを検索
    const sceneIndex = this.scenario.scenes.findIndex((scene) => scene.id === sceneId);
    if (sceneIndex === -1) {
      console.error(`Scene with ID ${sceneId} not found.`);
      return null;
    }

    // 現在のシーンを設定
    this.currentSceneIndex = sceneIndex;
    this.currentScene = this.scenario.scenes[sceneIndex];

    return this.currentScene;
  }

  /// シーンを進める
  nextScene(): Scene | null {
    if (!this.currentScene) {
      console.error('No current scene to advance from.');
      return null;
    }

    if (!this.currentScene.next) {
      console.error('Current scene has no next scene defined.');
      return null;
    }

    // 履歴に現在のシーンを追加
    this.history.push(this.currentScene.id);
    // 次のシーンに進む
    return this.setCurrentScene(this.currentScene.next);
  }

  // 履歴から前のシーンに戻る
  backScene(): Scene | null {
    if (this.currentScene) {
      //履歴に現在のシーンを追加
      this.history.push(this.currentScene.id);
      // 履歴から前のシーンを取得
      const previousSceneId = this.history.pop();
      if (!previousSceneId) {
        console.error('No previous scene found in history.');
        return null;
      }
      // シーンを設定
      return this.setCurrentScene(previousSceneId);
    } else {
      console.error('No history to go back to.');
      return null;
    }
  }

  getState() {
    return {
      currentScene: this.currentScene?.id || null,
      variables: this.state.variables,
      flags: this.state.flags,
      history: this.history,
    };
  }

  selectChoice(choiceIndex: number): Scene | null {
    if (!this.currentScene || !this.currentScene.choices) {
      console.error('No current scene to select choice from.');
      return null;
    }
    // 選択肢のインデックスが範囲内か確認
    const choice = this.currentScene.choices[choiceIndex];
    if (!choice) {
      console.error(`Choice with index ${choiceIndex} not found`);
      return null;
    }
    // 選択肢の効果を適用
    if (choice.effects) {
      choice.effects.forEach((effect) => {
        switch (effect.type) {
          case 'setVariable':
            this.state.variables[effect.name] = effect.value;
            break;
          case 'setFlag':
            this.state.flags[effect.name] = effect.value;
            break;
          default:
            console.error(`Unknown effect type: ${effect.type}`);
        }
      });
    }

    this.history.push(this.currentScene.id);
    return this.setCurrentScene(choice.next);
  }

  // 現在のテキストブロックを取得
  getCurrentTextBlock(): TextBlock | null {
    if (
      !this.currentScene ||
      !this.currentScene.textBlocks ||
      this.currentScene.textBlocks.length === 0
    ) {
      return null;
    }
    return this.currentScene.textBlocks[this.currentTextBlockIndex];
  }

  // 次のテキストブロックに進む
  nextTextBlock(): TextBlock | null {
    if (!this.currentScene || !this.currentScene.textBlocks) {
      return null;
    }

    if (this.currentTextBlockIndex < this.currentScene.textBlocks.length - 1) {
      this.currentTextBlockIndex++;
      return this.currentScene.textBlocks[this.currentTextBlockIndex];
    } else {
      // 最後のテキストブロックの場合、次のシーンに進むべきかどうかの判断が必要
      return null;
    }
  }
}
export default ScenarioEngine;
