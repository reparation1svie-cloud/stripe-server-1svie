import express from "express";
import Stripe from "stripe";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Création session Stripe dynamique
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
            success_url: "https://TON-SITE/success",
            cancel_url: "https://TON-SITE/cancel"
        });

        res.json({ url: session.url });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(10000, () => console.log("Stripe server running"));
