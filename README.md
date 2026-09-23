# MM. Portfolio

Marcella Moussa's creative developer portfolio. It features an interactive homepage, an about story, selected projects, skills, contact information, and dedicated pages for Kira, Femi, Rong Xing, and Rushd.

## Run locally

Requires Node.js and npm.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build and check

```bash
npm run lint
npm run build
```

The build creates a static site in `out/`. Serve that directory with any static web host. If the site is hosted under a subpath, set `NEXT_PUBLIC_BASE_PATH` to that path when building, for example `/mm-portfolio`.

## Where to edit

| Area | File |
| --- | --- |
| Homepage sections and order | `src/app/page.tsx` |
| About story and chapter content | `src/components/AboutSection.tsx` |
| Projects | `src/components/ProjectsSection.tsx` and `src/app/projects/` |
| Global styles | `src/app/globals.css` |
| Images and audio | `public/assets/` and `public/audio/` |

Built with Next.js, React, TypeScript, Tailwind CSS, and Framer Motion. The site includes optional background audio and respects reduced motion preferences.
