# Splita 视觉系统 Spec v1

## 1. 品牌气质

Splita 是一个轻量、社交型的朋友间分账工具。
气质关键词：**现代、可信、干净、友好但不幼稚**。
不是企业 SaaS，不是财务软件，是朋友之间用的协作小工具。

---

## 2. 品牌色系统

### 2.1 Brand colors

| Token | Hex | 用途 |
|-------|-----|------|
| `--brand-primary` | `#4F56E8` | CTA 按钮、Hero 背景、关键强调 |
| `--brand-primary-hover` | `#4349D4` | CTA hover 状态 |
| `--brand-primary-dark` | `#3D43C7` | active 状态、深色场景下的 primary |
| `--brand-primary-light` | `#E3E4F3` | 浅色标签、badge 背景、选中态底色 |
| `--brand-primary-subtle` | `#F0F0FA` | 极浅强调底色（hero 下方渐变终点等） |

### 2.2 Surface 层级

整个 app 只用这一套 surface 体系，不允许体系外的背景色出现。

| Token | Hex | 用途 |
|-------|-----|------|
| `--bg-page` | `#FFFFFF` | 页面底色 |
| `--bg-card` | `#F7F7FB` | 卡片、容器 |
| `--bg-card-hover` | `#EEEFF7` | 卡片 hover、次级容器 |
| `--bg-accent` | `#E3E4F3` | 强调区域、selected 状态 |
| `--bg-hero` | `#4F56E8` | Hero 区域背景（仅首页） |

### 2.3 Text 层级

| Token | Hex | 用途 |
|-------|-----|------|
| `--text-primary` | `#1A1A2E` | 标题、正文 |
| `--text-secondary` | `#5A5A78` | 副标题、说明文字 |
| `--text-muted` | `#8E8EA8` | 提示、placeholder、时间戳 |
| `--text-on-brand` | `#FFFFFF` | brand 背景上的文字 |
| `--text-brand` | `#4F56E8` | 链接、品牌色文字 |

### 2.4 Border

| Token | Hex | 用途 |
|-------|-----|------|
| `--border-default` | `#E2E2EE` | 卡片边框、分割线 |
| `--border-hover` | `#D0D0E0` | hover 状态边框 |
| `--border-brand` | `#4F56E8` | focus 状态、选中边框 |

### 2.5 功能色（语义色）

| Token | Hex | 用途 |
|-------|-----|------|
| `--color-success` | `#16A34A` | 正数余额、成功提示 |
| `--color-danger` | `#DC2626` | 负数余额、错误、删除 |
| `--color-warning` | `#D97706` | 警告 |
| `--color-info` | `#4F56E8` | 同 brand primary |

---

## 3. Typography

### 3.1 字体栈

```css
--font-sans: "Inter", "Noto Sans JP", "Noto Sans SC", system-ui, sans-serif;
```

优先级：Inter 处理拉丁字符，Noto Sans JP 处理日文，Noto Sans SC 处理中文。
三种语言共享同一字体栈，不做语言特判。

### 3.2 字重

只用两个字重：
- **400** — 正文、说明
- **600** — 标题、按钮、强调

不用 300（太细）、不用 700/800/900（太重）。

### 3.3 字号体系

| 用途 | 大小 | 字重 | 行高 |
|------|------|------|------|
| Hero 标题 | 36px (mobile) / 48px (desktop) | 600 | 1.1 |
| Hero 副标题 | 16px (mobile) / 18px (desktop) | 400 | 1.5 |
| 页面标题 (h1) | 24px | 600 | 1.3 |
| 段落标题 (h2) | 18px | 600 | 1.3 |
| 正文 | 15px | 400 | 1.6 |
| 小字 / 标签 | 13px | 400 | 1.4 |
| 最小字 | 12px | 400 | 1.4 |

### 3.4 多语言排版规则

- 中日文天然更紧凑，不需要额外调整行高
- 品牌名按语言切换：Splita / スプリタ / AA记
- Hero 副标题按语言独立撰写，不做直译，但结构和长度要接近
- 不在 CSS 中按 locale 做字号特判

---

## 4. 组件规则

### 4.1 卡片

```
背景: var(--bg-card)
边框: 0.5px solid var(--border-default)
圆角: 12px
内边距: 16px 20px
Hover: 背景 → var(--bg-card-hover), 边框 → var(--border-hover)
```

所有页面的卡片样式必须统一。

### 4.2 按钮

**Primary（CTA）**
```
背景: var(--brand-primary)
文字: var(--text-on-brand)
圆角: 8px
高度: 44px (mobile) / 40px (desktop)
字号: 15px, weight 600
Hover: 背景 → var(--brand-primary-hover)
Active: 背景 → var(--brand-primary-dark)
```

**Secondary（次要操作）**
```
背景: transparent
边框: 0.5px solid var(--border-default)
文字: var(--text-primary)
Hover: 背景 → var(--bg-card-hover)
```

**Ghost（最弱）**
```
背景: transparent
边框: none
文字: var(--text-secondary)
Hover: 背景 → var(--bg-card)
```

### 4.3 输入框

```
背景: var(--bg-page)
边框: 0.5px solid var(--border-default)
圆角: 8px
高度: 44px
Placeholder: var(--text-muted)
Focus: 边框 → var(--border-brand), ring → 0 0 0 3px var(--brand-primary-light)
```

### 4.4 Badge / Tag

```
背景: var(--brand-primary-light)
文字: var(--brand-primary)
圆角: 6px
字号: 12px, weight 600
内边距: 2px 8px
```

### 4.5 成员 Chip

```
背景: var(--bg-card)
边框: 0.5px solid var(--border-default)
圆角: 20px (pill)
字号: 13px
内边距: 4px 12px
删除按钮: 文字色 var(--text-muted), hover → var(--color-danger)
```

---

## 5. 首页 Hero 结构

### 5.1 Layout

```
┌──────────────────────────────────────────┐
│            [brand-primary 背景]           │
│                                          │
│              品牌名 (36/48px)             │
│         一句话功能定位 (16/18px)           │
│                                          │
│           [ CTA 按钮: 白底品牌色 ]         │
│                                          │
└──────────────────────────────────────────┘
```

### 5.2 规则

- Hero 背景: `var(--bg-hero)` 即 `#4F56E8`
- 所有文字: 白色 `var(--text-on-brand)`
- CTA 按钮: 白底 + 品牌色文字，hover 时微妙阴影
- 不放功能卡片、不放截图、不放复杂图形
- Hero 高度由内容撑起，不做固定高度，但上下留充足 padding（mobile 48px, desktop 64px）
- Hero 下方直接接白色页面内容（如 Recent Groups）

### 5.3 多语言文案

| Locale | 品牌名 | 副标题 | CTA |
|--------|--------|--------|-----|
| en | Splita | Split expenses with friends. Simple, instant, no sign-up. | Create a group |
| ja | スプリタ | 友達との割り勘を、シンプルに。登録不要。 | グループを作成 |
| zh-CN | AA记 | 和朋友轻松分账，无需注册，即开即用。 | 创建群组 |

### 5.4 Hero 下方内容

Hero 之后是白色背景区域，内容为：
1. Recent Groups（如果有）
2. 或者一小段"怎么用"的简要说明（3 步流程，纯文字，不做卡片）

---

## 6. 页面产品旅程一致性

### 6.1 四个关键页面必须统一

| 页面 | 背景 | 特殊元素 |
|------|------|----------|
| 首页 | Hero 区 brand-primary + 下方 bg-page | Hero |
| Create Group | bg-page | 居中卡片表单 |
| Share/Created | bg-page | 成功信息 + 分享链接卡片 |
| Group | bg-page | 标题栏 + 费用列表 + 余额 |

### 6.2 统一规则

- 除首页 Hero 外，所有页面背景均为 `var(--bg-page)` 白色
- 所有页面的卡片、按钮、输入框使用同一套组件样式
- 不在不同页面引入不同的品牌色区块
- Group 页的标题栏可以用 `var(--bg-card)` 做微妙区分，但不用 brand-primary 背景

---

## 7. 需要彻底清除的旧风格

- [ ] 所有暖黄 / 米黄 / amber 系背景色
- [ ] 任何不在本 spec 中定义的背景色
- [ ] 旧的 deep navy / midnight 相关色值
- [ ] Hero 中的功能卡片 / 复杂布局
- [ ] 按钮的非标准样式（如自定义渐变、阴影）
- [ ] 页面之间不一致的卡片圆角 / 边框 / 内边距
- [ ] 任何 CSS 变量名与本 spec 不一致的自定义色值

---

## 8. 实施阶段

### Phase 0: 代码审计
审计当前 main 分支的实际状态，列出所有需要清除的旧色值和组件

### Phase 1: Design tokens
在 Tailwind config / globals.css 中定义本 spec 的所有 CSS variables
不改任何页面，只建立 token 层

### Phase 2: 英文首页 Hero
按本 spec 实现英文首页，包括 Hero + 下方内容

### Phase 3: 日文 + 中文首页
同结构，换文案，验证版式稳定性

### Phase 4: Create Group + Share/Created
表单页和成功页进入统一视觉系统

### Phase 5: Group 页 + Settlement 页
核心使用页面统一

### Phase 6: Typography audit + 收口
中日英混排字重、行高、清晰度统一检查
