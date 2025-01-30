import { Request, Response, NextFunction } from "express";
import { FriendService } from "../services/friend.service";
import { PaginationQuery } from "../types/pagination";

export class FriendController {
  private friendService: FriendService;
  constructor() {
    this.friendService = new FriendService();
  }
  getFriends = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;
      const query: PaginationQuery = {
        page: Number(req.query.page),
        limit: Number(req.query.limit),
        sort: req.query.sort as string,
        name: req.query.name as string,
      };

      const result = await this.friendService.getAllFriends(
        userId as string,
        query
      );
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  };

  
  getFriendRequests = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user?.userId;
      const query: PaginationQuery = {
        page: Number(req.query.page),
        limit: Number(req.query.limit),
        sort: req.query.sort as string,
        name: req.query.name as string,
      };

      const result = await this.friendService.getPendingRequests(
        userId as string,
        query
      );
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  };
  sendRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const senderId = req.user?.userId;
      const { receiverId } = req.body;
      const request = await this.friendService.createRequest(
        senderId as string,
        receiverId
      );
      res.status(201).json({ success: true, data: request });
    } catch (error) {
      next(error);
    }
  };

  
  handleRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;
      const { requestId, status } = req.body;
      const result = await this.friendService.updateRequestStatus(
        requestId,
        userId as string,
        status
      );
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };
}