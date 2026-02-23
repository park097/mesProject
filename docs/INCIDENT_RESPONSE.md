# 장애 대응 실습 가이드

## 목적
배포 후 주요 장애를 의도적으로 발생시키고, 원인 분석부터 복구까지 수행 기록을 남긴다.

## 공통 점검 명령
```bash
# 앱
ps -ef | grep mes.jar
tail -n 200 /opt/mes/app.log

# nginx
sudo nginx -t
sudo systemctl status nginx
sudo tail -n 200 /var/log/nginx/error.log

# mysql
sudo systemctl status mysql
```

## 시나리오 1: Spring Boot 중지
재현:
```bash
pkill -f 'java -jar mes.jar'
```

증상:
- 502 Bad Gateway 또는 연결 실패

복구:
```bash
cd /opt/mes
nohup java -jar mes.jar --spring.profiles.active=prod > app.log 2>&1 &
```

검증:
- `curl http://127.0.0.1:8080/actuator/health` (구성 시)
- 외부 접속 정상화 확인

## 시나리오 2: MySQL 중지
재현:
```bash
sudo systemctl stop mysql
```

증상:
- 로그인/조회 시 DB 연결 오류

복구:
```bash
sudo systemctl start mysql
sudo systemctl status mysql
```

검증:
- 애플리케이션 로그에서 DB 연결 정상 확인
- 로그인/조회 재시도 성공

## 시나리오 3: Nginx 설정 오류
재현:
- 설정 파일 문법 깨진 상태로 저장

증상:
- `nginx -t` 실패
- 서비스 reload 실패

복구:
```bash
sudo nginx -t
# 오류 라인 수정
sudo systemctl reload nginx
```

검증:
- 외부 접속 정상
- `/var/log/nginx/error.log` 에 신규 오류 없는지 확인

## 시나리오 4: 방화벽 차단 이슈
재현:
```bash
sudo ufw deny 80
```

증상:
- 외부 접속 불가

복구:
```bash
sudo ufw allow 80
sudo ufw status numbered
```

검증:
- 외부 브라우저 접속 정상

## 기록 양식 (권장)
- 발생 시각:
- 증상:
- 영향 범위:
- 원인:
- 조치:
- 재발 방지:
- 로그 근거:
