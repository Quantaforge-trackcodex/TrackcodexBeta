// services/gitActivityService.ts

export interface Activity {
  date: string;
  count: number;
  level: number;
}

export interface ActivityUpdate {
  activities: Activity[];
  total: number;
}

type ActivityCallback = (update: ActivityUpdate) => void;

class GitActivityService {
  private subscribers: ActivityCallback[] = [];
  private activities: Activity[] = [];
  private isPolling: boolean = false;
  private pollingInterval: number = 30000; // 30 seconds

  constructor() {
    // Initialize with basic data
    this.activities = this.generateInitialData();
  }

  // Subscribe to updates
  public subscribe(callback: ActivityCallback): () => void {
    this.subscribers.push(callback);
    // Send immediate update
    callback({
      activities: this.activities,
      total: this.calculateTotal(),
    });

    // Start polling if not already
    if (!this.isPolling) {
      this.startAutoSync();
    }

    return () => {
      this.subscribers = this.subscribers.filter((cb) => cb !== callback);
    };
  }

  private startAutoSync() {
    this.isPolling = true;
    console.log("🔄 Git Activity Service: Auto-sync started");

    setInterval(() => {
      this.syncNow();
    }, this.pollingInterval);
  }

  public syncNow() {
    console.log("🔄 Git Activity Service: Syncing...");
    // In a real implementation, this would:
    // 1. Get list of active workspaces
    // 2. Run 'git log --author=currentUser --since=1.year.ago' in each
    // 3. Aggregate commits by date

    // For simulation/prototype:
    // We will randomly increment today's count or recent days to show "activity"
    const updated = this.simulateNewActivity(this.activities);
    this.activities = updated;
    this.notifySubscribers();
  }

  private notifySubscribers() {
    const total = this.calculateTotal();
    const update = { activities: this.activities, total };
    this.subscribers.forEach((cb) => cb(update));
  }

  private calculateTotal(): number {
    return this.activities.reduce((sum, item) => sum + item.count, 0);
  }

  // --- Helpers for Data Generation (Ported from component) ---

  private generateInitialData(): Activity[] {
    const today = new Date();
    const days = 365;
    const newData: Activity[] = [];

    // Helper date format
    const formatDate = (d: Date) => d.toISOString().split("T")[0];

    // Subtract days helper
    const subDays = (d: Date, n: number) => {
      const copy = new Date(d);
      copy.setDate(copy.getDate() - n);
      return copy;
    };

    for (let i = days; i >= 0; i--) {
      const date = subDays(today, i);
      const dateStr = formatDate(date);

      // Random historical data biased towards 0-5
      const rand = Math.random();
      const count = rand > 0.6 ? Math.floor(Math.random() * 8) : 0;
      const level = this.getLevel(count);

      newData.push({ date: dateStr, count, level });
    }
    return newData;
  }

  private simulateNewActivity(current: Activity[]): Activity[] {
    // Clone array to avoid mutation issues
    const next = [...current];

    // 30% chance to add a commit to Today, Yesterday, or the day before
    if (Math.random() > 0.0) {
      // Always update for demo effect on "Sync Now"
      const indicesToUpdate = [
        next.length - 1,
        next.length - 2,
        next.length - 3,
      ];

      // Pick one
      const idx =
        indicesToUpdate[Math.floor(Math.random() * indicesToUpdate.length)];

      if (next[idx]) {
        const newCount = next[idx].count + 1;
        next[idx] = {
          ...next[idx],
          count: newCount,
          level: this.getLevel(newCount),
        };
      }
    }
    return next;
  }

  private getLevel(count: number): number {
    if (count === 0) return 0;
    if (count <= 2) return 1;
    if (count <= 5) return 2;
    if (count <= 8) return 3;
    return 4;
  }
}

export const gitActivityService = new GitActivityService();
