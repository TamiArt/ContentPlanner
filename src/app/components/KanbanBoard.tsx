import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Post } from '../../lib/storage';
import { useApp } from '../../context/AppContext';
import { Calendar, FileText, Image, Tag, Hash, Clock } from 'lucide-react';

const STATUS_COLORS: Record<string, string> = {
  'Идея': 'bg-gray-200 text-gray-700',
  'В работе': 'bg-blue-200 text-blue-700',
  'Нужен текст': 'bg-yellow-200 text-yellow-700',
  'Нужен визуал': 'bg-purple-200 text-purple-700',
  'Готово': 'bg-green-200 text-green-700',
  'Запланировано': 'bg-teal-200 text-teal-700',
  'Опубликовано': 'bg-green-700 text-white',
  'Нужно проанализировать': 'bg-orange-200 text-orange-700'
};

const COLUMNS = [
  'Идея',
  'В работе',
  'Нужен текст',
  'Нужен визуал',
  'Готово',
  'Запланировано',
  'Опубликовано',
  'Нужно проанализировать'
];

interface PostCardProps {
  post: Post;
  onClick: (post: Post) => void;
}

function PostCard({ post, onClick }: PostCardProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'POST',
    item: { id: post.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  }));

  return (
    <div
      ref={drag}
      onClick={() => onClick(post)}
      className={`bg-white p-3 rounded-lg shadow-sm border border-border cursor-pointer hover:shadow-md transition-shadow ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="flex-1 text-sm font-medium truncate">{post.title || post.topic || 'Без названия'}</h4>
        {post.platform && (
          <span className="text-xs px-2 py-0.5 bg-secondary rounded-full shrink-0">{post.platform}</span>
        )}
      </div>

      {post.format && (
        <p className="text-xs text-muted-foreground mb-2">{post.format}</p>
      )}

      {post.publishDate && (
        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
          <Calendar className="w-3 h-3" />
          <span>{new Date(post.publishDate).toLocaleDateString('ru-RU')}</span>
          {post.publishTime && <span>{post.publishTime}</span>}
        </div>
      )}

      <div className="flex items-center gap-2 mt-2">
        {post.slidesText && <FileText className="w-3 h-3 text-green-600" />}
        {post.visualNotes && <Image className="w-3 h-3 text-purple-600" />}
        {post.hashtags && <Hash className="w-3 h-3 text-blue-600" />}
        {post.prompt && <Tag className="w-3 h-3 text-orange-600" />}
      </div>

      {post.rubric && (
        <div className="mt-2 pt-2 border-t border-border">
          <span className="text-xs text-muted-foreground">{post.rubric}</span>
        </div>
      )}
    </div>
  );
}

interface ColumnProps {
  status: string;
  posts: Post[];
  onPostClick: (post: Post) => void;
}

function Column({ status, posts, onPostClick }: ColumnProps) {
  const { updatePost } = useApp();

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'POST',
    drop: (item: { id: string }) => {
      updatePost(item.id, { status });
    },
    collect: (monitor) => ({
      isOver: monitor.isOver()
    })
  }));

  return (
    <div className="flex-shrink-0 w-72">
      <div className={`rounded-lg p-2 mb-2 ${STATUS_COLORS[status]}`}>
        <h3 className="font-medium text-sm text-center">{status}</h3>
        <span className="text-xs block text-center mt-1">{posts.length}</span>
      </div>

      <div
        ref={drop}
        className={`min-h-[400px] p-2 rounded-lg border-2 border-dashed ${
          isOver ? 'border-primary bg-secondary/50' : 'border-border'
        }`}
      >
        <div className="space-y-2">
          {posts.map(post => (
            <PostCard key={post.id} post={post} onClick={onPostClick} />
          ))}
        </div>
      </div>
    </div>
  );
}

interface KanbanBoardProps {
  posts: Post[];
  onPostClick: (post: Post) => void;
}

export default function KanbanBoard({ posts, onPostClick }: KanbanBoardProps) {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max">
          {COLUMNS.map(status => (
            <Column
              key={status}
              status={status}
              posts={posts.filter(p => p.status === status)}
              onPostClick={onPostClick}
            />
          ))}
        </div>
      </div>
    </DndProvider>
  );
}
