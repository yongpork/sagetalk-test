import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 개발 인디케이터 완전 비활성화
  devIndicators: {
    buildActivity: false,
    appIsrStatus: false,
  },
  // Turbopack 설정
  turbopack: {
    // 기존 experimental.turbo 설정을 여기로 이동
  }
};

export default nextConfig;