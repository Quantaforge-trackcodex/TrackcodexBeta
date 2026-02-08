import React, { useState, useEffect } from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { KanbanColumn } from './KanbanColumn';
import { CandidateCard } from './CandidateCard'; // For overlay

const STAGES = ['Applied', 'Phone Screen', 'Interview', 'Offer', 'Hired', 'Rejected'];

const KanbanBoard = ({ jobId }: { jobId: string }) => {
    const [columns, setColumns] = useState<Record<string, any[]>>({});
    const [activeId, setActiveId] = useState<string | null>(null);
    const [activeApp, setActiveApp] = useState<any>(null);

    // Fetch Data
    useEffect(() => {
        fetch(`http://localhost:4000/api/v1/applications/kanban/${jobId}`)
            .then(res => res.json())
            .then(data => setColumns(data))
            .catch(err => console.error(err));
    }, [jobId]);

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
        setActiveApp(event.active.data.current.application);
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;
        setActiveId(null);
        setActiveApp(null);

        if (!over) return;

        const appId = active.id;
        const newStage = over.id; // Droppable ID is the stage name

        // Optimistic Update
        // Find source stage
        let sourceStage = null;
        let application = null;

        const newColumns = { ...columns };

        // Locate and remove from source
        for (const stage of Object.keys(newColumns)) {
            const foundIndex = newColumns[stage].findIndex(a => a.id === appId);
            if (foundIndex !== -1) {
                sourceStage = stage;
                application = newColumns[stage][foundIndex];
                newColumns[stage].splice(foundIndex, 1);
                break;
            }
        }

        if (!sourceStage || sourceStage === newStage) return;

        // Add to dest
        application.stage = newStage;
        if (!newColumns[newStage]) newColumns[newStage] = [];
        newColumns[newStage].push(application);

        setColumns(newColumns);

        // Call API
        try {
            await fetch(`http://localhost:4000/api/v1/applications/${appId}/move`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ stage: newStage })
            });
        } catch (e) {
            console.error("Move failed", e);
            // Revert logic would go here
        }
    };

    return (
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="flex h-full gap-4 overflow-x-auto pb-4">
                {STAGES.map(stage => (
                    <KanbanColumn
                        key={stage}
                        id={stage}
                        title={stage}
                        applications={columns[stage] || []}
                    />
                ))}
            </div>
            <DragOverlay>
                {activeApp ? <CandidateCard application={activeApp} onClick={() => { }} /> : null}
            </DragOverlay>
        </DndContext>
    );
};

export default KanbanBoard;
