import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FileText, Copy, Check, Download } from "lucide-react";
import { parseSessionPlan, type ParsedSessionPlan } from "@/lib/session-parser";
import { useState } from "react";

interface SessionPlanProps {
  content: string;
  ageGroup: string;
  onCopy: () => void;
  onExport?: () => void;
}

export function SessionPlan({ content, ageGroup, onCopy, onExport }: SessionPlanProps) {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const parsed: ParsedSessionPlan = parseSessionPlan(content);

  const copySection = (sectionId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <Card className="shadow-xl">
      <CardHeader className="pb-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="text-blue-600 h-6 w-6" />
            <div>
              <CardTitle className="text-xl text-gray-900">
                Session Plan - {ageGroup}
              </CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                {parsed.activities.length} {parsed.activities.length === 1 ? 'section' : 'sections'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onExport && (
              <button
                onClick={onExport}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-green-700 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                aria-label="Export to PDF"
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Download PDF</span>
              </button>
            )}
            <button
              onClick={onCopy}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-700 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
              aria-label="Copy full session plan"
            >
              <Copy className="h-4 w-4" />
              <span className="hidden sm:inline">Copy All</span>
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {parsed.activities.length > 1 ? (
          <Accordion type="multiple" className="space-y-2" defaultValue={[parsed.activities[0]?.id]}>
            {parsed.activities.map((activity, index) => (
              <AccordionItem
                key={activity.id}
                value={activity.id}
                className="border rounded-lg px-4 bg-white hover:bg-gray-50 transition-colors"
              >
                <AccordionTrigger className="hover:no-underline py-4">
                  <div className="flex items-center gap-3 text-left">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 truncate">
                        {activity.title}
                      </div>
                      {activity.duration && (
                        <Badge variant="outline" className="mt-1 text-xs">
                          {activity.duration}
                        </Badge>
                      )}
                    </div>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="pt-2 pb-4">
                  <div className="space-y-4 pl-11">
                    {/* Main content */}
                    {activity.content && (
                      <div className="prose prose-sm max-w-none text-gray-700">
                        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                          {activity.content}
                        </pre>
                      </div>
                    )}

                    {/* Subsections */}
                    {activity.subsections && activity.subsections.length > 0 && (
                      <div className="space-y-3">
                        {activity.subsections.map((subsection, subIndex) => (
                          <div key={subIndex} className="border-l-2 border-blue-200 pl-4">
                            <h4 className="font-semibold text-sm text-gray-800 mb-2">
                              {subsection.title}
                            </h4>
                            <div className="prose prose-sm max-w-none text-gray-600">
                              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                                {subsection.content}
                              </pre>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Copy section button */}
                    <div className="flex justify-end pt-2">
                      <button
                        onClick={() => {
                          const fullText = [
                            activity.title,
                            activity.duration ? `(${activity.duration})` : '',
                            activity.content,
                            ...(activity.subsections?.map(s => `${s.title}\n${s.content}`) || []),
                          ].filter(Boolean).join('\n\n');
                          copySection(activity.id, fullText);
                        }}
                        className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                      >
                        {copiedSection === activity.id ? (
                          <>
                            <Check className="h-3 w-3" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            Copy Section
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          // Fallback for unparsed content
          <div className="prose prose-sm max-w-none">
            <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700 leading-relaxed">
              {content}
            </pre>
          </div>
        )}

        <Separator className="my-6" />

        {/* Copy full plan button */}
        <button
          onClick={onCopy}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Copy className="h-4 w-4" />
          Copy Full Session Plan
        </button>
      </CardContent>
    </Card>
  );
}
