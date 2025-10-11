import React, { useState } from "react";
import {
  Send,
  Loader2,
  FileText,
  Settings,
  Youtube,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";

export default function TrojansCoachingAssistant() {
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
        contactLevel: "Tackle including hold - below armpits",
        scrums: "None initially, introduce towards end of season",
        lineouts: "None",
        kickoffs: "Tap from halfway",
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
        kickoffs: "Drop kick from halfway",
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
        lineouts: "Contested lineout - lift permitted",
        kickoffs: "Drop kick from halfway",
        kicking: "Full kicking allowed",
        notes:
          "Contested lineouts introduced. 17 year olds can play adult rugby (not front row)",
      },
      U17: {
        format: "Contact Rugby",
        teamSize: "15v15",
        pitchSize: "100m x 70m",
        halfLength: "35 minutes",
        maxPlayTime: "90 minutes per day",
        contactLevel: "Full contact, tackle below base of sternum",
        scrums: "8-player contested scrums",
        lineouts: "Contested lineout",
        kickoffs: "Drop kick from halfway",
        kicking: "Full kicking allowed",
        notes:
          "Can play adult rugby from 17th birthday (not front row until 18)",
      },
      U18: {
        format: "Contact Rugby",
        teamSize: "15v15",
        pitchSize: "100m x 70m",
        halfLength: "35 minutes",
        maxPlayTime: "90 minutes per day",
        contactLevel: "Full contact, tackle below base of sternum",
        scrums: "8-player contested scrums",
        lineouts: "Contested lineout",
        kickoffs: "Drop kick from halfway",
        kicking: "Full kicking allowed",
        notes:
          "Full adult rugby from 18th birthday. Girls joint age band (U16/17/18)",
      },
    };
    return rules[age] || rules["U10"];
  };

  const getFrameworkForAge = (age: string) => {
    const ageNum = parseInt(age.substring(1));
    if (ageNum <= 8) {
      return {
        simplified: true,
        principles:
          "Focus on FUNdamentals: Running, catching, passing, evasion, decision-making",
        treds: "Enjoyment and Teamwork are primary",
      };
    }
    return {
      simplified: false,
      principles: "Full RFU Principles of Play",
      treds: "All TREDS values",
    };
  };

  const provideFeedback = async (thumbsUp: boolean) => {
    setFeedback(thumbsUp ? "positive" : "negative");

    console.log({
      feedback: thumbsUp ? "thumbs_up" : "thumbs_down",
      ageGroup,
      sessionFocus,
      coachingMethod,
      challenge,
      timestamp: new Date().toISOString(),
    });

    setTimeout(() => setFeedback(null), 2000);
  };

  const getCoachingAdvice = async () => {
    setLoading(true);
    setError("");
    setResponse("");
    setWhatsappSummary("");

    const framework = getFrameworkForAge(ageGroup);
    const reg15 = getRegulation15Rules(ageGroup);
    const ageNum = parseInt(ageGroup.substring(1));

    const methodDescription: Record<string, string> = {
      "game-skill-zone": `Game Zone/Skill Zone Cycle:
1. Start with game where problem emerges
2. Isolate skill in focused practice
3. Return to game to apply skill`,
      "freeze-frame": `Freeze Frame/Rewind Method:
1. Stop game at coaching moment
2. Reset to that position
3. Use questions to build awareness
4. Restart from reset position`,
      "block-practice": `Block Practice (Pull Outs):
1-3 players removed from game
Focus on key skill/technique
Short & sharp (2-3 mins)
Return to game with enhanced skill`,
      "decision-making": `Decision Making Pull Outs:
Address skill gap or tactical need
Minimum 2 decisions required
Up to 5 mins meaningful activity
Return solution to game`,
    };

    const prompt = `You are an expert rugby coach assistant for Trojans RFC, strictly following RFU Regulation 15.

TROJANS COACHING FRAMEWORK:
Vision: "To support every player to develop a passion for a lifetime of rugby"
Ethos: "To be an inclusive club, offering opportunities for ALL players to enjoy and develop the skills, behaviours and values rugby offers"

THE TROJANS PLAYER (what we develop):
BEHAVIOURS: Teamwork, Resilience, Enjoyment, Discipline, Sportsmanship, Creativity, Awareness, Decision making, Self-organising
SKILLS: Agility, Balance, Coordination, Footwork, Pass/catch, Tackling, Fitness, Body control, Core strength, Flexibility
KNOWLEDGE: ${ageNum <= 8 ? "Basic rules, safety, spatial awareness, tag technique" : "Offside, Run forward/pass back, Scrum, Lineout, Playing positions, Defensive line, Attacking shape, Kicking, Age grade rules, Ruck/maul"}

TREDS VALUES: Teamwork, Respect, Enjoyment, Discipline, Sportsmanship
${framework.simplified ? "(Focus primarily on Enjoyment and Teamwork for this age)" : ""}

${
  ageNum >= 9
    ? `RFU PRINCIPLES OF PLAY:
1. Go Forward - advancing toward opposition try line
2. Support - being available to help ball carrier
3. Continuity - keeping ball alive and in play
4. Pressure - applying defensive pressure
5. Contest - competing for possession

PRIMARY TACTICS:
- Go Through: Identify gaps/weak shoulders to penetrate
- Go Around: Narrow defence, exploit outside space
- Go Over: Draw defence, play ball behind into back field`
    : ""
}

CRITICAL - RFU REGULATION 15 RULES FOR ${ageGroup}:
Format: ${reg15.format}
Team Size: ${reg15.teamSize}
Half Length: ${reg15.halfLength}
Max Play Time: ${reg15.maxPlayTime}
Contact Level: ${reg15.contactLevel}
Scrums: ${reg15.scrums}
Lineouts: ${reg15.lineouts}
Kickoffs: ${reg15.kickoffs}
Important Notes: ${reg15.notes}

YOU MUST design activities that comply with these rules. Do not suggest activities involving contact for U7-U8, or contested scrums for U9-U10, etc.

COACHING METHOD FOR THIS SESSION:
${methodDescription[coachingMethod]}

STEP PRINCIPLE (use for progressions):
Space - adjust area size
Task - change rules/objectives
Equipment - vary equipment
People - change numbers/groupings

TROJANS COACHING HABITS (must embed in every activity):
1. Shared Purpose - Clear aim linked to Trojans Player, shared with players
2. Progression - Start achievable for ALL, build challenge using STEP
3. Praise - Specific, linked to TREDS values (give examples per activity)
4. Review - Questions throughout, encourage player-led reflection
5. Choice - Give players ownership (specify where they can make choices)

Sessions must be APES: Active, Purposeful, Enjoyable, Safe

SESSION CONTEXT:
- Age group: ${ageGroup}
- Number of players: ${numPlayers}
- Number of coaches: ${numCoaches}
- Session length: ${sessionDuration} minutes
- Session focus: ${sessionFocus}

COACHING CHALLENGE:
"${challenge}"

IMPORTANT GUIDELINES:
- Keep activities age-appropriate for ${ageGroup}
- Use simple, memorable language coaches can recall on pitch
- Suggest specific RFU Kids First/Keep Your Boots On video titles (coaches will search YouTube)
- Respect Reg 15 rules absolutely - no exceptions
${ageNum <= 8 ? "- Focus on fun, movement, basic skills. No tactics." : ""}
${ageNum === 9 ? "- This is transitional contact - emphasize safe tackle technique" : ""}

Provide a complete session plan:

SESSION PURPOSE:
[One sentence linking to Trojans Player and ${ageNum >= 9 ? "RFU Principles" : "FUNdamentals"}]

EQUIPMENT REQUIRED:
[Specific list with quantities needed for ${numPlayers} players]

SAFETY BRIEF (to communicate at start):
[${ageGroup}-specific safety points including Reg 15 requirements]

${
  coachingMethod === "game-skill-zone"
    ? `
WARM-UP / ACTIVATE (${Math.round(sessionDuration * 0.17)} mins):
Activity name:
Description: [${reg15.teamSize} appropriate]
Coaching Points (max 3):
STEP Progressions:
Coaching Habits: [How to embed Shared Purpose, Progression, Praise, Review, Choice]
TREDS emphasis:
Trojans Player elements:

GAME ZONE 1 (${Math.round(sessionDuration * 0.25)} mins):
Activity name:
Description: [Must use ${reg15.format} format]
What to observe: [Problems likely to emerge]
${ageNum >= 9 ? "RFU Principles featured:" : "FUNdamentals focus:"}
Coaching Points (max 3):
Coaching Habits:
TREDS emphasis:

SKILL ZONE (${Math.round(sessionDuration * 0.25)} mins):
Activity name:
Description: [Address problem from Game Zone]
Coaching Points (max 3):
STEP Progressions:
Coaching Habits:
TREDS emphasis:
Trojans Player elements:

GAME ZONE 2 (${Math.round(sessionDuration * 0.25)} mins):
Activity name:
Description: [Return to ${reg15.format}]
Success criteria: [What improvement to look for]
${ageNum >= 9 ? "RFU Principles featured:" : "FUNdamentals applied:"}
Coaching Points (max 3):
Coaching Habits:
TREDS emphasis:
`
    : coachingMethod === "freeze-frame"
      ? `
WARM-UP (${Math.round(sessionDuration * 0.17)} mins):
[Activity with Coaching Points]

MAIN GAME (${Math.round(sessionDuration * 0.6)} mins):
Game: [${reg15.format} format]
When to Freeze: [3-4 key moments]
Questions to ask: [Build player awareness]
How to reset and restart:
Coaching Habits throughout:

PROGRESSION:
[How game evolves]
`
      : `
WARM-UP (${Math.round(sessionDuration * 0.17)} mins):
[Activity]

MAIN ACTIVITY (${Math.round(sessionDuration * 0.5)} mins):
[Primary activity with ${reg15.format} format]
Pull-Out opportunities:
Focus of pull-out:
Return criteria:
Coaching Habits:

GAME APPLICATION (${Math.round(sessionDuration * 0.25)} mins):
[Apply skills in ${reg15.format}]
`
}

COOL DOWN (${Math.round(sessionDuration * 0.08)} mins):
[Brief activity and player-led review]

REVIEW QUESTIONS FOR COACHES:
[3-4 open questions to ask during session]

COACHING ORGANIZATION:
[How to organize ${numPlayers} players with ${numCoaches} coaches - specific groupings and rotations]

REGULATION 15 COMPLIANCE CHECK:
[Confirm activities meet ${ageGroup} requirements: ${reg15.contactLevel}, ${reg15.teamSize}, etc.]

YOUTUBE RESOURCES (RFU Kids First / Keep Your Boots On):
[Suggest 2-3 specific video titles/topics coaches can search for to understand these activities better]

Keep it practical, memorable, and pitch-ready for ${ageGroup}!`;

    try {
      const apiResponse = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4000,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (!apiResponse.ok) {
        throw new Error(`API request failed: ${apiResponse.status}`);
      }

      const data = await apiResponse.json();
      const claudeResponse = data.content[0].text;
      setResponse(claudeResponse);

      const summaryPrompt = `Create a brief WhatsApp message (max 120 words) for ${ageGroup} parents about this Sunday's session:
- What skill we're working on
- Why it matters for their development  
- What to bring (gumshield, boots, water bottle)
- Keep it enthusiastic and parent-friendly
- Use 1-2 emojis max

Session: ${claudeResponse}`;

      const summaryResponse = await fetch(
        "https://api.anthropic.com/v1/messages",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 400,
            messages: [{ role: "user", content: summaryPrompt }],
          }),
        },
      );

      const summaryData = await summaryResponse.json();
      setWhatsappSummary(summaryData.content[0].text);
    } catch (err: any) {
      setError(`Error: ${err.message}`);
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-red-900 p-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-6 border border-white/20">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                🏉 Trojans Coaching Assistant v2.0
              </h1>
              <p className="text-blue-100">
                RFU Regulation 15 Compliant Session Planning
              </p>
            </div>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-lg transition-colors"
            >
              <Settings size={24} />
            </button>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Session Settings
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Age Group:
                </label>
                <select
                  value={ageGroup}
                  onChange={(e) => setAgeGroup(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {ageGroups.map((ag) => (
                    <option key={ag} value={ag}>
                      {ag}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-600 mt-1">
                  {getRegulation15Rules(ageGroup).format}
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Session Focus:
                </label>
                <select
                  value={sessionFocus}
                  onChange={(e) => setSessionFocus(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {sessionFocusOptions.map((sf) => (
                    <option key={sf} value={sf}>
                      {sf}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Coaching Method:
              </label>
              <select
                value={coachingMethod}
                onChange={(e) => setCoachingMethod(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {coachingMethods.map((cm) => (
                  <option key={cm.value} value={cm.value}>
                    {cm.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Main Input Section */}
        <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-700">
              <strong>Setup:</strong> {ageGroup} • {numPlayers} players •{" "}
              {numCoaches} coaches • {sessionDuration} mins • {sessionFocus}
            </p>
            <p className="text-xs text-gray-600 mt-1">
              <strong>Reg 15:</strong> {getRegulation15Rules(ageGroup).format} (
              {getRegulation15Rules(ageGroup).teamSize})
            </p>
          </div>

          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Your Coaching Challenge:
          </label>
          <textarea
            value={challenge}
            onChange={(e) => setChallenge(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none mb-4"
            rows={3}
            placeholder="e.g., My players struggle with support play in attack..."
          />

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Players:
              </label>
              <input
                type="number"
                value={numPlayers}
                onChange={(e) => setNumPlayers(parseInt(e.target.value) || 0)}
                min={6}
                max={25}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Coaches:
              </label>
              <input
                type="number"
                value={numCoaches}
                onChange={(e) => setNumCoaches(parseInt(e.target.value) || 0)}
                min={1}
                max={6}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Duration:
              </label>
              <select
                value={sessionDuration}
                onChange={(e) => setSessionDuration(parseInt(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value={60}>60 mins</option>
                <option value={75}>75 mins</option>
                <option value={90}>90 mins</option>
              </select>
            </div>
          </div>

          <button
            onClick={getCoachingAdvice}
            disabled={loading || !challenge.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Creating your session plan...
              </>
            ) : (
              <>
                <Send size={20} />
                Generate Reg 15 Compliant Session Plan
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

        {/* Response Display */}
        {response && (
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
                    alert("✓ Copied to clipboard!");
                  }}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  📋 Copy WhatsApp Message
                </button>
              </div>
            )}

            {/* Full Session Plan */}
            <div className="bg-white rounded-lg shadow-xl p-6">
              <div className="flex items-center justify-between mb-4 pb-3 border-b">
                <div className="flex items-center gap-2">
                  <FileText className="text-blue-600" size={24} />
                  <h2 className="text-xl font-bold text-gray-800">
                    Session Plan - {ageGroup}
                  </h2>
                </div>
                <Youtube className="text-red-600" size={24} />
              </div>
              <div className="prose max-w-none mb-4">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans leading-relaxed">
                  {response}
                </pre>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(response);
                  alert("✓ Session plan copied to clipboard!");
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                📋 Copy Full Session Plan
              </button>
            </div>
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
    </div>
  );
}
