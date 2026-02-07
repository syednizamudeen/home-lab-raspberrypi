# home-lab-raspberrypi

## Commands
### Access Docker Container Shell
```
docker exec -it nginx-web /bin/sh
docker exec -it infanina-app /bin/sh
```
### List Docker Containers
```
docker container ls
```
### Docker Container Log
```
docker compose logs -f nginx-web
docker logs -f uptime-kuma
docker logs -f infanina-app
```
### Docker Start Detached
```
docker compose up -d
```
### Docker Stop
```
docker compose down
```
### Self Hosted GitHub Runner Status
```
cd /home/pi/actions-runner && sudo ./svc.sh status
```
### Services Running
- [x] Business Page
- [x] UpTime Monitoring
- [x] Nginx React
- [x] Github Workflow
### Todo
- [ ] N8N
- [ ] Blue/Green Deployment
- [ ] SEO
- [ ] Analytics
- [ ] OG Implementation
- [ ] Social Media Handle
- [ ] Hardening
- [ ] CSP Check