let userProfile = {
    name: '',
    age: 0,
    gender: '',
    diseases: [],
    habits: [],
    medication: '',
    diseaseLevel: '',
    priority: ''
};

let healthData = {
    bloodPressure: { systolic: 0, diastolic: 0 },
    bloodSugar: 0,
    steps: 0,
    sleep: 0,
    symptoms: []
};

let checkinData = {
    streak: 0,
    lastCheckin: null,
    todayCheckin: false
};

function loadData() {
    const savedProfile = localStorage.getItem('healthProfile');
    const savedCheckin = localStorage.getItem('checkinData');
    
    if (savedProfile) {
        userProfile = JSON.parse(savedProfile);
        fillProfileForm();
    }
    
    if (savedCheckin) {
        checkinData = JSON.parse(savedCheckin);
        checkStreak();
    }
    
    updateCheckinDisplay();
    updateGreeting();
}

function saveData() {
    localStorage.setItem('healthProfile', JSON.stringify(userProfile));
    localStorage.setItem('checkinData', JSON.stringify(checkinData));
}

function fillProfileForm() {
    if (userProfile.name) {
        document.getElementById('name').value = userProfile.name;
    }
    if (userProfile.age) {
        document.getElementById('age').value = userProfile.age;
    }
    if (userProfile.gender) {
        document.getElementById('gender').value = userProfile.gender;
    }
    if (userProfile.diseaseLevel) {
        document.getElementById('disease-level').value = userProfile.diseaseLevel;
    }
    if (userProfile.priority) {
        document.getElementById('priority').value = userProfile.priority;
    }
    if (userProfile.medication) {
        document.getElementById('medication').value = userProfile.medication;
    }
    
    userProfile.diseases.forEach(disease => {
        const checkbox = document.querySelector(`input[name="disease"][value="${disease}"]`);
        if (checkbox) checkbox.checked = true;
    });
    
    userProfile.habits.forEach(habit => {
        const checkbox = document.querySelector(`input[name="habit"][value="${habit}"]`);
        if (checkbox) checkbox.checked = true;
    });
}

function checkStreak() {
    const today = new Date().toDateString();
    const lastCheckin = checkinData.lastCheckin;
    
    if (lastCheckin) {
        const lastDate = new Date(lastCheckin);
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (lastDate.toDateString() === today) {
            checkinData.todayCheckin = true;
        } else if (lastDate.toDateString() !== yesterday.toDateString()) {
            checkinData.streak = 0;
        }
    }
}

function updateCheckinDisplay() {
    const checkinText = document.querySelector('.checkin-text');
    const checkinIcon = document.querySelector('.checkin-icon');
    const streakDisplay = document.getElementById('checkin-streak');
    const checkinPrompt = document.getElementById('checkin-prompt');
    
    if (checkinData.todayCheckin) {
        if (checkinText) checkinText.textContent = '今日已打卡';
        if (checkinIcon) checkinIcon.textContent = '✅';
        if (checkinPrompt) checkinPrompt.style.display = 'none';
    } else {
        if (checkinText) checkinText.textContent = '今日未打卡';
        if (checkinIcon) checkinIcon.textContent = '📅';
        if (checkinPrompt) checkinPrompt.style.display = 'flex';
    }
    
    if (streakDisplay) {
        streakDisplay.textContent = `连续打卡: ${checkinData.streak}天`;
    }
}

function updateGreeting() {
    const hour = new Date().getHours();
    let greeting = '';
    
    if (hour < 6) {
        greeting = '夜深了，注意休息！';
    } else if (hour < 9) {
        greeting = '早上好！';
    } else if (hour < 12) {
        greeting = '上午好！';
    } else if (hour < 14) {
        greeting = '中午好！';
    } else if (hour < 18) {
        greeting = '下午好！';
    } else if (hour < 22) {
        greeting = '晚上好！';
    } else {
        greeting = '夜深了，注意休息！';
    }
    
    const greetingText = document.getElementById('greeting-text');
    const greetingName = document.getElementById('greeting-name');
    
    if (greetingText) greetingText.textContent = greeting;
    if (greetingName) {
        greetingName.textContent = userProfile.name ? `${userProfile.name}` : '';
    }
}

function getGreetingWithName() {
    const hour = new Date().getHours();
    let timeGreeting = '';
    
    if (hour >= 5 && hour < 12) timeGreeting = '早上好';
    else if (hour >= 12 && hour < 18) timeGreeting = '下午好';
    else timeGreeting = '晚上好';
    
    if (userProfile.name) {
        return `${timeGreeting}，${userProfile.name}！`;
    }
    return `${timeGreeting}！`;
}

function showModal(title, message, onConfirm) {
    const modal = document.getElementById('confirm-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');
    const confirmBtn = document.getElementById('modal-confirm');
    const cancelBtn = document.getElementById('modal-cancel');
    
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modal.classList.add('show');
    
    const handleConfirm = () => {
        modal.classList.remove('show');
        confirmBtn.removeEventListener('click', handleConfirm);
        cancelBtn.removeEventListener('click', handleCancel);
        if (onConfirm) onConfirm();
    };
    
    const handleCancel = () => {
        modal.classList.remove('show');
        confirmBtn.removeEventListener('click', handleConfirm);
        cancelBtn.removeEventListener('click', handleCancel);
    };
    
    confirmBtn.addEventListener('click', handleConfirm);
    cancelBtn.addEventListener('click', handleCancel);
}

function closePrivacyBanner() {
    const banner = document.getElementById('privacy-banner');
    if (banner) {
        banner.style.display = 'none';
        document.querySelector('.app-layout').style.paddingTop = '0';
        document.querySelector('.sidebar').style.top = '0';
    }
}

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
    
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    const activeNav = document.querySelector(`.nav-item[data-page="${pageId}"]`);
    if (activeNav) {
        activeNav.classList.add('active');
    }
    
    window.scrollTo(0, 0);
}

function validateBPInput() {
    const systolic = document.getElementById('bp-systolic').value;
    const diastolic = document.getElementById('bp-diastolic').value;
    const errorEl = document.getElementById('bp-error');
    
    if (!systolic && !diastolic) {
        errorEl.textContent = '';
        return false;
    }
    
    if (!systolic || !diastolic) {
        errorEl.textContent = '请同时填写高压和低压';
        return false;
    }
    
    const sys = parseInt(systolic);
    const dia = parseInt(diastolic);
    
    if (sys < 60 || sys > 250) {
        errorEl.textContent = '高压应在60-250之间';
        return false;
    }
    
    if (dia < 40 || dia > 150) {
        errorEl.textContent = '低压应在40-150之间';
        return false;
    }
    
    if (sys < dia) {
        errorEl.textContent = '高压应该大于低压';
        return false;
    }
    
    errorEl.textContent = '';
    return true;
}

function validateSugarInput() {
    const sugar = document.getElementById('blood-sugar').value;
    const errorEl = document.getElementById('sugar-error');
    
    if (!sugar) {
        errorEl.textContent = '';
        return true;
    }
    
    const value = parseFloat(sugar);
    if (value < 2 || value > 30) {
        errorEl.textContent = '血糖值应在2-30之间';
        return false;
    }
    
    errorEl.textContent = '';
    return true;
}

function saveProfile(event) {
    event.preventDefault();
    
    userProfile.name = document.getElementById('name').value.trim();
    userProfile.age = parseInt(document.getElementById('age').value) || 0;
    userProfile.gender = document.getElementById('gender').value;
    userProfile.diseaseLevel = document.getElementById('disease-level').value;
    userProfile.priority = document.getElementById('priority').value;
    userProfile.medication = document.getElementById('medication').value.trim();
    
    userProfile.diseases = [];
    document.querySelectorAll('input[name="disease"]:checked').forEach(checkbox => {
        userProfile.diseases.push(checkbox.value);
    });
    
    userProfile.habits = [];
    document.querySelectorAll('input[name="habit"]:checked').forEach(checkbox => {
        userProfile.habits.push(checkbox.value);
    });
    
    if (!userProfile.name || !userProfile.age || !userProfile.gender) {
        showModal('提示', '请填写完整的个人信息（称呼、年龄、性别）');
        return;
    }
    
    saveData();
    updateGreeting();
    
    showModal('保存成功', `${userProfile.name}，您的档案已保存！\n\n接下来可以开始记录健康数据了。`, () => {
        showPage('page-data');
    });
}

function analyzeHealth(event) {
    event.preventDefault();
    
    const systolic = document.getElementById('bp-systolic').value;
    const diastolic = document.getElementById('bp-diastolic').value;
    
    if (!systolic || !diastolic) {
        showModal('提示', '请至少填写血压数据（高压和低压）');
        return;
    }
    
    if (!validateBPInput()) {
        return;
    }
    
    healthData.bloodPressure.systolic = parseInt(systolic);
    healthData.bloodPressure.diastolic = parseInt(diastolic);
    healthData.bloodSugar = parseFloat(document.getElementById('blood-sugar').value) || 0;
    healthData.steps = parseInt(document.getElementById('steps').value) || 0;
    healthData.sleep = parseFloat(document.getElementById('sleep').value) || 0;
    
    healthData.symptoms = [];
    document.querySelectorAll('input[name="symptom"]:checked').forEach(checkbox => {
        healthData.symptoms.push(checkbox.value);
    });
    
    const confirmMessage = `请确认您填写的数据：\n\n血压：${healthData.bloodPressure.systolic}/${healthData.bloodPressure.diastolic} mmHg\n` +
        (healthData.bloodSugar ? `血糖：${healthData.bloodSugar} mmol/L\n` : '') +
        (healthData.steps ? `步数：${healthData.steps} 步\n` : '') +
        (healthData.sleep ? `睡眠：${healthData.sleep} 小时\n` : '') +
        '\n确认提交吗？';
    
    showModal('确认数据', confirmMessage, () => {
        displayResults();
        showPage('page-result');
        
        if (!checkinData.todayCheckin) {
            checkinData.todayCheckin = true;
            checkinData.streak++;
            checkinData.lastCheckin = new Date().toISOString();
            saveData();
            updateCheckinDisplay();
            showCheckinSuccess();
        }
    });
}

function showCheckinSuccess() {
    const successEl = document.getElementById('checkin-success');
    const streakInfo = document.getElementById('streak-info');
    const badgesEl = document.getElementById('badges');
    
    if (successEl) {
        successEl.style.display = 'block';
        
        if (streakInfo) {
            streakInfo.textContent = `您已连续打卡 ${checkinData.streak} 天！`;
        }
        
        if (badgesEl) {
            badgesEl.innerHTML = '';
            
            if (checkinData.streak >= 7) {
                badgesEl.innerHTML += '<span class="badge">🌟 坚持一周</span>';
            }
            if (checkinData.streak >= 30) {
                badgesEl.innerHTML += '<span class="badge">🏆 坚持一月</span>';
            }
            if (checkinData.streak >= 100) {
                badgesEl.innerHTML += '<span class="badge">👑 坚持百日</span>';
            }
        }
    }
}

function analyzeBloodPressure(systolic, diastolic) {
    let result = {
        status: '',
        class: '',
        advice: '',
        actions: []
    };
    
    if (systolic < 90 || diastolic < 60) {
        result.status = '偏低';
        result.class = 'warning';
        result.advice = '您的血压偏低，可能会感到头晕、乏力。';
        result.actions = [
            '适当增加盐分摄入，多喝温开水',
            '避免突然站立，起身时动作要慢',
            '保证充足睡眠，避免过度劳累',
            '如持续偏低，请咨询医生'
        ];
    } else if (systolic >= 140 || diastolic >= 90) {
        result.status = '偏高';
        result.class = 'danger';
        result.advice = '您的血压偏高，需要引起重视。';
        result.actions = [
            '低盐饮食，每日食盐不超过6克',
            '保持心情平和，避免情绪激动',
            '规律服药，不要自行停药',
            '每天定时监测血压',
            '如持续偏高，请及时就医'
        ];
    } else {
        result.status = '正常';
        result.class = 'normal';
        result.advice = '血压处于正常范围，请继续保持健康的生活方式。';
        result.actions = [
            '继续保持良好的生活习惯',
            '定期监测血压'
        ];
    }
    
    return result;
}

function analyzeBloodSugar(sugar) {
    let result = {
        status: '',
        class: '',
        advice: '',
        actions: []
    };
    
    if (sugar === 0) {
        return null;
    }
    
    if (sugar < 3.9) {
        result.status = '偏低';
        result.class = 'warning';
        result.advice = '血糖偏低，可能会出现头晕、心慌等症状。';
        result.actions = [
            '随身携带糖果或饼干',
            '出现不适时及时补充糖分',
            '规律进餐，不要空腹太久'
        ];
    } else if (sugar >= 7.0) {
        result.status = '偏高';
        result.class = 'danger';
        result.advice = '空腹血糖偏高，建议控制饮食，适当运动。';
        result.actions = [
            '控制碳水化合物摄入',
            '减少糖分和精制食品',
            '饭后散步30分钟',
            '定期监测血糖',
            '如持续偏高，请咨询医生'
        ];
    } else {
        result.status = '正常';
        result.class = 'normal';
        result.advice = '空腹血糖正常，请继续保持良好的饮食习惯。';
        result.actions = [
            '继续保持均衡饮食',
            '定期监测血糖'
        ];
    }
    
    return result;
}

function analyzeActivity(steps) {
    let result = {
        status: '',
        class: '',
        advice: '',
        actions: []
    };
    
    if (steps === 0) {
        return null;
    }
    
    if (steps < 3000) {
        result.status = '活动量不足';
        result.class = 'warning';
        result.advice = '今日活动量较少，建议适当增加运动。';
        result.actions = [
            '晚饭后下楼散步15-20分钟',
            '可以在家做简单的伸展运动',
            '减少久坐时间，每小时起身活动'
        ];
    } else if (steps >= 10000) {
        result.status = '活动量充足';
        result.class = 'normal';
        result.advice = '活动量很棒！继续保持，注意运动后适当休息。';
        result.actions = [
            '继续保持运动习惯',
            '注意运动后补充水分'
        ];
    } else {
        result.status = '活动量适中';
        result.class = 'normal';
        result.advice = '活动量适中，可以尝试增加一些运动。';
        result.actions = [
            '可以尝试每天多走1000步',
            '饭后散步有助于消化'
        ];
    }
    
    return result;
}

function analyzeSleep(hours) {
    let result = {
        status: '',
        class: '',
        advice: '',
        actions: []
    };
    
    if (hours === 0) {
        return null;
    }
    
    if (hours < 6) {
        result.status = '睡眠不足';
        result.class = 'warning';
        result.advice = '睡眠时间不足，可能影响身体恢复和免疫力。';
        result.actions = [
            '今晚早点休息，争取睡够7小时',
            '睡前1小时不看手机',
            '可以泡脚15分钟助眠',
            '保持卧室安静、黑暗'
        ];
    } else if (hours > 9) {
        result.status = '睡眠过多';
        result.class = 'warning';
        result.advice = '睡眠时间过长，可能影响精神状态。';
        result.actions = [
            '保持规律作息',
            '白天适当增加活动量',
            '午睡不要超过30分钟'
        ];
    } else {
        result.status = '睡眠良好';
        result.class = 'normal';
        result.advice = '睡眠时间充足，继续保持规律的作息习惯。';
        result.actions = [
            '继续保持规律作息',
            '每天固定时间睡觉和起床'
        ];
    }
    
    return result;
}

function generateSuggestions() {
    const suggestions = [];
    const name = userProfile.name || '您';
    
    if (userProfile.diseases.includes('hypertension')) {
        suggestions.push(`${name}，记得低盐饮食，每日食盐不超过6克`);
        suggestions.push('定期监测血压，按时服用降压药');
        
        if (userProfile.habits.includes('salty')) {
            suggestions.push('您喜欢吃咸，建议逐渐减少盐的用量');
        }
    }
    
    if (userProfile.diseases.includes('diabetes')) {
        suggestions.push('控制碳水化合物摄入，少食多餐');
        suggestions.push('定期监测血糖，避免高糖食物');
        suggestions.push('可以选择低糖水果，如草莓、柚子');
    }
    
    if (userProfile.diseases.includes('heart')) {
        suggestions.push('避免剧烈运动，保持心情舒畅');
        suggestions.push('定期复查心脏功能');
        suggestions.push('如出现胸闷、气短，请及时就医');
    }
    
    if (userProfile.diseases.includes('arthritis')) {
        suggestions.push('注意关节保暖，避免受凉');
        suggestions.push('适度活动关节，避免长时间保持同一姿势');
    }
    
    if (healthData.steps < 5000 && healthData.steps > 0) {
        suggestions.push('晚饭后下楼散步15-20分钟，增加活动量');
    }
    
    if (healthData.sleep < 7 && healthData.sleep > 0) {
        suggestions.push('睡前泡脚有助于改善睡眠质量');
    }
    
    if (healthData.symptoms.includes('dizzy')) {
        suggestions.push('您今天感到头晕，建议多休息，如持续请就医');
    }
    
    if (healthData.symptoms.includes('headache')) {
        suggestions.push('头痛时建议闭目休息，避免看手机');
    }
    
    suggestions.push('多喝水，每日饮水1500-2000毫升');
    suggestions.push('保持心情愉悦，多与家人朋友交流');
    
    return [...new Set(suggestions)];
}

function displayResults() {
    const name = userProfile.name || '您';
    
    const summaryText = document.getElementById('summary-text');
    if (summaryText) {
        let summary = `${getGreetingWithName()}\n`;
        
        const bpResult = analyzeBloodPressure(
            healthData.bloodPressure.systolic,
            healthData.bloodPressure.diastolic
        );
        
        if (bpResult.class === 'normal') {
            summary += `您的血压正常，继续保持！`;
        } else if (bpResult.class === 'warning') {
            summary += `您的血压有些偏低，请注意休息。`;
        } else {
            summary += `您的血压偏高，请注意饮食和休息。`;
        }
        
        summaryText.textContent = summary;
    }
    
    const bpResult = analyzeBloodPressure(
        healthData.bloodPressure.systolic,
        healthData.bloodPressure.diastolic
    );
    
    document.getElementById('bp-result').textContent = 
        `${healthData.bloodPressure.systolic}/${healthData.bloodPressure.diastolic} mmHg - ${bpResult.status}`;
    document.getElementById('bp-result').className = `result-value ${bpResult.class}`;
    document.getElementById('bp-advice').textContent = bpResult.advice;
    
    const bpActions = document.getElementById('bp-actions');
    bpActions.innerHTML = bpResult.actions.map((action, i) => 
        `<div class="action-step"><span class="step-num">${i + 1}</span>${action}</div>`
    ).join('');
    
    const sugarResult = analyzeBloodSugar(healthData.bloodSugar);
    const sugarCard = document.getElementById('sugar-card');
    
    if (sugarResult) {
        sugarCard.style.display = 'block';
        document.getElementById('sugar-result').textContent = 
            `${healthData.bloodSugar} mmol/L - ${sugarResult.status}`;
        document.getElementById('sugar-result').className = `result-value ${sugarResult.class}`;
        document.getElementById('sugar-advice').textContent = sugarResult.advice;
        
        const sugarActions = document.getElementById('sugar-actions');
        sugarActions.innerHTML = sugarResult.actions.map((action, i) => 
            `<div class="action-step"><span class="step-num">${i + 1}</span>${action}</div>`
        ).join('');
    } else {
        sugarCard.style.display = 'none';
    }
    
    const activityResult = analyzeActivity(healthData.steps);
    const activityCard = document.getElementById('activity-card');
    
    if (activityResult) {
        activityCard.style.display = 'block';
        document.getElementById('activity-result').textContent = 
            `${healthData.steps} 步 - ${activityResult.status}`;
        document.getElementById('activity-result').className = `result-value ${activityResult.class}`;
        document.getElementById('activity-advice').textContent = activityResult.advice;
        
        const activityActions = document.getElementById('activity-actions');
        activityActions.innerHTML = activityResult.actions.map((action, i) => 
            `<div class="action-step"><span class="step-num">${i + 1}</span>${action}</div>`
        ).join('');
    } else {
        activityCard.style.display = 'none';
    }
    
    const sleepResult = analyzeSleep(healthData.sleep);
    const sleepCard = document.getElementById('sleep-card');
    
    if (sleepResult) {
        sleepCard.style.display = 'block';
        document.getElementById('sleep-result').textContent = 
            `${healthData.sleep} 小时 - ${sleepResult.status}`;
        document.getElementById('sleep-result').className = `result-value ${sleepResult.class}`;
        document.getElementById('sleep-advice').textContent = sleepResult.advice;
        
        const sleepActions = document.getElementById('sleep-actions');
        sleepActions.innerHTML = sleepResult.actions.map((action, i) => 
            `<div class="action-step"><span class="step-num">${i + 1}</span>${action}</div>`
        ).join('');
    } else {
        sleepCard.style.display = 'none';
    }
    
    const suggestions = generateSuggestions();
    const suggestionsList = document.getElementById('suggestions-list');
    suggestionsList.innerHTML = '';
    suggestions.forEach(suggestion => {
        const li = document.createElement('li');
        li.textContent = suggestion;
        suggestionsList.appendChild(li);
    });
    
    const medicationReminder = document.getElementById('medication-reminder');
    const medicationCard = document.getElementById('medication-card');
    
    if (userProfile.medication) {
        medicationCard.style.display = 'block';
        medicationReminder.textContent = `${name}，根据您的档案，日常用药：\n${userProfile.medication}\n\n请按时服药，不要漏服或重复服用。`;
    } else {
        medicationCard.style.display = 'none';
    }
}

function clearAllData() {
    showModal('确认清除', '确定要清除所有数据吗？\n\n这将删除您的档案和所有健康记录，此操作不可恢复。', () => {
        localStorage.removeItem('healthProfile');
        localStorage.removeItem('checkinData');
        
        userProfile = {
            name: '',
            age: 0,
            gender: '',
            diseases: [],
            habits: [],
            medication: '',
            diseaseLevel: '',
            priority: ''
        };
        
        healthData = {
            bloodPressure: { systolic: 0, diastolic: 0 },
            bloodSugar: 0,
            steps: 0,
            sleep: 0,
            symptoms: []
        };
        
        checkinData = {
            streak: 0,
            lastCheckin: null,
            todayCheckin: false
        };
        
        document.getElementById('profile-form').reset();
        document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
        
        updateCheckinDisplay();
        updateGreeting();
        
        showModal('清除成功', '所有数据已清除。');
    });
}

function exportReport() {
    let report = '长寿智伴 - 健康报告\n';
    report += '=' .repeat(30) + '\n\n';
    report += `生成时间：${new Date().toLocaleString()}\n\n`;
    
    if (userProfile.name) {
        report += `用户：${userProfile.name}\n`;
        report += `年龄：${userProfile.age}岁\n`;
        report += `性别：${userProfile.gender === 'male' ? '男' : '女'}\n`;
        
        if (userProfile.diseases.length > 0) {
            const diseaseNames = {
                'hypertension': '高血压',
                'diabetes': '糖尿病',
                'heart': '心脏病',
                'arthritis': '关节炎'
            };
            report += `慢性病：${userProfile.diseases.map(d => diseaseNames[d]).join('、')}\n`;
        }
        
        if (userProfile.medication) {
            report += `日常用药：${userProfile.medication}\n`;
        }
    }
    
    report += '\n' + '-'.repeat(30) + '\n';
    report += '最近健康数据\n';
    report += '-'.repeat(30) + '\n';
    
    if (healthData.bloodPressure.systolic > 0) {
        report += `血压：${healthData.bloodPressure.systolic}/${healthData.bloodPressure.diastolic} mmHg\n`;
    }
    if (healthData.bloodSugar > 0) {
        report += `空腹血糖：${healthData.bloodSugar} mmol/L\n`;
    }
    if (healthData.steps > 0) {
        report += `今日步数：${healthData.steps} 步\n`;
    }
    if (healthData.sleep > 0) {
        report += `睡眠时长：${healthData.sleep} 小时\n`;
    }
    
    report += '\n' + '-'.repeat(30) + '\n';
    report += `连续打卡：${checkinData.streak} 天\n`;
    
    const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `健康报告_${new Date().toLocaleDateString().replace(/\//g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}

function shareToFamily() {
    const name = userProfile.name || '我';
    const bpStatus = healthData.bloodPressure.systolic > 0 ? 
        `血压 ${healthData.bloodPressure.systolic}/${healthData.bloodPressure.diastolic}` : '';
    
    let shareText = `${name}今天的健康数据：\n`;
    if (bpStatus) shareText += `${bpStatus}\n`;
    if (healthData.steps > 0) shareText += `步数：${healthData.steps}步\n`;
    if (healthData.sleep > 0) shareText += `睡眠：${healthData.sleep}小时\n`;
    shareText += `\n连续打卡${checkinData.streak}天！`;
    
    if (navigator.share) {
        navigator.share({
            title: '长寿智伴 - 健康报告',
            text: shareText
        }).catch(() => {});
    } else {
        navigator.clipboard.writeText(shareText).then(() => {
            showModal('复制成功', '健康报告已复制到剪贴板，可以发送给家人了！');
        }).catch(() => {
            showModal('分享内容', shareText);
        });
    }
}

const aiResponses = {
    '高血压': {
        keywords: ['高血压', '血压高', '降压', '血压'],
        response: `关于高血压患者的建议：

<b>饮食方面：</b>
• 低盐饮食，每日食盐不超过6克
• 多吃新鲜蔬菜水果，补充钾元素
• 减少动物脂肪，选择植物油

<b>运动方面：</b>
• 每天散步30分钟
• 避免剧烈运动
• 运动时如有不适立即停止

<b>生活方面：</b>
• 保持心情平和，避免情绪激动
• 规律作息，保证充足睡眠
• 戒烟限酒

<span class="source-tag">参考《中国高血压防治指南》</span>

如有其他问题，欢迎继续咨询！`
    },
    '糖尿病': {
        keywords: ['糖尿病', '血糖', '水果'],
        response: `关于糖尿病患者的建议：

<b>可以适量食用的水果：</b>
• 草莓、蓝莓等浆果类
• 苹果、梨（带皮吃）
• 柚子、橙子、猕猴桃

<b>建议避免的水果：</b>
• 葡萄、荔枝、龙眼
• 榴莲、芒果
• 果干、果脯

<b>吃水果注意事项：</b>
1. 选择在两餐之间食用
2. 每次控制在100-200克
3. 血糖不稳定时暂缓食用

<span class="source-tag">参考《中国糖尿病防治指南》</span>

建议您定期监测血糖，根据血糖情况调整饮食。`
    },
    '运动': {
        keywords: ['运动', '步数', '走路', '锻炼'],
        response: `关于运动的建议：

<b>不同人群的目标：</b>
• 健康成年人：每天8000-10000步
• 老年人：每天6000-8000步
• 慢病患者：每天4000-6000步

<b>具体建议：</b>
1. 晚饭后下楼散步15-20分钟
2. 在小区里慢慢走，不用太急
3. 穿舒适的运动鞋
4. 感到累了就休息

<b>注意事项：</b>
• 避免空腹运动
• 随身携带糖果（防低血糖）
• 感到不适立即停止

坚持适度运动，对控制血压、血糖都有帮助！`
    },
    '睡眠': {
        keywords: ['睡眠', '失眠', '睡不着'],
        response: `关于改善睡眠的建议：

<b>睡前准备：</b>
• 睡前1小时不看手机、电视
• 泡脚15-20分钟
• 喝杯温牛奶
• 听轻音乐放松

<b>睡眠环境：</b>
• 保持卧室安静、黑暗
• 温度控制在18-22℃
• 选择舒适的枕头

<b>白天习惯：</b>
• 适当户外活动，晒太阳
• 午睡不超过30分钟
• 下午避免喝浓茶、咖啡

如果长期失眠，建议咨询医生。`
    },
    '用药': {
        keywords: ['用药', '药物', '吃药', '服药'],
        response: `关于用药的注意事项：

<b>按时服药：</b>
严格按照医嘱服药，不要自行增减剂量或停药。

<b>服药时间：</b>
• 降压药：通常早晨服用
• 降糖药：根据类型，餐前或餐后
• 安眠药：睡前30分钟

<b>温馨提示：</b>
• 不要用茶水、饮料服药
• 药品存放在阴凉干燥处
• 过期药品及时处理
• 注意观察服药后的反应

具体用药问题请咨询您的主治医生。`
    }
};

function getAIResponse(question) {
    const lowerQuestion = question.toLowerCase();
    
    for (const [key, data] of Object.entries(aiResponses)) {
        for (const keyword of data.keywords) {
            if (lowerQuestion.includes(keyword)) {
                return data.response;
            }
        }
    }
    
    const name = userProfile.name || '您';
    return `感谢您的提问！${name}，关于您的问题，我建议：

1. 保持健康的生活方式
2. 均衡饮食，适度运动
3. 保证充足睡眠
4. 定期进行健康体检

如果您有具体的健康问题，可以问我关于：
• 高血压、糖尿病等慢性病管理
• 饮食营养建议
• 运动健身指导
• 睡眠改善方法

我会尽力为您提供专业建议！`;
}

function addMessage(content, isUser = false) {
    const messagesContainer = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}`;
    
    messageDiv.innerHTML = `
        <div class="message-avatar">${isUser ? '👤' : '🤖'}</div>
        <div class="message-content">${content}</div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function showTypingIndicator() {
    const messagesContainer = document.getElementById('chat-messages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message ai-message typing-indicator';
    typingDiv.id = 'typing-indicator';
    
    typingDiv.innerHTML = `
        <div class="message-avatar">🤖</div>
        <div class="typing-dots">
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;
    
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

function handleChat(event) {
    event.preventDefault();
    
    const input = document.getElementById('chat-input');
    const question = input.value.trim();
    
    if (!question) return;
    
    addMessage(question, true);
    input.value = '';
    
    showTypingIndicator();
    
    setTimeout(() => {
        removeTypingIndicator();
        const response = getAIResponse(question);
        addMessage(response);
    }, 800 + Math.random() * 700);
}

function handleQuickQuestion(event) {
    const question = event.target.getAttribute('data-question');
    if (question) {
        document.getElementById('chat-input').value = question;
        handleChat(event);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    loadData();
    
    document.getElementById('chat-form').addEventListener('submit', handleChat);
    
    document.querySelectorAll('.quick-btn').forEach(btn => {
        btn.addEventListener('click', handleQuickQuestion);
    });
    
    document.getElementById('profile-form').addEventListener('submit', saveProfile);
    document.getElementById('health-form').addEventListener('submit', analyzeHealth);
    
    document.getElementById('bp-systolic').addEventListener('input', validateBPInput);
    document.getElementById('bp-diastolic').addEventListener('input', validateBPInput);
    document.getElementById('blood-sugar').addEventListener('input', validateSugarInput);
    
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const pageId = this.getAttribute('data-page');
            showPage(pageId);
        });
    });
    
    document.getElementById('btn-clear-data').addEventListener('click', clearAllData);
    document.getElementById('btn-export').addEventListener('click', exportReport);
    document.getElementById('btn-share').addEventListener('click', shareToFamily);
});
