import React, { useState } from "react";
import {
  Send,
  Loader2,
  FileText,
  Settings,
  Youtube,
  ThumbsUp,
  ThumbsDown,
  Info,
  Shield,
} from "lucide-react";
import { apiKeyStorage } from './lib/api-key-storage.ts';
import { ApiKeyModal } from './components/ApiKeyModal';
import { Toaster } from './components/ui/toaster';
import { useToast } from './hooks/use-toast';
import { SessionPlanSkeleton } from './components/coaching/SessionPlanSkeleton';
import { Alert, AlertDescription, AlertTitle } from './components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { TemplateLibrary } from './components/coaching/TemplateLibrary';
import type { SessionTemplate } from './lib/templates';
import { SessionPlan } from './components/coaching/SessionPlan';

export default function TrojansCoachingAssistant() {
  // Toast hook
  const { toast } = useToast();

  // Session inputs
  const [challenge, setChallenge] = useState(
    "I need to develop my players' Catch and Pass skills in order to help their ability to exploit space on the pitch.",
  );
  const [ageGroup, setAgeGroup] = useState("U10");
  const [numPlayers, setNumPlayers] = useState(12);
  const [numCoaches, setNumCoaches] = useState(2);
  const [sessionDuration, setSessionDuration] = useState(60);
  const [sessionFocus, setSessionFocus] = useState("Skills");
  const [coachingMethod, setCoachingMethod] = useState("game-skill-zone");

  // State
  const [response, setResponse] = useState("");
  const [whatsappSummary, setWhatsappSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);

  const ageGroups = [
    "U6",
    "U7",
    "U8",
    "U9",
    "U10",
    "U11",
    "U12",
    "U13",
    "U14",
    "U15",
    "U16",
    "U17",
    "U18",
  ];
  const sessionFocusOptions = [
    "Attack",
    "Defence",
    "Contact",
    "Skills",
    "Game Understanding",
    "Breakdown",
  ];
  const coachingMethods = [
    { value: "game-skill-zone", label: "Game Zone / Skill Zone" },
    { value: "freeze-frame", label: "Freeze Frame / Rewind" },
    { value: "block-practice", label: "Block Practice (Pull Outs)" },
    { value: "decision-making", label: "Decision Making Activities" },
  ];

  // RFU Regulation 15 Rules by Age Group (2025-26 Season)
  const getRegulation15Rules = (age: string) => {
    const rules: Record<string, any> = {
      U6: {
        format: "No matches permitted - training only",
        teamSize: "N/A",
        pitchSize: "N/A",
        halfLength: "N/A",
        maxPlayTime: "N/A",
        contactLevel: "Non-contact games and movement",
        scrums: "None",
        lineouts: "None",
        kickoffs: "None",
        kicking: "None",
        notes: "Focus on FUNdamentals, movement, and basic handling",
      },
      U7: {
        format: "Tag Rugby",
        teamSize: "4v4",
        pitchSize: "20m x 12m",
        halfLength: "10 minutes",
        maxPlayTime: "50 minutes per day",
        contactLevel: "No contact - tag only",
        scrums: "None",
        lineouts: "None",
        kickoffs: "Free pass from halfway",
        kicking: "None",
        notes:
          "Can train/play with U8s. 3m defensive offside line. Focus on evasion and support",
      },
      U8: {
        format: "Tag Rugby",
        teamSize: "6v6",
        pitchSize: "45m x 22m",
        halfLength: "10 minutes",
        maxPlayTime: "50 minutes per day",
        contactLevel: "No contact - tag only",
        scrums: "None",
        lineouts: "None",
        kickoffs: "Free pass from halfway",
        kicking: "None",
        notes:
          "Can train/play with U7s. 7m defensive offside line. Develop decision-making",
      },
      U9: {
        format: "Transitional Contact",
        teamSize: "7v7",
        pitchSize: "60m x 30m",
        halfLength: "15 minutes",
        maxPlayTime: "60 minutes per day",
        contactLevel: "Tackle including hold - below sternum",
        scrums: "None initially, introduce towards end of season",
        lineouts: "None",
        kickoffs: "Free pass from halfway",
        kicking: "None",
        notes:
          "Introduction to contact. Emphasis on safe tackle technique. Contact game starts.",
      },
      U10: {
        format: "Contact Rugby",
        teamSize: "8v8",
        pitchSize: "60m x 35m",
        halfLength: "15 minutes",
        maxPlayTime: "60 minutes per day",
        contactLevel:
          "Full tackle (not hold), ruck (1 support player), maul (1 support player)",
        scrums: "3-player uncontested scrums",
        lineouts: "None",
        kickoffs: "Free pass from halfway",
        kicking: "None",
        notes:
          "Rucks and mauls with 1 support player per team. Tackle not hold.",
      },
      U11: {
        format: "Contact Rugby",
        teamSize: "9v9",
        pitchSize: "60m x 43m",
        halfLength: "20 minutes",
        maxPlayTime: "70 minutes per day",
        contactLevel:
          "Full tackle, ruck (2 support players), maul (2 support players)",
        scrums: "3-player contested scrums (strike, no push)",
        lineouts: "None",
        kickoffs: "Drop kick from halfway",
        kicking: "Allowed - no fly-hack",
        notes:
          "Rucks and mauls with 2 support players per team. Girls can play with U12 girls (with approval)",
      },
      U12: {
        format: "Contact Rugby",
        teamSize: "12v12",
        pitchSize: "60m x 43m",
        halfLength: "20 minutes",
        maxPlayTime: "70 minutes per day",
        contactLevel:
          "Full tackle, ruck (unlimited), maul (unlimited). Fend-off below armpits.",
        scrums: "5-player contested scrums (strike, no push)",
        lineouts: "None",
        kickoffs: "Drop kick from halfway",
        kicking: "Allowed - no fly-hack",
        notes:
          "Mixed rugby no longer permitted from U12. 5-player scrum with 2 in second row",
      },
      U13: {
        format: "Contact Rugby",
        teamSize: "Boys: 13v13, Girls: 12v12",
        pitchSize: "Boys: 90m x 60m, Girls: 60m x 43m",
        halfLength: "25 minutes",
        maxPlayTime: "80 minutes per day",
        contactLevel: "Full contact, tackle below base of sternum",
        scrums:
          "Boys: 6-player (strike and push). Girls: 5-player (strike, no push)",
        lineouts: "None",
        kickoffs: "Drop kick from halfway",
        kicking: "Boys: Fly-hack allowed. Girls: No fly-hack",
        notes:
          "Full laws apply with tackle height restriction. Girls play joint age band (U12/13/14)",
      },
      U14: {
        format: "Contact Rugby",
        teamSize: "15v15",
        pitchSize: "100m x 70m",
        halfLength: "25 minutes",
        maxPlayTime: "80 minutes per day",
        contactLevel: "Full contact, tackle below base of sternum",
        scrums: "8-player contested scrums. Number 8 pick-up allowed.",
        lineouts: "Uncontested lineout",
        kickoffs: "Drop kick from halfway",
        kicking: "Kicking at goal allowed. Fly-hack allowed.",
        notes:
          "Full 8-player scrums introduced. Tackle height restriction continues",
      },
      U15: {
        format: "Contact Rugby",
        teamSize: "15v15",
        pitchSize: "100m x 70m",
        halfLength: "30 minutes",
        maxPlayTime: "90 minutes per day",
        contactLevel: "Full contact, tackle below base of sternum",
        scrums: "8-player contested scrums",
        lineouts: "Uncontested lineout - lift permitted",
        kickoffs: "Drop kick from halfway",
        kicking: "Full kicking allowed",
        notes:
          "League rugby permitted from U15. Tackle height restriction. Girls joint age band (U14/15/16)",
      },
      U16: {
        format: "Contact Rugby",
        teamSize: "15v15",
        pitchSize: "100m x 70m",
        halfLength: "35 minutes",
        maxPlayTime: "90 minutes per day",
        contactLevel: "Full contact, tackle below base of sternum",
        scrums: "8-player contested scrums",
        lineouts: "Contested lineout - lift and support",
        kickoffs: "Drop kick from halfway",
        kicking: "Full kicking allowed",
        notes: "Tackle height restriction continues",
      },
      U17: {
        format: "Contact Rugby",
        teamSize: "15v15",
        pitchSize: "100m x 70m",
        halfLength: "35 minutes",
        maxPlayTime: "90 minutes per day",
        contactLevel: "Full contact, tackle below base of sternum",
        scrums: "8-player contested scrums",
        lineouts: "Contested lineout - lift and support",
        kickoffs: "Drop kick from halfway",
        kicking: "Full kicking allowed",
        notes: "Tackle height restriction continues",
      },
      U18: {
        format: "Contact Rugby",
        teamSize: "15v15",
        pitchSize: "100m x 70m",
        halfLength: "40 minutes",
        maxPlayTime: "100 minutes per day",
        contactLevel: "Full contact, tackle below base of sternum",
        scrums: "8-player contested scrums",
        lineouts: "Contested lineout - lift and support",
        kickoffs: "Drop kick from halfway",
        kicking: "Full kicking allowed",
        notes: "Full rugby laws apply. Tackle height restriction continues.",
      },
    };
    return rules[age] || rules["U10"];
  };

  const getCoachingAdvice = async () => {
    
    setLoading(true);
    setError("");
    setResponse("");
    setWhatsappSummary("");
    setFeedback(null);

    const regulation15 = getRegulation15Rules(ageGroup);

    const coachingMethodDescriptions: Record<string, string> = {
      "game-skill-zone":
        "Use Game Zone (decision-making games) and Skill Zone (isolated skill practice) approach. Start with an unopposed game, then move to skill practice, then return to an opposed game.",
      "freeze-frame":
        "Use Freeze Frame technique - stop the action to highlight key learning moments, rewind and replay scenarios for better understanding.",
      "block-practice":
        "Use Block Practice (repetitive drills) and Pull Outs (isolating individuals for specific coaching). Break down skills into components and practice repeatedly.",
      "decision-making":
        "Focus on decision-making activities where players must read the game and choose appropriate actions. Use question-led coaching.",
    };

    const prompt = `You are an expert rugby coach creating a detailed training session plan following RFU Regulation 15 (2025-26 season).

**COACHING CHALLENGE:**
${challenge}

**AGE GROUP:** ${ageGroup}
**SESSION FOCUS:** ${sessionFocus}
**COACHING METHOD:** ${coachingMethodDescriptions[coachingMethod]}
**SESSION DURATION:** ${sessionDuration} minutes
**NUMBER OF PLAYERS:** ${numPlayers}
**NUMBER OF COACHES:** ${numCoaches}

**RFU REGULATION 15 RULES FOR ${ageGroup}:**
- Format: ${regulation15.format}
- Team Size: ${regulation15.teamSize}
- Pitch Size: ${regulation15.pitchSize}
- Half Length: ${regulation15.halfLength}
- Contact Level: ${regulation15.contactLevel}
- Scrums: ${regulation15.scrums}
- Lineouts: ${regulation15.lineouts}
- Kickoffs: ${regulation15.kickoffs}
- Kicking: ${regulation15.kicking}
- Notes: ${regulation15.notes}

**IMPORTANT INSTRUCTIONS:**
1. **Strictly adhere to RFU Regulation 15** for ${ageGroup} - no activities that go beyond the permitted contact level or use prohibited elements
2. Follow the coaching method: ${coachingMethodDescriptions[coachingMethod]}
3. Embed "Coaching Habits" in every activity:
   - Player names (use diverse names reflecting UK demographics)
   - Questioning techniques
   - Positive reinforcement examples
   - How to give effective feedback
4. Use STEP Principle for progressions (Space, Task, Equipment, People)
5. Include timing for each activity
6. Suggest appropriate Keep Your Boots On (KYBO) video resources
7. Account for ${numCoaches} coaches - suggest how to organize groups
8. Address the coaching challenge: ${challenge}

**SESSION STRUCTURE:**
Create a ${sessionDuration}-minute session with:
1. Arrival Activity (5-10 mins) - game-based, no equipment setup
2. Warm-up (10 mins) - dynamic, rugby-specific
3. Main Activities (${sessionDuration - 30} mins) - following chosen coaching method
4. Cool-down & Reflection (5-10 mins)

For EACH activity provide:
- Activity name & description
- Organisation (space, players per group, coach positioning)
- Key coaching points
- STEP progressions (2-3 levels)
- Example coaching dialogue (with player names)
- Safety considerations
- Link to relevant KYBO video topic (descriptive, no URLs)

Make it practical, detailed, and immediately usable for ${numCoaches} coach(es) with ${numPlayers} ${ageGroup} players.`;

    try {
      const apiResponse = await fetch("/api/generate-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt,
          maxTokens: 4096,
        }),
      });

      if (!apiResponse.ok) {
        const errorData = await apiResponse.json().catch(() => ({}));
        const userMessage = errorData.userMessage || `API request failed with status ${apiResponse.status}`;
        throw new Error(userMessage);
      }

      const data = await apiResponse.json();
      const claudeResponse = data.content[0].text;
      setResponse(claudeResponse);

      // Generate WhatsApp summary
      const whatsappPrompt = `Based on this rugby session plan for ${ageGroup}, create a brief WhatsApp message (150-200 words) that a coach can send to parents.

Include:
- What the session will focus on (${sessionFocus})
- Key skills being developed
- What to bring (kit, water, gumshield)
- Positive, encouraging tone
- Remind about pickup time

Session plan:
${claudeResponse}

Format it ready to copy and paste into WhatsApp.`;

      const summaryResponse = await fetch("/api/generate-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: whatsappPrompt,
          maxTokens: 400,
        }),
      });

      if (!summaryResponse.ok) {
        const errorData = await summaryResponse.json().catch(() => ({}));
        const userMessage = errorData.userMessage || `WhatsApp summary generation failed with status ${summaryResponse.status}`;
        throw new Error(userMessage);
      }

      const summaryData = await summaryResponse.json();
      const summaryClaude = summaryData.content[0].text;
      setWhatsappSummary(summaryClaude);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred",
      );
    } finally {
      setLoading(false);
    }
  };

  const provideFeedback = (isPositive: boolean) => {
    setFeedback(isPositive ? "positive" : "negative");
    console.log(`Feedback: ${isPositive ? "👍" : "👎"}`);
  };

  // Get Alert styling based on contact level
  const getRFUAlertStyle = (ageGroup: string) => {
    const rules = getRegulation15Rules(ageGroup);
    const contactLevel = rules.contactLevel.toLowerCase();

    if (contactLevel.includes("no contact") || contactLevel.includes("tag")) {
      return {
        className: "border-green-500 bg-green-50 dark:bg-green-950/20",
        iconColor: "text-green-600 dark:text-green-500",
        titleColor: "text-green-900 dark:text-green-100",
        descColor: "text-green-800 dark:text-green-200",
      };
    } else if (contactLevel.includes("transitional")) {
      return {
        className: "border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20",
        iconColor: "text-yellow-600 dark:text-yellow-500",
        titleColor: "text-yellow-900 dark:text-yellow-100",
        descColor: "text-yellow-800 dark:text-yellow-200",
      };
    } else {
      return {
        className: "border-orange-500 bg-orange-50 dark:bg-orange-950/20",
        iconColor: "text-orange-600 dark:text-orange-500",
        titleColor: "text-orange-900 dark:text-orange-100",
        descColor: "text-orange-800 dark:text-orange-200",
      };
    }
  };

  // Handle template selection
  const loadTemplate = (template: SessionTemplate) => {
    setChallenge(template.challenge);
    setAgeGroup(template.ageGroup);
    setSessionFocus(template.sessionFocus);
    setCoachingMethod(template.coachingMethod);

    // Show toast confirmation
    toast({
      title: "Template loaded",
      description: `${template.title} - You can edit the challenge below`,
      duration: 3000,
    });

    // Smooth scroll to challenge textarea
    setTimeout(() => {
      document.querySelector('textarea')?.focus();
      document.querySelector('textarea')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            🏉 Trojans Coaching Assistant
          </h1>
          <p className="text-blue-100 text-lg">
            RFU Regulation 15 Compliant Session Plans
          </p>
          <p className="text-blue-200 text-sm mt-1">
            v2.0 - Full Regulation 15 Compliance (2025-26 Season)
          </p>
        </div>

        {/* Quick Start Templates */}
        <TemplateLibrary onSelectTemplate={loadTemplate} />

        {/* Main Coaching Challenge */}
        <Card className="mb-6 shadow-xl border-blue-200 bg-white/95 backdrop-blur-sm">
          <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-white">
            <CardTitle className="text-gray-900 flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              Your Coaching Challenge
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Describe what you want to achieve in this session
            </p>
          </CardHeader>
          <CardContent className="pt-6">
            <textarea
              value={challenge}
              onChange={(e) => setChallenge(e.target.value)}
              placeholder="Example: I need to develop my players' Catch and Pass skills to help them exploit space on the pitch. Players often drop the ball under pressure..."
              rows={5}
              className="w-full p-4 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 placeholder:text-gray-400"
              aria-label="Coaching challenge description"
            />
            <p className="text-xs text-gray-500 mt-2">
              💡 Tip: Be specific about the skills or behaviors you want to develop
            </p>
          </CardContent>
        </Card>

        {/* Session Details */}
        <Card className="mb-6 shadow-xl bg-white/95 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-gray-900 text-base flex items-center gap-2">
              <Settings className="h-5 w-5 text-gray-600" />
              Session Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Players
                </label>
                <input
                  type="number"
                  value={numPlayers}
                  onChange={(e) => setNumPlayers(parseInt(e.target.value) || 0)}
                  min={6}
                  max={25}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  aria-label="Number of players"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Coaches
                </label>
                <input
                  type="number"
                  value={numCoaches}
                  onChange={(e) => setNumCoaches(parseInt(e.target.value) || 0)}
                  min={1}
                  max={6}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  aria-label="Number of coaches"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Session Duration
                </label>
                <select
                  value={sessionDuration}
                  onChange={(e) => setSessionDuration(parseInt(e.target.value))}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                  aria-label="Session duration"
                >
                  <option value={60}>60 minutes</option>
                  <option value={75}>75 minutes</option>
                  <option value={90}>90 minutes</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Advanced Settings - Collapsible */}
        <Card className="mb-6 shadow-xl bg-white/95 backdrop-blur-sm">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="w-full p-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors rounded-lg"
            aria-expanded={showSettings}
            aria-controls="advanced-settings"
          >
            <div className="flex items-center gap-2">
              <Settings size={20} className="text-gray-600" />
              <h3 className="text-base font-semibold text-gray-900">
                Advanced Settings
              </h3>
              <Badge variant="outline" className="text-xs">
                Optional
              </Badge>
            </div>
            <div className={`transition-transform ${showSettings ? 'rotate-180' : ''}`}>
              <svg className="w-5 h-5 text-gray-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </button>

          {showSettings && (
            <div className="px-6 pb-6 border-t space-y-6 pt-6" id="advanced-settings">
              {/* Age Group and RFU Rules moved here from old settings panel */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age Group
                </label>
                <select
                  value={ageGroup}
                  onChange={(e) => setAgeGroup(e.target.value)}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                  aria-label="Select age group"
                >
                  {ageGroups.map((age) => (
                    <option key={age} value={age}>
                      {age}
                    </option>
                  ))}
                </select>
                {/* RFU Rules Alert */}
                <Alert className={`mt-4 ${getRFUAlertStyle(ageGroup).className}`}>
                  <Shield className={`h-5 w-5 ${getRFUAlertStyle(ageGroup).iconColor}`} />
                  <AlertTitle className={getRFUAlertStyle(ageGroup).titleColor}>
                    RFU Regulation 15 - {ageGroup}
                  </AlertTitle>
                  <AlertDescription className={`${getRFUAlertStyle(ageGroup).descColor} space-y-2`}>
                    <div className="grid md:grid-cols-2 gap-x-4 gap-y-1 text-sm">
                      <div>
                        <span className="font-semibold">Format:</span> {getRegulation15Rules(ageGroup).teamSize}
                      </div>
                      <div>
                        <span className="font-semibold">Contact:</span> {getRegulation15Rules(ageGroup).contactLevel}
                      </div>
                      <div>
                        <span className="font-semibold">Scrums:</span> {getRegulation15Rules(ageGroup).scrums}
                      </div>
                      <div>
                        <span className="font-semibold">Duration:</span> {getRegulation15Rules(ageGroup).halfLength} halves
                      </div>
                    </div>
                    <p className="text-xs italic pt-1 border-t border-current/20">
                      {getRegulation15Rules(ageGroup).notes}
                    </p>
                  </AlertDescription>
                </Alert>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Session Focus
                </label>
                <select
                  value={sessionFocus}
                  onChange={(e) => setSessionFocus(e.target.value)}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                  aria-label="Select session focus"
                >
                  {sessionFocusOptions.map((focus) => (
                    <option key={focus} value={focus}>
                      {focus}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Coaching Method
                </label>
                <select
                  value={coachingMethod}
                  onChange={(e) => setCoachingMethod(e.target.value)}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                  aria-label="Select coaching method"
                >
                  {coachingMethods.map((method) => (
                    <option key={method.value} value={method.value}>
                      {method.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </Card>

        {/* Desktop Generate Button */}
        <div className="hidden md:block mb-6">
          <button
            onClick={getCoachingAdvice}
            disabled={loading || !challenge.trim()}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold py-4 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl disabled:shadow-none flex items-center justify-center gap-3 transform hover:scale-[1.02] disabled:hover:scale-100"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={22} />
                <span>Creating your session plan...</span>
              </>
            ) : (
              <>
                <Send size={22} />
                <span>Generate RFU Regulation 15 Compliant Session Plan</span>
              </>
            )}
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 font-semibold">⚠️ {error}</p>
          </div>
        )}

        {/* Loading State with Skeleton */}
        {loading && <SessionPlanSkeleton />}

        {/* Response Display */}
        {response && !loading && (
          <>
            {/* Feedback Section */}
            <div className="bg-white rounded-lg shadow-xl p-4 mb-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-700 font-semibold">
                  Was this session plan helpful?
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => provideFeedback(true)}
                    className={`p-2 rounded-lg transition-colors ${
                      feedback === "positive"
                        ? "bg-green-500 text-white"
                        : "bg-gray-100 hover:bg-green-100 text-gray-700"
                    }`}
                  >
                    <ThumbsUp size={20} />
                  </button>
                  <button
                    onClick={() => provideFeedback(false)}
                    className={`p-2 rounded-lg transition-colors ${
                      feedback === "negative"
                        ? "bg-red-500 text-white"
                        : "bg-gray-100 hover:bg-red-100 text-gray-700"
                    }`}
                  >
                    <ThumbsDown size={20} />
                  </button>
                </div>
              </div>
              {feedback && (
                <p className="text-sm text-gray-600 mt-2">
                  {feedback === "positive"
                    ? "✓ Thanks! This helps improve future plans."
                    : "✓ Thanks for feedback. We'll work on improving."}
                </p>
              )}
            </div>

            {/* WhatsApp Summary */}
            {whatsappSummary && (
              <div className="bg-green-50 border-2 border-green-500 rounded-lg shadow-xl p-6 mb-6">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-green-300">
                  <span className="text-2xl">💬</span>
                  <h2 className="text-lg font-bold text-gray-800">
                    WhatsApp Message for Parents
                  </h2>
                </div>
                <div className="bg-white rounded-lg p-4 mb-3">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans leading-relaxed">
                    {whatsappSummary}
                  </pre>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(whatsappSummary);
                    toast({
                      title: "Copied!",
                      description: "WhatsApp message ready to paste",
                      duration: 2000,
                    });
                  }}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  📋 Copy WhatsApp Message
                </button>
              </div>
            )}

            {/* Full Session Plan - Structured Display */}
            <SessionPlan
              content={response}
              ageGroup={ageGroup}
              onCopy={() => {
                navigator.clipboard.writeText(response);
                toast({
                  title: "Copied!",
                  description: "Session plan copied to clipboard",
                  duration: 2000,
                });
              }}
            />
          </>
        )}

        {/* Instructions */}
        {!response && !loading && (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <h3 className="text-white font-semibold mb-3">
              Quick Start Guide:
            </h3>
            <ol className="text-blue-100 space-y-2 text-sm">
              <li>
                1. Click <Settings className="inline" size={16} /> to customize
                age group, focus, and coaching method
              </li>
              <li>2. Describe your coaching challenge</li>
              <li>3. Set player numbers, coaches, and duration</li>
              <li>4. Generate your RFU Regulation 15 compliant session plan</li>
              <li>5. Get WhatsApp message + YouTube resources</li>
              <li>6. Provide feedback to help improve future plans</li>
            </ol>

            <div className="mt-4 pt-4 border-t border-white/20">
              <h4 className="text-white font-semibold mb-2">
                What's New in v2.0:
              </h4>
              <ul className="text-blue-100 space-y-1 text-sm">
                <li>
                  ✓ Full RFU Regulation 15 compliance (team sizes, contact
                  levels, match duration)
                </li>
                <li>
                  ✓ Age-specific activity suggestions (Tag for U7-U8,
                  Transitional for U9, etc.)
                </li>
                <li>✓ Coaching Habits embedded in every activity</li>
                <li>✓ STEP Principle progressions</li>
                <li>✓ Keep Your Boots On video recommendations</li>
                <li>
                  ✓ Feedback system (coming: learns from your preferences)
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Mobile sticky button - fixed at bottom, hidden on desktop */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg z-50">
        <button
          onClick={getCoachingAdvice}
          disabled={loading || !challenge.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 touch-manipulation min-h-[48px]"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              <span className="text-sm">Creating...</span>
            </>
          ) : (
            <>
              <Send size={20} />
              <span>Generate Plan</span>
            </>
          )}
        </button>
      </div>

      {/* Bottom padding on mobile to prevent content being hidden by sticky button */}
      <div className="md:hidden h-20" aria-hidden="true" />

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
        onSave={() => {
          setShowApiKeyModal(false);
        }}
      />

      {/* Toast notifications */}
      <Toaster />
    </div>
  );
}