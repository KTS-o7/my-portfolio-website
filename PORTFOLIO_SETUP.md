# Portfolio Website - JSON Configuration Setup

## ✅ What's Been Done

Your portfolio website has been refactored to use JSON files for all content! You can now easily update your portfolio by editing simple JSON files instead of modifying React code.

## 📂 Changes Made

### New Data Files Created
All portfolio content is now in `/src/data/`:

1. **`projects.json`** - All your projects and publications
2. **`about.json`** - Skills, education, certifications
3. **`hero.json`** - Hero section content and buttons
4. **`contact.json`** - Contact information and social links

### Components Updated
The following components now load data from JSON:

1. **`Projects.tsx`** - Reads from `projects.json`
2. **`About.tsx`** - Reads from `about.json`
3. **`Hero.tsx`** - Reads from `hero.json`
4. **`Contact.tsx`** - Reads from `contact.json`

### Configuration Updated
- **`tsconfig.json`** - Added path aliases for clean imports

## 🎯 How to Use

### Adding a New Project

1. Open `/src/data/projects.json`
2. Add a new entry to the `projects` array:

```json
{
  "id": 8,
  "name": "My Awesome Project",
  "description": "This is what my project does...",
  "image": "/proj/awesome-project.png",
  "link": "https://github.com/yourusername/project",
  "tag": ["All", "Software"]
}
```

3. Save the file - the website updates automatically!

### Updating Your Skills

1. Open `/src/data/about.json`
2. Modify the `skills` array:

```json
"skills": [
  "Python",
  "C++",
  "New Skill Here"
]
```

### Changing Hero Text

1. Open `/src/data/hero.json`
2. Edit any text field:

```json
"title": "Your New Title",
"shortDescription": "Your new description"
```

### Updating Contact Info

1. Open `/src/data/contact.json`
2. Update email, phone, or social links

## 🚀 Running the Website

**Development:**
```bash
npm run dev
```

**Build for Production:**
```bash
npm run build
npm start
```

## 📝 Important Notes

- All your existing content has been preserved in the JSON files
- Images should be placed in `/public/` subdirectories
- The website automatically hot-reloads when you save JSON changes
- See `/src/data/README.md` for detailed documentation

## 🎨 Directory Structure

```
my-portfolio-website/
├── public/
│   ├── proj/           # Project images
│   ├── publication/    # Publication images
│   ├── Images/         # Profile images
│   └── Hero.png        # Hero section image
├── src/
│   ├── app/
│   │   └── components/ # React components
│   └── data/           # 🆕 Your editable content!
│       ├── projects.json
│       ├── about.json
│       ├── hero.json
│       ├── contact.json
│       └── README.md
└── package.json
```

## 💡 Benefits

✅ **Easy Updates** - Edit JSON files, not code  
✅ **No Coding Required** - Simple text editing  
✅ **Version Control Friendly** - Track content changes  
✅ **Scalable** - Add unlimited projects easily  
✅ **Type Safe** - TypeScript ensures data integrity  
✅ **Hot Reload** - See changes instantly

## 🔄 Next Steps

1. Browse to `http://localhost:3001` (or the port shown in terminal)
2. Verify everything looks correct
3. Try editing a JSON file and watch it update!
4. Add your new content
5. Deploy when ready

Enjoy your new easy-to-maintain portfolio! 🎉

