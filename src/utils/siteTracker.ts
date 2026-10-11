// Lightweight, privacy-respecting client-side tracker for Teachers At Home

function getSessionId(): string {
  try {
    let sid = sessionStorage.getItem('tah_sid');
    if (!sid) {
      sid = 'sess_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
      sessionStorage.setItem('tah_sid', sid);
    }
    return sid;
  } catch {
    return 'sess_' + Date.now().toString(36);
  }
}

function getDeviceType(): 'Mobile' | 'Tablet' | 'Desktop' {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'Tablet';
  }
  if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(ua)) {
    return 'Mobile';
  }
  return 'Desktop';
}

function getBrowserName(): string {
  const ua = navigator.userAgent;
  if (ua.includes('Chrome') && !ua.includes('Edg')) return 'Chrome';
  if (ua.includes('Edg')) return 'Edge';
  if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
  if (ua.includes('Firefox')) return 'Firefox';
  return 'Browser';
}

function getReferrer(): string {
  const ref = document.referrer;
  if (!ref) return 'Direct';
  try {
    const url = new URL(ref);
    if (url.hostname.includes('google')) return 'Google';
    if (url.hostname.includes('whatsapp') || url.hostname.includes('wa.me')) return 'WhatsApp';
    if (url.hostname.includes('facebook') || url.hostname.includes('instagram')) return 'Meta/Social';
    if (url.hostname.includes('youtube')) return 'YouTube';
    return url.hostname;
  } catch {
    return 'Referral';
  }
}

export function trackEvent(eventType: string, eventLabel?: string, pagePath?: string) {
  try {
    const payload = {
      page_path: pagePath || window.location.pathname || '/',
      event_type: eventType,
      event_label: eventLabel || null,
      device_type: getDeviceType(),
      browser: getBrowserName(),
      referrer: getReferrer(),
      session_id: getSessionId()
    };

    // Use sendBeacon if available, otherwise fetch keepalive
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
      navigator.sendBeacon('/api/track', blob);
    } else {
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true
      }).catch(() => {});
    }
  } catch (err) {
    // Non-blocking
  }
}

export function trackPageView(pagePath?: string) {
  trackEvent('page_view', 'Page Loaded', pagePath);
}
