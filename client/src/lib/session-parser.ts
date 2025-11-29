/**
 * Parse AI-generated session plan into structured sections
 */

export interface ActivitySection {
  id: string;
  title: string;
  duration?: string;
  content: string;
  subsections?: {
    title: string;
    content: string;
  }[];
}

export interface ParsedSessionPlan {
  activities: ActivitySection[];
  rawText: string;
}

/**
 * Parse session plan text into structured activities
 * Looks for common patterns like:
 * - "1. Activity Name (10 mins)"
 * - "## Activity Name"
 * - Activity sections with duration markers
 */
export function parseSessionPlan(text: string): ParsedSessionPlan {
  const activities: ActivitySection[] = [];

  // Split by common activity section markers
  // Patterns: "1. ", "## ", numbered lists, or activity keywords
  const activityKeywords = [
    'arrival activity',
    'warm-up',
    'warm up',
    'main activity',
    'skill zone',
    'game zone',
    'cool-down',
    'cool down',
    'reflection',
    'activity 1',
    'activity 2',
    'activity 3',
    'activity 4',
  ];

  // Try to split by markdown headers or numbered lists
  const lines = text.split('\n');
  let currentActivity: ActivitySection | null = null;
  let currentSubsection: { title: string; content: string } | null = null;
  let lineBuffer: string[] = [];

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // Check if this line starts a new main activity
    const isMainActivityHeader =
      /^#{1,2}\s+\d+\.?\s+/.test(trimmed) || // ## 1. Activity or # 1. Activity
      /^#{1,2}\s+[A-Z]/.test(trimmed) || // ## ACTIVITY
      /^\d+\.\s+[A-Z]/.test(trimmed) || // 1. ACTIVITY
      activityKeywords.some(keyword => trimmed.toLowerCase().startsWith(keyword)) ||
      /^\*\*\d+\./.test(trimmed); // **1. Activity

    // Check if this is a subsection header (smaller heading or bold)
    const isSubsection =
      /^#{3,4}\s+/.test(trimmed) || // ### or ####
      /^\*\*[A-Z][^*]+\*\*/.test(trimmed) || // **Title**
      /^[A-Z][a-z\s]+:$/.test(trimmed); // Title:

    if (isMainActivityHeader) {
      // Save previous activity if exists
      if (currentActivity) {
        if (currentSubsection) {
          currentActivity.subsections = currentActivity.subsections || [];
          currentActivity.subsections.push({
            title: currentSubsection.title,
            content: lineBuffer.join('\n').trim(),
          });
        } else {
          currentActivity.content += '\n' + lineBuffer.join('\n').trim();
        }
        activities.push(currentActivity);
      }

      // Extract duration if present (10 mins, 15 minutes, etc.)
      const durationMatch = trimmed.match(/\((\d+)\s*(min|minute)s?\)/i);
      const duration = durationMatch ? `${durationMatch[1]} min` : undefined;

      // Clean title
      let title = trimmed
        .replace(/^#{1,4}\s*/, '')
        .replace(/^\d+\.\s*/, '')
        .replace(/^\*\*/, '')
        .replace(/\*\*$/, '')
        .replace(/\(.*?\)/, '')
        .trim();

      currentActivity = {
        id: `activity-${activities.length + 1}`,
        title: title || `Activity ${activities.length + 1}`,
        duration,
        content: '',
        subsections: [],
      };

      currentSubsection = null;
      lineBuffer = [];
    } else if (isSubsection && currentActivity) {
      // Save previous subsection if exists
      if (currentSubsection) {
        currentActivity.subsections = currentActivity.subsections || [];
        currentActivity.subsections.push({
          title: currentSubsection.title,
          content: lineBuffer.join('\n').trim(),
        });
      }

      // Start new subsection
      const title = trimmed
        .replace(/^#{3,4}\s*/, '')
        .replace(/^\*\*/, '')
        .replace(/\*\*$/, '')
        .replace(/:$/, '')
        .trim();

      currentSubsection = {
        title,
        content: '',
      };
      lineBuffer = [];
    } else {
      // Add line to current buffer
      lineBuffer.push(line);
    }
  });

  // Save final activity
  if (currentActivity) {
    if (currentSubsection) {
      currentActivity.subsections = currentActivity.subsections || [];
      currentActivity.subsections.push({
        title: currentSubsection.title,
        content: lineBuffer.join('\n').trim(),
      });
    } else {
      currentActivity.content += '\n' + lineBuffer.join('\n').trim();
    }
    activities.push(currentActivity);
  }

  // If no activities were parsed, treat the whole text as one section
  if (activities.length === 0) {
    activities.push({
      id: 'activity-1',
      title: 'Session Plan',
      content: text,
    });
  }

  return {
    activities: activities.filter(a => a.content.trim() || (a.subsections && a.subsections.length > 0)),
    rawText: text,
  };
}
