# Attendance and Payroll
`use sudo if needed`

Implement HTTPS Letsencrypt
https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-16-04

Auto renew certificate
https://websiteforstudents.com/secure-nginx-https-websites-with-lets-encrypt-free-ssl-tls-on-ubuntu-16-04-18-04/

## How to Deploy
### Backend
#### In Local (Your PC)
```bash
$ cd backend
$ npm run build
$ git add .
$ git commit -m "build backend for deploy"
$ git push origin development
```

#### In Server
```bash
$ cd attendance-and-payroll/backend
$ git pull origin development
$ pm2 restart app

`if this command not work, do this`
$ pm2 kill
$ pm2 start --name="app" --env staging
```

### Frontend
#### In Local (Your PC)
```bash
$ cd frontend
`for development mode`
$ npm run build:dev
`for staging mode`
$ npm run build:staging
`for production mode`
$ npm run build:prod
$ git add .
$ git commit -m "build frontend for deploy"
$ git push origin development
```

#### In Server
```bash
$ cd attendance-and-payroll/frontend
$ git pull origin development
$ sudo systemctl restart nginx
```