import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IntrigueDeckCard } from 'src/app/models/intrigue';
import { AIManager } from 'src/app/services/ai/ai.manager';
import { AudioManager } from 'src/app/services/audio-manager.service';
import { GameManager } from 'src/app/services/game-manager.service';
import { GameModifiersService } from 'src/app/services/game-modifier.service';
import { IntriguesService } from 'src/app/services/intrigues.service';
import { PlayersService } from 'src/app/services/players.service';
import { IntriguesPreviewDialogComponent } from '../_common/dialogs/intrigues-preview-dialog/intrigues-preview-dialog.component';

@Component({
  selector: 'dune-intrigues',
  templateUrl: './intrigues.component.html',
  styleUrl: './intrigues.component.scss',
  standalone: false,
})
export class IntriguesComponent {
  activePlayerId = 0;
  hasIntrigueVision = false;
  intrigueStackIsActive = false;
  intrigueDiscardPileTopCard: IntrigueDeckCard | undefined;

  constructor(
    private intriguesService: IntriguesService,
    private gameManager: GameManager,
    private gameModifierService: GameModifiersService,
    private audioManager: AudioManager,
    private dialog: MatDialog,
    private aiManager: AIManager,
    private playersService: PlayersService,
  ) {}

  ngOnInit(): void {
    this.gameManager.activePlayerId$.subscribe((activePlayerId) => {
      this.activePlayerId = activePlayerId;

      this.hasIntrigueVision = this.gameModifierService.playerHasCustomActionAvailable(
        this.activePlayerId,
        'vision-intrigues',
      );

      this.intrigueStackIsActive = false;
    });

    this.gameModifierService.playerGameModifiers$.subscribe(() => {
      this.hasIntrigueVision = this.gameModifierService.playerHasCustomActionAvailable(
        this.activePlayerId,
        'vision-intrigues',
      );
    });

    this.intriguesService.intrigueDiscardPile$.subscribe((discardPile) => {
      this.intrigueDiscardPileTopCard = discardPile[discardPile.length - 1];
    });
  }

  onDrawIntrigueClicked() {
    const player = this.playersService.getPlayer(this.activePlayerId);
    if (!player) {
      return;
    }

    this.audioManager.playSound('intrigue');
    this.intriguesService.drawPlayerIntriguesFromDeck(this.activePlayerId, 1);

    this.aiManager.setPreferredFieldsForAIPlayer(player);
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
