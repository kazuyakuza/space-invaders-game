# Product

## Overview

Space Invaders is a classic arcade-style shooter where the player defends Earth from descending waves of alien invaders. This implementation modernizes the classic mechanics with a multi-level progression system and dynamic difficulty scaling.

## Problem

Classic arcade games often lack progression or become predictable. This project aims to provide an engaging, challenging experience by implementing a configurable level system that scales in difficulty, ensuring players remain challenged as they progress.

## How it Works

The game uses a high-performance HTML5 Canvas rendering engine. Level configurations are loaded from a central JSON file, defining enemy formation, speed, and spacing. As players clear waves, the game seamlessly transitions to the next level. If a player clears all predefined levels, the game enters an "infinity mode," repeating the final configuration while continuing to track high scores.

## User Experience Goals

- **Classic Feel**: Maintain the iconic movement and shooting patterns of the original Space Invaders.
- **Progression**: Provide a sense of achievement through a multi-level system.
- **Increasing Challenge**: Implement velocity scaling (0.1% increase per row drop) to keep the gameplay intense.
- **Visual Clarity**: A "night mode" color scheme ensures high contrast and reduced eye strain during extended play.
- **Persistent Feedback**: Real-time score and level display on the UI.
