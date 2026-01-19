# home-lab-raspberrypi

## Commands
### Access Docker Container Shell
```
docker exec -it nginx-web /bin/sh
```
### List Docker Containers
```
docker container ls
```
### Docker Container Log
```
docker compose logs -f nginx-web
docker logs -f uptime-kuma
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
- [x] UpTime Monitoring
- [x] Nginx React
- [x] Github Workflow
### Todo
- [ ] Business Page
- [ ] Blue/Green Deployment