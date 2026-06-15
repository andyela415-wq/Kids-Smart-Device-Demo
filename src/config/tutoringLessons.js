export const LESSONS = [
  {
    id: 'g3-autumn-rain',
    grade: '三年级语文',
    title: '秋天的雨',
    icon: '🍂',
    accent: '#e76f51',
    tagline: '五彩缤纷的秋雨里，藏着整个秋天',
    startLabel: '开启秋雨之旅 🌧️',
    excerpt: [
      '秋天的雨，是一把钥匙。它带着清凉和温柔，轻轻地，轻轻地，趁你没留意，把秋天的大门打开了。',
      '秋天的雨，有一盒五彩缤纷的颜料。你看，它把黄色给了银杏树，黄黄的叶子像一把把小扇子，扇哪扇哪，扇走了夏天的炎热。它把红色给了枫树，红红的枫叶像一枚枚邮票，飘哇飘哇，邮来了秋天的凉爽。金黄色是给田野的，看，田野像金色的海洋。橙红色是给果树的，橘子、柿子你挤我碰，争着要人们去摘呢！菊花仙子得到的颜色就更多了，紫红的、淡黄的、雪白的……美丽的菊花在秋雨里频频点头。',
      '秋天的雨，藏着非常好闻的气味。梨香香的，菠萝甜甜的，还有苹果、橘子，好多好多香甜的气味，都躲在小雨滴里呢！小朋友的脚，常被那香味勾住。',
      '秋天的雨，吹起了金色的小喇叭。它告诉大家，冬天快要来了。小喜鹊衔来树枝造房子，小松鼠找来松果当粮食，小青蛙在加紧挖洞，准备舒舒服服地睡大觉。松柏穿上厚厚的、油亮亮的衣裳，杨树、柳树的叶子飘到树妈妈的脚下。它们都在准备过冬了。',
      '秋天的雨，带给大地的是一曲丰收的歌，带给小朋友的是一首欢乐的歌。',
    ],
    report: {
      tip: '从颜色、气味到过冬准备，整篇《秋天的雨》尽收眼底。',
      vocabularyGroups: [
        {
          title: '颜色与姿态',
          items: [
            { word: '五彩缤纷', tone: 'mint', speak: '五彩缤纷，形容颜色繁多，非常好看。' },
            { word: '频频点头', tone: 'pink', speak: '频频点头，形容不断地点头，像在打招呼。' },
          ],
        },
        {
          title: '气味与体验',
          items: [
            { word: '香甜', tone: 'yellow', speak: '香甜，形容味道又香又甜，课文里梨、菠萝、苹果、橘子都很香甜。' },
            { word: '舒舒服服', tone: 'orange', speak: '舒舒服服，形容非常舒适，小青蛙准备舒舒服服地睡大觉。' },
          ],
        },
        {
          title: '动作与修辞',
          items: [
            { word: '小扇子', tone: 'lavender', speak: '小扇子，课文里把银杏树的叶子比作一把把小扇子。' },
            { word: '油亮亮', tone: 'sky', speak: '油亮亮，形容光亮润泽，松柏穿上了油亮亮的衣裳。' },
          ],
        },
      ],
      patternCategories: [
        {
          id: 'metaphor',
          title: '比喻句',
          tone: 'lavender',
          speak: '比喻句：秋天的雨，是一把钥匙。田野像金色的海洋。',
          examples: ['秋天的雨，是一把钥匙。', '田野像金色的海洋。'],
        },
        {
          id: 'personification',
          title: '拟人句',
          tone: 'peach',
          speak: '拟人句：橘子、柿子你挤我碰，争着要人们去摘呢！美丽的菊花在秋雨里频频点头。',
          examples: [
            '橘子、柿子你挤我碰，争着要人们去摘呢！',
            '美丽的菊花在秋雨里频频点头。',
          ],
        },
        {
          id: 'reduplication',
          title: '叠词想象',
          tone: 'mint',
          speak: '叠词：轻轻地，轻轻地；飘哇飘哇；扇哪扇哪，读起来真有节奏感。',
          examples: ['轻轻地，轻轻地', '飘哇飘哇', '扇哪扇哪'],
        },
      ],
      goldenSentence: {
        text: '秋天的雨，是一把钥匙。它带着清凉和温柔，把秋天的大门打开了。',
        emoji: '🗝️',
      },
      quiz: {
        question: '课文里，金黄色是给了谁？',
        options: [
          { id: 'field', label: '田野', emoji: '🌾', correct: true },
          { id: 'ginkgo', label: '银杏树', emoji: '🍂', correct: false },
        ],
        correctFeedback: '太棒啦！金黄色给了田野，像金色的海洋～',
        wrongFeedback: '再想想，课文说「金黄色是给田野的」哦～',
      },
      grammar: '比喻句 · 拟人句 · 叠词',
    },
  },
]

export function getLesson(id) {
  return LESSONS.find((lesson) => lesson.id === id) || LESSONS[0]
}
