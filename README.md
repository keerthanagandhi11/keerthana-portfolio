# Keerthana Gandhirajan — Interactive Portfolio

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/keerthana-gandhi13aa64282)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white)](https://github.com/keerthanagandhi11)
[![Email](https://img.shields.io/badge/Email-keerthanagandhi1104%40gmail.com-EA4335?style=flat&logo=gmail&logoColor=white)](mailto:keerthanagandhi1104@gmail.com)

An interactive portfolio for Keerthana Gandhirajan, a computer operations professional at Kyndryl and MCA student building AI applications in Python. It features a cursor-tracking avatar animated from 63 directional frames.

## Features

- Cursor-tracked avatar with directional frame mapping
- Center eye-contact state
- Frosted-glass navigation and portfolio modals
- Resume, projects, about, and contact sections populated from Keerthana's resume and LinkedIn profile
- Six project cards with Situation, Task, Action, and Result details
- Web Audio API hover feedback
- Canvas renderer using `requestAnimationFrame`

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | React 19 + Vite 6 |
| Rendering | HTML5 Canvas 2D |
| Styling | Vanilla CSS |
| Icons | Lucide React |

## Run Locally

```bash
npm install
npm run dev
```

## Structure

```
├── public/
│   ├── character_image_corrected.png
│   └── avatar_frames/           # 63 directional avatar frames
├── src/
│   ├── components/
│   │   ├── HeroCanvas.jsx       # Cursor tracking and avatar rendering
│   │   ├── Navigation.jsx       # Main navigation
│   │   ├── HeroContent.jsx      # Hero copy and calls to action
│   │   ├── TrackerHUD.jsx       # Direction telemetry and social links
│   │   └── Modals.jsx           # Projects, about, contact, and resume
│   └── index.css
```
