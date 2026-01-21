# Portfolio Data Configuration

This directory contains all the configurable data for your portfolio website. Simply edit these JSON files to update your portfolio content without touching any code!

## 📁 File Structure

### `projects.json`
Contains all your projects and publications.

**Structure:**
- `categories`: Array of filter categories (e.g., "All", "Software", "Hardware", "Publication")
- `projects`: Array of project objects with:
  - `id`: Unique identifier
  - `name`: Project name
  - `description`: Short description
  - `image`: Path to image (relative to `/public`)
  - `link`: URL to project/publication
  - `tag`: Array of categories this project belongs to

**Example:**
```json
{
  "id": 8,
  "name": "New Project",
  "description": "Description of your new project",
  "image": "/proj/new-project.png",
  "link": "https://github.com/username/project",
  "tag": ["All", "Software"]
}
```

### `about.json`
Contains your bio, skills, education, and certifications.

**Structure:**
- `image`: Path to your profile image
- `title`: Main title text
- `description`: Object with `primary` and `secondary` text
- `skills`: Array of skill names
- `education`: Array of education objects
  - `degree`: Degree name
  - `institution`: School name
  - `gpa`: GPA value
  - `period`: Time period (e.g., "2021 - 2025")
- `specializations`: Array of specialization names
- `certifications`: Array of certification names

### `hero.json`
Contains the hero section content.

**Structure:**
- `image`: Path to hero image
- `title`: Main headline
- `name`: Your name
- `roles`: Array of roles for typing animation
- `roleAnimationDelay`: Delay in ms between role changes
- `shortDescription`: Brief description line 1
- `shortDescriptionLine2`: Brief description line 2
- `detailedDescription`: Object with:
  - `intro`: Introduction text
  - `technologies`: Array of technology names
  - `webDev`: Web development framework
  - `languages`: Array of programming languages
  - `outro`: Closing text
- `buttons`: Array of button objects
  - `text`: Button text
  - `link`: Button URL
  - `type`: "primary", "secondary", or "tertiary"
  - `external`: true/false for external links

### `contact.json`
Contains contact information and social media links.

**Structure:**
- `email`: Your email address
- `phone`: Object with `display` and `link` formats
- `description`: Contact section description
- `socialMedia`: Array of social media objects
  - `platform`: Platform name
  - `url`: Profile URL
  - `icon`: Icon name ("faGithub" or "faLinkedin")
- EmailJS is configured via environment variables:
  - `NEXT_PUBLIC_EMAILJS_SERVICE_ID`
  - `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`
  - `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`

## 🚀 Quick Start

1. **Add a new project:**
   - Open `projects.json`
   - Add a new object to the `projects` array
   - Add your project image to `/public/proj/`
   - The website will automatically update!

2. **Update skills:**
   - Open `about.json`
   - Add/remove items from the `skills` array

3. **Change hero text:**
   - Open `hero.json`
   - Edit any text fields or add new roles to the typing animation

4. **Update contact info:**
   - Open `contact.json`
   - Update email, phone, or social media links

## 💡 Tips

- All image paths are relative to the `/public` directory
- After making changes, the dev server will hot-reload automatically
- Use proper JSON syntax (quotes around strings, commas between items)
- Keep descriptions concise for better UX
- Test your changes locally before deploying

## 🎨 Adding New Images

1. Place images in the appropriate `/public` subdirectory:
   - Projects: `/public/proj/`
   - Publications: `/public/publication/`
   - Profile: `/public/Images/`
   - Hero: `/public/`

2. Reference them in JSON with the path starting from `/public`:
   ```json
   "image": "/proj/my-image.png"
   ```

## 📝 Validation

Make sure your JSON is valid:
- Use proper quotes around all strings
- Don't forget commas between array items
- No trailing commas after the last item
- Check for matching brackets `{}` and `[]`

You can use online JSON validators if needed!
