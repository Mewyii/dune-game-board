import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AudioManager } from 'src/app/services/audio-manager.service';
import { GameManager } from 'src/app/services/game-manager.service';
import { GameModifiersService } from 'src/app/services/game-modifier.service';
import { IntriguesService } from 'src/app/services/intrigues.service';
import { IntriguesPreviewDialogComponent } from '../_common/dialogs/intrigues-preview-dialog/intrigues-preview-dialog.component';

@Component({
  selector: 'dune-intrigues',
  templateUrl: './intrigues.component.html',
  styleUrl: './intrigues.component.scss',
})
export class IntriguesComponent {
  constructor(
    public intriguesService: IntriguesService,
    private gameManager: GameManager,
    private gameModifierService: GameModifiersService,
    private audioManager: AudioManager,
    private dialog: MatDialog
  ) {}

  public activePlayerId = 0;
  public hasIntrigueVision = false;
  public intrigueStackIsActive = false;

  ngOnInit(): void {
    this.gameManager.activePlayerId$.subscribe((activePlayerId) => {
      this.activePlayerId = activePlayerId;

      this.hasIntrigueVision = this.gameModifierService.playerHasCustomActionAvailable(
        this.activePlayerId,
        'vision-intrigues'
      );

      this.intrigueStackIsActive = false;
    });

    this.gameModifierService.playerGameModifiers$.subscribe(() => {
      this.hasIntrigueVision = this.gameModifierService.playerHasCustomActionAvailable(
        this.activePlayerId,
        'vision-intrigues'
      );
    });
  }

  onDrawIntrigueClicked() {
    this.audioManager.playSound('intrigue');
    this.intriguesService.drawPlayerIntriguesFromDeck(this.activePlayerId, 1);

    this.gameManager.setPreferredFieldsForAIPlayer(this.activePlayerId);
  }

  onShowNextIntrigueClicked() {
    const nextIntrigue = this.intriguesService.intrigueDeck[0];
    if (nextIntrigue) {
      this.dialog.open(IntriguesPreviewDialogComponent, {
        data: {
          title: 'Top Intrigue Card',
          intrigues: [nextIntrigue],
        },
      });
    }
  }

  onSearchIntriguesClicked() {
    const intrigues = this.intriguesService.intrigueDeck;
    if (intrigues) {
      const dialogRef = this.dialog.open(IntriguesPreviewDialogComponent, {
        data: {
          title: 'Intrigue Deck',
          intrigues: intrigues,
          canAquireCards: true,
          playerId: this.activePlayerId,
        },
      });

      dialogRef.afterClosed().subscribe(() => {
        this.intriguesService.shuffleIntrigueDeck();
      });
    }
  }

  onSetIntrigueStackActiveClicked() {
    this.intrigueStackIsActive = !this.intrigueStackIsActive;
  }
}
