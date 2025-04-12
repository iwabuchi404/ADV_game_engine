import { Scene, Scenario, Effect, Choice, Character, TextBlock } from '../types/scenario';

class ScenarioEngine {
  private scenario: Scenario | null = null;
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

  getScene(id: string): Scene | null {
    if (!this.scenario) {
      console.error('No scenario loaded.');
      return null;
    }
    const scene = this.scenario.scenes.find((scene) => scene.id === id);
    if (!scene) {
      console.error(`Scene with ID ${id} not found.`);
      return null;
    }
    return scene;
  }
}
export default ScenarioEngine;
