import { Movement } from 'systems/movement';
import { Sequenceable } from 'systems/sequence/contracts/sequenceable';

export class MoveToTarget implements Sequenceable {
  private isStarted: boolean = false;

  constructor(
    private movement: Movement,
    private target: Phaser.Math.Vector2
  ) {}

  reset(): void {
    this.isStarted = false;
  }

  update(): void {
    if (!this.isStarted) {
      this.movement.moveTo(this.target);

      this.isStarted = true;
    }
  }

  isComplete(): boolean {
    return this.target.clone().subtract(this.movement.position()).length() < 2;
  }
}
