const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());

const YANDEX_API_KEY = "fbfb2f4c-6c30-42c2-b5ac-4074e467ac57";

app.get("/api/flights", async (req, res) => {
    try {
        const {
            station = "s9600216",
            date = "2025-05-05" } = req.query;
        const url = `https://api.rasp.yandex.net/v3.0/schedule/?apikey=${YANDEX_API_KEY}&station=${station}&transport_types=plane&event=departure&date=${date}`;

        const response = await axios.get(url);
        res.json(response.data.schedule);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});