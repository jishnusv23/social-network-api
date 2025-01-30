import { FriendController } from "@/controller/friendController.controller";
import { Router } from "express";
const router = Router();
const friendController=new FriendController()

router.get("/requests", friendController.getFriendRequests);
router.post("/request", friendController.sendRequest);
router.put("/request/:requestId", friendController.handleRequest);
router.get("/", friendController.getFriends);
