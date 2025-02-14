import dotenv from "dotenv";
dotenv.config();

import { Bot, Keyboard } from "grammy";

import { prisma } from "./prisma";
import type { Entry } from "@prisma/client"; // Added type import

const token = process.env.BOT_TOKEN;
if (!token) throw new Error("BOT_TOKEN must be provided in env variables");

export const bot = new Bot(token);

const menu = new Keyboard()
    .text("новая запись")
    .row()
    .text("показать статистику");

// Command /start: explain bot usage and show menu
bot.command("start", async (ctx) => {
    const welcomeMsg = `Добро пожаловать! Этот бот поможет вести дневник давления.
Используйте кнопки в меню ниже для создания новой записи или просмотра статистики.`;
    await ctx.reply(welcomeMsg, { reply_markup: menu });
});

// Handle messages for menu actions and new data
bot.on("message:text", async (ctx) => {
    const text = ctx.message.text.trim();
    const userId = String(ctx.from?.id);

    if (text === "новая запись") {
        await ctx.reply(
            "Введите систолическое давление, диастолическое давление и пульс через пробел, например: 120 80 70"
        );
        return;
    }

    if (text === "показать статистику") {
        const entries = await prisma.entry.findMany({
            where: { telegramUserId: userId },
            orderBy: { createdAt: "asc" },
        });
        if (entries.length === 0) {
            await ctx.reply("Нет записей для отображения.", {
                reply_markup: menu,
            });
            return;
        }
        const stats = entries
            .map(
                (entry: Entry) => // Added type annotation for entry
                    `${new Date(entry.createdAt).toLocaleString()}: ${
                        entry.systolic
                    }/${entry.diastolic} мм.рт.ст, пульс: ${entry.pulse}`
            )
            .join("\n");
        await ctx.reply(stats, { reply_markup: menu });
        return;
    }

    // Validate input: expect three numbers separated by spaces
    const regex = /^(\d+)\s+(\d+)\s+(\d+)$/;
    const match = text.match(regex);
    if (match) {
        const [, systolic, diastolic, pulse] = match;
        try {
            await prisma.entry.create({
                data: {
                    telegramUserId: userId,
                    systolic: parseInt(systolic, 10),
                    diastolic: parseInt(diastolic, 10),
                    pulse: parseInt(pulse, 10),
                },
            });
            await ctx.reply("Запись успешно добавлена!", {
                reply_markup: menu,
            });
        } catch (error) {
            console.error(error);
            await ctx.reply("Ошибка при сохранении записи. Попробуйте снова.", {
                reply_markup: menu,
            });
        }
    } else {
        await ctx.reply(
            "Неверный формат данных. Введите 3 числа через пробел, например: 120 80 70",
            { reply_markup: menu }
        );
    }
});

// For local development
if (process.env.NODE_ENV !== "production") {
    bot.start();
}
