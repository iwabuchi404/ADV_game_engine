import { Scene, Scenario } from '../types/scenario';

class ScenarioEngine {
  /**
   * シナリオデータを読み込む
   * @param scenarioId - シナリオID
   * @returns シナリオデータまたはnull
   */
  async loadScenario(scenarioId: string): Promise<Scenario | null> {
    try {
      const response = await fetch(`/assets/scenarios/${scenarioId}.json`);
      const scenario = await response.json();
      return scenario;
    } catch (error) {
      console.error('Failed to load scenario:', error);
      return null;
    }
  }

  /**
   * シナリオから特定のシーンを取得
   * @param scenario - シナリオデータ
   * @param id - シーンID
   * @returns シーンまたはnull
   */
  getScene(scenario: Scenario, id: string): Scene | null {
    if (!scenario) {
      console.error('No scenario provided.');
      return null;
    }

    const scene = scenario.scenes.find((scene) => scene.id === id);
    if (!scene) {
      console.error(`Scene with ID ${id} not found.`);
      return null;
    }

    return scene;
  }

  /**
   * シナリオの最初のシーンを取得
   * @param scenario - シナリオデータ
   * @returns 最初のシーンまたはnull
   */
  getFirstScene(scenario: Scenario): Scene | null {
    if (!scenario || !scenario.scenes || scenario.scenes.length === 0) {
      console.error('Scenario has no scenes.');
      return null;
    }

    return scenario.scenes[0];
  }
}

export default ScenarioEngine;
