import express from "express";
import {
  addScreen,
  getAllScreens,
  getScreenById,
  updateScreen,
  deleteScreen,
  getSeatLayout,
  getSeatsByType,
  getCapacityBreakdown,
} from "../controllers/screenController.js";

const router = express.Router();

router.post("/", addScreen);
router.get("/", getAllScreens);
router.get("/:id", getScreenById);
router.put("/:id", updateScreen);
router.delete("/:id", deleteScreen);
router.get("/:id/seat-layout", getSeatLayout);
router.get("/:id/seats/:type", getSeatsByType);
router.get("/:id/capacity", getCapacityBreakdown);

export default router;
