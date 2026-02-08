# Job Completion & Rating Flow

## Backend Implementation
Update `backend/routes/jobs.ts`:
- **POST `/jobs/:id/complete`**
  - Payload: `{ rating: number, feedback: string, freelancerId: string }`
  - Logic:
    1. Verify user is the job creator.
    2. Update Job status to "Completed".
    3. Create `JobReview` record.
    4. Upsert `FreelancerProfile` for the freelancer:
       - Increment `jobsCompleted`.
       - Recalculate average `rating`.

## Frontend Implementation
1. **Update `MissionDetailView.tsx`**:
   - Add "Complete Mission" button (visible only to creator).
   - Wire `handleRatingSubmit` to call the new API endpoint.
   
2. **Update `JobRatingModal.tsx`**:
   - Ensure it returns the necessary data structure.

## Verification
- User completes a job via UI.
- Profile stats (Rating, Count) update automatically.
