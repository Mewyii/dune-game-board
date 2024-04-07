import { Component, OnInit } from '@angular/core';
import { ActionField, Reward } from 'src/app/models';
import { SettingsService } from 'src/app/services/settings.service';

interface FieldValue {
  fieldId: string;
  value: number;
}

@Component({
  selector: 'dune-board-evaluation',
  templateUrl: './board-evaluation.component.html',
  styleUrls: ['./board-evaluation.component.scss'],
})
export class BoardEvaluationComponent implements OnInit {
  public fieldValues: FieldValue[] = [];

  constructor(public settingsService: SettingsService) {}

  ngOnInit(): void {
    this.settingsService.settings$.subscribe((x) => {
      const actionFields: ActionField[] = [
        ...x.gameContent.factions.map((x) => x.actionFields).flat(),
        ...x.gameContent.locations.map((x) => x.actionField),
      ];
      if (x.gameContent.ix) {
        actionFields.push(x.gameContent.ix);
      }

      this.fieldValues = [];

      for (const actionField of actionFields) {
        const fieldCosts = actionField.costs ? this.getRewardValue(actionField.costs) : 0;

        const rewardOptionIndex = actionField.rewards.findIndex(
          (x) => x.type === 'separator' || x.type === 'separator-horizontal'
        );
        const fieldHasRewardOptions = rewardOptionIndex > -1;

        if (!fieldHasRewardOptions) {
          const fieldRewards = this.getRewardValue(actionField.rewards);
          let fieldValue = fieldRewards - fieldCosts;

          this.fieldValues.push({ fieldId: actionField.title.en, value: fieldValue });
        } else {
          const optionalRewards = actionField.rewards.filter(
            (item, index) => index === rewardOptionIndex - 1 || index === rewardOptionIndex + 1
          );

          const nonOptionalRewards = this.getRewardValue(
            actionField.rewards.filter((x) => !optionalRewards.some((y) => y.type === x.type))
          );

          let highestOptionalRewardValue = 0;
          for (const reward of optionalRewards) {
            const value = this.getRewardValue([reward]);
            if (value > highestOptionalRewardValue) {
              highestOptionalRewardValue = value;
            }
          }
          let fieldValue = nonOptionalRewards + highestOptionalRewardValue - fieldCosts;

          this.fieldValues.push({ fieldId: actionField.title.en, value: fieldValue });
        }
      }

      this.fieldValues.sort((a, b) => b.value - a.value);
    });
  }

  private getRewardValue(rewards: Reward[]) {
    let value = 0;
    for (const reward of rewards) {
      const amount = reward.amount ?? 1;
      switch (reward.type) {
        case 'water':
          value += 2.25 * amount;
          break;
        case 'spice':
          value += 2 * amount;
          break;
        case 'solari':
          value += 1 * amount;
          break;
        case 'troop':
          if (rewards.some((x) => x.type === 'combat')) {
            value += 2.25 * amount;
          } else {
            value += 1.5 * amount;
          }
          break;
        case 'loose-troop':
          value -= 1.5 * amount;
          break;
        case 'dreadnought':
          if (rewards.some((x) => x.type === 'combat')) {
            value += 7 * amount;
          } else {
            value += 5 * amount;
          }
          break;
        case 'card-draw':
          value += 1.75 * amount;
          break;
        case 'card-discard':
          value -= 1 * amount;
          break;
        case 'card-destroy':
          value += 1.75 * amount;
          break;
        case 'card-draw-or-destroy':
          value += 2 * amount;
          break;
        case 'card-round-start':
          value += 1.5 * amount;
          break;
        case 'intrigue':
          value += 1.75 * amount;
          break;
        case 'persuasion':
          value += 2 * amount;
          break;
        case 'foldspace':
          value += 1.5 * amount;
          break;
        case 'council-seat-small':
        case 'council-seat-large':
          value += 3.5 * amount;
          break;
        case 'sword-master':
        case 'agent':
          value += 14 * amount;
          break;
        case 'intrigue-draw':
          value += 0.1 * amount;
          break;
        case 'tech':
          value += 1 * amount;
          break;
        case 'tech-reduced':
          value += 2.25 * amount;
          break;
        case 'tech-reduced-two':
          value += 4.5 * amount;
          break;
        case 'tech-reduced-three':
          value += 6.75 * amount;
          break;
        case 'combat':
          if (rewards.some((x) => x.type === 'troop')) {
          } else {
            value += 0.75 * amount;
          }
          break;
        case 'faction-influence-up-choice':
          value += 3.5 * amount;
          break;

        case 'faction-influence-up-emperor':
        case 'faction-influence-up-guild':
        case 'faction-influence-up-bene':
        case 'faction-influence-up-fremen':
          value += 3 * amount;
          break;
        case 'faction-influence-up-twice-choice':
          value += 5 * amount;
          break;
        case 'faction-influence-down-choice':
        case 'faction-influence-down-emperor':
        case 'faction-influence-down-guild':
        case 'faction-influence-down-bene':
        case 'faction-influence-down-fremen':
          value -= 3 * amount;
          break;
        case 'shipping':
          value += 2.5 * amount;
          break;
        case 'agent-lift':
        case 'mentat':
          value += 3.5 * amount;
          break;
        case 'victory-point':
          value += 6 * amount;
          break;
        case 'signet-ring':
          value += 2 * amount;
          break;
        case 'sword':
          value += 1 * amount;
          break;
        case 'spice-accumulation':
        case 'intrigue-trash':
        case 'helper-arrow-down':
        case 'helper-arrow-right':
        case 'placeholder':
        case 'separator':
        case 'separator-horizontal':
        case 'control-spice':
        case 'buildup':
        case 'signet-token':
        default:
          break;
      }
    }
    return value;
  }
}
