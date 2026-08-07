const INDEXNOW_KEY = process.env.INDEXNOW_KEY || '';
const BASE_URL = 'https://www.kalaconnect.me';
const BING_ENDPOINT = 'https://api.bing.com/indexnow';

export async function submitToBing(urls: string | string[]): Promise<boolean> {
  if (!INDEXNOW_KEY || process.env.NODE_ENV === 'development') {
    if (process.env.NODE_ENV === 'development') {
      console.log('[IndexNow] Skipping Bing submission in development mode');
    }
    return false;
  }

  const urlList = Array.isArray(urls) ? urls : [urls];
  const payload = {
    host: new URL(BASE_URL).hostname,
    key: INDEXNOW_KEY,
    urls: urlList,
  };

  try {
    const response = await fetch(`${BING_ENDPOINT}?key=${INDEXNOW_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      console.log(`[IndexNow] Submitted ${urlList.length} URLs to Bing`);
      return true;
    } else {
      console.error(`[IndexNow] Bing submission failed: ${response.status} ${response.statusText}`);
      return false;
    }
  } catch (error) {
    console.error('[IndexNow] Submission error:', error);
    return false;
  }
}

export async function notifyUrlUpdate(urls: string[]): Promise<void> {
  if (process.env.NODE_ENV === 'development') {
    console.log('[IndexNow] notifyUrlUpdate skipped in development mode');
    return;
  }
  await submitToBing(urls);
}

export async function notifyUrlRemoval(urls: string[]): Promise<void> {
  if (process.env.NODE_ENV === 'development') {
    console.log('[IndexNow] notifyUrlRemoval skipped in development mode');
    return;
  }
  await submitToBing(urls);
}

export { INDEXNOW_KEY };
