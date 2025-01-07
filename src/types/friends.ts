import type { Profile, Friend, FriendRequest } from './database';

export type { Profile, Friend, FriendRequest };

export interface FriendWithProfile extends Friend {
  friend_profile: Profile;
}

export interface FriendRequestWithProfiles extends FriendRequest {
  sender_profile: Profile;
  receiver_profile: Profile;
}
