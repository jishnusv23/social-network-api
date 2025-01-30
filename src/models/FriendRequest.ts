import mongoose, { Schema } from "mongoose";

const friendsSchema = new Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    message: {
      type: String,
      maxLength: [200, "Message cannot exceed 200 characters"],
    },
  },
  {
    timestamps: true,
  }
);

//create compout index like prevent the duplicates 
friendsSchema.index({ sender: 1, receiver: 1 }, { unique: true });
const FriendRequest = mongoose.model("FriendRequest", friendsSchema);
export default FriendRequest;
