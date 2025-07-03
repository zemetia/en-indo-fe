
import { EngagementForm } from "./engagement-form";

export default function EngagementInsightsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground font-headline">Engagement Insights</h1>
        <p className="text-muted-foreground">
          Use AI to analyze member data and identify potential volunteers and leaders.
        </p>
      </div>
      <EngagementForm />
    </div>
  );
}
