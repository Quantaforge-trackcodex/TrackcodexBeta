import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_WORKSPACES } from '../constants';
import { Workspace } from '../types';
import Spinner from '../components/ui/Spinner';
import EditorView from './Editor';

const WorkspaceDetailView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [workspace, setWorkspace] = useState<Workspace | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        // Simulate fetching data
        setTimeout(() => {
            const found = MOCK_WORKSPACES.find(ws => ws.id === id);
            setWorkspace(found || MOCK_WORKSPACES[0]);
            setIsLoading(false);
        }, 500);
    }, [id]);

    if (isLoading || !workspace) {
        return (
            <div className="flex-1 flex items-center justify-center bg-[#1e1e1e]">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="flex-1 h-full w-full overflow-hidden">
            <EditorView />
        </div>
    );
};

export default WorkspaceDetailView;
