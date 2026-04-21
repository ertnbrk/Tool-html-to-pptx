# HTML to PPTX Converter

Convert multiple HTML slide files into a single PowerPoint (`.pptx`) presentation with pixel-perfect rendering.

Each HTML file is rendered in a headless browser and captured as an image, then inserted as a slide into the final PPTX.

---

## 📁 Project Structure

```
project/
├─ html/                # Input HTML slides
│   ├─ page_1.html
│   ├─ page_2.html
│   ├─ ...
│
├─ temp/                # Temporary screenshots (auto-generated, ignored)
│
├─ output/              # Final PPTX output (ignored)
│   └─ presentation.pptx
│
├─ src/
│   └─ generate.js      # Main generation script
│
├─ package.json
├─ .gitignore
├─ README.md
```

---

## ⚙️ Installation

Make sure you have **Node.js (v18+)** installed.

Install dependencies:

```
npm install
```

---

## 🚀 Usage

Run the generator:

```
npm run generate
```

After execution:

```
output/presentation.pptx
```

will be created.

---

## 🧠 How It Works

1. Reads all `.html` files from `/html`
2. Sorts them numerically (`page_1 → page_2 → ...`)
3. Opens each file in Puppeteer (headless Chrome)
4. Waits for render completion
5. Takes a screenshot of each slide
6. Adds each image as a PowerPoint slide
7. Exports final `.pptx`

---

## 📏 Slide Resolution

Default rendering:

```
1280 x 720 (16:9)
```

If your slides use a different size, update in:

```
src/generate.js
```

```js
const VIEWPORT_WIDTH = 1280;
const VIEWPORT_HEIGHT = 720;
```

---

## ⚠️ Important Notes

### 1. HTML Requirements

Each HTML file should:

* Be designed as a fixed slide (not responsive)
* Match the viewport size (1280x720 recommended)
* Use `overflow: hidden`
* Avoid scroll

---

### 2. External Assets

Your slides may use:

* Google Fonts
* External images
* Tailwind CDN

⚠️ Make sure:

* Assets load correctly
* Internet connection is stable during rendering

---

### 3. Rendering Stability

The script waits for:

* `networkidle0`
* `<body>` render
* Additional delay buffer

This ensures:

* Fonts load correctly
* Layout is stable
* No partial renders

---

### 4. File Naming

Files must follow numeric pattern:

```
page_1.html
page_2.html
page_10.html
```

Sorting is handled automatically.

---

### 5. Output Quality

Slides are added as images, meaning:

✔ Pixel-perfect design
✔ No layout breaking
✔ No font mismatch
❌ Not editable inside PowerPoint

---

## 🧹 Temp Files

Screenshots are stored in:

```
/temp
```

They are ignored via `.gitignore`.

You can optionally delete them after generation.

---

## 🛠 Tech Stack

* Puppeteer → HTML rendering
* PptxGenJS → PPTX generation
* Node.js → runtime

---

## 💡 Recommended Use Cases

* AI-generated slide decks
* Web-based presentations
* Product demos
* Architecture diagrams
* UI/UX showcase

---

## 🔥 Future Improvements (Optional)

* CLI support (`--input`, `--output`)
* Parallel rendering (faster)
* Auto slide titles
* Footer / branding injection
* Theme system (dark/light)
* Temp file auto-cleanup

---

## ✅ Summary

This tool provides a **fast, reliable, and scalable** way to convert HTML slides into PowerPoint presentations without losing design fidelity.

---

**Ready to use.**
