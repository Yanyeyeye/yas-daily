# Vue 3 - TypeScript - Vite

## 简介

这个模板是由 `cnpm create Vite` 创建的，并使用了一些很棒的 vite 插件。它也是我的框架模板，用于启动新项目。以下是这个精简版的一些特点：

- 💫`unplugin-auto-import`：此插件将帮助您自动注册您在此项目中使用的功能。查看 [这里](https://github.com/antfu/unplugin-auto-import) 以获取更多信息。
- :books:`vite-plugin-pages`: 你想用 vue-router 更优雅吗？这个插件将帮助您生成路由，并且您唯一需要将您使用的每个页面放在`./src/pages/`中。这是[文档](https://github.com/hannoeru/vite-plugin-页)。
- :lollipop:`unplugin-vue-components`：Vue 的按需组件自动导入。您需要做的只是开始编码而无需任何导入。查看 [这里](https://github.com/antfu/unplugin-vue-components) 以获取更多信息。
- :gem:`UnoCSS`: [原子 CSS 引擎不是框架](https://github.com/unocss/unocss)
  - :facepunch:`@unocss/reset`: 使用 'tailwind.css' 初始化 CSS。
  - 😃`@iconify-json/carbon @iconify-json/mdi`：使用任何图标作为类实用程序。

  *这个插件是实验性的，所以在发生破坏性变化时做好准备。*
- :helicopter:`VUEuse`: 是的。基于 Composition API 的实用函数集合。试试这个方便的 [plugin](https://vueuse.org/)。
- 🦾 `TypeScript`：完整的 TypeScript 支持。
- :calling: `Netlify`: 在 Netlify 上部署。

## 如何开始？

  1. 使用`ni`安装依赖。
     - 如果你不知道像 `ni` 这样的命令。请查看 [这里](https://github.com/antfu/ni) 了解更多信息。
  2. 使用`nr dev` 启动。
