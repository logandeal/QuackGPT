const gpt_tokenizer = require('gpt-tokenizer/cjs/model/gpt-3.5-turbo')
const OpenAI = require('openai')

const apiKey = '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'
const org = 'org-68QuWVk4cgE92XSCY3hpiDyl'
const openai = new OpenAI({
    apiKey: apiKey,
    organization: org
})

// models will be tried in sorted order
const models = [
    {
        name: "gpt-3.5-turbo",
        maxContext: 4096
    },
    {
        name: "gpt-3.5-turbo-0125",
        maxContext: 16385
    }
]

class Quacker {
    constructor(initialContext = "You are acting as a programmer's rubber duck. Programmers often talk to rubber ducks to work through problems. You will be asked programming questions, but you may also be chatted with in English. Please answer these questions as helpfully as possible, but also as briefly as possible. If you don't have enough information, ask for whatever you need.") {
        this.messages = [{role: "system", content: initialContext}]
        this.model = models[0]
    }

    addMessage(newMessage) {
        const newMessageObj = {role: "user", content: newMessage}
        const newMessages = this.messages.concat([newMessageObj])

        for (const model of models) {
            if (gpt_tokenizer.isWithinTokenLimit(newMessages, model.maxContext)) {
                this.model = model
                this.messages.push(newMessageObj)
                return true
            }
        }

        return false
    }

    async summarizeMessage(bigMessage, targetLength = this.model.maxContext, maxTries = 5) {
        const summarizer = new Quacker("Rather than responding to my prompts, you need to summarize anything I say to you and tell me the summary. Do not say anything but the summary. Do not say 'The summary is' or anything like that, just say exactly the summary, no more and no less. If and only if the summary you want to give contains more tokens than the original response, try to think of another response. If you still can't think of a shorter response after 5 tries, say 'Error: the prompt cannot be summarized.' exactly like that.")

        let workingSum = bigMessage
        for (let i = maxTries; i > 0; i--) {
            summarizer.addMessage(workingSum)
            workingSum = await summarizer.getFirstResponse()

            if (workingSum == "Error: the prompt cannot be summarized.") {
                console.log(workingSum)
                break
            }

            if (gpt_tokenizer.isWithinTokenLimit(workingSum, targetLength)) {
                return workingSum
            }
        }

        throw new TooBigToSumError(bigMessage, maxTries)
    }

    async sendMessages() {
        const completion = await openai.chat.completions.create({
            messages: this.messages,
            model: this.model.name,
        });

        return completion
    }

    async getFirstResponse() {
        const completion = await this.sendMessages()

        return completion.choices[0].message.content
    }

    async test() {
        const summary = await this.summarizeMessage("Tell me how I might go about calculating 4 + 4 in code.", 50, 2)
        console.log(summary)

        this.addMessage(summary)

        const response = await this.getFirstResponse()

        console.log(response);
    }
}

class TooBigToSumError extends Error {
    constructor(bigMessage, steps) {
        super("The following message was too big to summarize in " + steps + " steps: " + bigMessage)
    }
}

module.exports = Quacker
