# AI Agent Workflow

## 1. Task Reception

- **Orchestrator Agent**:
  - Receives the initial task from the user.
  - Generates an overall plan of action, following the available workflows listed in the WORKFLOWS.md file.
  - Orchestrates the workflow by assigning sub-tasks to the appropriate agents.
  - The sub-tasks must have a clear description of the expected outcome and the steps to achieve it. It must be specially clear to the agent if it should implement or not code, modify/create files or not, signal completion with a clear response, etc.

## 2. Analysis and Planning

- **Architect Agent**:
  - Identifies ambiguities and areas needing user clarification.
  - Researches required technologies, frameworks, or APIs.
  - Analyzes the current project status.
  - Defines a high-level approach for the solution.
  - Creates a detailed, step-by-step plan.
  - Refines the plan in tiny steps.
  - Review the plan for any necessary changes.
  - **File Storage**: the plan must be saved to a file in `.kilocode/_generated/plans/` (<< REMEMBER THIS PATH) with a unique name (e.g., `<datetime>-<plan-name>.md`) in almost all cases. So, the Coder Agent must receive this file to work on.
  - The plan must be presented to the user for approval before proceeding with the next steps.
  - Although the Architect Agent is responsible for creating the plan, the Orchestrator Agent is responsible for ensuring that the plan is followed and that the appropriate agents are assigned to the appropriate tasks.
  - Always check the details of the original task before proceeding with the next steps.

## 3. User Interaction

- **Asker Agent**: Manages communication with the user, when asking for clarifications and providing updates is required.

## 4. Implementation

- **Coder Agent**:
  - Receives and implements individual extremely tiny and detailed steps from the plan.
  - Always check the details of the original task before proceeding with the next steps.

## 5. Code Review

- **Architect/Code Reviewer/Code Simplifier Agent**:
  - Reviews the implemented code for errors or deviations from the plan.
  - Requests necessary changes from the Coder Agent.

## 6. Documentation

- **Documentator Agent**:
  - Adds comments to the code where necessary.
  - Updates the project's documentation (e.g., README, `/docs` files).
  - Suggests and implements automated documentation tools.
