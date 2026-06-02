# Joke Generator

A simple, modern web application that generates random jokes using the JokeAPI.

## 🎯 Features

✅ Generate random jokes with one click
✅ Multiple joke categories (General, Programming, Knock-knock, etc.)
✅ Two-part jokes support (Setup + Delivery)
✅ Single-line jokes
✅ Copy joke to clipboard
✅ Share jokes on social media
✅ Responsive design (mobile + desktop)
✅ No dependencies - pure HTML/CSS/JavaScript
✅ Fast loading
✅ Beautiful UI with animations

## 📁 Project Structure

```
joke-generator/
├── index.html          # Main HTML file
├── styles.css          # Styling
├── script.js           # JavaScript logic
└── README.md           # Documentation
```

## 🚀 Quick Start

### Option 1: Open in Browser (Simplest)

1. Download or clone the repository
2. Open `index.html` in your browser
3. Click "Get Joke" button
4. Enjoy! 😂

### Option 2: Local Server (Recommended)

```bash
# Using Python 3
python -m http.server 8000

# OR using Python 2
python -m SimpleHTTPServer 8000

# OR using Node.js (http-server)
npx http-server
```

Then open: **http://localhost:8000**

## 🎨 Features Explained

### Categories
- **General** - General jokes for everyone
- **Programming** - Programming and tech jokes
- **Knock-knock** - Classic knock-knock jokes
- **Random** - All categories mixed

### Copy & Share
- **Copy** - Copy joke to clipboard
- **Share** - Share on Twitter or Facebook

### Dark Mode
- Toggle dark/light theme with the moon/sun icon

## 🔧 Technical Details

**API Used:** [JokeAPI](https://jokeapi.dev/)

**Endpoints:**
- `https://v2.jokeapi.dev/joke/Any` - Get random joke
- `https://v2.jokeapi.dev/joke/{category}` - Get joke by category

**JavaScript Features:**
- Fetch API for API calls
- Error handling
- LocalStorage for theme preference
- Clipboard API
- Responsive design

## 📝 How It Works

1. User clicks "Get Joke" button
2. JavaScript sends request to JokeAPI
3. API returns joke (single or two-part)
4. Joke is displayed with animation
5. User can copy, share, or get another joke

## 🌐 Browser Support

✅ Chrome
✅ Firefox
✅ Safari
✅ Edge
✅ Mobile browsers

## 📄 License

MIT

## 🙏 Credits

- Jokes provided by [JokeAPI](https://jokeapi.dev/)
- Created with ❤️
