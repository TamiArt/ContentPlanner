// Storage utilities for local data persistence

export interface AppData {
  posts: Post[];
  ideas: Idea[];
  templates: Template[];
  settings: Settings;
  metadata: {
    exportedAt?: string;
    appVersion: string;
    dataVersion: string;
    lastUpdated: string;
  };
}

export interface Post {
  id: string;
  title: string;
  topic: string;
  niche: string;
  rubric: string;
  platform: string;
  format: string;
  goal: string;
  style: string;
  tone: string;
  audience: string;
  slidesCount: number;
  keywords: string;
  ideaDescription: string;
  visualNotes: string;
  hook: string;
  structure: string;
  caption: string;
  slidesText: string;
  videoScript: string;
  cta: string;
  hashtags: string;
  prompt: string;
  status: string;
  publishDate: string;
  publishTime: string;
  priority: string;
  checklist: string[];
  references: string[];
  analytics: {
    url: string;
    views: number;
    likes: number;
    comments: number;
    saves: number;
    shares: number;
    followers: number;
    notes: string;
    repeatFormat: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Idea {
  id: string;
  text: string;
  topic: string;
  niche: string;
  rubric: string;
  format: string;
  platform: string;
  readiness: string;
  notes: string;
  references: string[];
  status: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  platforms: string[];
  goals: string[];
  formats: string[];
  structure: string;
  example: string;
  createdAt: string;
  updatedAt: string;
}

export interface Settings {
  theme: string;
  language: string;
  platforms: string[];
  niches: string[];
  rubrics: string[];
  promptTemplate: string;
  contentStrategy: {
    postsPerWeek: number;
    publishingDays: string[];
    mainTopics: string[];
    mainGoal: string;
    mainPlatforms: string[];
    tone: string;
    audience: string;
  };
}

// Default values
export const DEFAULT_PLATFORMS = ['TikTok', 'Instagram', 'Pinterest', 'YouTube Shorts', 'Telegram', 'VK'];
export const DEFAULT_NICHES = ['искусство', 'интерьер', 'личное', 'обучение', 'рецепты', 'lifestyle', 'экспертный блог', 'продажи'];
export const DEFAULT_RUBRICS = ['экспертный', 'личный', 'обучающий', 'закулисье', 'продающий'];
export const DEFAULT_FORMATS = ['видео', 'карусель', 'сторис', 'пост', 'Reels', 'TikTok', 'Shorts', 'Pinterest Pin'];
export const DEFAULT_GOALS = ['подписки', 'охваты', 'сохранения', 'комментарии', 'продажи', 'доверие', 'экспертность'];
export const DEFAULT_STATUSES = ['Идея', 'В работе', 'Нужен текст', 'Нужен визуал', 'Готово', 'Запланировано', 'Опубликовано', 'Нужно проанализировать'];

export const DEFAULT_PROMPT_TEMPLATE = `Ты — опытный контент-стратег, SMM-специалист и редактор.

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

// Storage helpers
export const storage = {
  getPosts: (): Post[] => {
    const appData = storage.getAppData();
    return appData.posts;
  },

  savePosts: (posts: Post[]) => {
    const appData = storage.getAppData();
    appData.posts = posts;
    appData.metadata.lastUpdated = new Date().toISOString();
    storage.saveAppData(appData);
  },

  getIdeas: (): Idea[] => {
    const appData = storage.getAppData();
    return appData.ideas;
  },

  saveIdeas: (ideas: Idea[]) => {
    const appData = storage.getAppData();
    appData.ideas = ideas;
    appData.metadata.lastUpdated = new Date().toISOString();
    storage.saveAppData(appData);
  },

  getTemplates: (): Template[] => {
    const appData = storage.getAppData();
    return appData.templates.length > 0 ? appData.templates : getDefaultTemplates();
  },

  saveTemplates: (templates: Template[]) => {
    const appData = storage.getAppData();
    appData.templates = templates;
    appData.metadata.lastUpdated = new Date().toISOString();
    storage.saveAppData(appData);
  },

  getSettings: (): Settings => {
    const appData = storage.getAppData();
    return appData.settings;
  },

  saveSettings: (settings: Settings) => {
    const appData = storage.getAppData();
    appData.settings = settings;
    appData.metadata.lastUpdated = new Date().toISOString();
    storage.saveAppData(appData);
  },

  getAppData: (): AppData => {
    const data = localStorage.getItem('appData');
    if (data) {
      try {
        return JSON.parse(data);
      } catch (e) {
        console.error('Error parsing appData:', e);
      }
    }

    // Return default appData structure
    return {
      posts: [],
      ideas: [],
      templates: getDefaultTemplates(),
      settings: {
        theme: 'light',
        language: 'ru',
        platforms: DEFAULT_PLATFORMS,
        niches: DEFAULT_NICHES,
        rubrics: DEFAULT_RUBRICS,
        promptTemplate: DEFAULT_PROMPT_TEMPLATE,
        contentStrategy: {
          postsPerWeek: 3,
          publishingDays: ['Понедельник', 'Среда', 'Пятница'],
          mainTopics: [],
          mainGoal: 'подписки',
          mainPlatforms: ['Instagram'],
          tone: 'дружелюбный',
          audience: ''
        }
      },
      metadata: {
        appVersion: '1.0.0',
        dataVersion: '1.0',
        lastUpdated: new Date().toISOString()
      }
    };
  },

  saveAppData: (appData: AppData) => {
    localStorage.setItem('appData', JSON.stringify(appData));
  },

  exportData: (): AppData => {
    const appData = storage.getAppData();
    appData.metadata.exportedAt = new Date().toISOString();
    return appData;
  },

  importData: (data: any) => {
    // Validate data structure
    if (!data || typeof data !== 'object') {
      throw new Error('Неверный формат данных');
    }

    const appData: AppData = {
      posts: data.posts || [],
      ideas: data.ideas || [],
      templates: data.templates || getDefaultTemplates(),
      settings: data.settings || storage.getSettings(),
      metadata: {
        appVersion: data.metadata?.appVersion || '1.0.0',
        dataVersion: data.metadata?.dataVersion || '1.0',
        lastUpdated: new Date().toISOString(),
        exportedAt: data.metadata?.exportedAt
      }
    };

    storage.saveAppData(appData);
  },

  clearAll: () => {
    localStorage.removeItem('appData');
    // Legacy cleanup
    localStorage.removeItem('posts');
    localStorage.removeItem('ideas');
    localStorage.removeItem('templates');
    localStorage.removeItem('settings');
  },

  // Migration from old storage format to new
  migrateFromLegacy: () => {
    const oldPosts = localStorage.getItem('posts');
    const oldIdeas = localStorage.getItem('ideas');
    const oldTemplates = localStorage.getItem('templates');
    const oldSettings = localStorage.getItem('settings');

    if (oldPosts || oldIdeas || oldTemplates || oldSettings) {
      const appData: AppData = {
        posts: oldPosts ? JSON.parse(oldPosts) : [],
        ideas: oldIdeas ? JSON.parse(oldIdeas) : [],
        templates: oldTemplates ? JSON.parse(oldTemplates) : getDefaultTemplates(),
        settings: oldSettings ? JSON.parse(oldSettings) : storage.getSettings(),
        metadata: {
          appVersion: '1.0.0',
          dataVersion: '1.0',
          lastUpdated: new Date().toISOString()
        }
      };

      storage.saveAppData(appData);

      // Remove old keys
      localStorage.removeItem('posts');
      localStorage.removeItem('ideas');
      localStorage.removeItem('templates');
      localStorage.removeItem('settings');

      console.log('Migrated from legacy storage format');
    }
  }
};

function getDefaultTemplates(): Template[] {
  return [
    {
      id: '1',
      name: 'Экспертный пост',
      description: 'Пост для демонстрации экспертности',
      platforms: ['Instagram', 'TikTok', 'Telegram'],
      goals: ['подписки', 'экспертность', 'доверие'],
      formats: ['карусель', 'пост', 'видео'],
      structure: `1. Хук: покажи проблему или сильный результат
2. Контекст: объясни, почему эта тема важна
3. Мини-объяснение: дай 1–3 полезных тезиса
4. Пример: покажи конкретный случай
5. Вывод: что человек должен запомнить
6. CTA: призыв подписаться / сохранить / задать вопрос`,
      example: 'Слайд 1: "Эта ошибка убивает конверсию"\nСлайд 2: Почему это важно\nСлайд 3-4: Как правильно\nСлайд 5: Подписывайся',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      name: 'TikTok-карусель',
      description: 'Структура карусели для TikTok',
      platforms: ['TikTok'],
      goals: ['подписки', 'сохранения'],
      formats: ['карусель'],
      structure: `1. Слайд 1 — сильный заголовок / хук
2. Слайд 2 — проблема
3. Слайд 3 — объяснение
4. Слайд 4 — пример
5. Слайд 5 — вывод
6. Слайд 6 — призыв подписаться`,
      example: 'Слайд 1: "Почему твои посты не сохраняют"\nСлайд 2: Проблема\nСлайд 3-4: Решение\nСлайд 5: Вывод\nСлайд 6: Подпишись для большего',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '3',
      name: 'Пост на подписку',
      description: 'Пост с целью набрать подписчиков',
      platforms: ['Instagram', 'TikTok'],
      goals: ['подписки'],
      formats: ['карусель', 'видео', 'Reels'],
      structure: `1. Хук с обещанием пользы
2. Коротко обозначить проблему аудитории
3. Дать полезный мини-совет
4. Показать, что в аккаунте таких советов будет больше
5. Призыв подписаться`,
      example: 'Начало: "Сохрани, чтобы не потерять"\nСередина: полезный совет\nКонец: "Подписывайся, чтобы не пропустить еще 50+ советов"',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '4',
      name: 'Ошибка и решение',
      description: 'Разбор ошибки с предложением решения',
      platforms: ['Instagram', 'TikTok', 'Telegram'],
      goals: ['сохранения', 'экспертность'],
      formats: ['карусель', 'пост', 'видео'],
      structure: `1. Хук: "Эта ошибка портит результат…"
2. Что было не так
3. Почему это проблема
4. Как исправить
5. Что получилось после исправления
6. CTA: "Сохрани, чтобы не повторить ошибку"`,
      example: 'Слайд 1: "Эта ошибка убила мой охват"\nСлайд 2: Что я делал\nСлайд 3: Почему не работало\nСлайд 4-5: Как исправил\nСлайд 6: Результат + CTA',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '5',
      name: 'До / После',
      description: 'Демонстрация трансформации',
      platforms: ['Instagram', 'TikTok', 'Pinterest'],
      goals: ['вовлечение', 'сохранения'],
      formats: ['карусель', 'видео', 'Reels'],
      structure: `1. Хук: обещание трансформации
2. "До": показать проблемную ситуацию
3. Контекст: что мешало, почему так было
4. Процесс: что изменилось
5. "После": показать результат
6. CTA: призыв к действию`,
      example: 'Слайд 1: "Как я изменил интерьер за выходные"\nСлайд 2: До (фото)\nСлайд 3: Что сделал\nСлайд 4-5: Процесс\nСлайд 6: После (фото)',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
}

// Helper to generate prompt from post data
export function generatePrompt(post: Partial<Post>, template: string): string {
  let prompt = template;

  const replacements: Record<string, string> = {
    '{ниша}': post.niche || 'не указано',
    '{рубрика}': post.rubric || 'не указано',
    '{тема}': post.topic || 'не указано',
    '{платформа}': post.platform || 'не указано',
    '{формат}': post.format || 'не указано',
    '{цель}': post.goal || 'не указано',
    '{аудитория}': post.audience || 'не указано',
    '{стиль}': post.style || 'не указано',
    '{тон}': post.tone || 'не указано',
    '{количество_слайдов}': post.slidesCount?.toString() || 'не указано',
    '{ключевые_слова}': post.keywords || 'не указано',
    '{описание_идеи}': post.ideaDescription || 'не указано',
    '{визуальные_заметки}': post.visualNotes || 'не указано',
    '{ограничения}': 'не указано',
    '{язык}': 'русский'
  };

  for (const [key, value] of Object.entries(replacements)) {
    prompt = prompt.replace(new RegExp(key, 'g'), value);
  }

  return prompt;
}

// Helper to create new post
export function createPost(data: Partial<Post>): Post {
  const now = new Date().toISOString();
  return {
    id: Date.now().toString(),
    title: data.title || '',
    topic: data.topic || '',
    niche: data.niche || '',
    rubric: data.rubric || '',
    platform: data.platform || '',
    format: data.format || '',
    goal: data.goal || '',
    style: data.style || '',
    tone: data.tone || '',
    audience: data.audience || '',
    slidesCount: data.slidesCount || 5,
    keywords: data.keywords || '',
    ideaDescription: data.ideaDescription || '',
    visualNotes: data.visualNotes || '',
    hook: data.hook || '',
    structure: data.structure || '',
    caption: data.caption || '',
    slidesText: data.slidesText || '',
    videoScript: data.videoScript || '',
    cta: data.cta || '',
    hashtags: data.hashtags || '',
    prompt: data.prompt || '',
    status: data.status || 'Идея',
    publishDate: data.publishDate || '',
    publishTime: data.publishTime || '',
    priority: data.priority || 'средний',
    checklist: data.checklist || [],
    references: data.references || [],
    analytics: data.analytics || {
      url: '',
      views: 0,
      likes: 0,
      comments: 0,
      saves: 0,
      shares: 0,
      followers: 0,
      notes: '',
      repeatFormat: false
    },
    createdAt: now,
    updatedAt: now
  };
}

// Helper to create new idea
export function createIdea(data: Partial<Idea>): Idea {
  const now = new Date().toISOString();
  return {
    id: Date.now().toString(),
    text: data.text || '',
    topic: data.topic || '',
    niche: data.niche || '',
    rubric: data.rubric || '',
    format: data.format || '',
    platform: data.platform || '',
    readiness: data.readiness || 'сырая идея',
    notes: data.notes || '',
    references: data.references || [],
    status: data.status || 'Идея',
    priority: data.priority || 'средний',
    createdAt: now,
    updatedAt: now
  };
}
