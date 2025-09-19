<div align="center">
  <img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 💊 Medication Disposal Finder / 폐의약품 수거함 Finder

> 사용자가 가까운 폐의약품 수거함을 쉽게 찾을 수 있도록 돕는 웹앱  
> Built with **Google AI Studio** & **Gemini API**

---

## ✨ Features / 주요 기능

- 📍 **Find Nearby / 내 주변 찾기**: GPS를 활용해 가장 가까운 3곳 수거함 표시  
- 🏠 **Search by Address / 주소 검색**: 주소 입력 및 자동완성 기능으로 근처 수거함 탐색  
- 🔗 **Open in Map Apps / 지도앱 열기**: Google Maps / Naver Maps / Kakao Maps 길찾기 연동  
- ⭐ **Favorites & Recent Searches / 즐겨찾기 & 최근 검색**: 자주 찾는 장소를 저장  
- ☎️ **Call Facility / 시설 전화걸기**: 관리 기관에 바로 전화 연결 (정보가 있을 경우)  
- 📅 **Data Freshness / 데이터 최신성 표시**: 공공데이터 기준일자 표시  

---

## 📊 Data Source / 데이터 출처

- **공공데이터포털** `전국폐의약품수거함표준데이터`  
  (Korean Open Data Portal — Standard Data for Nationwide Medication Disposal Bins)  

- 현재 데이터셋은 **서울특별시, 경기도**만 포함 (샘플링 및 정제 완료)  
- 주요 필드 / Key fields:  
  - `name`, `sido`, `sigungu`, `road_address`, `jibun_address`, `lat`, `lng`, `org`, `phone`, `updated_at`

---

## 🚀 Run Locally / 로컬 실행 방법

**Prerequisites / 사전 준비**  
- Node.js (>= 18)  
- Gemini API Key  

```bash
# 1. Install dependencies / 의존성 설치
npm install

# 2. Add your Gemini API key / API 키 환경변수 설정
echo "GEMINI_API_KEY=your_api_key_here" > .env.local

# 3. Run the app / 앱 실행
npm run dev

