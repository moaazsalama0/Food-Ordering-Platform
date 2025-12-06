# Deployment Guide

This guide will help you deploy the Food Ordering Backend API to production.

## 🚀 Deployment Options

### Option 1: Railway (Recommended)

1. **Connect GitHub Repository**
   - Go to [railway.app](https://railway.app)
   - Connect your GitHub repository
   - Select the backend folder

2. **Configure Environment Variables**
   - Add all variables from `.env.example`
   - Railway will automatically deploy on push

3. **Database Setup**
   - Add PostgreSQL plugin from Railway
   - Update DATABASE_URL environment variable

### Option 2: Heroku

1. **Create Heroku App**
   ```bash
   heroku create your-app-name
   ```

2. **Add PostgreSQL Database**
   ```bash
   heroku addons:create heroku-postgresql:hobby-dev
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=your_jwt_secret
   # Add other environment variables
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

### Option 3: DigitalOcean

1. **Create Droplet**
   - Choose Node.js application
   - Select appropriate size

2. **Setup Database**
   - Create managed PostgreSQL database
   - Configure connection settings

3. **Deploy Application**
   - SSH into droplet
   - Clone repository
   - Install dependencies
   - Start with PM2

## 🛠️ Production Configuration

### Environment Variables

```env
NODE_ENV=production
PORT=5000

# Database
DB_HOST=your-db-host
DB_PORT=5432
DB_NAME=food_ordering_prod
DB_USER=your-db-user
DB_PASSWORD=your-db-password

# Security
JWT_SECRET=your-super-secure-jwt-secret-min-32-chars
JWT_EXPIRE=7d

# Stripe
STRIPE_SECRET_KEY=sk_live_your_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Frontend
FRONTEND_URL=https://your-frontend-domain.com
```

### SSL Certificate

1. **Using Let's Encrypt**
   ```bash
   sudo apt update
   sudo apt install certbot nginx
   sudo certbot --nginx -d yourdomain.com
   ```

2. **Configure Nginx**
   ```nginx
   server {
       listen 443 ssl;
       server_name yourdomain.com;

       ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

### Process Management

**Using PM2**
```bash
# Install PM2 globally
npm install -g pm2

# Start application
pm2 start server.js --name food-ordering-api

# Save PM2 configuration
pm2 save

# Setup startup script
pm2 startup
```

### Database Migration

```bash
# Run database initialization
npm run seed

# For production, create migration script
node scripts/migrateProduction.js
```

## 🔧 Monitoring & Logging

### PM2 Monitoring
```bash
# Monitor application
pm2 monit

# View logs
pm2 logs

# View application status
pm2 status
```

### Error Tracking
Consider integrating with:
- Sentry for error tracking
- LogRocket for user session tracking
- New Relic for performance monitoring

## 📊 Performance Optimization

### Database Optimization
1. **Add Indexes**
   ```sql
   CREATE INDEX idx_menu_items_category ON menu_items(category_id);
   CREATE INDEX idx_orders_user ON orders(user_id);
   CREATE INDEX idx_orders_status ON orders(status);
   ```

2. **Connection Pooling**
   ```javascript
   // Already configured in database.js
   max: 20,
   idleTimeoutMillis: 30000,
   ```

### API Optimization
1. **Enable Compression**
   ```bash
   npm install compression
   ```

2. **Implement Caching**
   ```bash
   npm install redis
   ```

3. **Optimize Images**
   - Use CDN for image delivery
   - Implement image compression

## 🔒 Security Best Practices

### 1. Keep Dependencies Updated
```bash
npm audit
npm update
```

### 2. Use Environment Variables
Never hardcode secrets in code.

### 3. Implement Rate Limiting
Already configured in server.js.

### 4. Enable CORS Properly
Configure for production domain only.

### 5. Use HTTPS
Always use SSL certificates in production.

## 📋 Pre-Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrated
- [ ] SSL certificate installed
- [ ] Error tracking configured
- [ ] Monitoring setup
- [ ] Backup strategy implemented
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] CORS configured for production
- [ ] Process manager configured

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection**
   - Check connection string
   - Verify firewall rules
   - Ensure database is running

2. **Port Already in Use**
   ```bash
   lsof -i :5000
   kill -9 <PID>
   ```

3. **Memory Issues**
   - Increase Node.js memory limit
   - Implement caching
   - Optimize database queries

4. **CORS Issues**
   - Verify frontend URL in environment
   - Check CORS configuration

### Support

For deployment support:
- Check application logs: `pm2 logs`
- Monitor system resources: `htop`
- Database logs: Check PostgreSQL logs

## 📈 Scaling

### Horizontal Scaling
- Use load balancer (NGINX)
- Implement session storage (Redis)
- Database read replicas

### Vertical Scaling
- Increase server resources
- Optimize database performance
- Implement caching layers

---

**Happy Deploying! 🚀**