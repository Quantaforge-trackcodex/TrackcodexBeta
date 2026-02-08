# Frontend Implementation: Employer Kanban Board 📋

We will build a high-performance, drag-and-drop Kanban board for managing job applications, strictly adhering to the TrackCodex "Dark Glass" aesthetic.

## 1. UI Architecture
We will use `@dnd-kit/core` for the drag-and-drop primitives as it is lightweight and accessible.

### Components
- **`KanbanBoard.tsx`**: Main container. Fetches data from `GET /applications/kanban/:jobId`.
- **`KanbanColumn.tsx`**: Droppable zone for stages (`Applied`, `Phone Screen`, etc.).
- **`CandidateCard.tsx`**: Draggable item.
  - **Visuals**: `bg-[#161b22]`, `border-[#30363d]`, rounded-xl.
  - **Content**: Avatar, Name, "Match Score", and Link to Resume.

## 2. Design System Tokens (From Existing UI)
- **Backgrounds**: `bg-[#0d1117]` (Page), `bg-[#161b22]` (Card/Container).
- **Borders**: `border-[#30363d]`.
- **Text**: `text-slate-300` (Body), `text-white` (Headings), `text-slate-500` (Meta).
- **Accents**: `emerald-500` (Success/Hired), `amber-500` (Pending/Review).

## 3. Integration Logic
1.  **Fetch**: On mount, call API to get grouped applications.
2.  **Optimistic UI**: On drag end, immediately update local state.
3.  **Persist**: Call `PATCH /applications/:id/move` in background.
4.  **Error Handling**: Revert if API fails.

## 4. Routing
- Add `/jobs/:id/applications` route to `App.tsx`.
