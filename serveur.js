import express from "express";
import Stripe from "stripe";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Route pour créer une session Stripe
app.post("/create-checkout-session", async (req, res) => {
    const { amount, model } = req.body;

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "eur",
                        product_data: { name: `Acompte réparation – ${model}` },
                        unit_amount: Math.round(amount * 100),
                    },
                    quantity: 1,
                }
            ],
            mode: "payment",
            
            // ⚠️ METS ICI LES URL DE TON VRAI SITE
            success_url: "https://ton-vrai-site.fr/success",
            cancel_url: "https://ton-vrai-site.fr/cancel"
        });

        res.json({ url: session.url });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Render impose d'utiliser process.env.PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Stripe server running on port " + PORT));
