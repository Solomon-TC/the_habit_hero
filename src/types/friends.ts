import { Database } from './database';

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type FriendRequest = Database['public']['Tables']['friend_requests']['Row'];
export type Friend = Database['public']['Tables']['friends']['Row'];

export interface FriendWithProfile extends Omit<Friend, 'id'> {
  id: string;
  user_id: string;
  friend_id: string;
  created_at: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  friend_code: string;
  bio: string | null;
}

export interface FriendRequestWithProfiles extends FriendRequest {
  sender_profile: Profile;
  receiver_profile: Profile;
}
