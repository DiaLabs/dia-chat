# LinkedIn Post Draft

A year ago, I started building Dia without really knowing what an LLM was. The first version was... humble. I fine-tuned a model that was "okay" at best, and I had to rely on Google Colab just to run inference. It was a start, but it wasn't the vision I had.

Last month, I picked it back up with a specific goal: **True On-Device Inference.** No servers, no expensive APIs, just your browser.

I fine-tuned Llama 3.2 1B-Instruct specifically for this purpose and went down the rabbit hole of running LLMs in the browser. It’s been a massive learning curve, but today Dia is running entirely client-side.

Here’s the cool technical part—I built a hybrid inference engine to make it accessible to everyone:
🚀 **WebGPU Mode:** Uses WebLLM for blazing fast performance if you have a GPU.
🛡️ **CPU Fallback:** Uses Transformers.js (ONNX WASM) with multi-threading support for devices without WebGPU (like older laptops).

We also tackled some serious engineering challenges to make it production-ready:
*   **Persistent Chat History:** Moved to IndexedDB so your conversations are saved locally and securely.
*   **silky Smooth UI:** Solved complex mobile viewport issues (the dreaded 100dvh + virtual keyboard problem) for an app-like feel.
*   **Smart Architecture:** Implemented a custom "Ghost Chat" system for instant interaction before the first message is even saved.
*   **Production Grade:** Optimized the build process, silencing verbose logs and handling edge cases (like authentication popups vs strict security headers) gracefully.

Right now, it works great on laptops and PCs, and the mobile experience is getting better every day. 📱

It’s crazy to look back at that Colab notebook from a year ago compared to running a private, finetuned 1B parameter model directly in Chrome today.

#AI #WebGPU #OnDeviceAI #Llama3 #Engineering #OpenSource #DiaChat
