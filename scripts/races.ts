// @ts-nocheck
const express = require('express')
const fs = require('fs')
const axios = require('axios')

const app = express()
const port = 5000

app.use(express.json())

async function fetchRaces() {
    try {
        const response = await axios.get('https://ergast.com/api/f1/2024.json')
        const content = JSON.stringify(response.data, null, 2) // formatage propre
    
        fs.writeFile('./src/data/local/races2024.json', content, (err) => {
          if (err) {
            console.error('Erreur d\'écriture:', err)
            return
          }
          console.log('Fichier écrit avec succès')
        })
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error)
      }
}

fetchRaces()