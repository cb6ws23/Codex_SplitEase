# Claude Code 指令：Splita 视觉系统重构

## 你的角色

你正在接手 Splita 项目的视觉系统重构。项目位于当前目录。
这不是小修小补，而是一轮系统性的品牌与 UI 统一。

**重要前提**：之前有一轮失败的视觉重构（ChatGPT + Codex 执行），已经被 revert。当前 main 分支处于"功能可用，但视觉混乱不统一"的状态。你的任务是按照下面的 spec 重新建立统一的视觉系统。

---

## 第零步：读取上下文

请先依次阅读：

1. `README.md`
2. `SPLITA_VISUAL_SPEC_V1.md`（视觉系统 spec，已放在项目根目录，如果没有请让用户提供）
3. `tailwind.config.ts`
4. `src/app/globals.css`
5. `src/app/layout.tsx`
6. `src/app/[locale]/layout.tsx`
7. `src/app/[locale]/page.tsx`（首页）
8. `src/app/[locale]/groups/new/page.tsx`（Create Group）
9. `src/app/[locale]/g/[slug]/page.tsx`（Group 页）
10. `src/components/locale-switcher.tsx`

读完后输出简短现状总结：当前用了哪些颜色、哪些需要清除、哪些组件样式不统一。

---

## Phase 1：Design Tokens

**目标**：在项目中建立本 spec 定义的所有 CSS variables，不改任何页面。

### 操作

1. 在 `src/app/globals.css` 的 `:root` 中定义以下 CSS variables：

```css
:root {
  /* Brand */
  --brand-primary: #4F56E8;
  --brand-primary-hover: #4349D4;
  --brand-primary-dark: #3D43C7;
  --brand-primary-light: #E3E4F3;
  --brand-primary-subtle: #F0F0FA;

  /* Surfaces */
  --bg-page: #FFFFFF;
  --bg-card: #F7F7FB;
  --bg-card-hover: #EEEFF7;
  --bg-accent: #E3E4F3;
  --bg-hero: #4F56E8;

  /* Text */
  --text-primary: #1A1A2E;
  --text-secondary: #5A5A78;
  --text-muted: #8E8EA8;
  --text-on-brand: #FFFFFF;
  --text-brand: #4F56E8;

  /* Border */
  --border-default: #E2E2EE;
  --border-hover: #D0D0E0;
  --border-brand: #4F56E8;

  /* Semantic */
  --color-success: #16A34A;
  --color-danger: #DC2626;
  --color-warning: #D97706;
  --color-info: #4F56E8;
}
```

2. 在 `tailwind.config.ts` 中扩展 colors 引用这些 CSS variables，例如：

```ts
colors: {
  brand: {
    DEFAULT: 'var(--brand-primary)',
    hover: 'var(--brand-primary-hover)',
    dark: 'var(--brand-primary-dark)',
    light: 'var(--brand-primary-light)',
    subtle: 'var(--brand-primary-subtle)',
  },
  surface: {
    page: 'var(--bg-page)',
    card: 'var(--bg-card)',
    'card-hover': 'var(--bg-card-hover)',
    accent: 'var(--bg-accent)',
    hero: 'var(--bg-hero)',
  },
  // ... text, border 同理
}
```

3. 确保字体栈正确：

```css
font-family: "Inter", "Noto Sans JP", "Noto Sans SC", system-ui, sans-serif;
```

如果 Inter / Noto Sans JP / Noto Sans SC 还没引入，通过 `next/font` 或 Google Fonts link 引入。

### 验证

- `npm run lint` 通过
- `npx next build` 通过
- 页面外观不应有变化（只加了 variables，还没使用）

---

## Phase 2：英文首页 Hero

**目标**：重写英文首页，实现统一的 Hero + Recent Groups 布局。

### Hero 区域 spec

```
背景: var(--bg-hero) = #4F56E8
文字: var(--text-on-brand) = #FFFFFF
结构（居中）:
  品牌名 "Splita"   — 42px, weight 600, letter-spacing -0.5px
  副标题             — 16px, weight 400, rgba(255,255,255,0.88)
    "Split expenses with friends."
    "Simple, instant, no sign-up."
  CTA 按钮          — 白底 (#FFFFFF), 品牌色文字 (#4F56E8)
    "Create a group"
    15px weight 600, padding 12px 28px, border-radius 8px
  上下 padding: 48px (mobile) / 64px (desktop)
```

### Hero 下方

```
背景: var(--bg-page) = #FFFFFF
内容:
  1. "Recent groups" 标签 — 13px, var(--text-muted)
  2. Recent Groups 列表（已有组件，只需统一样式）
     每个 group card:
       背景: var(--bg-card)
       边框: 0.5px solid var(--border-default)
       圆角: 12px
       内边距: 14px 16px
  3. 如果没有 recent groups，不显示这个 section
```

### 需要清除的

- Hero 中的任何功能卡片、复杂布局、插图
- 任何不在 spec 中的背景色（暖黄、米黄、深蓝等）
- 旧的 Hero 组件 / 样式

### 验证

- `npm run lint` 通过
- `npx next build` 通过
- 浏览器访问 `http://localhost:3000/en` 确认 Hero 显示正确

---

## Phase 3：日文 + 中文首页

**目标**：同一个 Hero 组件，通过 i18n 消息文件切换文案。

### 日文

```
品牌名: スプリタ
副标题: 友達との割り勘を、シンプルに。
       登録不要、すぐ使える。
CTA: グループを作成
Recent groups 标签: 最近のグループ
```

### 中文

```
品牌名: AA记
副标题: 和朋友轻松分账。
       无需注册，即开即用。
CTA: 创建群组
Recent groups 标签: 最近的群组
```

### 规则

- 不做语言特判 CSS
- 结构完全一致，只换文案
- 副标题的换行通过文案中的自然断句实现，不 hardcode `<br>`

### 验证

- 访问 `/ja` 和 `/zh-CN` 确认 Hero 正确
- 切换语言确认布局稳定，不乱

---

## Phase 4：Create Group + Share/Created 页

**目标**：让建组流程的两个页面进入统一视觉系统。

### Create Group 页

```
背景: var(--bg-page)
结构: 居中卡片表单
卡片样式:
  背景: var(--bg-card)
  边框: 0.5px solid var(--border-default)
  圆角: 12px
  内边距: 24px
  最大宽度: 480px
输入框: 按 spec 4.3
按钮: Primary CTA 按 spec 4.2
成员 chips: 按 spec 4.5
```

### Share/Created 页

```
背景: var(--bg-page)
结构: 居中卡片
内容:
  成功图标或文案
  Group 链接（可复制）
  "进入群组" CTA 按钮
卡片样式同上
```

### 需要清除的

- 任何旧的暖色背景
- 非标准的按钮样式
- 不一致的卡片样式

### 验证

- lint + build 通过
- 完整走一遍：建组 → 成功页 → 进入群组，视觉无跳跃感

---

## Phase 5：Group 页 + Settlement 页

**目标**：核心使用页面进入统一视觉系统。

### Group 页

```
背景: var(--bg-page)
Group 标题栏: 可用 var(--bg-card) 做微妙区分
费用列表: 每条费用用统一卡片样式
余额显示: 正数用 var(--color-success), 负数用 var(--color-danger), 零用 var(--text-muted)
操作按钮: 按 spec 4.2
```

### Settlement 页

```
背景: var(--bg-page)
结算建议: 每条用卡片展示，样式统一
"谁付给谁多少" 的关键数字用 weight 600
```

### 验证

- lint + build 通过
- 建一个有费用的 group，确认视觉一致

---

## Phase 6：Typography Audit + 收口

**目标**：最终检查所有页面的字体表现。

### 检查项

1. 所有页面的 `font-family` 是否正确加载 Inter + Noto Sans JP + Noto Sans SC
2. 标题是否统一 weight 600，正文 weight 400
3. 中日英混排页面的行高是否自然
4. 所有 placeholder 是否使用 var(--text-muted)
5. 所有卡片内文字层级是否清晰（标题 > 副标题 > 说明）
6. 最小字号不低于 12px

### 最终验证

- lint + build 通过
- 依次访问 en / ja / zh-CN 的：首页、建组、成功页、Group 页、Settlement 页
- 确认所有页面看起来像同一个产品

---

## 冻结约束（必须遵守）

### 不要做的事

- 不加登录/注册/dashboard/多币种
- 不改路由模型
- 不加付费外部服务
- 不混合旧暖黄和新 indigo 系统
- 不在没有 spec 依据的情况下自由发挥颜色
- 不先改英文再顺手带坏日中
- 不引入 spec 之外的颜色值
- 不做 dark mode（MVP A 不需要）

### 必须做的事

- 每次改动前先理解现有逻辑
- 修改最小化，不做不必要的重构
- 每个 Phase 完成后跑 lint + build
- 需要浏览器验证的明确说出来
- 不确定的先问用户

### 保留的产品功能（不要动）

- single-link collaboration 模型
- Recent Groups（localStorage）
- Remove-from-recent
- 成员 chips 输入
- Create Group 成功后的分享引导页
- 语言切换器
- CSV 导出
- Settlement 算法

### 路由（不要改）

- `/{locale}/g/{slug}`
- `/{locale}/g/{slug}/expenses/new`
- `/{locale}/g/{slug}/expenses/{expenseId}/edit`
- `/{locale}/g/{slug}/settlement`
- `/{locale}/groups/new`
- `/api/groups/{slug}/access`
- `/api/groups/{slug}/export`

---

## 执行顺序

严格按 Phase 0 → 1 → 2 → 3 → 4 → 5 → 6 执行。
每个 Phase 完成后报告：改了什么文件、清除了什么旧样式、需要浏览器验证什么。
不要跳 Phase，不要在一个 Phase 里偷跑下一个 Phase 的内容。
