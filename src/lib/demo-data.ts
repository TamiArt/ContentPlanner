import { Post, Idea, createPost, createIdea } from './storage';

export function generateDemoData() {
  const demoPosts: Post[] = [
    createPost({
      title: 'Как картина меняет интерьер',
      topic: 'Искусство в интерьере',
      niche: 'искусство',
      rubric: 'экспертный',
      platform: 'TikTok',
      format: 'карусель',
      goal: 'подписки',
      style: 'экспертный, живой',
      tone: 'дружелюбный',
      slidesCount: 6,
      ideaDescription: 'Показать на примере как одна картина полностью меняет восприятие комнаты',
      status: 'Идея',
      publishDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      publishTime: '10:00'
    }),
    createPost({
      title: '5 ошибок при выборе рамы',
      topic: 'Оформление картин',
      niche: 'искусство',
      rubric: 'обучающий',
      platform: 'Instagram',
      format: 'Reels',
      goal: 'сохранения',
      style: 'экспертный',
      tone: 'профессиональный',
      slidesCount: 5,
      ideaDescription: 'Разобрать типичные ошибки при выборе рамы для картины',
      status: 'Нужен текст',
      publishDate: new Date(Date.now() + 172800000).toISOString().split('T')[0],
      publishTime: '14:00'
    }),
    createPost({
      title: 'Закулисье: как я создаю картину',
      topic: 'Процесс создания',
      niche: 'искусство',
      rubric: 'закулисье',
      platform: 'Instagram',
      format: 'сторис',
      goal: 'вовлечение',
      style: 'личный, искренний',
      tone: 'дружелюбный',
      ideaDescription: 'Показать весь процесс от идеи до готовой работы',
      status: 'В работе',
      publishDate: new Date().toISOString().split('T')[0],
      publishTime: '18:00'
    })
  ];

  const demoIdeas: Idea[] = [
    createIdea({
      text: 'Топ-3 музея для вдохновения художника',
      niche: 'искусство',
      format: 'карусель',
      platform: 'Instagram',
      readiness: 'сырая идея'
    }),
    createIdea({
      text: 'Сравнение: акварель vs масло - что выбрать начинающему',
      niche: 'обучение',
      format: 'видео',
      platform: 'YouTube Shorts',
      readiness: 'есть структура'
    }),
    createIdea({
      text: 'История одной картины: от эскиза до продажи',
      niche: 'личное',
      format: 'пост',
      platform: 'Telegram',
      readiness: 'сырая идея'
    })
  ];

  return { posts: demoPosts, ideas: demoIdeas };
}
