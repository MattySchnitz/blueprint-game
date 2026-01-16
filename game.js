// Floor plan data - Ted & Marshall's iconic NYC apartment
const FLOOR_PLAN = {
    name: "Ted & Marshall's Apartment",
    difficulty: "Medium",
    rooms: [
        { id: 1, name: "Living Room", x: 25, y: 35, width: 35, height: 30 },
        { id: 2, name: "Kitchen", x: 60, y: 35, width: 20, height: 25 },
        { id: 3, name: "Ted's Bedroom", x: 15, y: 10, width: 20, height: 25 },
        { id: 4, name: "Marshall's Bedroom", x: 35, y: 10, width: 20, height: 25 },
        { id: 5, name: "Bathroom", x: 55, y: 10, width: 15, height: 15 },
        { id: 6, name: "Entry/Hallway", x: 15, y: 65, width: 20, height: 15 },
        { id: 7, name: "Balcony", x: 60, y: 60, width: 20, height: 20 },
        { id: 8, name: "The Red Door", x: 15, y: 80, width: 10, height: 8 }
    ]
};

// Game state
let userAnswers = {};
let showResults = false;
let roomNames = [];

// Initialize game
function initGame() {
    // Shuffle room names
    roomNames = FLOOR_PLAN.rooms.map(r => r.name).sort(() => Math.random() - 0.5);
    
    // Render floor plan
    renderFloorPlan();
    
    // Render room list
    renderRoomList();
    
    // Setup event listeners
    document.getElementById('check-btn').addEventListener('click', checkAnswers);
    document.getElementById('reset-btn').addEventListener('click', resetGame);
    
    updateUI();
}

function renderFloorPlan() {
    const svg = document.getElementById('floor-plan');
    svg.innerHTML = '';
    
    FLOOR_PLAN.rooms.forEach(room => {
        // Create room rectangle
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', room.x);
        rect.setAttribute('y', room.y);
        rect.setAttribute('width', room.width);
        rect.setAttribute('height', room.height);
        rect.setAttribute('fill', '#475569');
        rect.setAttribute('stroke', '#1e293b');
        rect.setAttribute('stroke-width', '0.5');
        rect.classList.add('room');
        rect.dataset.roomId = room.id;
        rect.addEventListener('click', () => handleRoomClick(room.id));
        svg.appendChild(rect);
        
        // Room number
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', room.x + room.width / 2);
        text.setAttribute('y', room.y + room.height / 2 - 2);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', 'white');
        text.setAttribute('font-size', '3');
        text.setAttribute('font-weight', 'bold');
        text.classList.add('room-text');
        text.textContent = room.id;
        svg.appendChild(text);
        
        // User answer label (will be updated)
        const answerText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        answerText.setAttribute('x', room.x + room.width / 2);
        answerText.setAttribute('y', room.y + room.height / 2 + 2);
        answerText.setAttribute('text-anchor', 'middle');
        answerText.setAttribute('fill', 'white');
        answerText.setAttribute('font-size', '2');
        answerText.classList.add('room-label');
        answerText.id = `label-${room.id}`;
        svg.appendChild(answerText);
        
        // Correct answer (shown after checking)
        const correctText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        correctText.setAttribute('x', room.x + room.width / 2);
        correctText.setAttribute('y', room.y + room.height / 2 + 4);
        correctText.setAttribute('text-anchor', 'middle');
        correctText.setAttribute('font-size', '1.5');
        correctText.classList.add('room-answer');
        correctText.id = `answer-${room.id}`;
        correctText.style.display = 'none';
        svg.appendChild(correctText);
    });
}

function renderRoomList() {
    const roomList = document.getElementById('room-list');
    roomList.innerHTML = '';
    
    roomNames.forEach(name => {
        const div = document.createElement('div');
        div.className = 'room-item';
        div.textContent = name;
        roomList.appendChild(div);
    });
}

function handleRoomClick(roomId) {
    if (showResults) return;
    
    let message = '🎺 HIMYM Apartment - Select room name:\n\n';
    roomNames.forEach((name, i) => {
        message += `${i + 1}. ${name}\n`;
    });
    
    const input = prompt(message + '\nEnter the number (1-' + roomNames.length + '):');
    
    if (input) {
        const index = parseInt(input) - 1;
        if (index >= 0 && index < roomNames.length) {
            userAnswers[roomId] = roomNames[index];
            updateUI();
        }
    }
}

function checkAnswers() {
    showResults = true;
    let correct = 0;
    
    FLOOR_PLAN.rooms.forEach(room => {
        const rect = document.querySelector(`rect[data-room-id="${room.id}"]`);
        const answerLabel = document.getElementById(`answer-${room.id}`);
        
        if (userAnswers[room.id] === room.name) {
            correct++;
            rect.classList.add('correct');
        } else {
            rect.classList.add('incorrect');
        }
        
        rect.classList.add('checked');
        answerLabel.textContent = room.name;
        answerLabel.style.display = 'block';
    });
    
    document.getElementById('score-display').style.display = 'block';
    document.querySelector('.score-number').textContent = `${correct}/${FLOOR_PLAN.rooms.length}`;
    
    // Fun HIMYM-themed results messages
    if (correct === FLOOR_PLAN.rooms.length) {
        setTimeout(() => alert('🎺 Legendary! You know this apartment better than the Mosby Boys!'), 100);
    } else if (correct >= FLOOR_PLAN.rooms.length - 2) {
        setTimeout(() => alert('👔 Suit up! You almost nailed it!'), 100);
    } else {
        setTimeout(() => alert('🍺 Time to rewatch the series at MacLaren\'s!'), 100);
    }
    
    updateUI();
}

function resetGame() {
    userAnswers = {};
    showResults = false;
    
    // Clear all room styling
    document.querySelectorAll('.room').forEach(rect => {
        rect.classList.remove('correct', 'incorrect', 'checked');
        rect.setAttribute('fill', '#475569');
    });
    
    // Hide answer labels
    FLOOR_PLAN.rooms.forEach(room => {
        document.getElementById(`answer-${room.id}`).style.display = 'none';
    });
    
    document.getElementById('score-display').style.display = 'none';
    
    // Re-shuffle rooms
    roomNames = FLOOR_PLAN.rooms.map(r => r.name).sort(() => Math.random() - 0.5);
    renderRoomList();
    
    updateUI();
}

function updateUI() {
    const answerCount = Object.keys(userAnswers).length;
    const totalRooms = FLOOR_PLAN.rooms.length;
    
    // Update answer labels
    FLOOR_PLAN.rooms.forEach(room => {
        const label = document.getElementById(`label-${room.id}`);
        if (userAnswers[room.id] && !showResults) {
            label.textContent = userAnswers[room.id];
        } else if (!showResults) {
            label.textContent = '';
        }
    });
    
    // Update button states
    const checkBtn = document.getElementById('check-btn');
    const resetBtn = document.getElementById('reset-btn');
    
    document.getElementById('answer-count').textContent = `${answerCount}/${totalRooms}`;
    checkBtn.disabled = answerCount !== totalRooms;
    
    if (showResults) {
        checkBtn.style.display = 'none';
        resetBtn.style.display = 'block';
    } else {
        checkBtn.style.display = 'block';
        resetBtn.style.display = 'none';
    }
}

// Start the game when page loads
window.addEventListener('DOMContentLoaded', initGame);
