import FriendRequest from "../models/FriendRequest";
import User from "../models/User";


export class UserService {
  async getUserById(userId: string) {
    const user = await User.findById(userId)
      .select("-password")
      .populate("friends", "username email profilePicture");
    if (!user) throw new Error("User not found");
    return user;
  }

  async updateUser(userId: string, updateData: any) {
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");
    if (!user) throw new Error("User not found");
    return user;
  }

 
}
