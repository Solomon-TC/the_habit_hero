export interface Profile {
  id: string;
  username: string;
  display_name: string;
  avatar_url?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

export interface FriendRequest {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface Friend {
  id: string;
  user_id: string;
  friend_id: string;
  created_at: string;
}

export interface FriendWithProfile extends Friend {
  profiles: Profile;  // Friend's profile
}

export interface FriendRequestWithProfiles extends FriendRequest {
  sender: Profile;
  receiver: Profile;
}
