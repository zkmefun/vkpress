import { resolve } from 'path'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import Layouts from 'vite-plugin-vue-layouts'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Unocss from 'unocss/vite'
import Markdown from 'vite-plugin-vue-markdown'
import MDAttributes from 'markdown-it-link-attributes'
import MDCheckbox from 'markdown-it-task-checkbox'
import Shiki from 'markdown-it-shiki'
import Anchor from 'markdown-it-anchor'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  plugins: [
    Vue({
      include: [/\.vue$/, /\.md$/],
      reactivityTransform: true
    }),
    Pages({
      extensions: ['vue', 'md']
    }),
    Layouts(),
    AutoImport({
      imports: ['vue', 'vue-router', 'vue/macros', '@vueuse/core'],
      resolvers: [NaiveUiResolver()],
      dts: 'src/types/auto-imports.d.ts',
      vueTemplate: true
    }),
    Components({
      extensions: ['vue', 'md'],
      resolvers: [NaiveUiResolver()],
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      dts: 'src/types/components.d.ts'
    }),
    Markdown({
      headEnabled: true,
      markdownItSetup(md) {
        md.use(Shiki, {
          theme: {
            dark: 'vitesse-dark',
            light: 'vitesse-light'
          }
        })
        md.use(MDCheckbox)
        md.use(MDAttributes, {
          matcher: (link: string) => /^https?:\/\//.test(link),
          attrs: {
            target: '_blank',
            rel: 'noopener'
          }
        })
        md.use(Anchor, {
          permalink: Anchor.permalink.linkInsideHeader({
            class: 'link-anchor',
            symbol: '',
            space: true,
            placement: 'before'
          })
        })
      }
    }),
    Unocss()
  ],
  resolve: {
    alias: {
      '@/': `${resolve(__dirname, 'src')}/`,
      '#/': `${resolve(__dirname, 'src/types')}/`
    }
  },
  server: {
    host: true,
    open: true
  },
  ssgOptions: {
    script: 'async',
    formatting: 'minify'
  },
  ssr: {
    noExternal: ['naive-ui']
  }
})
