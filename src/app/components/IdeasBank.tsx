import React, { useState } from 'react';
import { Idea, createIdea, createPost } from '../../lib/storage';
import { useApp } from '../../context/AppContext';
import { Plus, Lightbulb, ArrowRight, Trash2, Edit, LayoutGrid } from 'lucide-react';
import { toast } from 'sonner';

export default function IdeasBank() {
  const { ideas, addIdea, updateIdea, deleteIdea, addPost } = useApp();
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [quickIdeaText, setQuickIdeaText] = useState('');
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);

  const handleQuickAdd = () => {
    if (!quickIdeaText.trim()) {
      toast.error('Введите текст идеи');
      return;
    }

    const idea = createIdea({ text: quickIdeaText });
    addIdea(idea);
    setQuickIdeaText('');
    setShowQuickAdd(false);
    toast.success('Идея добавлена');
  };

  const handleCreatePost = (idea: Idea) => {
    const post = createPost({
      title: idea.text,
      topic: idea.topic,
      niche: idea.niche,
      rubric: idea.rubric,
      platform: idea.platform,
      format: idea.format,
      ideaDescription: idea.text,
      status: 'В работе'
    });

    addPost(post);
    toast.success('Пост создан из идеи');
  };

  const handleSendToBoard = (idea: Idea) => {
    const post = createPost({
      title: idea.text,
      topic: idea.topic,
      niche: idea.niche,
      rubric: idea.rubric,
      platform: idea.platform,
      format: idea.format,
      ideaDescription: idea.text,
      status: 'Идея'
    });

    addPost(post);
    deleteIdea(idea.id);
    toast.success('Идея отправлена на доску');
  };

  const handleDeleteIdea = (id: string) => {
    if (confirm('Удалить эту идею?')) {
      deleteIdea(id);
      toast.success('Идея удалена');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Банк идей</h2>
        <button
          onClick={() => setShowQuickAdd(true)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Быстро добавить идею
        </button>
      </div>

      {showQuickAdd && (
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h3 className="font-medium mb-3 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-600" />
            Быстрое добавление идеи
          </h3>
          <textarea
            value={quickIdeaText}
            onChange={(e) => setQuickIdeaText(e.target.value)}
            className="w-full px-3 py-2 bg-white rounded-lg border border-border h-24 resize-none mb-3"
            placeholder="Опишите вашу идею..."
            autoFocus
          />
          <div className="flex items-center gap-2">
            <button
              onClick={handleQuickAdd}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
            >
              Добавить
            </button>
            <button
              onClick={() => {
                setShowQuickAdd(false);
                setQuickIdeaText('');
              }}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg"
            >
              Отмена
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ideas.map(idea => (
          <div key={idea.id} className="bg-white p-4 rounded-lg border border-border">
            <div className="flex items-start justify-between gap-2 mb-3">
              <Lightbulb className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
              <p className="flex-1 text-sm">{idea.text}</p>
            </div>

            {(idea.platform || idea.format || idea.niche) && (
              <div className="flex flex-wrap gap-2 mb-3">
                {idea.platform && (
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                    {idea.platform}
                  </span>
                )}
                {idea.format && (
                  <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                    {idea.format}
                  </span>
                )}
                {idea.niche && (
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                    {idea.niche}
                  </span>
                )}
              </div>
            )}

            {idea.readiness && (
              <p className="text-xs text-muted-foreground mb-3">
                Уровень готовности: {idea.readiness}
              </p>
            )}

            <div className="space-y-2">
              <button
                onClick={() => handleSendToBoard(idea)}
                className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2 text-sm hover:bg-blue-700 transition-colors"
              >
                <LayoutGrid className="w-4 h-4" />
                Отправить на доску
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCreatePost(idea)}
                  className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg flex items-center justify-center gap-2 text-sm hover:bg-green-700 transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                  Создать пост
                </button>
                <button
                  onClick={() => handleDeleteIdea(idea.id)}
                  className="px-3 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
                  title="Удалить идею"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {ideas.length === 0 && !showQuickAdd && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            <Lightbulb className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Пока нет идей. Добавьте первую!</p>
          </div>
        )}
      </div>
    </div>
  );
}
