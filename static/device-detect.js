function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// 页面加载时检测设备并跳转
if (isMobile()) {
  window.location.href = 'mobile.html';
}