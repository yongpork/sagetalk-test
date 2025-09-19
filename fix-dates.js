#!/usr/bin/env node

/**
 * SageTalk 프로젝트 날짜 수정 스크립트
 * 모든 문서의 날짜를 현재 날짜로 수정
 */

const fs = require('fs');
const path = require('path');
const { getCurrentKoreanDate, fixDatesInContent, saveCurrentDateToFile } = require('./utils/dateHelper');

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
    'Conversation/대화_전체회의_open.md',
    'Conversation/대화_최상무님:최명기정신과.md',
    'sage_talk_conversations.md',
    'README.md'
];

/**
 * 파일의 날짜를 수정하는 함수
 * @param {string} filePath - 수정할 파일 경로
 */
function fixFileDates(filePath) {
    try {
        const fullPath = path.join(PROJECT_ROOT, filePath);
        
        // 파일이 존재하는지 확인
        if (!fs.existsSync(fullPath)) {
            console.log(`⚠️ 파일이 존재하지 않습니다: ${filePath}`);
            return false;
        }
        
        // 파일 내용 읽기
        const content = fs.readFileSync(fullPath, 'utf8');
        
        // 날짜 수정
        const fixedContent = fixDatesInContent(content);
        
        // 내용이 변경되었는지 확인
        if (content !== fixedContent) {
            // 백업 파일 생성
            const backupPath = `${fullPath}.backup.${Date.now()}`;
            fs.writeFileSync(backupPath, content, 'utf8');
            console.log(`📁 백업 파일 생성: ${backupPath}`);
            
            // 수정된 내용 저장
            fs.writeFileSync(fullPath, fixedContent, 'utf8');
            console.log(`✅ 날짜 수정 완료: ${filePath}`);
            return true;
        } else {
            console.log(`ℹ️ 수정할 날짜가 없습니다: ${filePath}`);
            return false;
        }
        
    } catch (error) {
        console.error(`❌ 파일 수정 실패: ${filePath}`, error.message);
        return false;
    }
}

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
            } else if (item.endsWith('.md')) {
                // 마크다운 파일 추가
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
    console.log('🚀 SageTalk 프로젝트 날짜 수정 시작...\n');
    
    // 현재 날짜 정보 출력
    const currentDate = getCurrentKoreanDate();
    console.log(`📅 현재 날짜: ${currentDate.korean}`);
    console.log(`📅 수정 대상 날짜: 2025년 8월 17일, 2025년 8월 18일 등\n`);
    
    // 현재 날짜 정보를 파일로 저장
    saveCurrentDateToFile(path.join(PROJECT_ROOT, 'current-date.json'));
    
    let fixedCount = 0;
    let totalCount = 0;
    
    // 지정된 파일들 수정
    console.log('📝 지정된 파일들 수정 중...');
    TARGET_FILES.forEach(filePath => {
        totalCount++;
        if (fixFileDates(filePath)) {
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
                totalCount++;
                if (fixFileDates(filePath)) {
                    fixedCount++;
                }
            }
        });
    }
    
    // 결과 요약
    console.log('\n📊 수정 결과 요약:');
    console.log(`✅ 수정된 파일: ${fixedCount}개`);
    console.log(`📁 전체 검사 파일: ${totalCount}개`);
    console.log(`📅 모든 날짜가 ${currentDate.simple}로 수정되었습니다.`);
    
    console.log('\n🎯 날짜 수정 완료!');
}

// 스크립트 실행
if (require.main === module) {
    main();
}

module.exports = {
    fixFileDates,
    findMarkdownFiles,
    main
};

