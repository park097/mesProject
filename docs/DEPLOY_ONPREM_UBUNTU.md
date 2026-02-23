# 온프레미스 배포 가이드 (Ubuntu + Nginx + MySQL)

## 1. 백엔드 빌드
로컬 또는 CI에서:
```bash
./gradlew clean build
```

산출물:
- `build/libs/mes-0.0.1-SNAPSHOT.jar` (예시)

## 2. 서버 업로드
```bash
scp build/libs/mes-0.0.1-SNAPSHOT.jar user@SERVER_IP:/opt/mes/mes.jar
```

## 3. 애플리케이션 실행
```bash
cd /opt/mes
nohup java -jar mes.jar --spring.profiles.active=prod > app.log 2>&1 &
```

확인:
```bash
ps -ef | grep mes.jar
tail -f /opt/mes/app.log
```

## 4. Nginx 리버스 프록시
설정 파일 예시: `/etc/nginx/sites-available/mes`
```nginx
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

적용:
```bash
sudo ln -s /etc/nginx/sites-available/mes /etc/nginx/sites-enabled/mes
sudo nginx -t
sudo systemctl reload nginx
```

## 5. 방화벽(UFW)
```bash
sudo ufw allow 80
sudo ufw deny 8080
sudo ufw deny 3306
sudo ufw status numbered
```

## 6. 검증
- 외부 브라우저에서 `http://공인IP` 접속
- 로그인 성공 확인
- 품목 등록/재고 반영 후 DB 데이터 확인

## 7. 운영 권장사항
- `systemd` 서비스로 전환하여 자동 재시작 설정
- 로그 로테이션(logrotate) 설정
- prod 설정파일(`application-prod.yml`)에 DB/JWT 비밀값 외부화
