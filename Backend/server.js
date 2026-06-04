require("dotenv").config()
const path = require("path")
const express = require("express")
const app = require("./src/app")
const connectToDB = require("./src/config/database")

connectToDB()

// Serve React static assets if running in a production cloud environment
if (process.env.NODE_ENV === 'production') {
    // Points up and over to your Frontend/dist directory
    app.use(express.static(path.join(__dirname, '../Frontend/dist')))

    // Catch-all handler routes browser page refreshes straight back to React Router
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../Frontend', 'dist', 'index.html'))
    })
}

// Dynamically use Render's assigned port, or default to 3000 locally
const PORT = process.env.PORT || 3000

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

// CRITICAL OVERRIDE: Extend server connection lifecycle to 2 minutes (120,000ms)
// This keeps the request open while Gemini builds content and Puppeteer compiles the single-page layout
server.timeout = 120000