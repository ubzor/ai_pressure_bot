import { VercelRequest, VercelResponse } from "@vercel/node";
import { bot } from "./bot";

export default async (req: VercelRequest, res: VercelResponse) => {
    try {
        await bot.handleUpdate(req.body);
        res.status(200).send("OK");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error");
    }
};
