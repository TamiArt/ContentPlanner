import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Settings, Download, Upload, Trash2, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPanel() {
  const { settings, updateSettings, exportData, importData, clearAllData } = useApp();
  const [promptTemplate, setPromptTemplate] = useState(settings?.promptTemplate || '');

  const handleSavePrompt = () => {
    updateSettings({ promptTemplate });
    toast.success('Шаблон промпта сохранен');
  };

  const handleResetPrompt = () => {
    if (confirm('Вернуть стандартный шаблон промпта?')) {
      const defaultTemplate = `Ты — опытный контент-стратег, SMM-специалист и редактор.

Создай контент для соцсети на основе данных:

Ниша: {ниша}
Рубрика: {рубрика}
Тема: {тема}
Платформа: {платформа}
Формат: {формат}
Цель: {цель}
Аудитория: {аудитория}
Стиль: {стиль}
Тон: {тон}
Количество слайдов / частей: {количество_слайдов}
Ключевые слова: {ключевые_слова}
Описание идеи: {описание_идеи}
Визуальные заметки: {визуальные_заметки}
Ограничения: {ограничения}
Язык: {язык}

Сделай:
1. Сильный хук.
2. Структуру поста.
3. Текст по слайдам / кадрам / блокам.
4. Описание под публикацию.
5. CTA под цель поста.
6. 5 хэштегов.
7. Визуальное задание.
8. Чек-лист перед публикацией.
9. 2 альтернативных хука.

Важно:
Учитывай платформу, формат и цель.
Если цель — подписки, сделай призыв подписаться.
Если цель — сохранения, сделай призыв сохранить.
Если цель — комментарии, добавь вопрос в конце.
Пиши живо, понятно, без воды и без банальных фраз.`;

      setPromptTemplate(defaultTemplate);
      updateSettings({ promptTemplate: defaultTemplate });
      toast.success('Шаблон сброшен к стандартному');
    }
  };

  const handleExport = () => {
    const appData = exportData();
    const jsonString = JSON.stringify(appData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const fileName = `content-planner-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Данные экспортированы: ${fileName}`);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        importData(data);
        toast.success('Данные импортированы');
        window.location.reload();
      } catch (error) {
        toast.error('Ошибка при импорте данных');
      }
    };
    reader.readAsText(file);
  };

  const handleClearAll = () => {
    if (confirm('Удалить все данные? Это действие нельзя отменить.')) {
      clearAllData();
      toast.success('Все данные удалены');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold flex items-center gap-2">
        <Settings className="w-6 h-6" />
        Настройки
      </h2>

      <div className="bg-white p-6 rounded-lg border border-border">
        <h3 className="text-lg font-medium mb-4">Шаблон промпта для нейросети</h3>

        <p className="text-sm text-muted-foreground mb-4">
          Используйте переменные в фигурных скобках: {'{ниша}'}, {'{рубрика}'}, {'{тема}'}, {'{платформа}'}, {'{формат}'}, {'{цель}'}, {'{аудитория}'}, {'{стиль}'}, {'{тон}'}, {'{количество_слайдов}'}, {'{ключевые_слова}'}, {'{описание_идеи}'}, {'{визуальные_заметки}'}, {'{ограничения}'}, {'{язык}'}
        </p>

        <textarea
          value={promptTemplate}
          onChange={(e) => setPromptTemplate(e.target.value)}
          className="w-full px-3 py-2 bg-input-background rounded-lg border border-border h-96 resize-none font-mono text-sm"
        />

        <div className="flex items-center gap-2 mt-4">
          <button
            onClick={handleSavePrompt}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Сохранить шаблон
          </button>
          <button
            onClick={handleResetPrompt}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg"
          >
            Сбросить к стандартному
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border border-border">
        <h3 className="text-lg font-medium mb-4">Экспорт и импорт данных</h3>

        <div className="space-y-3">
          <button
            onClick={handleExport}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Экспортировать все данные в JSON
          </button>

          <label className="w-full px-4 py-3 bg-green-600 text-white rounded-lg flex items-center justify-center gap-2 cursor-pointer">
            <Upload className="w-5 h-5" />
            Импортировать данные из JSON
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>

          <button
            onClick={handleClearAll}
            className="w-full px-4 py-3 bg-destructive text-destructive-foreground rounded-lg flex items-center justify-center gap-2"
          >
            <Trash2 className="w-5 h-5" />
            Удалить все данные
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border border-border">
        <h3 className="text-lg font-medium mb-4">О приложении</h3>
        <p className="text-sm text-muted-foreground">
          Content Planner AI — бесплатное PWA-приложение для планирования контента в соцсетях.
          Все данные хранятся локально в вашем браузере.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Версия: 1.0.0
        </p>
      </div>
    </div>
  );
}
