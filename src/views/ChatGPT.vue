<!-- 基于api版本的chatGPT -->
<template>
    <div class="container">
        <div class="chat-window">
            <div class="chat-header">
                <h1>ChatGPT对话界面</h1>
            </div>
            <div class="chat-history" id="chat-history">
                <!-- 对话记录显示在这里 -->
                <div
                    class="chat-message"
                    :class="item.role === 'user' ? 'chat-message-user' : 'chat-message-bot'"
                    v-for="(item, index) in currentChatList"
                    :key="index"
                >
                    <span :class="item.role === 'user' ? 'user' : 'bot'">
                        {{ item.content }}
                    </span>
                </div>
            </div>
            <div class="chat-input">
                <form id="chat-form">
                    <input
                        type="text"
                        id="chat-message"
                        v-model="inputText"
                        placeholder="请输入消息..."
                        :disabled="isLoading"
                    />
                    <button class="btn" @click="onClickSendBtn">发送</button>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import { Configuration, OpenAIApi } from 'openai';

const CHAT_GPT_API_KEY = '';

export default {
    name: 'ChatGPT',
    data() {
        return {
            isInit: false,
            isLoading: false,
            openAI: null,
            currentEngine: 'gpt-3.5-turbo',
            msgExample: [
                { role: 'user', content: '你好，很高兴认识你' },
                {
                    role: 'assistant',
                    content: '您好，请问我有什么可以帮助你的吗？',
                },
            ],
            currentChatList: [],
            inputText: '',
        };
    },

    components: {},

    methods: {
        onClickSendBtn() {
            console.log('HJJ 发送内容为：', this.inputText);
            this.sendMsg(this.inputText);
            this.isLoading = true;
            this.inputText = '';
        },
        initOpenAI() {
            const configuration = new Configuration({
                apiKey: CHAT_GPT_API_KEY,
            });
            this.openAI = new OpenAIApi(configuration);
            window.chatgpt = this;
        },
        sendMsg(msg) {
            const message = { role: 'user', content: msg };
            this.saveMsg(message);
            this.sendRequest();
        },
        saveMsg(message) {
            this.currentChatList.push(message);
        },
        async sendRequest() {
            const { data: result } = await this.openAI.createChatCompletion({
                model: 'gpt-3.5-turbo',
                messages: this.currentChatList,
            });
            const { choices } = result;
            if (choices && choices[0].message) {
                console.log('HJJ 接收内容为：', choices[0].message.content);
                this.saveMsg(choices[0].message);
            }

            this.isLoading = false;
        },
    },

    mounted() {
        if (!this.isInit) this.initOpenAI();
        this.isInit = true;
    },
};
</script>
<style lang="scss" scoped>
body {
    font-family: Arial, sans-serif;
}

.container {
    max-width: 800px;
    margin: 0 auto;
}

.chat-window {
    background-color: #f5f5f5;
    border-radius: 5px;
    box-shadow: 0px 0px 10px #ccc;
    padding: 10px;
    margin-top: 50px;
}

.chat-header h1 {
    margin: 0;
    font-size: 24px;
}

.chat-history {
    min-height: 400px;
    overflow-y: auto;
    margin-top: 10px;
}

.chat-message {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    text-align: left;
}

.chat-message-user {
    flex-direction: row-reverse;
}

.chat-message-bot {
    flex-direction: row;
}

.chat-message .user {
    background-color: #4caf50;
    color: #fff;
    padding: 5px 10px;
    border-radius: 5px;
    margin-right: 10px;
}

.chat-message .bot {
    background-color: #ddd;
    padding: 5px 10px;
    border-radius: 5px;
    margin-left: 10px;
}

.chat-input {
    margin-top: 10px;
}

.chat-input input[type='text'] {
    width: 70%;
    padding: 10px;
    border: none;
    border-radius: 5px;
    margin-right: 10px;
}

.chat-input .btn {
    background-color: #4caf50;
    color: #fff;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
}
</style>
