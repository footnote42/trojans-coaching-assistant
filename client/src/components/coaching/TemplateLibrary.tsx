import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { sessionTemplates, type SessionTemplate } from "@/lib/templates";
import { Sparkles } from "lucide-react";

interface TemplateLibraryProps {
  onSelectTemplate: (template: SessionTemplate) => void;
}

export function TemplateLibrary({ onSelectTemplate }: TemplateLibraryProps) {
  return (
    <Card className="mb-6 bg-white/95 backdrop-blur-sm border-blue-200">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-600" />
          <CardTitle className="text-gray-800">Quick Start Templates</CardTitle>
        </div>
        <CardDescription>
          Choose a template to get started, or write your own coaching challenge below
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {sessionTemplates.map((template) => (
            <Button
              key={template.id}
              variant="outline"
              onClick={() => onSelectTemplate(template)}
              className="h-auto p-4 flex flex-col items-start text-left hover:bg-blue-50 hover:border-blue-400 transition-all group"
            >
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">
                {template.icon}
              </div>
              <div className="font-semibold text-sm text-gray-900 mb-1">
                {template.title}
              </div>
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <span className="font-medium">{template.ageGroup}</span>
                <span>•</span>
                <span>{template.sessionFocus}</span>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
