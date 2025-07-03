
"use client";

import { useState } from "react";
import { analyzeMemberEngagement, AnalyzeMemberEngagementOutput } from "@/ai/flows/analyze-member-engagement";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Lightbulb, Loader2, UserCheck, Users } from "lucide-react";

const placeholderData = `John Doe, Attended 10/12 services, Leads a small group, Skill: Music
Jane Smith, Attended 12/12 services, Helps in kids ministry, Skill: Teaching
Michael Chen, Attended 8/12 services, New member, Skill: Administration
Sarah Lee, Attended 11/12 services, Volunteers for setup/teardown, Skill: Hospitality
David Garcia, Attended 6/12 services, Long-time member, Skill: Finance`;

export function EngagementForm() {
  const [memberData, setMemberData] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeMemberEngagementOutput | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!memberData.trim()) {
      toast({
        title: "Input required",
        description: "Please enter member data to analyze.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const analysisResult = await analyzeMemberEngagement({ memberData });
      setResult(analysisResult);
    } catch (error) {
      console.error("Analysis failed:", error);
      toast({
        title: "Analysis Failed",
        description: "An error occurred while analyzing the data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Analyze Member Data</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              value={memberData}
              onChange={(e) => setMemberData(e.target.value)}
              placeholder={placeholderData}
              rows={8}
              className="text-sm"
              aria-label="Member Data Input"
            />
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Generate Insights"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {result && (
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Potential Volunteers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {result.potentialVolunteers.map((name, index) => (
                  <li key={index} className="flex items-center">
                    <span className="text-sm">{name}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Potential Leaders</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {result.potentialLeaders.map((name, index) => (
                  <li key={index} className="flex items-center font-semibold">
                    <span className="text-sm">{name}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Key Insights</CardTitle>
              <Lightbulb className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground/80 whitespace-pre-wrap">{result.insights}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
