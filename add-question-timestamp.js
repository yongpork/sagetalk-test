#!/usr/bin/env node

/**
 * SageTalk 프로젝트 실시간 승용질문 시간 정보 추가 도구
 * 새로운 승용질문 작성 시 자동으로 시간 정보를 추가
 */

const fs = require('fs');
const path = require('path');
const { getCurrentKoreanDate, addQuestionTimestamps } = require('./utils/dateHelper');

/**
 * 특정 파일의 승용질문에 현재 시간을 추가하는 함수
 * @param {string} filePath - 파일 경로
 * @returns {boolean} 성공 여부
 */
function addCurrentTimestampToFile(filePath) {
    const currentDate = getCurrentKoreanDate();
    return addQuestionTimestamps(filePath, currentDate.questionFormat);
}

/**
 * 대화 파일에 새로운 승용질문을 추가하는 함수
 * @param {string} filePath - 파일 경로
 * @param {string} question - 질문 내용
 * @returns {boolean} 성공 여부
 */
function addNewQuestionToFile(filePath, question) {
    try {
        const currentDate = getCurrentKoreanDate();
        
        // 파일이 존재하는지 확인
        if (!fs.existsSync(filePath)) {
            console.log(`⚠️ 파일이 존재하지 않습니다: ${filePath}`);
            return false;
        }
        
        // 파일 내용 읽기
        const content = fs.readFileSync(filePath, 'utf8');
        
        // 새로운 승용질문 추가
        const newQuestion = `\n\n🗣️ **승용질문(${currentDate.questionFormat})** : "${question}"\n`;
        const updatedContent = content + newQuestion;
        
        // 파일에 저장
        fs.writeFileSync(filePath, updatedContent, 'utf8');
        console.log(`✅ 새로운 승용질문이 추가되었습니다: ${filePath}`);
        console.log(`📅 추가된 시간: ${currentDate.questionFormat}`);
        
        return true;
        
    } catch (error) {
        console.error(`❌ 파일 수정 실패: ${filePath}`, error.message);
        return false;
    }
}

/**
 * 명령행 인수 처리
 */
function main() {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        console.log('📋 사용법:');
        console.log('  node add-question-timestamp.js <파일경로>                    # 기존 승용질문에 시간 추가');
        console.log('  node add-question-timestamp.js <파일경로> "질문내용"        # 새로운 승용질문 추가');
        console.log('');
        console.log('📝 예시:');
        console.log('  node add-question-timestamp.js Conversation/대화_비밀대화.md');
        console.log('  node add-question-timestamp.js Conversation/대화_비밀대화.md "새로운 질문입니다"');
        return;
    }
    
    const filePath = args[0];
    const question = args[1];
    
    // 프로젝트 루트 기준으로 절대 경로 생성
    const fullPath = path.isAbsolute(filePath) ? filePath : path.join('/Users/markit/Documents/SageTalk', filePath);
    
    console.log('🚀 승용질문 시간 정보 처리 시작...\n');
    
    const currentDate = getCurrentKoreanDate();
    console.log(`📅 현재 시간: ${currentDate.questionFormat}`);
    console.log(`📁 대상 파일: ${fullPath}\n`);
    
    if (question) {
        // 새로운 질문 추가
        console.log('📝 새로운 승용질문 추가 중...');
        addNewQuestionToFile(fullPath, question);
    } else {
        // 기존 승용질문에 시간 추가
        console.log('📝 기존 승용질문에 시간 정보 추가 중...');
        addCurrentTimestampToFile(fullPath);
    }
    
    console.log('\n🎯 처리 완료!');
}

// 스크립트 실행
if (require.main === module) {
    main();
}

module.exports = {
    addCurrentTimestampToFile,
    addNewQuestionToFile,
    main
};

