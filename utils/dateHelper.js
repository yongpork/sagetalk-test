/**
 * SageTalk 프로젝트용 날짜 헬퍼 유틸리티
 * HDpharm3_Voice 프로젝트의 날짜 로직을 참고하여 생성
 */

/**
 * 현재 날짜와 시간을 한국어 형식으로 반환
 * @returns {Object} 날짜 정보 객체
 */
function getCurrentKoreanDate() {
    const now = new Date();
    
    // 한국 시간대로 변환 (UTC+9)
    const koreanTime = new Date(now.getTime() + (9 * 60 * 60 * 1000));
    
    const year = koreanTime.getFullYear();
    const month = String(koreanTime.getMonth() + 1).padStart(2, '0');
    const day = String(koreanTime.getDate()).padStart(2, '0');
    const hour = String(koreanTime.getHours()).padStart(2, '0');
    const minute = String(koreanTime.getMinutes()).padStart(2, '0');
    const second = String(koreanTime.getSeconds()).padStart(2, '0');
    
    // 요일 계산
    const weekdays = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
    const weekday = weekdays[koreanTime.getDay()];
    
    return {
        date: `${year}년 ${month}월 ${day}일`,
        time: `${hour}시 ${minute}분 ${second}초`,
        dateTime: `${year}년 ${month}월 ${day}일 ${hour}시 ${minute}분`,
        iso: koreanTime.toISOString(),
        korean: `${year}년 ${month}월 ${day}일 ${hour}시 ${minute}분`,
        // 마크다운 파일용 형식
        markdown: `**${year}년 ${month}월 ${day}일**`,
        // 간단한 형식
        simple: `${year}년 ${month}월 ${day}일`,
        // 승용질문용 형식 (요일 포함)
        questionFormat: `${year}년 ${parseInt(month)}월 ${parseInt(day)}일 ${weekday} ${hour}시${minute}분`,
        // 요일 정보
        weekday: weekday
    };
}

/**
 * 날짜 문자열을 검증하고 올바른 형식으로 수정
 * @param {string} dateString - 검증할 날짜 문자열
 * @returns {string} 수정된 날짜 문자열
 */
function validateAndFixDate(dateString) {
    const currentDate = getCurrentKoreanDate();
    
    // 잘못된 날짜 패턴들을 수정
    const datePatterns = [
        // 2025년 8월 17일 -> 현재 날짜로 수정
        /2025년\s*8월\s*17일/g,
        // 2025. 8. 18. -> 현재 날짜로 수정
        /2025\.\s*8\.\s*18\./g,
        // 기타 잘못된 날짜들
        /2025년\s*8월\s*18일/g,
        /2025\.\s*8\.\s*17\./g
    ];
    
    let fixedString = dateString;
    
    datePatterns.forEach(pattern => {
        if (pattern.test(fixedString)) {
            fixedString = fixedString.replace(pattern, currentDate.simple);
        }
    });
    
    return fixedString;
}

/**
 * 파일 내용에서 날짜를 자동으로 수정
 * @param {string} content - 파일 내용
 * @returns {string} 수정된 파일 내용
 */
function fixDatesInContent(content) {
    const currentDate = getCurrentKoreanDate();
    
    // 다양한 날짜 패턴을 현재 날짜로 교체
    const replacements = [
        // 마크다운 형식의 날짜
        { from: /\*\*2025년 8월 17일\*\*/g, to: currentDate.markdown },
        { from: /\*\*2025년 8월 18일\*\*/g, to: currentDate.markdown },
        { from: /2025년 8월 17일/g, to: currentDate.simple },
        { from: /2025년 8월 18일/g, to: currentDate.simple },
        // 점으로 구분된 날짜
        { from: /2025\. 8\. 17\./g, to: currentDate.simple },
        { from: /2025\. 8\. 18\./g, to: currentDate.simple },
        // 회의 일시
        { from: /\*\*📅 회의 일시\*\*: 2025년 1월 17일/g, to: `**📅 회의 일시**: ${currentDate.simple}` },
        { from: /\*\*📅 회의 일시\*\*: 2025년 8월 17일/g, to: `**📅 회의 일시**: ${currentDate.simple}` }
    ];
    
    let fixedContent = content;
    
    replacements.forEach(({ from, to }) => {
        fixedContent = fixedContent.replace(from, to);
    });
    
    return fixedContent;
}

/**
 * 현재 날짜 정보를 JSON 파일로 저장 (HDpharm3_Voice 스타일)
 * @param {string} filePath - 저장할 파일 경로
 */
function saveCurrentDateToFile(filePath) {
    const fs = require('fs');
    const path = require('path');
    
    const dateInfo = getCurrentKoreanDate();
    
    const dateData = {
        date: dateInfo.simple,
        time: dateInfo.time,
        iso: dateInfo.iso,
        korean: dateInfo.korean
    };
    
    // 디렉토리가 없으면 생성
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(filePath, JSON.stringify(dateData, null, 2), 'utf8');
    console.log(`✅ 현재 날짜 정보가 ${filePath}에 저장되었습니다.`);
}

/**
 * 승용질문에 현재 시간 정보를 추가하는 함수
 * @param {string} content - 파일 내용
 * @returns {string} 시간 정보가 추가된 내용
 */
function addTimestampToQuestions(content) {
    const currentDate = getCurrentKoreanDate();
    
    // 승용질문 패턴 찾기 및 시간 정보 추가
    const questionPattern = /🗣️\s*\*\*승용질문\*\*\s*:/g;
    
    return content.replace(questionPattern, `🗣️ **승용질문(${currentDate.questionFormat})** :`);
}

/**
 * 승용질문에 특정 시간 정보를 추가하는 함수
 * @param {string} content - 파일 내용
 * @param {string} timestamp - 추가할 시간 정보
 * @returns {string} 시간 정보가 추가된 내용
 */
function addSpecificTimestampToQuestions(content, timestamp) {
    // 승용질문 패턴 찾기 및 특정 시간 정보 추가
    const questionPattern = /🗣️\s*\*\*승용질문\*\*\s*:/g;
    
    return content.replace(questionPattern, `🗣️ **승용질문(${timestamp})** :`);
}

/**
 * 파일에 승용질문 시간 정보를 추가하는 함수
 * @param {string} filePath - 파일 경로
 * @param {string} timestamp - 추가할 시간 정보 (선택사항)
 * @returns {boolean} 성공 여부
 */
function addQuestionTimestamps(filePath, timestamp = null) {
    const fs = require('fs');
    const path = require('path');
    
    try {
        // 파일이 존재하는지 확인
        if (!fs.existsSync(filePath)) {
            console.log(`⚠️ 파일이 존재하지 않습니다: ${filePath}`);
            return false;
        }
        
        // 파일 내용 읽기
        const content = fs.readFileSync(filePath, 'utf8');
        
        // 시간 정보 추가
        const updatedContent = timestamp 
            ? addSpecificTimestampToQuestions(content, timestamp)
            : addTimestampToQuestions(content);
        
        // 내용이 변경되었는지 확인
        if (content !== updatedContent) {
            // 백업 파일 생성
            const backupPath = `${filePath}.backup.${Date.now()}`;
            fs.writeFileSync(backupPath, content, 'utf8');
            console.log(`📁 백업 파일 생성: ${backupPath}`);
            
            // 수정된 내용 저장
            fs.writeFileSync(filePath, updatedContent, 'utf8');
            console.log(`✅ 승용질문 시간 정보 추가 완료: ${filePath}`);
            return true;
        } else {
            console.log(`ℹ️ 수정할 승용질문이 없습니다: ${filePath}`);
            return false;
        }
        
    } catch (error) {
        console.error(`❌ 파일 수정 실패: ${filePath}`, error.message);
        return false;
    }
}

module.exports = {
    getCurrentKoreanDate,
    validateAndFixDate,
    fixDatesInContent,
    saveCurrentDateToFile,
    addTimestampToQuestions,
    addSpecificTimestampToQuestions,
    addQuestionTimestamps
};
