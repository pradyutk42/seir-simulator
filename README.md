# SEIR Simulator

An interactive SEIR (Susceptible–Exposed–Infectious–Recovered) model simulator built using React, TailwindCSS, and Chart.js.  
It allows users to input initial conditions and visualize how an infectious disease spreads and stabilizes over time.

### Live Demo  
[https://pradyutk42.github.io/seir-simulator/](https://pradyutk42.github.io/seir-simulator/)

---

## Features

- Natural, sentence-style user input
- Adjustable parameters: Susceptible (S), Exposed (E), and Transmissibility (β)
- Automatic detection of plateau in infections
- Interactive plot showing Infectious and Recovered curves
- Tooltips explaining transmissibility and plateau dynamics
- Typography and styling designed for clarity and readability
- Fully responsive and embeddable in external websites

---

## Technology Stack

- React (with functional components and hooks)
- Vite for development and builds
- TailwindCSS for styling
- Chart.js for dynamic chart rendering
- GitHub Pages for deployment

---

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/pradyutk42/seir-simulator.git
   cd seir-simulator
   ```
2. **Install dependencies**
   ```bash
   npm install 
   ``` 
3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Build and deploy to GitHub Pages**
   ```bash
   npm run build
   npm run deploy
   ```
---

## Embedding

You can embed the simulator in your website using the following html snippet:
```html
<iframe
  src="https://pradyutk42.github.io/seir-simulator/"
  width="100%"
  height="720"
  style="border: none; border-radius: 12px;"
  loading="lazy"
></iframe>

```

---

## References and Attribution

- SEIR model structure based on classical epidemic models described in:
  - Hethcote, H. W. (2000). *The Mathematics of Infectious Diseases*. SIAM Review, 42(4), 599–653.
- Chart rendering: [Chart.js](https://www.chartjs.org/) and [react-chartjs-2](https://github.com/reactchartjs/react-chartjs-2)
- Styling: [TailwindCSS](https://tailwindcss.com/)


   
