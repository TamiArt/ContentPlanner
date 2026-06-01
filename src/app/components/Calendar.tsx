import React, { useState, useMemo } from 'react';
import { Post } from '../../lib/storage';
import { useApp } from '../../context/AppContext';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, List, Plus } from 'lucide-react';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  format,
  isSameMonth,
  isSameDay,
  isToday,
  parseISO,
  startOfDay
} from 'date-fns';
import { ru } from 'date-fns/locale';

type CalendarView = 'month' | 'week' | 'list';

interface CalendarProps {
  onPostClick: (post: Post) => void;
  onCreatePost: (date: string) => void;
}

const STATUS_COLORS: Record<string, string> = {
  'Идея': 'bg-gray-200 text-gray-700 border-gray-300',
  'В работе': 'bg-blue-200 text-blue-700 border-blue-300',
  'Нужен текст': 'bg-yellow-200 text-yellow-700 border-yellow-300',
  'Нужен визуал': 'bg-purple-200 text-purple-700 border-purple-300',
  'Готово': 'bg-green-200 text-green-700 border-green-300',
  'Запланировано': 'bg-teal-200 text-teal-700 border-teal-300',
  'Опубликовано': 'bg-green-700 text-white border-green-800',
  'Нужно проанализировать': 'bg-orange-200 text-orange-700 border-orange-300'
};

export default function Calendar({ onPostClick, onCreatePost }: CalendarProps) {
  const { posts, updatePost } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>('month');
  const [draggedPost, setDraggedPost] = useState<Post | null>(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { locale: ru });
  const calendarEnd = endOfWeek(monthEnd, { locale: ru });

  const calendarDays = useMemo(() => {
    const days = [];
    let day = calendarStart;
    while (day <= calendarEnd) {
      days.push(day);
      day = addDays(day, 1);
    }
    return days;
  }, [calendarStart, calendarEnd]);

  const weekDays = useMemo(() => {
    const start = startOfWeek(currentDate, { locale: ru });
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(addDays(start, i));
    }
    return days;
  }, [currentDate]);

  const getPostsForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return posts.filter(post => post.publishDate === dateStr);
  };

  const handlePrevious = () => {
    if (view === 'month') {
      setCurrentDate(addMonths(currentDate, -1));
    } else if (view === 'week') {
      setCurrentDate(addDays(currentDate, -7));
    }
  };

  const handleNext = () => {
    if (view === 'month') {
      setCurrentDate(addMonths(currentDate, 1));
    } else if (view === 'week') {
      setCurrentDate(addDays(currentDate, 7));
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleDragStart = (post: Post) => {
    setDraggedPost(post);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (date: Date) => {
    if (draggedPost) {
      const newDate = format(date, 'yyyy-MM-dd');
      updatePost(draggedPost.id, { publishDate: newDate });
      setDraggedPost(null);
    }
  };

  const handleCreatePostOnDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    onCreatePost(dateStr);
  };

  const scheduledPosts = useMemo(() => {
    return posts.filter(p => p.publishDate).sort((a, b) => {
      if (!a.publishDate || !b.publishDate) return 0;
      return a.publishDate.localeCompare(b.publishDate);
    });
  }, [posts]);

  const renderMonthView = () => {
    const weeks = [];
    for (let i = 0; i < calendarDays.length; i += 7) {
      weeks.push(calendarDays.slice(i, i + 7));
    }

    return (
      <div className="bg-white rounded-lg border border-border overflow-hidden">
        <div className="grid grid-cols-7 border-b border-border">
          {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(day => (
            <div key={day} className="p-2 text-center font-medium text-sm border-r border-border last:border-r-0">
              {day}
            </div>
          ))}
        </div>
        <div className="divide-y divide-border">
          {weeks.map((week, weekIdx) => (
            <div key={weekIdx} className="grid grid-cols-7">
              {week.map((day, dayIdx) => {
                const dayPosts = getPostsForDate(day);
                const isCurrentMonth = isSameMonth(day, currentDate);
                const isCurrentDay = isToday(day);

                return (
                  <div
                    key={dayIdx}
                    className={`min-h-[120px] p-2 border-r border-border last:border-r-0 ${
                      !isCurrentMonth ? 'bg-muted/30' : ''
                    } ${isCurrentDay ? 'bg-blue-50' : ''}`}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(day)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-sm ${
                        isCurrentDay
                          ? 'font-bold text-blue-600'
                          : !isCurrentMonth
                          ? 'text-muted-foreground'
                          : ''
                      }`}>
                        {format(day, 'd')}
                      </span>
                      {isCurrentMonth && (
                        <button
                          onClick={() => handleCreatePostOnDate(day)}
                          className="p-1 hover:bg-secondary rounded transition-colors opacity-0 group-hover:opacity-100"
                          title="Создать пост на эту дату"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    <div className="space-y-1">
                      {dayPosts.slice(0, 3).map(post => (
                        <div
                          key={post.id}
                          draggable
                          onDragStart={() => handleDragStart(post)}
                          onClick={() => onPostClick(post)}
                          className={`text-xs p-1.5 rounded cursor-pointer border ${
                            STATUS_COLORS[post.status] || 'bg-gray-100'
                          } hover:shadow-md transition-shadow truncate`}
                          title={post.title || post.topic}
                        >
                          <div className="font-medium truncate">
                            {post.platform && <span className="mr-1">{post.platform}</span>}
                            {post.title || post.topic || 'Без названия'}
                          </div>
                          {post.publishTime && (
                            <div className="text-[10px] opacity-75">{post.publishTime}</div>
                          )}
                        </div>
                      ))}
                      {dayPosts.length > 3 && (
                        <div className="text-xs text-muted-foreground text-center py-1">
                          +{dayPosts.length - 3} ещё
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    return (
      <div className="bg-white rounded-lg border border-border overflow-hidden">
        <div className="grid grid-cols-7 border-b border-border">
          {weekDays.map(day => (
            <div key={day.toString()} className="p-3 text-center border-r border-border last:border-r-0">
              <div className="text-sm text-muted-foreground">
                {format(day, 'EEE', { locale: ru })}
              </div>
              <div className={`text-xl font-semibold ${isToday(day) ? 'text-blue-600' : ''}`}>
                {format(day, 'd')}
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 divide-x divide-border">
          {weekDays.map(day => {
            const dayPosts = getPostsForDate(day);
            return (
              <div
                key={day.toString()}
                className={`min-h-[400px] p-3 ${isToday(day) ? 'bg-blue-50' : ''}`}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(day)}
              >
                <button
                  onClick={() => handleCreatePostOnDate(day)}
                  className="w-full mb-2 p-2 border-2 border-dashed border-border hover:border-primary hover:bg-secondary rounded text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Добавить
                </button>
                <div className="space-y-2">
                  {dayPosts.map(post => (
                    <div
                      key={post.id}
                      draggable
                      onDragStart={() => handleDragStart(post)}
                      onClick={() => onPostClick(post)}
                      className={`p-2 rounded cursor-pointer border ${
                        STATUS_COLORS[post.status] || 'bg-gray-100'
                      } hover:shadow-md transition-shadow`}
                    >
                      <div className="font-medium text-sm mb-1 truncate">
                        {post.title || post.topic || 'Без названия'}
                      </div>
                      <div className="text-xs opacity-75 mb-1">
                        {post.platform} — {post.format}
                      </div>
                      {post.publishTime && (
                        <div className="text-xs opacity-75">{post.publishTime}</div>
                      )}
                      <div className="text-[10px] mt-1 opacity-60">{post.status}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderListView = () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const upcoming = scheduledPosts.filter(p => p.publishDate && p.publishDate >= today);
    const past = scheduledPosts.filter(p => p.publishDate && p.publishDate < today);

    return (
      <div className="space-y-6">
        {upcoming.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-3">Запланированные ({upcoming.length})</h3>
            <div className="space-y-2">
              {upcoming.map(post => (
                <div
                  key={post.id}
                  onClick={() => onPostClick(post)}
                  className="bg-white p-4 rounded-lg border border-border cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${STATUS_COLORS[post.status]}`}>
                          {post.status}
                        </span>
                        {post.platform && (
                          <span className="text-xs px-2 py-1 bg-secondary rounded-full">
                            {post.platform}
                          </span>
                        )}
                        {post.format && (
                          <span className="text-xs text-muted-foreground">
                            {post.format}
                          </span>
                        )}
                      </div>
                      <h4 className="font-medium mb-1">
                        {post.title || post.topic || 'Без названия'}
                      </h4>
                      {post.ideaDescription && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {post.ideaDescription}
                        </p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-medium">
                        {format(parseISO(post.publishDate!), 'd MMM', { locale: ru })}
                      </div>
                      {post.publishTime && (
                        <div className="text-sm text-muted-foreground">{post.publishTime}</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {past.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-3">Прошедшие ({past.length})</h3>
            <div className="space-y-2">
              {past.map(post => (
                <div
                  key={post.id}
                  onClick={() => onPostClick(post)}
                  className="bg-white p-4 rounded-lg border border-border cursor-pointer hover:shadow-md transition-shadow opacity-75"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${STATUS_COLORS[post.status]}`}>
                          {post.status}
                        </span>
                        {post.platform && (
                          <span className="text-xs px-2 py-1 bg-secondary rounded-full">
                            {post.platform}
                          </span>
                        )}
                      </div>
                      <h4 className="font-medium mb-1">
                        {post.title || post.topic || 'Без названия'}
                      </h4>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-medium text-muted-foreground">
                        {format(parseISO(post.publishDate!), 'd MMM', { locale: ru })}
                      </div>
                      {post.publishTime && (
                        <div className="text-sm text-muted-foreground">{post.publishTime}</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {scheduledPosts.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <CalendarIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Нет запланированных публикаций</p>
            <p className="text-sm mt-2">Установите дату публикации для постов</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevious}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-semibold min-w-[200px] text-center">
            {view === 'list'
              ? 'Список публикаций'
              : format(currentDate, 'LLLL yyyy', { locale: ru })}
          </h2>
          <button
            onClick={handleNext}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          {view !== 'list' && (
            <button
              onClick={handleToday}
              className="px-3 py-2 bg-secondary hover:bg-accent rounded-lg transition-colors text-sm"
            >
              Сегодня
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setView('month')}
            className={`px-3 py-2 rounded-lg transition-colors ${
              view === 'month'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary hover:bg-accent'
            }`}
          >
            Месяц
          </button>
          <button
            onClick={() => setView('week')}
            className={`px-3 py-2 rounded-lg transition-colors ${
              view === 'week'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary hover:bg-accent'
            }`}
          >
            Неделя
          </button>
          <button
            onClick={() => setView('list')}
            className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1 ${
              view === 'list'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary hover:bg-accent'
            }`}
          >
            <List className="w-4 h-4" />
            Список
          </button>
        </div>
      </div>

      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 text-sm text-blue-800">
        💡 Перетаскивайте карточки постов между датами для изменения расписания
      </div>

      {view === 'month' && renderMonthView()}
      {view === 'week' && renderWeekView()}
      {view === 'list' && renderListView()}
    </div>
  );
}
