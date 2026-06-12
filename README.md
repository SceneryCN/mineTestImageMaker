# JLImage

基于 [Agnes AI](https://agnes-ai.com/doc/overview) 的智能对话与生图 Web 应用。

## GitHub Pages 部署（必读）

`404 Not Found` / `Get Pages site failed` 表示 **仓库还没开启 GitHub Pages**，必须在 GitHub 网页上手动启用一次。

### 第一步：开启 Pages（只做一次）

1. 打开：**https://github.com/SceneryCN/mineTestImageMaker/settings/pages**
2. 左侧点 **Pages**
3. **Build and deployment → Source** 选 **GitHub Actions**
   - 不要选 “Deploy from a branch”
4. 页面会自动保存

> 若看不到 Pages 菜单，说明你没有仓库 Admin 权限，或组织禁用了 Pages。

### 第二步：重新部署

1. 打开：**https://github.com/SceneryCN/mineTestImageMaker/actions**
2. 左侧 **Deploy to GitHub Pages**
3. 右上角 **Run workflow** → Branch 选 `main` → **Run workflow**
4. 等 `build` 和 `deploy` 都显示绿色 ✓

### 第三步：访问

```
https://scenerycn.github.io/mineTestImageMaker/
```

---

## 本地开发

```bash
npm install
npm run dev
```

## 后续更新

```bash
git push origin main
```

推送后 Actions 会自动重新部署。
