import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Sortable Card Component
const SortableCard: React.FC<{ card: any }> = ({ card }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getCardContent = () => {
    if (card.issue) {
      return (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined !text-[16px] text-green-500">
              radio_button_unchecked
            </span>
            <span className="text-sm font-bold text-gh-text line-clamp-2">
              {card.issue.title}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gh-text-secondary">
            <span>#{card.issue.number}</span>
            {card.issue.labels && card.issue.labels.length > 0 && (
              <div className="flex gap-1">
                {card.issue.labels.slice(0, 2).map((label: any) => (
                  <span
                    key={label.id}
                    className="px-1.5 py-0.5 rounded text-[10px]"
                    style={{
                      backgroundColor: `${label.color}30`,
                      color: label.color,
                    }}
                  >
                    {label.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    }

    if (card.pr) {
      return (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined !text-[16px] text-primary">
              merge
            </span>
            <span className="text-sm font-bold text-gh-text line-clamp-2">
              {card.pr.title}
            </span>
          </div>
          <div className="text-xs text-gh-text-secondary">
            #{card.pr.number}
          </div>
        </div>
      );
    }

    return (
      <div>
        <div className="text-sm font-bold text-gh-text mb-1">
          {card.noteTitle || "Untitled Note"}
        </div>
        {card.noteBody && (
          <div className="text-xs text-gh-text-secondary line-clamp-2">
            {card.noteBody}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-gh-bg border border-gh-border rounded-lg p-3 mb-2 cursor-grab active:cursor-grabbing hover:border-primary transition-colors"
    >
      {getCardContent()}
    </div>
  );
};

// Column Component
const BoardColumn: React.FC<{
  column: any;
  cards: any[];
}> = ({ column, cards }) => {
  return (
    <div className="bg-gh-bg-secondary border border-gh-border rounded-xl p-4 min-w-[300px] max-w-[300px] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-gh-text">{column.name}</h3>
        <span className="text-xs text-gh-text-secondary bg-gh-bg px-2 py-0.5 rounded-full">
          {cards.length}
        </span>
      </div>

      <SortableContext
        items={cards.map((c) => c.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex-1 overflow-y-auto max-h-[600px]">
          {cards.length === 0 ? (
            <div className="text-center py-8 text-gh-text-secondary text-sm">
              No cards
            </div>
          ) : (
            cards.map((card) => <SortableCard key={card.id} card={card} />)
          )}
        </div>
      </SortableContext>
    </div>
  );
};

// Main Kanban Board
const ProjectBoardKanban: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [board, setBoard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeCard, setActiveCard] = useState<any>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    fetchBoard();
  }, [id]);

  const fetchBoard = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/boards/${id}`);
      const data = await res.json();
      setBoard(data);
    } catch (err) {
      console.error("Failed to fetch board", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const card = board.columns
      .flatMap((col: any) => col.cards)
      .find((c: any) => c.id === active.id);
    setActiveCard(card);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCard(null);

    if (!over) return;

    const activeCardId = active.id as string;
    const overCardId = over.id as string;

    // Find source and destination columns
    let sourceColumn: any = null;
    let destColumn: any = null;
    let sourceCardIndex = -1;
    let destCardIndex = -1;

    board.columns.forEach((col: any) => {
      const activeIndex = col.cards.findIndex(
        (c: any) => c.id === activeCardId,
      );
      const overIndex = col.cards.findIndex((c: any) => c.id === overCardId);

      if (activeIndex !== -1) {
        sourceColumn = col;
        sourceCardIndex = activeIndex;
      }
      if (overIndex !== -1) {
        destColumn = col;
        destCardIndex = overIndex;
      }
    });

    if (!sourceColumn || !destColumn) return;

    // Optimistic update
    const newBoard = { ...board };
    const sourceCol = newBoard.columns.find(
      (c: any) => c.id === sourceColumn.id,
    );
    const destCol = newBoard.columns.find((c: any) => c.id === destColumn.id);

    if (sourceColumn.id === destColumn.id) {
      // Same column
      sourceCol.cards = arrayMove(
        sourceCol.cards,
        sourceCardIndex,
        destCardIndex,
      );
    } else {
      // Different columns
      const [movedCard] = sourceCol.cards.splice(sourceCardIndex, 1);
      destCol.cards.splice(destCardIndex, 0, movedCard);
    }

    setBoard(newBoard);

    // API call
    try {
      await fetch(`/api/v1/cards/${activeCardId}/move`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          columnId: destColumn.id,
          position: destCardIndex,
        }),
      });
    } catch (err) {
      console.error("Failed to move card", err);
      // Revert on error
      fetchBoard();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="size-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!board) {
    return (
      <div className="p-6 text-center">
        <h3 className="text-lg font-bold text-gh-text">Board not found</h3>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gh-bg">
      {/* Header */}
      <div className="border-b border-gh-border bg-gh-bg-secondary">
        <div className="max-w-full px-6 py-4">
          <button
            onClick={() => navigate(`/repositories/${board.repoId}`)}
            className="text-sm text-gh-text-secondary hover:text-primary mb-3 flex items-center gap-1"
          >
            <span className="material-symbols-outlined !text-[16px]">
              arrow_back
            </span>
            Back to repository
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gh-text mb-1">
                {board.name}
              </h1>
              {board.description && (
                <p className="text-sm text-gh-text-secondary">
                  {board.description}
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <button className="px-3 py-1.5 bg-gh-bg-tertiary text-gh-text rounded-lg text-sm hover:bg-gh-border transition-all">
                Add column
              </button>
              <button className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-opacity-90 transition-all">
                Add card
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="p-6 overflow-x-auto">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4">
            {board.columns.map((column: any) => (
              <BoardColumn
                key={column.id}
                column={column}
                cards={column.cards || []}
              />
            ))}
          </div>

          <DragOverlay>
            {activeCard ? (
              <div className="bg-gh-bg border-2 border-primary rounded-lg p-3 shadow-xl opacity-90">
                <SortableCard card={activeCard} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};

export default ProjectBoardKanban;
