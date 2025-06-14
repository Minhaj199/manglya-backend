
import Stripe from "stripe";


const publicshKey = process.env.STRIPE_PUBLISH_KEY || "";
 export const stripe = new Stripe(publicshKey);