import { webhookCallback } from 'grammy'

import bot from '../src/bot'

console.log('bot imported')

export default webhookCallback(bot, 'https')