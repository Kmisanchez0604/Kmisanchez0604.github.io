import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
import { OpenAI } from "openai";
import express from 'express';
import { HfInference } from "@huggingface/inference";

dotenv.config();

const app = express();
const port = 3300;

app.listen(port, () => {
    console.log(`Server is running on https://kmisanchez0604-github-io.onrender.com`);
});

// Configuración de CORS
app.use(cors({
    origin: 'http://127.0.0.1:5500',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

const client = new HfInference("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");

app.post('/chat', async (req, res) => {
    let out = "";
    const { type, age, parentName, childName } = req.body;
    console.log({ type, age, parentName, childName });

    // Crear el prompt usando la función createPrompt
    const prompt = createPrompt(type, getStage(age), parentName, childName);

    const stream = client.chatCompletionStream({
        model: "mistralai/Mistral-Nemo-Instruct-2407",
        messages: [
            { role: "user", content: prompt }
        ],
        max_tokens: 500
    });
    console.log(prompt);

    for await (const chunk of stream) {
        if (chunk.choices && chunk.choices.length > 0) {
            const newContent = chunk.choices[0].delta.content;
            out += newContent;
        }
    }

    // Imprimir la respuesta en consola
    console.log(out);

    res.status(200).json({
        "Response": "Información Obtenida!",
        "data": {
            "Type": req.body.type,
            "Edad": req.body.age,
            "Padre": req.body.parentName,
            "Pequeno": req.body.childName,
            "Output": out
        }
    });
});

// Función para determinar la etapa según la edad
function getStage(age) {
    if (age <= 24) return 'Bebé (0-24 meses)';
    if (age <= 144) return 'Niño (2-12 años)';
    return 'Adolescente (12-18 años)';
}

// Función para crear el prompt según el tipo de ayuda y la etapa
function createPrompt(type, stage, parentName, childName) {
    let prompt = `Eres un asesor de crianza que ayuda a ${parentName} con su hijo ${childName}, que está en la etapa de ${stage}. `;
    switch(type) {
        case 'advice':
            prompt += "Proporciona un consejo general sobre cómo manejar situaciones comunes en esta etapa.";
            break;
        case 'psychological_help':
            prompt += "Ofrece una recomendación de apoyo psicológico para esta etapa.";
            break;
        case 'stage_guide':
            prompt += "Describe eventos y comportamientos típicos de esta etapa que ayuden a los padres a entender el desarrollo de su hijo.";
            break;
    }
    return prompt;
}
