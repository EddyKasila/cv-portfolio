# Edwin Nguli - Professional CV/Portfolio

A modern, responsive CV/portfolio website built with Astro, Bootstrap 5, and SCSS. Features a clean design with smooth animations, dark/light theme toggle, and professional presentation of skills and experience.

## 🚀 Features

- **Modern Design**: Clean, professional layout with glassmorphism effects
- **Responsive**: Fully responsive design that works on all devices
- **Dark/Light Theme**: Toggle between dark and light modes
- **Smooth Animations**: AOS (Animate On Scroll) library integration
- **Fast Performance**: Built with Astro for optimal performance
- **SEO Optimized**: Proper meta tags and semantic HTML
- **Accessible**: WCAG compliant design patterns

## 🛠️ Tech Stack

- **Framework**: [Astro](https://astro.build/) - Modern static site generator
- **Styling**: SCSS with Bootstrap 5
- **Icons**: Font Awesome 6
- **Animations**: AOS (Animate On Scroll)
- **Fonts**: Inter & Poppins from Google Fonts

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/EddyKasila/cv-portfolio.git
cd cv-portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:4321](http://localhost:4321) in your browser

## 🏗️ Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment.

## 📁 Project Structure

```
src/
├── components/          # Astro components
│   ├── About.astro
│   ├── Experience.astro
│   ├── Education.astro
│   ├── Skills.astro
│   ├── Interests.astro
│   ├── Awards.astro
│   └── Navigation.astro
├── data/
│   └── cv.ts           # CV data and content
├── layouts/
│   └── Layout.astro    # Main layout template
├── pages/
│   └── index.astro     # Home page
└── styles/
    └── scss/           # SCSS stylesheets
        ├── styles.scss
        ├── _global.scss
        ├── variables/
        ├── components/
        └── sections/
```

## 🎨 Customization

### Updating Content
Edit `src/data/cv.ts` to update your personal information, experience, education, and skills.

### Styling
- Colors: Modify `src/styles/scss/variables/_colors.scss`
- Typography: Update `src/styles/scss/variables/_typography.scss`
- Layout: Customize spacing in `src/styles/scss/variables/_spacing.scss`

### Adding Sections
1. Create a new component in `src/components/`
2. Import and use it in `src/pages/index.astro`
3. Add corresponding styles in `src/styles/scss/sections/`

## 🚀 Deployment

This project can be deployed to any static hosting service:

- **Vercel**: Connect your GitHub repository
- **Netlify**: Drag and drop the `dist/` folder
- **GitHub Pages**: Use GitHub Actions for automated deployment
- **AWS S3**: Upload the `dist/` folder contents

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Edwin Nguli**
- LinkedIn: [edwinkasila](https://www.linkedin.com/in/edwinkasila)
- Email: eddynguli@gmail.com

---

Built with ❤️ using Astro