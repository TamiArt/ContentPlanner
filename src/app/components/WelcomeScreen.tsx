import React from 'react';
import { Sparkles, Lightbulb, Calendar, FileText, X } from 'lucide-react';

interface WelcomeScreenProps {
  onClose: () => void;
  onLoadDemo: () => void;
}

export default function WelcomeScreen({ onClose, onLoadDemo }: WelcomeScreenProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Добро пожаловать в Content Planner AI!</h2>
                <p className="text-muted-foreground">Ваш бесплатный помощник для планирования контента</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6 mb-8">
            <div>
              <h3 className="font-semibold mb-3">Что умеет приложение:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex gap-3 p-3 bg-yellow-50 rounded-lg">
                  <Lightbulb className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm">Банк идей</h4>
                    <p className="text-xs text-muted-foreground">Сохраняйте идеи для будущих постов</p>
                  </div>
                </div>

                <div className="flex gap-3 p-3 bg-blue-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm">Kanban-доска</h4>
                    <p className="text-xs text-muted-foreground">Управляйте постами с помощью drag & drop</p>
                  </div>
                </div>

                <div className="flex gap-3 p-3 bg-purple-50 rounded-lg">
                  <FileText className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm">Генератор промптов</h4>
                    <p className="text-xs text-muted-foreground">Автоматическое создание промптов для ChatGPT</p>
                  </div>
                </div>

                <div className="flex gap-3 p-3 bg-green-50 rounded-lg">
                  <Sparkles className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm">100% бесплатно</h4>
                    <p className="text-xs text-muted-foreground">Без платных API, всё локально</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold mb-2 text-blue-900">Как это работает:</h3>
              <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                <li>Создайте пост и заполните детали (платформа, формат, цель)</li>
                <li>Нажмите "Скопировать промпт" - приложение сгенерирует промпт для нейросети</li>
                <li>Вставьте промпт в ChatGPT или другую нейросеть</li>
                <li>Скопируйте готовый текст обратно в приложение</li>
                <li>Запланируйте публикацию и опубликуйте!</li>
              </ol>
            </div>

            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <h3 className="font-semibold mb-2 text-amber-900">⚡ Важно:</h3>
              <p className="text-sm text-amber-800">
                Все данные хранятся локально в вашем браузере. Регулярно делайте резервные копии через
                "Настройки → Экспорт данных".
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onLoadDemo}
              className="flex-1 px-4 py-3 bg-secondary text-secondary-foreground rounded-lg"
            >
              Загрузить демо-данные
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-lg"
            >
              Начать работу
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
