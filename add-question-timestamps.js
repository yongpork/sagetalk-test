#!/usr/bin/env node

/**
 * SageTalk 프로젝트 승용질문 시간 정보 추가 스크립트
 * 모든 승용질문에 실제 입력 시간을 추가
 */

const fs = require('fs');
const path = require('path');
const { getCurrentKoreanDate, addQuestionTimestamps } = require('./utils/dateHelper');

// 프로젝트 루트 디렉토리
const PROJECT_ROOT = '/Users/markit/Documents/SageTalk';

// 수정할 파일들의 패턴
const TARGET_FILES = [
    'Conversation/대화_비밀대화.md',
    'Conversation/대화_전체회의_open.md',
    'Conversation/대화_김상무님:김성훈대표.md',
    'Conversation/대화_법상무님:법륜스님.md',
    'Conversation/대화_세상무님:세스고든.md',
    'Conversation/대화_세종대왕님.md',
    'Conversation/대화_이상무:이나모리가즈오.md',
    'Conversation/대화_최상무님:최명기정신과.md',
    'sage_talk_conversations.md'
];

/**
 * 디렉토리 내의 모든 마크다운 파일을 찾는 함수
 * @param {string} dirPath - 검색할 디렉토리 경로
 * @returns {Array} 마크다운 파일 경로 배열
 */
function findMarkdownFiles(dirPath) {
    const files = [];
    
    try {
        const items = fs.readdirSync(dirPath);
        
        items.forEach(item => {
            const itemPath = path.join(dirPath, item);
            const stat = fs.statSync(itemPath);
            
            if (stat.isDirectory()) {
                // 하위 디렉토리 재귀 검색
                files.push(...findMarkdownFiles(itemPath));
            } else if (item.endsWith('.md') && !item.includes('.backup.')) {
                // 마크다운 파일 추가 (백업 파일 제외)
                files.push(path.relative(PROJECT_ROOT, itemPath));
            }
        });
    } catch (error) {
        console.error(`❌ 디렉토리 검색 실패: ${dirPath}`, error.message);
    }
    
    return files;
}

/**
 * 메인 실행 함수
 */
function main() {
    console.log('🚀 SageTalk 프로젝트 승용질문 시간 정보 추가 시작...\n');
    
    // 현재 날짜 정보 출력
    const currentDate = getCurrentKoreanDate();
    console.log(`📅 현재 날짜: ${currentDate.korean}`);
    console.log(`📅 승용질문 형식: 🗣️ **승용질문(${currentDate.questionFormat})** :\n`);
    
    let fixedCount = 0;
    let totalCount = 0;
    
    // 지정된 파일들 수정
    console.log('📝 지정된 파일들 수정 중...');
    TARGET_FILES.forEach(filePath => {
        const fullPath = path.join(PROJECT_ROOT, filePath);
        totalCount++;
        if (addQuestionTimestamps(fullPath)) {
            fixedCount++;
        }
    });
    
    // Conversation 디렉토리의 모든 마크다운 파일 검색 및 수정
    console.log('\n📝 Conversation 디렉토리 전체 검색 중...');
    const conversationDir = path.join(PROJECT_ROOT, 'Conversation');
    if (fs.existsSync(conversationDir)) {
        const mdFiles = findMarkdownFiles(conversationDir);
        
        mdFiles.forEach(filePath => {
            // 이미 처리한 파일은 제외
            if (!TARGET_FILES.includes(filePath)) {
                const fullPath = path.join(PROJECT_ROOT, filePath);
                totalCount++;
                if (addQuestionTimestamps(fullPath)) {
                    fixedCount++;
                }
            }
        });
    }
    
    // 결과 요약
    console.log('\n📊 수정 결과 요약:');
    console.log(`✅ 수정된 파일: ${fixedCount}개`);
    console.log(`📁 전체 검사 파일: ${totalCount}개`);
    console.log(`📅 모든 승용질문에 시간 정보가 추가되었습니다.`);
    
    console.log('\n🎯 승용질문 시간 정보 추가 완료!');
    console.log('\n📋 사용 예시:');
    console.log('기존: 🗣️ **승용질문** : "내용"');
    console.log(`수정: 🗣️ **승용질문(${currentDate.questionFormat})** : "내용"`);
}

// 스크립트 실행
if (require.main === module) {
    main();
}

module.exports = {
    addQuestionTimestamps,
    findMarkdownFiles,
    main
};

