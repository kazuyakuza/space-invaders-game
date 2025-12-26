# Project Brief

## Overview

This project is a classic Space Invaders game. The player controls a spaceship at the bottom of the screen and must shoot down waves of aliens descending from the top.

## Goals

- Recreate the classic Space Invaders arcade experience.
- Implement core gameplay mechanics, including player movement, shooting, and enemy patterns.
- Create a scoring system to track player performance.
- Implement a progression system with multiple levels.

## Project Scope

- The game is developed using HTML, CSS, and TypeScript, with no frameworks (using Vite for bundling).
- Multi-level system driven by a JSON configuration file (`levels.json`).
- Infinity levels fallback: if levels run out, the game repeats the last level configuration.
- Difficulty scaling: enemy velocity increases by 0.1% every time they drop a row.
- The player controls the ship with the cursor keys and shoots with the space bar.
- The game starts with enemies in formation; the player wins a level by defeating all of them.
- If the enemies reach the bottom of the screen, the player loses.
- The game uses geometric figures for the ship and enemies, and does not have sound.
- UI displays current score and current level.
- The game has a "night mode" color scheme with a black background.

<!-- DO NOT DELETE THIS SECTION -->

## Important Note for AI Agents

All agents working on this project must adhere to the workflows and rules outlined in the [AI Agent Onboarding document](../../../AGENTS.md). This is not optional.

Before starting any task, you must:

1. **Review `AGENTS.md`**: This file is the primary source of instructions for agents.
2. **Follow Workflows**: It is crucial to follow the procedures defined in `.ai-agent/WORKFLOWS.md`, especially the .kilocode/workflows/critical-workflow.md

Failure to comply with these instructions will result in incorrect or incomplete work.

<!-- END DO NOT DELETE -->
