import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Target, BarChart3, Calendar } from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: Users,
      title: "Team Management",
      description: "Organize your teams and track player information efficiently.",
    },
    {
      icon: Target,
      title: "Training Programs",
      description: "Design and manage comprehensive training sessions and drills.",
    },
    {
      icon: BarChart3,
      title: "Performance Analytics",
      description: "Track progress and analyze performance metrics over time.",
    },
    {
      icon: Calendar,
      title: "Session Planning",
      description: "Schedule training sessions and manage your coaching calendar.",
    },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Welcome to Rugby Coach
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              A professional coaching platform designed to help you manage teams, plan training sessions, 
              and track performance with ease.
            </p>
            <div className="flex flex-wrap gap-4 justify-center mt-8">
              <Button size="lg" data-testid="button-get-started">
                Get Started
              </Button>
              <Button size="lg" variant="outline" data-testid="button-learn-more">
                Learn More
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="hover-elevate" data-testid={`card-feature-${index}`}>
                  <CardHeader className="gap-2">
                    <div className="h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center mb-2">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <CardDescription className="leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>

          <section className="mt-16 pt-16 border-t">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card data-testid="card-stat-teams">
                <CardHeader className="gap-2">
                  <CardDescription>Ready to manage</CardDescription>
                  <CardTitle className="text-3xl">Your Teams</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Create and organize multiple teams with comprehensive player profiles and statistics.
                  </p>
                </CardContent>
              </Card>

              <Card data-testid="card-stat-training">
                <CardHeader className="gap-2">
                  <CardDescription>Plan and execute</CardDescription>
                  <CardTitle className="text-3xl">Training Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Build effective training programs with customizable drills and session plans.
                  </p>
                </CardContent>
              </Card>

              <Card data-testid="card-stat-analytics">
                <CardHeader className="gap-2">
                  <CardDescription>Track and improve</CardDescription>
                  <CardTitle className="text-3xl">Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Analyze data and metrics to drive continuous improvement in your coaching.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
