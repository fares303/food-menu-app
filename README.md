# Food Menu App

A digital menu application for restaurants built with React and Supabase.

## Features

- Browse menu items by category
- View item details, prices, and images
- See popular items and daily specials
- Admin panel for menu management
- Works offline with local storage fallback
- Online database with Supabase

## Technologies Used

- React
- Vite
- React Router
- Framer Motion
- Supabase (Backend as a Service)
- GitHub Pages (Deployment)

## Deployment Instructions

### Setting Up GitHub Repository

1. Create a new GitHub repository named `food-menu-app`
2. Initialize Git in your local project:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOURUSERNAME/food-menu-app.git
   git push -u origin main
   ```

### Manual Deployment

1. Update the `homepage` field in `package.json` with your GitHub username
2. Build and deploy the app:
   ```bash
   npm run deploy
   ```

### Automated Deployment with GitHub Actions

The repository includes a GitHub Actions workflow that automatically deploys the app to GitHub Pages when you push to the main branch.

To set up the GitHub Actions workflow:

1. Go to your GitHub repository
2. Click on "Settings" > "Secrets and variables" > "Actions"
3. Add the following repository secrets:
   - `VITE_SUPABASE_URL`: Your Supabase URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key

## Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Supabase Setup

See the [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) file for instructions on setting up your Supabase project.

## License

MIT
