const { ipcRenderer } = require('electron');

// التحكم بالنافذة
function closeApp() { ipcRenderer.send('close-app'); }
function minimizeApp() { ipcRenderer.send('minimize-app'); }

const contentDiv = document.getElementById('content');
const audioPlayer = document.getElementById('audio-player');
let activeInterval = null;

// === البيانات الافتراضية التي طلبتها ===
const defaultData = [
    { title: 'تسجيل الحضور واستقبال المشاركين', duration: '15' },   // 8:00 - 8:15
    { title: 'مقدمة وتعريف بورشة العمل وأهدافها', duration: '60' }, // 8:15 - 9:15
    { title: 'الجلسة الأولى: المفاهيم الأساسية والمادة العلمية', duration: '60' }, // 9:30 - 10:30
    { title: 'استراحة قهوة', duration: '15' }, // 10:30 - 10:45
    { title: 'الجلسة الثانية: أنشطة تفاعلية / عمل جماعي', duration: '60' }, // 10:45 - 11:45
    { title: 'جلسة الأسئلة والأجوبة (Q&A)', duration: '15' } // 11:45 - 12:00
];

window.onload = loadData;

function saveData() {
    const items = [];
    document.querySelectorAll('.agenda-item').forEach(div => {
        items.push({
            title: div.querySelector('.title-input').value,
            duration: div.querySelector('.time-input').value
        });
    });
    localStorage.setItem('workshopData_v3', JSON.stringify(items));
}

function loadData() {
    // حاول جلب البيانات المحفوظة، إذا لم توجد استخدم البيانات الافتراضية
    let data = JSON.parse(localStorage.getItem('workshopData_v3'));
    
    if (!data || data.length === 0) {
        data = defaultData;
    }
    
    contentDiv.innerHTML = ''; // مسح المحتوى القديم
    data.forEach(item => addNewItem(item.title, item.duration));
}

function addNewItem(title = 'عنوان جديد', duration = '10') {
    const div = document.createElement('div');
    div.className = 'agenda-item';
    
    div.innerHTML = `
        <div class="item-info">
            <input type="text" class="title-input" value="${title}" oninput="saveData()">
            <div class="time-wrapper">
                <span>المدة:</span>
                <input type="number" class="time-input" value="${duration}" oninput="saveData()">
                <span>دقيقة</span>
            </div>
        </div>
        
        <div class="controls-wrapper">
            <span class="timer-display" style="display:none">00:00</span>
            <button class="icon-btn play-btn" onclick="toggleTimer(this)">&#9658;</button>
            <button class="icon-btn delete-btn" onclick="deleteItem(this)">&#128465;</button>
        </div>
    `;
    
    contentDiv.appendChild(div);
    saveData();
}

function deleteItem(btn) {
    if(confirm('حذف هذا البند؟')) {
        btn.closest('.agenda-item').remove();
        saveData();
    }
}

function toggleTimer(btn) {
    const item = btn.closest('.agenda-item');
    const display = item.querySelector('.timer-display');
    const inputTime = item.querySelector('.time-input');
    
    // حالة الإيقاف
    if (item.classList.contains('active')) {
        clearInterval(activeInterval);
        item.classList.remove('active');
        display.style.display = 'none';
        btn.innerHTML = '&#9658;'; // Play icon
        return;
    }

    // إيقاف أي مؤقت آخر نشط حالياً
    document.querySelectorAll('.agenda-item').forEach(el => {
        el.classList.remove('active');
        el.querySelector('.timer-display').style.display = 'none';
        el.querySelector('.play-btn').innerHTML = '&#9658;';
    });
    if (activeInterval) clearInterval(activeInterval);

    // تشغيل المؤقت الجديد
    item.classList.add('active');
    display.style.display = 'block';
    btn.innerHTML = '&#10074;&#10074;'; // Pause icon
    
    let totalSeconds = parseInt(inputTime.value) * 60;
    
    // تحديث فوري
    updateDisplay(display, totalSeconds);

    activeInterval = setInterval(() => {
        totalSeconds--;
        updateDisplay(display, totalSeconds);
        
        if (totalSeconds <= 0) {
            clearInterval(activeInterval);
            // === هنا كان الخطأ السابق، تم تصحيحه ===
            display.style.color = '#e81123'; // اللون الأحمر
            display.textContent = "انتهى";
            
            // تشغيل الصوت
            if(audioPlayer) {
                audioPlayer.currentTime = 0;
                audioPlayer.play().catch(e => console.log("تأكد من وجود ملف الصوت"));
            }

            // وميض للتنبيه
            let flash = 0;
            const flashInt = setInterval(() => {
                item.style.backgroundColor = flash % 2 === 0 ? '#4a1b1b' : '#252526';
                flash++;
                if(flash > 6) { 
                    clearInterval(flashInt); 
                    item.style.backgroundColor = ''; 
                    item.classList.remove('active');
                    btn.innerHTML = '&#9658;';
                }
            }, 300);
        }
    }, 1000);
}

function updateDisplay(element, seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    element.textContent = `${m}:${s < 10 ? '0' : ''}${s}`;
}