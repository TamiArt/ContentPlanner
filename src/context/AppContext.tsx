import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage, Post, Idea, Template, Settings } from '../lib/storage';

interface AppContextType {
  posts: Post[];
  ideas: Idea[];
  templates: Template[];
  settings: Settings;
  addPost: (post: Post) => void;
  updatePost: (id: string, updates: Partial<Post>) => void;
  deletePost: (id: string) => void;
  addIdea: (idea: Idea) => void;
  updateIdea: (id: string, updates: Partial<Idea>) => void;
  deleteIdea: (id: string) => void;
  addTemplate: (template: Template) => void;
  updateTemplate: (id: string, updates: Partial<Template>) => void;
  deleteTemplate: (id: string) => void;
  updateSettings: (updates: Partial<Settings>) => void;
  exportData: () => any;
  importData: (data: any) => void;
  clearAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Migrate from legacy storage if needed
    storage.migrateFromLegacy();

    // Load all data
    setPosts(storage.getPosts());
    setIdeas(storage.getIdeas());
    setTemplates(storage.getTemplates());
    setSettings(storage.getSettings());
    setIsLoading(false);
  }, []);

  const addPost = (post: Post) => {
    const updated = [...posts, post];
    setPosts(updated);
    storage.savePosts(updated);
  };

  const updatePost = (id: string, updates: Partial<Post>) => {
    const updated = posts.map(p =>
      p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
    );
    setPosts(updated);
    storage.savePosts(updated);
  };

  const deletePost = (id: string) => {
    const updated = posts.filter(p => p.id !== id);
    setPosts(updated);
    storage.savePosts(updated);
  };

  const addIdea = (idea: Idea) => {
    const updated = [...ideas, idea];
    setIdeas(updated);
    storage.saveIdeas(updated);
  };

  const updateIdea = (id: string, updates: Partial<Idea>) => {
    const updated = ideas.map(i =>
      i.id === id ? { ...i, ...updates, updatedAt: new Date().toISOString() } : i
    );
    setIdeas(updated);
    storage.saveIdeas(updated);
  };

  const deleteIdea = (id: string) => {
    const updated = ideas.filter(i => i.id !== id);
    setIdeas(updated);
    storage.saveIdeas(updated);
  };

  const addTemplate = (template: Template) => {
    const updated = [...templates, template];
    setTemplates(updated);
    storage.saveTemplates(updated);
  };

  const updateTemplate = (id: string, updates: Partial<Template>) => {
    const updated = templates.map(t =>
      t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
    );
    setTemplates(updated);
    storage.saveTemplates(updated);
  };

  const deleteTemplate = (id: string) => {
    const updated = templates.filter(t => t.id !== id);
    setTemplates(updated);
    storage.saveTemplates(updated);
  };

  const updateSettings = (updates: Partial<Settings>) => {
    if (!settings) return;
    const updated = { ...settings, ...updates };
    setSettings(updated);
    storage.saveSettings(updated);
  };

  const exportData = () => {
    return storage.exportData();
  };

  const importData = (data: any) => {
    storage.importData(data);
    setPosts(storage.getPosts());
    setIdeas(storage.getIdeas());
    setTemplates(storage.getTemplates());
    setSettings(storage.getSettings());
  };

  const clearAllData = () => {
    storage.clearAll();
    setPosts([]);
    setIdeas([]);
    setTemplates(storage.getTemplates());
    setSettings(storage.getSettings());
  };

  // Don't render children until data is loaded
  if (isLoading || !settings) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-solid border-primary border-r-transparent mb-4"></div>
          <p className="text-foreground font-medium">Content Planner AI</p>
          <p className="text-muted-foreground text-sm mt-2">Загрузка данных...</p>
        </div>
      </div>
    );
  }

  return (
    <AppContext.Provider
      value={{
        posts,
        ideas,
        templates,
        settings,
        addPost,
        updatePost,
        deletePost,
        addIdea,
        updateIdea,
        deleteIdea,
        addTemplate,
        updateTemplate,
        deleteTemplate,
        updateSettings,
        exportData,
        importData,
        clearAllData
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
