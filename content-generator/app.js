document.addEventListener('DOMContentLoaded', function() {
    const root = document.getElementById('root');
    
    root.innerHTML = `
        <div class="max-w-2xl mx-auto p-4">
            <div class="bg-white rounded-lg shadow-lg p-6">
                <h1 class="text-2xl font-bold text-center mb-6">AI Social Media Content Generator</h1>
                
                <div class="space-y-6">
                    <div>
                        <label class="block text-sm font-medium mb-2">Choose Platform</label>
                        <div class="flex gap-3">
                            <button class="flex-1 p-3 rounded-lg border" onclick="setPlatform('instagram')">Instagram</button>
                            <button class="flex-1 p-3 rounded-lg border" onclick="setPlatform('facebook')">Facebook</button>
                            <button class="flex-1 p-3 rounded-lg border" onclick="setPlatform('twitter')">Twitter</button>
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm font-medium mb-2">What's your topic?</label>
                        <input
                            type="text"
                            id="topicInput"
                            placeholder="e.g., New coffee shop opening, Fitness tips, Travel experiences"
                            class="w-full p-3 border rounded-lg"
                        />
                    </div>

                    <div>
                        <label class="block text-sm font-medium mb-2">Select Tone</label>
                        <select id="toneSelect" class="w-full p-3 border rounded-lg">
                            <option value="professional">Professional</option>
                            <option value="casual">Casual</option>
                            <option value="humorous">Humorous</option>
                            <option value="inspirational">Inspirational</option>
                        </select>
                    </div>

                    <button
                        onclick="generateContent()"
                        class="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        Generate Content
                    </button>

                    <div id="result" class="mt-6 hidden">
                        <div class="p-4 bg-gray-50 rounded-lg relative">
                            <pre id="generatedContent" class="whitespace-pre-wrap font-sans"></pre>
                            <button
                                onclick="copyContent()"
                                class="absolute top-2 right-2 p-2 rounded-lg hover:bg-gray-200"
                            >
                                Copy
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    window.currentPlatform = 'instagram';
});

function setPlatform(platform) {
    window.currentPlatform = platform;
    // Highlight selected platform button
    document.querySelectorAll('button').forEach(btn => {
        if (btn.textContent.toLowerCase() === platform) {
            btn.classList.add('border-blue-500', 'bg-blue-50', 'text-blue-600');
        } else {
            btn.classList.remove('border-blue-500', 'bg-blue-50', 'text-blue-600');
        }
    });
}

async function generateContent() {
    const topic = document.getElementById('topicInput').value;
    const tone = document.getElementById('toneSelect').value;
    
    if (!topic) return;

    const button = document.querySelector('button[onclick="generateContent()"]');
    button.textContent = 'Generating...';
    button.disabled = true;

    try {
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: {
                    platform: window.currentPlatform,
                    topic: topic,
                    tone: tone
                }
            }),
        });
        
        const data = await response.json();
        
        document.getElementById('result').classList.remove('hidden');
        document.getElementById('generatedContent').textContent = data.content;
    } catch (error) {
        console.error('Error:', error);
    } finally {
        button.textContent = 'Generate Content';
        button.disabled = false;
    }
}

function copyContent() {
    const content = document.getElementById('generatedContent').textContent;
    navigator.clipboard.writeText(content);
    
    const copyButton = document.querySelector('button[onclick="copyContent()"]');
    const originalText = copyButton.textContent;
    copyButton.textContent = 'Copied!';
    setTimeout(() => {
        copyButton.textContent = originalText;
    }, 2000);
}
