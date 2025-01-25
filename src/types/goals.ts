import type { Database } from './database';

export type Goal = Database['public']['Tables']['goals']['Row'];
export type GoalMilestone = Database['public']['Tables']['goal_milestones']['Row'];

export interface GoalWithMilestones extends Goal {
  milestones: GoalMilestone[];
}
