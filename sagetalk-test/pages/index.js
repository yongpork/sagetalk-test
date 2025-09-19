import { useState } from 'react';

export default function Home() {
  const [clicked, setClicked] = useState(false);
  const [touchCount, setTouchCount] = useState(0);

  const handleButtonClick = () => {
    setClicked(!clicked);
    setTouchCount(touchCount + 1);
  };

  return (
    <div style={{ 
      fontFamily: 'Arial, sans-serif', 
      padding: '20px',
      maxWidth: '600px',
      margin: '0 auto',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      {/* 헤더 */}
      <header style={{ 
        textAlign: 'center', 
        marginBottom: '40px',
        padding: '20px',
        backgroundColor: '#4a90e2',
        color: 'white',
        borderRadius: '10px'
      }}>
        <h1 style={{ margin: '0', fontSize: '2em' }}>🧪 SageTalk Test</h1>
        <p style={{ margin: '10px 0 0 0', fontSize: '1.1em' }}>웹 배포 테스트 페이지</p>
      </header>

      {/* 메인 섹션 */}
      <main style={{ marginBottom: '40px' }}>
        <div style={{ 
          backgroundColor: 'white', 
          padding: '30px', 
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          marginBottom: '20px'
        }}>
          <h2 style={{ color: '#333', marginTop: '0' }}>환영합니다! 🎉</h2>
          <p style={{ color: '#666', lineHeight: '1.6' }}>
            이 페이지는 WebSageChat 프로젝트의 웹 배포 테스트를 위해 만들어졌습니다.
            모바일과 데스크톱에서 정상적으로 작동하는지 확인해주세요.
          </p>
        </div>

        {/* 모바일 테스트 영역 */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '30px', 
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          marginBottom: '20px'
        }}>
          <h3 style={{ color: '#333', marginTop: '0' }}>📱 모바일 테스트</h3>
          
          <button 
            onClick={handleButtonClick}
            style={{
              backgroundColor: clicked ? '#e74c3c' : '#2ecc71',
              color: 'white',
              border: 'none',
              padding: '15px 30px',
              fontSize: '18px',
              borderRadius: '8px',
              cursor: 'pointer',
              width: '100%',
              marginBottom: '20px',
              transition: 'background-color 0.3s'
            }}
          >
            {clicked ? '✅ 터치 성공!' : '👆 터치해보세요'}
          </button>

          <div style={{ 
            padding: '15px', 
            backgroundColor: '#ecf0f1', 
            borderRadius: '5px',
            textAlign: 'center'
          }}>
            <p style={{ margin: '0', color: '#34495e' }}>
              터치 횟수: <strong>{touchCount}</strong>
            </p>
          </div>
        </div>

        {/* 반응형 테스트 */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '30px', 
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          marginBottom: '20px'
        }}>
          <h3 style={{ color: '#333', marginTop: '0' }}>📏 반응형 테스트</h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
            gap: '15px'
          }}>
            <div style={{ 
              padding: '20px', 
              backgroundColor: '#3498db', 
              color: 'white', 
              borderRadius: '5px',
              textAlign: 'center'
            }}>
              카드 1
            </div>
            <div style={{ 
              padding: '20px', 
              backgroundColor: '#9b59b6', 
              color: 'white', 
              borderRadius: '5px',
              textAlign: 'center'
            }}>
              카드 2
            </div>
            <div style={{ 
              padding: '20px', 
              backgroundColor: '#f39c12', 
              color: 'white', 
              borderRadius: '5px',
              textAlign: 'center'
            }}>
              카드 3
            </div>
          </div>
        </div>

        {/* 스크롤 테스트 */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '30px', 
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#333', marginTop: '0' }}>📜 스크롤 테스트</h3>
          <div style={{ 
            height: '300px', 
            overflow: 'auto', 
            border: '1px solid #ddd', 
            padding: '15px',
            borderRadius: '5px',
            backgroundColor: '#fafafa'
          }}>
            {[...Array(20)].map((_, i) => (
              <p key={i} style={{ margin: '10px 0', color: '#555' }}>
                스크롤 테스트 라인 {i + 1} - 이 영역은 스크롤이 가능합니다.
              </p>
            ))}
          </div>
        </div>
      </main>

      {/* 푸터 */}
      <footer style={{ 
        textAlign: 'center', 
        padding: '20px',
        backgroundColor: '#34495e',
        color: 'white',
        borderRadius: '10px',
        marginTop: '40px'
      }}>
        <p style={{ margin: '0' }}>🚀 SageTalk WebTest 배포 성공!</p>
        <p style={{ margin: '10px 0 0 0', fontSize: '0.9em', opacity: '0.8' }}>
          2025년 8월 14일 - Phase 2 테스트 완료
        </p>
      </footer>
    </div>
  );
}
