import React from 'react';
import { Plus, Lightbulb, Calendar, FileText, Settings } from 'lucide-react';

interface QuickActionsProps {
  onAddIdea: () => void;
  onCreatePost: () => void;
  onOpenCalendar: () => void;
  onOpenSettings: () => void;
}

export default function QuickActions({
  onAddIdea,
  onCreatePost,
  onOpenCalendar,
  onOpenSettings
}: QuickActionsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <button
        onClick={onAddIdea}
        className="p-4 bg-yellow-100 hover:bg-yellow-200 rounded-lg flex flex-col items-center gap-2 transition-colors"
      >
        <Lightbulb className="w-6 h-6 text-yellow-700" />
        <span className="text-sm font-medium text-yellow-900">Добавить идею</span>
      </button>

      <button
        onClick={onCreatePost}
        className="p-4 bg-green-100 hover:bg-green-200 rounded-lg flex flex-col items-center gap-2 transition-colors"
      >
        <Plus className="w-6 h-6 text-green-700" />
        <span className="text-sm font-medium text-green-900">Создать пост</span>
      </button>

      <button
        onClick={onOpenCalendar}
        className="p-4 bg-blue-100 hover:bg-blue-200 rounded-lg flex flex-col items-center gap-2 transition-colors"
      >
        <Calendar className="w-6 h-6 text-blue-700" />
        <span className="text-sm font-medium text-blue-900">Календарь</span>
      </button>

      <button
        onClick={onOpenSettings}
        className="p-4 bg-purple-100 hover:bg-purple-200 rounded-lg flex flex-col items-center gap-2 transition-colors"
      >
        <Settings className="w-6 h-6 text-purple-700" />
        <span className="text-sm font-medium text-purple-900">Настройки</span>
      </button>
    </div>
  );
}
