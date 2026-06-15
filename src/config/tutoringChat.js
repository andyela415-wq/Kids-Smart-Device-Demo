export const INITIAL_CHAT = [
  {
    id: 'init-ai',
    role: 'ai',
    text: '你好呀！我是 AI 小老师～全篇《秋天的雨》我都读完啦，想聊词语、气味还是小动物过冬，都可以问我！📚',
  },
]

export const QUICK_PROMPTS = [
  { id: 'adjective', label: '什么是形容词？', text: '什么是形容词？' },
  { id: 'smell', label: '藏着什么气味？', text: '文中藏着什么气味？' },
  { id: 'winter', label: '动物怎么过冬？', text: '小动物们怎么过冬？' },
]

export const MOCK_RESPONSES = {
  adjective:
    '哈哈，形容词就像是给事物穿上漂亮衣服的词哦！比如「五彩缤纷」的颜料、「香甜」的气味、「油亮亮」的衣裳。你还能想到别的吗？✨',
  sentence:
    '好呀！我们用课文里的词造句：秋天的雨，有一盒五彩缤纷的颜料，把田野染成了金色的海洋，真是太美啦！🍎🌾',
  quiz:
    '准备接招喽！课文里说「金黄色是给田野的」，那「黄色」给了谁呢？提示：像小扇子一样扇走炎热的是谁？🍂',
  author:
    '哇，你太会提问了！《秋天的雨》的作者是陶金鸿老师哦。课文从钥匙、颜料、气味到小动物过冬，写满了她对秋天的热爱！✨',
  autumnRain:
    '秋天的雨是很奇妙的！它像一把钥匙打开秋天，又像一盒五彩缤纷的颜料，还藏着香甜的气味，吹起小喇叭告诉大家冬天要来啦！🎨',
  lesson:
    '全篇课文有五个自然段哦！我们发现了五彩缤纷、香甜、比喻句、拟人句，还有小喜鹊、小松鼠准备过冬。你想先聊哪一段呢？',
  smell:
    '秋雨里躲着梨香香的、菠萝甜甜的，还有苹果和橘子好多香甜的气味呢！小朋友的脚常被香味勾住哦！🍍🍎',
  winter:
    '小喜鹊在造房子，小松鼠在找松果，小青蛙在加紧挖洞准备睡大觉，大家都在忙着准备过冬呢！🐿️',
  fallback:
    '这个问题有意思！你可以问我：课文藏着什么气味？小动物怎么过冬？或者点上面的提示按钮试试看～ 🌈',
}

/** 根据用户输入匹配模拟 AI 回复（优先级：专项问答 > 课文主题 > 兜底引导） */
export function resolveAiResponse(input) {
  const text = input.trim()
  if (!text) return null

  if (text.includes('形容词')) return MOCK_RESPONSES.adjective
  if (text.includes('造句')) return MOCK_RESPONSES.sentence
  if (text.includes('考考我') || text.includes('考考')) return MOCK_RESPONSES.quiz
  if (text.includes('气味') || text.includes('香味') || text.includes('藏着什么气味')) {
    return MOCK_RESPONSES.smell
  }
  if (
    text.includes('过冬') ||
    text.includes('小动物') ||
    text.includes('动物怎么') ||
    text.includes('准备过冬')
  ) {
    return MOCK_RESPONSES.winter
  }
  if (text.includes('作者')) return MOCK_RESPONSES.author
  if (text.includes('课文') || text.includes('意思')) return MOCK_RESPONSES.lesson
  if (text.includes('雨') || text.includes('秋天')) return MOCK_RESPONSES.autumnRain
  return MOCK_RESPONSES.fallback
}

export function createMessage(role, text) {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    role,
    text,
  }
}
