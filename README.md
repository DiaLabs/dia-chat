# Dia Chat - AI Companion 🤖

Privacy-first AI chat with on-device models. No cloud, no tracking, just you and an AI companion.

**Version:** 0.2.7 | Next.js 16 + React 19 | TypeScript

---

## ✨ Features

- 🔐 **Privacy First** - All conversations stay on your device
- ⚡ **Fast** - GPU-accelerated (WebGPU) with CPU fallback
- 💬 **Chat** - Real-time streaming responses
- 🎨 **Customizable** - Themes, fonts, colors
- 💾 **Persistent** - Auto-saved chat history
- 📱 **Responsive** - Mobile, tablet, desktop
- 🗣️ **Voice** (optional) - Text-to-speech synthesis

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **AI**: WebLLM (GPU), Transformers.js (CPU)
- **Storage**: IndexedDB, localStorage
- **Auth**: Firebase Google OAuth
- **Animation**: Framer Motion

---

## 🚀 Quick Start

```bash
# Clone & install
git clone https://github.com/yourusername/dia-chat.git
cd dia-chat
npm install

# Setup environment
# Create .env.local with Firebase credentials

# Start dev server
npm run dev
# Open http://localhost:3000
```

**First time:** Sign in → Go to /chat → Send message (model downloads ~730MB)



## 🤝 Contributing

1. Fork & clone
2. Create feature branch: `git checkout -b feature/your-feature`
3. Commit: `git commit -m "feat: description"`
4. Push & create PR

**Commit types:** `feat`, `fix`, `docs`, `style`, `refactor`, `perf`

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Model download stuck | Clear cache (DevTools → Application → Clear storage) |
| IndexedDB error | Check if IndexedDB is available: `window.indexedDB` |
| Firebase auth fails | Verify `.env.local` & Firebase console settings |
| WebGPU not available | Falls back to CPU (slower). Check browser support |
| Build fails | Clear cache: `rm -rf .next node_modules` then reinstall |


## 📝 License

MIT License - See [LICENSE](LICENSE)

---

## 🔗 Links

- **Issues**: [GitHub Issues](https://github.com/yourusername/dia-chat/issues)
- **Docs**: [Next.js](https://nextjs.org/docs) | [React](https://react.dev) | [Firebase](https://firebase.google.com/docs)

## Authors 
- Dhruv Sen: [Portfolio](https://codexdhruv.dev/) | [Github](https://github.com/CodeXdhruv)
- Itesh Singh Tomar: [Portfolio](https://www.iteshxt.me/) | [Github](https://github.com/iteshxt) 
- Aditya Kumar Anupam: [Portfolio](https://aditanupam.dev/) | [Github](https://www.aditanupam.dev/)