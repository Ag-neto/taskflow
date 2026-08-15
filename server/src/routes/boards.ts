import { Router } from "express";
import { prisma } from "../lib/prisma";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const router = Router();
router.use(authMiddleware);

// List the current user boards
router.get("/", async (req: AuthRequest, res) => {
  const boards = await prisma.board.findMany({
    where: { ownerId: req.userId },
    include: { columns: { include: { cards: true }, orderBy: { position: "asc" } } },
    orderBy: { createdAt: "desc" },
  });
  res.json(boards);
});

// Create a board with three default columns
router.post("/", async (req: AuthRequest, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: "Title is required" });
  const board = await prisma.board.create({
    data: {
      title,
      ownerId: req.userId as string,
      columns: {
        create: [
          { title: "To Do", position: 0 },
          { title: "Doing", position: 1 },
          { title: "Done", position: 2 },
        ],
      },
    },
    include: { columns: true },
  });
  res.status(201).json(board);
});

// Delete a board (only if it belongs to the user)
router.delete("/:id", async (req: AuthRequest, res) => {
  const board = await prisma.board.findUnique({ where: { id: req.params.id } });
  if (!board || board.ownerId !== req.userId) {
    return res.status(404).json({ error: "Board not found" });
  }
  await prisma.board.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

// Create a card in a column
router.post("/columns/:columnId/cards", async (req: AuthRequest, res) => {
  const { title, content } = req.body;
  if (!title) return res.status(400).json({ error: "Title is required" });
  const count = await prisma.card.count({ where: { columnId: req.params.columnId } });
  const card = await prisma.card.create({
    data: { title, content, columnId: req.params.columnId, position: count },
  });
  res.status(201).json(card);
});

// Move a card to another column
router.patch("/cards/:cardId", async (req: AuthRequest, res) => {
  const { columnId } = req.body;
  const card = await prisma.card.update({
    where: { id: req.params.cardId },
    data: { columnId },
  });
  res.json(card);
});

// Delete a card
router.delete("/cards/:cardId", async (req: AuthRequest, res) => {
  await prisma.card.delete({ where: { id: req.params.cardId } });
  res.status(204).send();
});

export default router;