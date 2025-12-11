//Format file size to human readable format
export function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

//Truncate text to specified length
export function truncateText(text, maxLength = 100) {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

//Capitalize first letter of string
export function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

//Convert string to title case
export function toTitleCase(str) {
  if (!str) return "";
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => capitalize(word))
    .join(" ");
}

//Generate random ID
export function generateId() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

//Debounce function
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

//Throttle function
export function throttle(func, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

//Deep clone object
export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

//Check if object is empty
export function isEmpty(obj) {
  if (!obj) return true;
  return Object.keys(obj).length === 0;
}

//Remove duplicates from array
export function removeDuplicates(arr, key) {
  if (!key) return [...new Set(arr)];

  const seen = new Set();
  return arr.filter((item) => {
    const value = item[key];
    if (seen.has(value))  return false;

    seen.add(value);
    return true;
  });
}

//Group array by key
export function groupBy(arr, key) {
  return arr.reduce((result, item) => {
    const group = item[key];
    if (!result[group]) result[group] = [];

    result[group].push(item);
    return result;
  }, {});
}

//Sort array by key
export function sortBy(arr, key, order = "asc") {
  return [...arr].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];

    if (order === "asc") { return aVal > bVal ? 1 : -1;
    } else { return aVal < bVal ? 1 : -1; }
  });
}

//Filter array by search term
export function filterBySearch(arr, searchTerm, keys) {
  if (!searchTerm) return arr;

  const term = searchTerm.toLowerCase();
  return arr.filter((item) => {
    return keys.some((key) => {
      const value = item[key];
      if (!value) return false;
      return value.toString().toLowerCase().includes(term);
    });
  });
}

//Create URL with query params
export function createUrlWithParams(baseUrl, params) {
  const url = new URL(baseUrl);
  Object.keys(params).forEach((key) => {
    if (params[key] !== null && params[key] !== undefined) {
      url.searchParams.append(key, params[key]);
    }
  });
  return url.toString();
}

//Parse query string to object
export function parseQueryString(queryString) {
  const params = new URLSearchParams(queryString);
  const result = {};
  for (const [key, value] of params) {
    result[key] = value;
  }
  return result;
}

//Copy text to clipboard
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error("Failed to copy to clipboard:", error);
    return false;
  }
}

//Download file from URL
export function downloadFile(url, filename) {
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

//Check if user is online
export function isOnline() {
  return navigator.onLine;
}

//Get browser info
export function getBrowserInfo() {
  const ua = navigator.userAgent;
  let browser = "Unknown";

  if (ua.includes("Firefox")) browser = "Firefox";
  else if (ua.includes("Chrome")) browser = "Chrome";
  else if (ua.includes("Safari")) browser = "Safari";
  else if (ua.includes("Edge")) browser = "Edge";

  return { browser, userAgent: ua, platform: navigator.platform, language: navigator.language, };
}

//Format number with commas
export function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

//Calculate percentage
export function calculatePercentage(value, total) {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

//Sleep/delay function
export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

//Retry function with exponential backoff
export async function retryWithBackoff(fn, maxRetries = 3, delay = 1000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await sleep(delay * Math.pow(2, i));
    }
  }
}
