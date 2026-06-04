const startBtn =
document.getElementById("startBtn");

const chatBox =
document.getElementById("chatBox");

const SpeechRecognition =
window.SpeechRecognition ||
window.webkitSpeechRecognition;

const recognition =
new SpeechRecognition();

recognition.lang = "en-US";

recognition.interimResults = false;

recognition.maxAlternatives = 1;

startBtn.addEventListener("click", () => {

    recognition.start();

    startBtn.innerText =
    "🎤 Listening...";
});

recognition.onresult = (event) => {

    const userText =
    event.results[0][0].transcript;

    addUserMessage(userText);

    getAIResponse(userText);

    startBtn.innerText =
    "🎤 Start Speaking";
};

recognition.onerror = () => {

    startBtn.innerText =
    "🎤 Start Speaking";
};

function addUserMessage(text){

    chatBox.innerHTML += `
        <div class="user-message">
            ${text}
        </div>
    `;

    chatBox.scrollTop =
    chatBox.scrollHeight;
}

function addBotMessage(text){

    chatBox.innerHTML += `
        <div class="bot-message">
            ${text}
        </div>
    `;

    chatBox.scrollTop =
    chatBox.scrollHeight;
}

async function getAIResponse(message){

    try{

        const response = await fetch(
            "http://localhost:5000/voice-chat",
            {
                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify({
                    message
                })
            }
        );

        const data =
        await response.json();

        addBotMessage(data.reply);

        speakText(data.reply);

    }
    catch(error){

        console.error(error);

        addBotMessage(
            "Sorry, something went wrong."
        );
    }
}

function addBotMessage(text){

    chatBox.innerHTML += `
        <div class="bot-message">
            ${text}
        </div>
    `;

    chatBox.scrollTop =
    chatBox.scrollHeight;
}

function speakText(text){

    window.speechSynthesis.cancel();

    const speech =
    new SpeechSynthesisUtterance(text);

    speech.lang = "en-US";

    speech.rate = 1;

    speech.pitch = 1;

    window.speechSynthesis.speak(speech);
}