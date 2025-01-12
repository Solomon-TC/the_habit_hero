export interface FriendWithProfile {
  id: string;
  user_id: string;
  friend_id: string;
  created_at: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  friend_code: string;
  bio: string | null;
  character_name: string | null;
  character_level: number | null;
  character_experience: number | null;
  character_next_level_exp: number | null;
  character_color_primary: string | null;
  character_color_secondary: string | null;
  character_color_accent: string | null;
  character_habits_completed: number | null;
  character_goals_completed: number | null;
  character_current_streak: number | null;
  character_longest_streak: number | null;
}

export interface FriendRequestWithProfiles {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;
  sender_username: string;
  sender_display_name: string;
  sender_avatar_url: string | null;
  sender_friend_code: string;
  sender_bio: string | null;
  receiver_username: string;
  receiver_display_name: string;
  receiver_avatar_url: string | null;
  receiver_friend_code: string;
  receiver_bio: string | null;
}
