
const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

// ⚠️ Intercepta requisição OPTIONS para liberar CORS
app.options("/api/gerar-pix", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.status(204).end();
});

app.post("/api/gerar-pix", async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  try {
    const { amount } = req.body;

    const response = await axios.post(
      "https://api.ghostspaysv1.com/api/v1/transaction.purchase",
      {
        name: "Cliente Web",
        email: "cliente@teste.com",
        cpf: "12583096885",
        phone: "+5511999999999",
        paymentMethod: "PIX",
        amount: amount,
        traceable: true,
        items: [
          {
            unitPrice: amount,
            title: "Assinatura Premium",
            quantity: 1,
            tangible: false
          }
        ]
      },
      {
        headers: {
          Authorization: "6aa9f7a7-bd4b-4046-9e84-40a87af3a198",
          "Content-Type": "application/json"
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      error: "Erro ao criar pagamento",
      details: error.response?.data || error.message
    });
  }
});

module.exports = (req, res) => app(req, res);
