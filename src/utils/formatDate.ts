// 날짜 문자열 표시 형식 변환: 2021-11-05 → 2021.11.05 (시간이 있으면 그대로 둡니다: 2021-11-11 12:00 → 2021.11.11 12:00)

const formatDate = (date: string) => date.replace(/^(\d{4})-(\d{2})-(\d{2})/, '$1.$2.$3');

export default formatDate;
