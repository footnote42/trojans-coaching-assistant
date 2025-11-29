export interface SessionTemplate {
  id: string;
  title: string;
  challenge: string;
  ageGroup: string;
  sessionFocus: string;
  coachingMethod: string;
  icon: string;
}

export const sessionTemplates: SessionTemplate[] = [
  {
    id: "catch-pass",
    title: "Catch & Pass Skills",
    challenge: "I need to develop my players' Catch and Pass skills in order to help their ability to exploit space on the pitch. Players often drop the ball under pressure and struggle to find support runners.",
    ageGroup: "U10",
    sessionFocus: "Skills",
    coachingMethod: "game-skill-zone",
    icon: "🏉"
  },
  {
    id: "tackle-technique",
    title: "Safe Tackle Technique",
    challenge: "Players need to improve their tackle technique and ensure they're tackling safely below the sternum. We need to focus on body position, timing, and making contact with the shoulder while maintaining safety.",
    ageGroup: "U12",
    sessionFocus: "Contact",
    coachingMethod: "block-practice",
    icon: "🛡️"
  },
  {
    id: "breakdown-skills",
    title: "Breakdown Skills",
    challenge: "Our players are losing possession at the breakdown. I need to teach them how to secure the ball after contact, when to ruck, and how to support the ball carrier effectively within RFU regulations.",
    ageGroup: "U14",
    sessionFocus: "Breakdown",
    coachingMethod: "freeze-frame",
    icon: "⚡"
  },
  {
    id: "space-creation",
    title: "Creating Space in Attack",
    challenge: "Players bunch together in attack and don't use the width of the pitch. I want to develop their understanding of when to pass, when to run, and how to create overlaps using decision-making games.",
    ageGroup: "U11",
    sessionFocus: "Attack",
    coachingMethod: "decision-making",
    icon: "🎯"
  }
];
