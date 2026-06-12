# JLImage

基于 [Agnes AI](https://agnes-ai.com/doc/overview) 的智能对话与生图 Web 应用。

## 功能

- **统一对话** — 聊天与生图同一入口，LLM 自动识别意图
- **流式输出** — 实时流式回复
- **智能生图** — 说「帮我画…」自动调用生图 API
- **图片修正** — 悬浮图片可编辑，附带当前图继续优化
- **本地 Key** — API Key 仅保存在浏览器

## 本地开发

```bash
npm install
npm run dev
```

## GitHub Pages 部署

### 第一次部署（必做）

1. 打开仓库 **Settings → Pages**
   - 地址：https://github.com/SceneryCN/mineTestImageMaker/settings/pages
2. **Build and deployment → Source** 选择 **GitHub Actions**（不是 Deploy from a branch）
3. 保存后，打开 **Actions** 标签页
4. 选择 **Deploy to GitHub Pages** → **Run workflow** → 重新运行

> 若未执行第 2 步，`deploy-pages` 会报 `404 Not Found / Failed to create deployment`。

### 访问地址

```
https://scenerycn.github.io/mineTestImageMaker/
```

### 后续更新

推送到 `main` 分支会自动重新部署。

```bash
git push origin main
```
