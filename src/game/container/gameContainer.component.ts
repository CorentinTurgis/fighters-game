import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import {  Scene } from 'phaser';
import { PhaserGame } from '../phaser-game.component';
import { EventBus } from '../EventBus';

@Component({
  selector: 'app-game-container',
  standalone: true,
  imports: [CommonModule, RouterOutlet, PhaserGame],
  templateUrl: './gameContainer.component.html',
  styleUrls: ['./gameContainer.component.css'],
})
export class gameContainerComponent implements AfterViewInit {

  public J1spritePosition = { x: 0, y: 0 };
  public J2spritePosition = { x: 0, y: 0 };
  public canStartFight = false;

  // This is a reference from the PhaserGame component
  @ViewChild(PhaserGame) phaserRef!: PhaserGame;

  ngAfterViewInit() {
    EventBus.on('current-scene-ready', (event: { scene: Scene}) => {
      this.canStartFight = event.scene.scene.key !== 'MainMenu';
    });
  }
}
