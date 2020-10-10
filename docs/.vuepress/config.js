module.exports = {

  title: "print('PyCoder')",
  // description: 'Just playing around',

  head: [
    ['link', { rel: 'icon', href: `/favicon.ico` }],
    //增加manifest.json
    ['link', { rel: 'manifest', href: '/manifest.json' }],
    // 移动端搜索框优化
    ['meta', { name: 'viewport', content: 'width=device-width,initial-scale=1,user-scalable=no' }],
  ],

  // permalink: "/:year/:month/:day/:slug",

  /*
  extraWatchFiles: [
    'posts/*.md',
  ],*/

  theme: 'reco',
  themeConfig: {
    type: 'blog',
    author: 'PyCoder',
    // huawei: true,
    displayAllHeaders: true,
    logo: '/img/logo.jpg',
    sidebar: 'auto',
    blogConfig: {
      category: {
        location: 2,     // 在导航栏菜单中所占的位置，默认2
        text: 'Category', // 默认文案 “分类”
        icon: 'reco-category'
      },
      tag: {
        location: 3,     // 在导航栏菜单中所占的位置，默认3
        text: 'Tag',      // 默认文案 “标签”
        icon: 'reco-tag'
      }
    },
    
    nav: [
      { text: 'Home', icon: 'reco-home', link: '/' },
      {
        text: 'Tools',
        ariaLabel: 'Tools Menu',
	icon: 'reco-menu',
        items: [
          { text: 'webp2jpg', link: 'https://renzhezhilu.gitee.io/webp2jpg-online/' },
        ]
      },
    ],

    // 默认值是 true 。设置为 false 来禁用所有页面的 下一篇 链接
    nextLinks: true,
    // 默认值是 true 。设置为 false 来禁用所有页面的 上一篇 链接
    prevLinks: true,
    // 页面滚动
    smoothScroll: true,
    // 起始时间
    startYear: '2016',

  },

  markdown: {
    lineNumbers: true,
    anchor: { permalink: false },
    toc: { includeLevel: [1,2] },
    /*
    extendMarkdown: md => {
      md.use(require('markdown-it-xxx))
    }*/
  },

  plugins: [
     [
      '@vuepress/pwa', {
         serviceWorker: true,
         updatePopup: true
       }
     ],
     [
       '@vuepress/google-analytics', {
         'ga': 'UA-110471007-1',
       }
     ]
  ]

}
