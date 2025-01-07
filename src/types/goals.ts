import type { Goal, GoalMilestone } from './database';

export type { Goal, GoalMilestone };

// This is the only type that extends the base types, so we keep it here
export interface GoalWithMilestones extends Goal {
  milestones: GoalMilestone[];
}
