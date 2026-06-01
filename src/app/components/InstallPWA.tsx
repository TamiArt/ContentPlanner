import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Monitor } from 'lucide-react';
import { showInstallPrompt, isInstalled } from '../../lib/pwa';

export default function InstallPWA() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    setInstalled(isInstalled());

    if (!isInstalled()) {
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, []);

  if (installed || !showPrompt) return null;

  const handleInstall = () => {
    showInstallPrompt();
    setShowPrompt(false);
  };

  return (
    <div className="fixed bottom-4 right-4 left-4 md:left-auto md:w-96 bg-white rounded-lg shadow-xl border border-border p-4 z-50">
      <button
        onClick={() => setShowPrompt(false)}
        className="absolute top-2 right-2 p-1 hover:bg-secondary rounded"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-start gap-3 mb-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Smartphone className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold mb-1">Установите приложение</h3>
          <p className="text-sm text-muted-foreground">
            Добавьте Content Planner на домашний экран для быстрого доступа
          </p>
        </div>
      </div>

      <div className="space-y-2 mb-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Monitor className="w-4 h-4" />
          <span>Работает офлайн</span>
        </div>
        <div className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          <span>Быстрая загрузка</span>
        </div>
      </div>

      <button
        onClick={handleInstall}
        className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg"
      >
        Установить приложение
      </button>

      <p className="text-xs text-muted-foreground mt-2 text-center">
        Для iOS: нажмите "Поделиться" → "На экран Домой"
      </p>
    </div>
  );
}
