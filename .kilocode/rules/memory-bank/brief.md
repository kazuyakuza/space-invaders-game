# Project Brief

## Overview

This project is a classic Space Invaders game. The player controls a spaceship at the bottom of the screen and must shoot down waves of aliens descending from the top.

## Goals

- Recreate the classic Space Invaders arcade experience.
- Implement core gameplay mechanics, including player movement, shooting, and enemy patterns.
- Create a scoring system to track player performance.
- Implement a progression system with multiple levels.

## Project Scope

- Developed using HTML, CSS, and TypeScript (Vite bundling, no frameworks).
- Multi-level progression via [`src/assets/levels.json`](src/assets/levels.json): sparse object keys, '+' prefix for incremental accumulation, supporting 1000 unique levels.
- Infinity mode: repeats final level config after exhausting defined levels.
- Difficulty scaling: 0.1% velocity increase per row drop ([`DIFFICULTY_SPEED_INCREMENT`](src/ts/constants.ts)).
- Controls: Arrow keys (move), Space (shoot), ESC (pause/unpause), R/Enter (restart).
- Level complete: All Red enemies destroyed (Yellow/Orange/Violet preserved).
- Game over: Enemies reach player Y position or 0/3 lives lost.
- Enemies:
  - Red: Standard.
  - Yellow: Faster.
  - Orange: Player-targeting, pass-through bullets.
  - Violet: 10x health mini-boss.
- Geometric canvas shapes, no images/audio, night mode theme.
- HUD: Score, level, lives display.

<!-- DO NOT DELETE THIS SECTION -->

## Important Note for AI Agents

All agents working on this project must adhere to the workflows and rules outlined in the [AI Agent Onboarding document](AGENTS.md). This is not optional.

Before starting any task, you must:

1. **Review `AGENTS.md`**: This file is the primary source of instructions for agents.
2. **Follow Workflows**: It is crucial to follow the procedures defined in `.ai-agent/WORKFLOWS.md`, especially the .kilocode/workflows/critical-workflow.md

Failure to comply with these instructions will result in incorrect or incomplete work.

<!-- END DO NOT DELETE -->
