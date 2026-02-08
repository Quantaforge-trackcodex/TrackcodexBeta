import { prisma } from "../lib/prisma";

export const ProjectBoardService = {
  /**
   * Create a new project board
   */
  async createBoard(
    repoId: string,
    name: string,
    description?: string,
    layout: "KANBAN" | "TABLE" = "KANBAN",
  ) {
    const board = await prisma.projectBoard.create({
      data: {
        repoId,
        name,
        description,
        layout,
        columns: {
          create: [
            { name: "To Do", position: 0 },
            { name: "In Progress", position: 1 },
            { name: "Done", position: 2 },
          ],
        },
      },
      include: {
        columns: {
          orderBy: { position: "asc" },
        },
      },
    });

    return board;
  },

  /**
   * List boards for a repository
   */
  async listBoards(repoId: string) {
    const boards = await prisma.projectBoard.findMany({
      where: { repoId },
      include: {
        columns: {
          orderBy: { position: "asc" },
          include: {
            _count: { select: { cards: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return boards;
  },

  /**
   * Get board with full details
   */
  async getBoard(boardId: string) {
    const board = await prisma.projectBoard.findUnique({
      where: { id: boardId },
      include: {
        repo: true,
        columns: {
          orderBy: { position: "asc" },
          include: {
            cards: {
              orderBy: { position: "asc" },
              include: {
                issue: {
                  include: {
                    author: true,
                    labels: true,
                    assignees: { include: { user: true } },
                  },
                },
                pr: {
                  include: {
                    author: true,
                    labels: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return board;
  },

  /**
   * Update board
   */
  async updateBoard(
    boardId: string,
    updates: {
      name?: string;
      description?: string;
      layout?: "KANBAN" | "TABLE";
    },
  ) {
    const board = await prisma.projectBoard.update({
      where: { id: boardId },
      data: updates,
      include: {
        columns: {
          orderBy: { position: "asc" },
        },
      },
    });

    return board;
  },

  /**
   * Delete board
   */
  async deleteBoard(boardId: string) {
    await prisma.projectBoard.delete({
      where: { id: boardId },
    });

    return { success: true };
  },

  /**
   * Add column to board
   */
  async addColumn(boardId: string, name: string, position?: number) {
    // If no position specified, add at the end
    if (position === undefined) {
      const lastColumn = await prisma.boardColumn.findFirst({
        where: { boardId },
        orderBy: { position: "desc" },
      });
      position = (lastColumn?.position ?? -1) + 1;
    }

    const column = await prisma.boardColumn.create({
      data: {
        boardId,
        name,
        position,
      },
      include: {
        cards: true,
      },
    });

    return column;
  },

  /**
   * Update column
   */
  async updateColumn(columnId: string, updates: { name?: string }) {
    const column = await prisma.boardColumn.update({
      where: { id: columnId },
      data: updates,
    });

    return column;
  },

  /**
   * Delete column
   */
  async deleteColumn(columnId: string) {
    await prisma.boardColumn.delete({
      where: { id: columnId },
    });

    return { success: true };
  },

  /**
   * Add card to column
   */
  async addCard(
    columnId: string,
    card: {
      issueId?: string;
      prId?: string;
      noteTitle?: string;
      noteBody?: string;
    },
    position?: number,
  ) {
    // If no position specified, add at the end
    if (position === undefined) {
      const lastCard = await prisma.boardCard.findFirst({
        where: { columnId },
        orderBy: { position: "desc" },
      });
      position = (lastCard?.position ?? -1) + 1;
    }

    const newCard = await prisma.boardCard.create({
      data: {
        columnId,
        ...card,
        position,
      },
      include: {
        issue: {
          include: {
            author: true,
            labels: true,
            assignees: { include: { user: true } },
          },
        },
        pr: {
          include: {
            author: true,
            labels: true,
          },
        },
      },
    });

    return newCard;
  },

  /**
   * Move card to different column/position
   */
  async moveCard(cardId: string, newColumnId: string, newPosition: number) {
    const card = await prisma.boardCard.findUnique({
      where: { id: cardId },
    });

    if (!card) throw new Error("Card not found");

    const oldColumnId = card.columnId;
    const oldPosition = card.position;

    // If moving within same column
    if (oldColumnId === newColumnId) {
      if (newPosition > oldPosition) {
        // Moving down: decrement positions between old and new
        await prisma.boardCard.updateMany({
          where: {
            columnId: oldColumnId,
            position: {
              gt: oldPosition,
              lte: newPosition,
            },
          },
          data: {
            position: {
              decrement: 1,
            },
          },
        });
      } else if (newPosition < oldPosition) {
        // Moving up: increment positions between new and old
        await prisma.boardCard.updateMany({
          where: {
            columnId: oldColumnId,
            position: {
              gte: newPosition,
              lt: oldPosition,
            },
          },
          data: {
            position: {
              increment: 1,
            },
          },
        });
      }
    } else {
      // Moving to different column
      // Decrement positions in old column
      await prisma.boardCard.updateMany({
        where: {
          columnId: oldColumnId,
          position: { gt: oldPosition },
        },
        data: {
          position: {
            decrement: 1,
          },
        },
      });

      // Increment positions in new column
      await prisma.boardCard.updateMany({
        where: {
          columnId: newColumnId,
          position: { gte: newPosition },
        },
        data: {
          position: {
            increment: 1,
          },
        },
      });
    }

    // Update the card
    const updatedCard = await prisma.boardCard.update({
      where: { id: cardId },
      data: {
        columnId: newColumnId,
        position: newPosition,
      },
      include: {
        issue: {
          include: {
            author: true,
            labels: true,
            assignees: { include: { user: true } },
          },
        },
        pr: {
          include: {
            author: true,
            labels: true,
          },
        },
      },
    });

    return updatedCard;
  },

  /**
   * Update card note
   */
  async updateCard(
    cardId: string,
    updates: {
      noteTitle?: string;
      noteBody?: string;
    },
  ) {
    const card = await prisma.boardCard.update({
      where: { id: cardId },
      data: updates,
      include: {
        issue: true,
        pr: true,
      },
    });

    return card;
  },

  /**
   * Delete card
   */
  async deleteCard(cardId: string) {
    const card = await prisma.boardCard.findUnique({
      where: { id: cardId },
    });

    if (!card) throw new Error("Card not found");

    // Decrement positions of cards after this one
    await prisma.boardCard.updateMany({
      where: {
        columnId: card.columnId,
        position: { gt: card.position },
      },
      data: {
        position: {
          decrement: 1,
        },
      },
    });

    await prisma.boardCard.delete({
      where: { id: cardId },
    });

    return { success: true };
  },
};
