import React, { useState, useMemo, useEffect } from 'react';
import { AppProvider, useApp } from '../context/AppContext';
import { createPost, createIdea } from '../lib/storage';
import KanbanBoard from './components/KanbanBoard';
import PostDialog from './components/PostDialog';
import IdeasBank from './components/IdeasBank';
import QuickActions from './components/QuickActions';
import SettingsPanel from './components/SettingsPanel';
import InstallPWA from './components/InstallPWA';
import WelcomeScreen from './components/WelcomeScreen';
import EmptyState from './components/EmptyState';
import CalendarView from './components/Calendar';
import { Toaster, toast } from 'sonner';
import { Calendar, LayoutGrid, Lightbulb, Settings, PlusCircle, Sparkles } from 'lucide-react';
import { Post } from '../lib/storage';
import { registerServiceWorker } from '../lib/pwa';
import { generateDemoData } from '../lib/demo-data';

type View = 'today' | 'ideas' | 'calendar' | 'settings';

function AppContent() {
  const { posts, addPost, addIdea, ideas } = useApp();
  const [currentView, setCurrentView] = useState<View>('today');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showPostDialog, setShowPostDialog] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    registerServiceWorker();

    // Show welcome screen on first visit
    const hasVisited = localStorage.getItem('hasVisited');
    if (!hasVisited && posts.length === 0 && ideas.length === 0) {
      setShowWelcome(true);
      localStorage.setItem('hasVisited', 'true');
    }

    // Add PWA meta tags and manifest link
    const existingManifest = document.querySelector('link[rel="manifest"]');
    if (!existingManifest) {
      const manifestLink = document.createElement('link');
      manifestLink.rel = 'manifest';
      manifestLink.href = '/manifest.json';
      document.head.appendChild(manifestLink);
    }

    const existingThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!existingThemeColor) {
      const themeColorMeta = document.createElement('meta');
      themeColorMeta.name = 'theme-color';
      themeColorMeta.content = '#030213';
      document.head.appendChild(themeColorMeta);
    }

    const existingViewport = document.querySelector('meta[name="viewport"]');
    if (!existingViewport) {
      const viewportMeta = document.createElement('meta');
      viewportMeta.name = 'viewport';
      viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes';
      document.head.appendChild(viewportMeta);
    }

    const existingDescription = document.querySelector('meta[name="description"]');
    if (!existingDescription) {
      const descriptionMeta = document.createElement('meta');
      descriptionMeta.name = 'description';
      descriptionMeta.content = 'Бесплатное PWA-приложение для планирования контента в соцсетях';
      document.head.appendChild(descriptionMeta);
    }

    const existingAppleMobileCapable = document.querySelector('meta[name="apple-mobile-web-app-capable"]');
    if (!existingAppleMobileCapable) {
      const appleMeta = document.createElement('meta');
      appleMeta.name = 'apple-mobile-web-app-capable';
      appleMeta.content = 'yes';
      document.head.appendChild(appleMeta);
    }

    const existingAppleTitle = document.querySelector('meta[name="apple-mobile-web-app-title"]');
    if (!existingAppleTitle) {
      const appleTitleMeta = document.createElement('meta');
      appleTitleMeta.name = 'apple-mobile-web-app-title';
      appleTitleMeta.content = 'Content Planner';
      document.head.appendChild(appleTitleMeta);
    }

    document.title = 'Content Planner AI';
  }, [posts.length, ideas.length]);

  const today = new Date().toISOString().split('T')[0];

  const todayPosts = useMemo(() => {
    return posts.filter(p => p.publishDate === today);
  }, [posts, today]);

  const overduePosts = useMemo(() => {
    return posts.filter(p => {
      if (!p.publishDate) return false;
      return p.publishDate < today && p.status !== 'Опубликовано';
    });
  }, [posts, today]);

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
    setShowPostDialog(true);
  };

  const handleCreateNewPost = () => {
    const newPost = createPost({
      title: 'Новый пост',
      status: 'Идея'
    });
    addPost(newPost);
    setSelectedPost(newPost);
    setShowPostDialog(true);
  };

  const handleQuickAddIdea = () => {
    setCurrentView('ideas');
  };

  const handleLoadDemo = () => {
    const demoData = generateDemoData();
    demoData.posts.forEach(post => addPost(post));
    demoData.ideas.forEach(idea => addIdea(idea));
    setShowWelcome(false);
    toast.success('Демо-данные загружены!');
  };

  const handleCreatePostOnDate = (date: string) => {
    const newPost = createPost({
      title: 'Новый пост',
      status: 'Запланировано',
      publishDate: date
    });
    addPost(newPost);
    setSelectedPost(newPost);
    setShowPostDialog(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" />
      <InstallPWA />

      <div className="border-b border-border bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Content Planner AI</h1>
            <button
              onClick={handleCreateNewPost}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              Создать пост
            </button>
          </div>

          <nav className="flex gap-2">
            <button
              onClick={() => setCurrentView('today')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                currentView === 'today'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-accent'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              Сегодня
            </button>
            <button
              onClick={() => setCurrentView('ideas')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                currentView === 'ideas'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-accent'
              }`}
            >
              <Lightbulb className="w-4 h-4" />
              Банк идей
            </button>
            <button
              onClick={() => setCurrentView('calendar')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                currentView === 'calendar'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-accent'
              }`}
            >
              <Calendar className="w-4 h-4" />
              Календарь
            </button>
            <button
              onClick={() => setCurrentView('settings')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                currentView === 'settings'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-accent'
              }`}
            >
              <Settings className="w-4 h-4" />
              Настройки
            </button>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {currentView === 'today' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Сегодня, {new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}
              </h2>

              <QuickActions
                onAddIdea={handleQuickAddIdea}
                onCreatePost={handleCreateNewPost}
                onOpenCalendar={() => setCurrentView('calendar')}
                onOpenSettings={() => setCurrentView('settings')}
              />
            </div>

            {todayPosts.length > 0 && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-medium mb-3 text-blue-900">Публикации на сегодня ({todayPosts.length})</h3>
                <div className="space-y-2">
                  {todayPosts.map(post => (
                    <div
                      key={post.id}
                      onClick={() => handlePostClick(post)}
                      className="bg-white p-3 rounded-lg cursor-pointer hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{post.title || post.topic || 'Без названия'}</p>
                          <p className="text-sm text-muted-foreground">
                            {post.platform} — {post.format}
                          </p>
                        </div>
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                          {post.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {overduePosts.length > 0 && (
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <h3 className="font-medium mb-3 text-red-900">Просроченные задачи ({overduePosts.length})</h3>
                <div className="space-y-2">
                  {overduePosts.map(post => (
                    <div
                      key={post.id}
                      onClick={() => handlePostClick(post)}
                      className="bg-white p-3 rounded-lg cursor-pointer hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{post.title || post.topic || 'Без названия'}</p>
                          <p className="text-sm text-muted-foreground">
                            {post.platform} — {post.publishDate}
                          </p>
                        </div>
                        <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full">
                          {post.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-lg font-semibold mb-4">Kanban-доска</h3>
              {posts.length === 0 ? (
                <EmptyState
                  icon={Sparkles}
                  title="Начните планировать контент"
                  description="Создайте первый пост или загрузите демо-данные, чтобы увидеть как работает приложение"
                  action={{
                    label: 'Создать первый пост',
                    onClick: handleCreateNewPost
                  }}
                />
              ) : (
                <KanbanBoard posts={posts} onPostClick={handlePostClick} />
              )}
            </div>
          </div>
        )}

        {currentView === 'ideas' && <IdeasBank />}

        {currentView === 'calendar' && (
          <CalendarView
            onPostClick={handlePostClick}
            onCreatePost={handleCreatePostOnDate}
          />
        )}

        {currentView === 'settings' && <SettingsPanel />}
      </div>

      {showPostDialog && (
        <PostDialog
          post={selectedPost}
          isOpen={showPostDialog}
          onClose={() => {
            setShowPostDialog(false);
            setSelectedPost(null);
          }}
        />
      )}

      {showWelcome && (
        <WelcomeScreen
          onClose={() => setShowWelcome(false)}
          onLoadDemo={handleLoadDemo}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}