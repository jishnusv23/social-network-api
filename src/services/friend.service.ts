import User from "@/models/User";
import { PaginationQuery, PaginatedResponse } from "../types/pagination";
import { getPaginationOptions } from "../utils/pagination";
import FriendRequest from "@/models/FriendRequest";
import mongoose from "mongoose";

export class FriendService {
  async getAllFriends(
    userId: string,
    query: PaginationQuery
  ): Promise<PaginatedResponse<any>> {
    try {
      const { page, limit, skip } = getPaginationOptions(query);

      // Build filter conditions
      const filter: any = {};
      if (query.name) {
        filter.username = { $regex: query.name, $options: "i" };
      }

      // Build sort conditions
      const sortOption: any = {};
      if (query.sort) {
        const [field, order] = query.sort.split(":");
        sortOption[field] = order === "desc" ? -1 : 1;
      } else {
        sortOption.username = 1; // Default sort
      }

      // Get user with friends
      const user = await User.findById(userId).select("friends");
      if (!user) throw new Error("User not found");

      // Get paginated friends
      const totalItems = user.friends.length;
      const friends = await User.find({
        _id: { $in: user.friends },
        ...filter,
      })
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .select("username email profilePicture status");

      return {
        data: friends,
        pagination: {
          totalItems,
          currentPage: page,
          totalPages: Math.ceil(totalItems / limit),
          limit,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async getPendingRequests(
    userId: string,
    query: PaginationQuery
  ): Promise<PaginatedResponse<any>> {
    try {
      const { page, limit, skip } = getPaginationOptions(query);

      // Build filter conditions
      const filter: any = {
        receiver: userId,
        status: "pending",
      };

      if (query.name) {
        filter["sender.username"] = { $regex: query.name, $options: "i" };
      }

      // Get total count
      const totalItems = await FriendRequest.countDocuments(filter);

      // Get paginated requests
      const requests = await FriendRequest.find(filter)
        .populate("sender", "username email profilePicture")
        .sort(query.sort ? { [query.sort]: 1 } : { createdAt: -1 })
        .skip(skip)
        .limit(limit);

      return {
        data: requests,
        pagination: {
          totalItems,
          currentPage: page,
          totalPages: Math.ceil(totalItems / limit),
          limit,
        },
      };
    } catch (error) {
      throw error;
    }
  }
  async createRequest(senderId: string, receiverId: string) {
    // Check if users exist
    const [sender, receiver] = await Promise.all([
      User.findById(senderId),
      User.findById(receiverId),
    ]);

    if (!sender || !receiver) {
      throw new Error("User not found");
    }

    // Check if request already exists
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
      status: { $in: ["pending", "accepted"] },
    });

    if (existingRequest) {
      throw new Error(
        "Friend request already exists or users are already friends"
      );
    }

    // Create new request
    return await FriendRequest.create({
      sender: senderId,
      receiver: receiverId,
    });
  }

  // Update request status
  async updateRequestStatus(
    requestId: string,
    userId: string,
    status: "accepted" | "rejected"
  ) {
    const request = await FriendRequest.findById(requestId);
    if (!request) {
      throw new Error("Request not found");
    }

    if (request.receiver.toString() !== userId) {
      throw new Error("Unauthorized to handle this request");
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      request.status = status;

      if (status === "accepted") {
        // Add to friends list
        await User.findByIdAndUpdate(request.sender, {
          $addToSet: { friends: request.receiver },
        });
        await User.findByIdAndUpdate(request.receiver, {
          $addToSet: { friends: request.sender },
        });
      }

      await request.save();
      await session.commitTransaction();
      return request;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}
