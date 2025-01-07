import type { Profile } from './database';

export interface Friend {
  id: string;
  user_id: string;
  friend_id: string;
  created_at: string;
}

export interface FriendRequest {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface FriendWithProfile extends Friend {
  username: string;
  display_name: string;
  avatar_url: string | null;
  friend_code: string;
  bio: string | null;
}

export interface FriendRequestWithProfiles extends FriendRequest {
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
