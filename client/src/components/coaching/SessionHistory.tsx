import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History, Trash2, FileText } from "lucide-react";
import { SavedSession, formatSessionDate, deleteSession } from "@/lib/session-storage";
import { useState } from "react";

interface SessionHistoryProps {
  sessions: SavedSession[];
  onLoadSession: (session: SavedSession) => void;
  onSessionDeleted: () => void;
}

export function SessionHistory({ sessions, onLoadSession, onSessionDeleted }: SessionHistoryProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (sessions.length === 0) {
    return (
      <Card className="mb-6 bg-white/95 backdrop-blur-sm border-gray-200">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-gray-600" />
            <CardTitle className="text-gray-800">Session History</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <History className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No saved sessions yet</p>
            <p className="text-xs mt-1">Sessions will be automatically saved when you generate them</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleDelete = (sessionId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setDeletingId(sessionId);
    setTimeout(() => {
      deleteSession(sessionId);
      setDeletingId(null);
      onSessionDeleted();
    }, 150);
  };

  return (
    <Card className="mb-6 bg-white/95 backdrop-blur-sm border-gray-200">
      <CardHeader className="pb-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-gray-600" />
            <CardTitle className="text-gray-800">Session History</CardTitle>
          </div>
          <Badge variant="outline" className="text-xs">
            {sessions.length} saved
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-2">
          {sessions.slice(0, 5).map((session) => (
            <button
              key={session.id}
              onClick={() => onLoadSession(session)}
              className={`w-full p-4 rounded-lg border-2 text-left transition-all hover:border-blue-400 hover:bg-blue-50 ${
                deletingId === session.id ? 'opacity-50 scale-95' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4 text-blue-600 flex-shrink-0" />
                    <h4 className="font-semibold text-sm text-gray-900 truncate">
                      {session.ageGroup} - {session.sessionFocus}
                    </h4>
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                    {session.challenge}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className="text-xs">
                      {session.ageGroup}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {session.sessionDuration} min
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {formatSessionDate(session.timestamp)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={(e) => handleDelete(session.id, e)}
                  className="p-2 rounded hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors flex-shrink-0"
                  aria-label="Delete session"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </button>
          ))}
        </div>
        {sessions.length > 5 && (
          <p className="text-xs text-gray-500 text-center mt-3">
            Showing 5 most recent sessions (10 total saved)
          </p>
        )}
      </CardContent>
    </Card>
  );
}
