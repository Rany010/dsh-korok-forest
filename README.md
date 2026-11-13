# Korok · 呀哈哈森林

DeepSeek Harness `0.2.2-rc.1` 的可安装皮肤包。晨光 / 幽光跟随宿主已有的浅色、深色和系统外观。桌宠可以显示、拖拽和关闭。种子自动收集默认暂停。

这不是改 DSH 源码。配色通过 `ctx.theme.overrideTokens` 叠在当前主题上，卸载时由插件 effect 撤掉。

## 安装

在已经能运行 `dsh` 的环境里，把本目录装进要启动的 profile。Web 界面用 `web`：

```sh
dsh plugin --profile web add /absolute/path/dsh-korok-forest
dsh --profile web
```

设置里会出现「呀哈哈森林」。外观仍用宿主的浅色 / 深色 / 跟随系统。

## 卸载

```sh
dsh plugin --profile web remove dsh-korok-forest
```

浏览器里本插件的本地设置键是 `dsh-korok-forest/v1`。卸载插件不会自动清掉它；设置页里的「清空本地数据」会删掉。

## 当前范围

- 双主题色覆盖正文、侧栏、气泡、输入、代码块底、Diff 底色和标记、滚动条、菜单、Toast、焦点圈。不改语法高亮，不改用户字体。
- 会话里的木灵按当前会话切换表情：等你确认、模型思考、工具执行、刚完成或失败，安静约五分钟后睡着。打开旧会话不会重播已经结束的回合。
- 种子账本和状态机已经有单测。自动发种子关闭，收藏页不显示模拟数量。

核验记录在 `docs/implementation-findings.md`。Token 对照在 `theme/dsh-token-mapping.md`。

## 检查

```sh
node --test
```
