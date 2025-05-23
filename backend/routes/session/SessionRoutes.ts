
import { createSessions, updateSession, duplicateSession, deleteSession, getSessionsByProject, getSessionById } from "../../controllers/SessionController";
import { catchError } from "../../middlewares/CatchErrorMiddleware";
import express from "express";


const router = express.Router();

// POST /api/v1/sessions/
router.post("/", catchError(createSessions));

// GET /api/v1/sessions/project/:projectId
router.get(
  "/project/:projectId",
  catchError(getSessionsByProject)
);

// GET /api/v1/sessions/:id
router.get(
  "/:id",
  catchError(getSessionById)
);

// PATCH /api/v1/sessions/:id
router.patch("/:id", catchError(updateSession));

// POST /api/v1/sessions/:id/duplicate
router.post("/:id/duplicate", catchError(duplicateSession));

// DELETE /api/v1/sessions/:d
router.delete("/:id", catchError(deleteSession));

export default router;