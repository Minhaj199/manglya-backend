var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { v4 as uuidv4 } from 'uuid';
import Stripe from 'stripe';
const publicshKey = process.env.STRIPE_PUBLISH_KEY || '';
const stripe = new Stripe(publicshKey);
export function doStripePayment(plan, token, email) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!email) {
            throw new Error('email not found');
        }
        let changedEmail = email;
        try {
            const idempotencyKey = uuidv4();
            const result = yield stripe.customers.create({
                email: changedEmail,
                source: token === null || token === void 0 ? void 0 : token.id
            });
            const result2 = yield stripe.charges.create({
                amount: parseInt(plan.amount) * 100,
                currency: 'INR',
                customer: result.id,
                description: plan.name
            }, { idempotencyKey });
            return (result2.status);
        }
        catch (error) {
            console.log(error);
            throw new Error(error);
        }
    });
}
