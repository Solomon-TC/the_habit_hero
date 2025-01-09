import type { Goal, GoalMilestone } from './database';

export type { Goal, GoalMilestone };

export interface GoalWithMilestones extends Goal {
  milestones: GoalMilestone[];
}
