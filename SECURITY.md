## 🔐 Security Setup

This application implements several security measures to protect against common vulnerabilities and ensure safe operation.

### 🛡️ Security Features Implemented

#### **Input Sanitization**
- All user inputs are sanitized using DOMPurify
- File names are validated and cleaned
- Report content is limited in size and cleaned of dangerous characters
- Crypto symbols are validated against allowed patterns

#### **Download Security**
- Safe file download mechanism without DOM manipulation
- Filename sanitization to prevent path traversal
- Content size limits to prevent memory exhaustion
- Secure MIME types for downloads

#### **Rate Limiting**
- API request rate limiting (5 requests per minute)
- Prevents abuse and DoS attacks
- User feedback when limits are exceeded

#### **Environment Protection**
- Sensitive configuration moved to environment variables
- API keys properly masked in logs
- Development vs production configuration separation

#### **Content Security Policy (CSP)**
- Restrictive CSP headers configured
- Prevention of XSS attacks
- Controlled resource loading

### 🔧 Environment Variables

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```

2. **Configure your API keys:**
   ```bash
   # Edit .env file
   VITE_COINCAP_API_KEY=your_actual_api_key_here
   VITE_COINCAP_BASE_URL=https://api.coincap.io/v2
   VITE_AGENT_FINANCE_BASE_URL=http://localhost:8000
   ```

3. **Never commit `.env` to version control**

### 🔑 CoinCap API Key

1. Get your free API key from [CoinCap.io](https://coincap.io/api-key)
2. Add it to your `.env` file
3. The app will use mock data if no valid API key is provided

### 🚀 Production Deployment

For production, set environment variables in your hosting platform:
- **Vercel**: Project Settings → Environment Variables
- **Netlify**: Site Settings → Environment Variables  
- **Railway**: Variables tab

**⚠️ NEVER expose API keys in client-side code or commits!**

### 🔍 Security Checklist

Before deploying to production:

#### ✅ **Environment Security**
- [ ] `.env` file is in `.gitignore`
- [ ] API keys are configured in hosting platform
- [ ] No hardcoded secrets in source code
- [ ] Environment variables are properly validated

#### ✅ **Application Security**
- [ ] All user inputs are sanitized
- [ ] File downloads are secure
- [ ] Rate limiting is enabled
- [ ] Error messages don't expose sensitive information

#### ✅ **Build Security**
- [ ] Source maps are disabled in production
- [ ] Console logs are removed in production builds
- [ ] CSP headers are configured
- [ ] Dependencies are up to date

### 🚨 Security Considerations

#### **Limitations of Frontend Security**
- Vite environment variables prefixed with `VITE_` are **public** in the browser
- API keys will be visible to users in the final bundle
- Use API keys with appropriate rate limits and restrictions
- Consider implementing a backend proxy for sensitive operations

#### **For Enhanced Security**
1. **Backend Proxy**: Route API calls through your backend
2. **API Key Rotation**: Regularly rotate API keys
3. **Monitoring**: Monitor API usage for unusual patterns
4. **HTTPS**: Always use HTTPS in production

### 📋 Vulnerability Prevention

#### **XSS (Cross-Site Scripting)**
- Input sanitization with DOMPurify
- Content Security Policy headers
- Safe DOM manipulation practices

#### **Path Traversal**
- Filename sanitization
- Restricted file download paths
- Input validation

#### **DoS (Denial of Service)**
- Rate limiting on API requests
- Content size limits
- Request timeout configuration

#### **Information Disclosure**
- Sensitive data masking in logs
- Error message sanitization
- Development information removal in production

### 🔄 Regular Security Tasks

#### **Weekly**
- [ ] Review API usage logs
- [ ] Check for dependency updates
- [ ] Monitor rate limit violations

#### **Monthly**
- [ ] Rotate API keys
- [ ] Review CSP policies
- [ ] Audit application logs

#### **Before Each Release**
- [ ] Run security audit: `npm audit`
- [ ] Test with production environment variables
- [ ] Verify CSP headers
- [ ] Check for exposed secrets

### 📞 Security Contact

If you discover a security vulnerability:
1. **Do not** create a public GitHub issue
2. Email security concerns privately
3. Provide detailed reproduction steps
4. Allow time for responsible disclosure

### 🔗 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [MDN Security](https://developer.mozilla.org/en-US/docs/Web/Security)
- [Vite Security Guide](https://vitejs.dev/guide/env-and-mode.html#security-notes)
