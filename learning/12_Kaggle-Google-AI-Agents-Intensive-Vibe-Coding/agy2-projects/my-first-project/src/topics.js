export const TOPICS = {
  WORLD: { name: 'World', code: 'WORLD' },
  NATION: { name: 'Nation', code: 'NATION' },
  BUSINESS: { name: 'Business', code: 'BUSINESS' },
  TECHNOLOGY: { name: 'Technology', code: 'TECHNOLOGY' },
  ENTERTAINMENT: { name: 'Entertainment', code: 'ENTERTAINMENT' },
  SPORTS: { name: 'Sports', code: 'SPORTS' },
  SCIENCE: { name: 'Science', code: 'SCIENCE' },
  HEALTH: { name: 'Health', code: 'HEALTH' }
};

export const getTopicByCode = (code) => {
  if (!code) return null;
  const upperCode = code.toUpperCase();
  return TOPICS[upperCode] || null;
};
