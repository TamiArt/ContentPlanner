import React, { useState, useEffect } from 'react';
import { Post, generatePrompt } from '../../lib/storage';
import { useApp } from '../../context/AppContext';
import { X, Copy, Calendar, Save, Trash2, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface PostDialogProps {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function PostDialog({ post, isOpen, onClose }: PostDialogProps) {
  const { updatePost, deletePost, settings } = useApp();
  const [formData, setFormData] = useState<Partial<Post>>({});

  useEffect(() => {
    if (post) {
      setFormData(post);
    }
  }, [post]);

  if (!isOpen || !post) return null;

  const isPublished = post.status === 'Опубликовано';
  const needsAnalytics = post.status === 'Нужно проанализировать';

  const handleChange = (field: keyof Post | 'analytics', value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    updatePost(post.id, formData);
    toast.success('Пост сохранен');
    onClose();
  };

  const handleDelete = () => {
    if (confirm('Удалить этот пост?')) {
      deletePost(post.id);
      toast.success('Пост удален');
      onClose();
    }
  };

  const handleCopyPrompt = () => {
    if (!settings?.promptTemplate) {
      toast.error('Шаблон промпта не найден');
      return;
    }
    const prompt = generatePrompt(formData, settings.promptTemplate);
    navigator.clipboard.writeText(prompt);
    toast.success('Промпт скопирован в буфер обмена');
  };

  const handleCopyText = () => {
    const text = formData.slidesText || formData.caption || '';
    navigator.clipboard.writeText(text);
    toast.success('Текст скопирован');
  };

  const handleGenerateStructure = () => {
    // Simple structure generation based on format
    let structure = '';

    if (formData.format === 'карусель' || formData.format === 'TikTok') {
      const slides = formData.slidesCount || 5;
      structure = `1. Слайд 1 — сильный хук\n`;
      structure += `2. Слайд 2 — проблема\n`;
      for (let i = 3; i < slides; i++) {
        structure += `${i}. Слайд ${i} — объяснение/пример\n`;
      }
      structure += `${slides}. Слайд ${slides} — вывод и CTA`;
    } else if (formData.format === 'видео' || formData.format === 'Reels') {
      structure = `1. Первые 3 секунды — сильный хук\n2. Контекст — объяснение проблемы\n3. Решение — главная часть\n4. Вывод и призыв к действию`;
    } else {
      structure = `1. Хук — привлечь внимание\n2. Контекст — объяснить тему\n3. Основная часть — раскрыть идею\n4. Вывод\n5. CTA — призыв к действию`;
    }

    handleChange('structure', structure);
    toast.success('Структура сгенерирована');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {isPublished ? 'Просмотр опубликованного поста' : 'Редактировать пост'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {isPublished && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 font-medium">
                ✅ Пост опубликован. Редактирование недоступно.
              </p>
              <p className="text-sm text-green-700 mt-1">
                Для изменений переместите пост в другой статус.
              </p>
            </div>
          )}

          {needsAnalytics && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <p className="text-orange-800 font-medium">
                📊 Добавьте аналитику публикации
              </p>
            </div>
          )}

          {needsAnalytics && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Аналитика публикации</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2">Ссылка на публикацию</label>
                  <input
                    type="url"
                    value={formData.analytics?.url || ''}
                    onChange={(e) => handleChange('analytics', { ...formData.analytics, url: e.target.value })}
                    className="w-full px-3 py-2 bg-input-background rounded-lg border border-border"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="block mb-2">Просмотры</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.analytics?.views || 0}
                    onChange={(e) => handleChange('analytics', { ...formData.analytics, views: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-input-background rounded-lg border border-border"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block mb-2">Лайки</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.analytics?.likes || 0}
                    onChange={(e) => handleChange('analytics', { ...formData.analytics, likes: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-input-background rounded-lg border border-border"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block mb-2">Комментарии</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.analytics?.comments || 0}
                    onChange={(e) => handleChange('analytics', { ...formData.analytics, comments: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-input-background rounded-lg border border-border"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block mb-2">Сохранения</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.analytics?.saves || 0}
                    onChange={(e) => handleChange('analytics', { ...formData.analytics, saves: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-input-background rounded-lg border border-border"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block mb-2">Репосты</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.analytics?.shares || 0}
                    onChange={(e) => handleChange('analytics', { ...formData.analytics, shares: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-input-background rounded-lg border border-border"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block mb-2">Новые подписчики</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.analytics?.followers || 0}
                    onChange={(e) => handleChange('analytics', { ...formData.analytics, followers: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-input-background rounded-lg border border-border"
                    placeholder="0"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block mb-2">Выводы и заметки</label>
                  <textarea
                    value={formData.analytics?.notes || ''}
                    onChange={(e) => handleChange('analytics', { ...formData.analytics, notes: e.target.value })}
                    className="w-full px-3 py-2 bg-input-background rounded-lg border border-border h-24 resize-none"
                    placeholder="Что сработало? Что можно улучшить?"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.analytics?.repeatFormat || false}
                      onChange={(e) => handleChange('analytics', { ...formData.analytics, repeatFormat: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span>Стоит повторить этот формат</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">Название</label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-3 py-2 bg-input-background rounded-lg border border-border"
                placeholder="Название поста"
                disabled={isPublished}
              />
            </div>

            <div>
              <label className="block mb-2">Тема</label>
              <input
                type="text"
                value={formData.topic || ''}
                onChange={(e) => handleChange('topic', e.target.value)}
                className="w-full px-3 py-2 bg-input-background rounded-lg border border-border"
                placeholder="Тема"
                disabled={isPublished}
              />
            </div>

            <div>
              <label className="block mb-2">Ниша</label>
              <select
                value={formData.niche || ''}
                onChange={(e) => handleChange('niche', e.target.value)}
                className="w-full px-3 py-2 bg-input-background rounded-lg border border-border"
                disabled={isPublished}
              >
                <option value="">Выберите нишу</option>
                {settings?.niches?.map(niche => (
                  <option key={niche} value={niche}>{niche}</option>
                )) || []}
              </select>
            </div>

            <div>
              <label className="block mb-2">Рубрика</label>
              <select
                value={formData.rubric || ''}
                onChange={(e) => handleChange('rubric', e.target.value)}
                className="w-full px-3 py-2 bg-input-background rounded-lg border border-border"
                disabled={isPublished}
              >
                <option value="">Выберите рубрику</option>
                {settings?.rubrics?.map(rubric => (
                  <option key={rubric} value={rubric}>{rubric}</option>
                )) || []}
              </select>
            </div>

            <div>
              <label className="block mb-2">Платформа</label>
              <select
                value={formData.platform || ''}
                onChange={(e) => handleChange('platform', e.target.value)}
                className="w-full px-3 py-2 bg-input-background rounded-lg border border-border"
                disabled={isPublished}
              >
                <option value="">Выберите платформу</option>
                {settings?.platforms?.map(platform => (
                  <option key={platform} value={platform}>{platform}</option>
                )) || []}
              </select>
            </div>

            <div>
              <label className="block mb-2">Формат</label>
              <select
                value={formData.format || ''}
                onChange={(e) => handleChange('format', e.target.value)}
                className="w-full px-3 py-2 bg-input-background rounded-lg border border-border"
                disabled={isPublished}
              >
                <option value="">Выберите формат</option>
                <option value="карусель">карусель</option>
                <option value="видео">видео</option>
                <option value="сторис">сторис</option>
                <option value="пост">пост</option>
                <option value="Reels">Reels</option>
                <option value="TikTok">TikTok</option>
                <option value="Shorts">Shorts</option>
              </select>
            </div>

            <div>
              <label className="block mb-2">Цель</label>
              <select
                value={formData.goal || ''}
                onChange={(e) => handleChange('goal', e.target.value)}
                className="w-full px-3 py-2 bg-input-background rounded-lg border border-border"
                disabled={isPublished}
              >
                <option value="">Выберите цель</option>
                <option value="подписки">подписки</option>
                <option value="охваты">охваты</option>
                <option value="сохранения">сохранения</option>
                <option value="комментарии">комментарии</option>
                <option value="продажи">продажи</option>
                <option value="доверие">доверие</option>
                <option value="экспертность">экспертность</option>
              </select>
            </div>

            <div>
              <label className="block mb-2">Статус</label>
              <select
                value={formData.status || ''}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full px-3 py-2 bg-input-background rounded-lg border border-border"
              >
                <option value="Идея">Идея</option>
                <option value="В работе">В работе</option>
                <option value="Нужен текст">Нужен текст</option>
                <option value="Нужен визуал">Нужен визуал</option>
                <option value="Готово">Готово</option>
                <option value="Запланировано">Запланировано</option>
                <option value="Опубликовано">Опубликовано</option>
                <option value="Нужно проанализировать">Нужно проанализировать</option>
              </select>
            </div>

            <div>
              <label className="block mb-2">Дата публикации</label>
              <input
                type="date"
                value={formData.publishDate || ''}
                onChange={(e) => handleChange('publishDate', e.target.value)}
                className="w-full px-3 py-2 bg-input-background rounded-lg border border-border"
                disabled={isPublished}
              />
            </div>

            <div>
              <label className="block mb-2">Время публикации</label>
              <input
                type="time"
                value={formData.publishTime || ''}
                onChange={(e) => handleChange('publishTime', e.target.value)}
                className="w-full px-3 py-2 bg-input-background rounded-lg border border-border"
                disabled={isPublished}
              />
            </div>

            <div>
              <label className="block mb-2">Количество слайдов</label>
              <input
                type="number"
                min="1"
                max="20"
                value={formData.slidesCount || 5}
                onChange={(e) => handleChange('slidesCount', parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-input-background rounded-lg border border-border"
                disabled={isPublished}
              />
            </div>

            <div>
              <label className="block mb-2">Стиль</label>
              <input
                type="text"
                value={formData.style || ''}
                onChange={(e) => handleChange('style', e.target.value)}
                className="w-full px-3 py-2 bg-input-background rounded-lg border border-border"
                placeholder="экспертный, живой, дружелюбный"
                disabled={isPublished}
              />
            </div>
          </div>

          <div>
            <label className="block mb-2">Описание идеи</label>
            <textarea
              value={formData.ideaDescription || ''}
              onChange={(e) => handleChange('ideaDescription', e.target.value)}
              className="w-full px-3 py-2 bg-input-background rounded-lg border border-border h-24 resize-none"
              placeholder="Опишите основную идею поста"
              disabled={isPublished}
            />
          </div>

          {!isPublished && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label>Структура поста</label>
                <button
                  onClick={handleGenerateStructure}
                  className="px-3 py-1 bg-primary text-primary-foreground rounded-lg text-sm"
                >
                  Сгенерировать структуру
                </button>
              </div>
              <textarea
                value={formData.structure || ''}
                onChange={(e) => handleChange('structure', e.target.value)}
                className="w-full px-3 py-2 bg-input-background rounded-lg border border-border h-32 resize-none"
                placeholder="Структура будет сгенерирована автоматически"
              />
            </div>
          )}

          <div>
            <label className="block mb-2">Текст поста / Текст по слайдам</label>
            <textarea
              value={formData.slidesText || ''}
              onChange={(e) => handleChange('slidesText', e.target.value)}
              className="w-full px-3 py-2 bg-input-background rounded-lg border border-border h-40 resize-none"
              placeholder="Вставьте текст, полученный из нейросети"
              disabled={isPublished}
            />
          </div>

          <div>
            <label className="block mb-2">Описание под пост</label>
            <textarea
              value={formData.caption || ''}
              onChange={(e) => handleChange('caption', e.target.value)}
              className="w-full px-3 py-2 bg-input-background rounded-lg border border-border h-24 resize-none"
              placeholder="Описание, которое будет в публикации"
              disabled={isPublished}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">Хэштеги</label>
              <input
                type="text"
                value={formData.hashtags || ''}
                onChange={(e) => handleChange('hashtags', e.target.value)}
                className="w-full px-3 py-2 bg-input-background rounded-lg border border-border"
                placeholder="#хэштег1 #хэштег2"
                disabled={isPublished}
              />
            </div>

            <div>
              <label className="block mb-2">Ключевые слова</label>
              <input
                type="text"
                value={formData.keywords || ''}
                onChange={(e) => handleChange('keywords', e.target.value)}
                className="w-full px-3 py-2 bg-input-background rounded-lg border border-border"
                placeholder="ключ1, ключ2"
                disabled={isPublished}
              />
            </div>
          </div>

          <div>
            <label className="block mb-2">Визуальное задание</label>
            <textarea
              value={formData.visualNotes || ''}
              onChange={(e) => handleChange('visualNotes', e.target.value)}
              className="w-full px-3 py-2 bg-input-background rounded-lg border border-border h-24 resize-none"
              placeholder="Что должно быть на фото, видео, слайдах"
              disabled={isPublished}
            />
          </div>
        </div>

        <div className="p-4 border-t border-border flex items-center justify-between gap-2 flex-wrap">
          {!isPublished && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyPrompt}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Скопировать промпт
              </button>
              {formData.slidesText && (
                <button
                  onClick={handleCopyText}
                  className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Скопировать текст
                </button>
              )}
            </div>
          )}

          {isPublished && (
            <div className="flex items-center gap-2">
              {formData.slidesText && (
                <button
                  onClick={handleCopyText}
                  className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Скопировать текст
                </button>
              )}
            </div>
          )}

          <div className="flex items-center gap-2">
            {!isPublished && (
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Удалить
              </button>
            )}
            <button
              onClick={isPublished ? onClose : handleSave}
              className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2"
            >
              {isPublished ? (
                <>
                  <X className="w-4 h-4" />
                  Закрыть
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Сохранить
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
