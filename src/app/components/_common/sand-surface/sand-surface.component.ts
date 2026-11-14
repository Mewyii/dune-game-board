import { Component, Input } from '@angular/core';

export type SandSurfaceShape = 'none' | 'banner' | 'panel';

/**
 * Decorative sand-grain surface, partially veiled by drifting dust.
 * - 'banner': filled pennant shape (fill = currentColor) with an inset frame, scales with its host.
 * - 'panel' / 'none': transparent overlay that fills its positioned parent, so the parent background shows through.
 */
@Component({
  selector: 'dune-sand-surface',
  templateUrl: './sand-surface.component.html',
  styleUrl: './sand-surface.component.scss',
  standalone: false,
  // Every non-banner shape is an absolutely positioned overlay, so it never takes up space in the host's layout.
  host: { '[class.shape-banner]': "shape === 'banner'", '[class.shape-overlay]': "shape !== 'banner'" },
})
export class SandSurfaceComponent {
  private static instanceCounter = 0;

  @Input() shape: SandSurfaceShape = 'none';

  // SVG ids are document-global, so every instance needs its own prefix.
  readonly idPrefix = `dune-sand-surface-${SandSurfaceComponent.instanceCounter++}`;
  // Varies the dust pattern per instance so neighbouring surfaces don't look identical.
  readonly dustSeed = 1 + (SandSurfaceComponent.instanceCounter % 50);
  readonly bannerOuterPath = 'M3 0H57Q60 0 60 3V65L30 50L0 65V3Q0 0 3 0Z';
  readonly bannerInnerPath = 'M5 5H55V57L30 44.5L5 57Z';
}
