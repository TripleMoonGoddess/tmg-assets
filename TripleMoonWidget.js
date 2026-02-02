// Triple Moon Goddess - Personal Widget
const API_URL = 'https://script.google.com/macros/s/AKfycbzrixpvCg1yNeUtIEfvDLJb9JigcsC1MoQrXVyFDCI9krHakKEMcdzYZPlbt6NWqjE9/exec';
const LOGO_URL = 'https://raw.githubusercontent.com/TripleMoonGoddess/tmg-assets/main/logo.jpg';
const USER_EMAIL = args.widgetParameter || '';

const SIGN_SYMBOLS = {
  'Aries': '♈', 'Taurus': '♉', 'Gemini': '♊', 'Cancer': '♋',
  'Leo': '♌', 'Virgo': '♍', 'Libra': '♎', 'Scorpio': '♏',
  'Sagittarius': '♐', 'Capricorn': '♑', 'Aquarius': '♒', 'Pisces': '♓'
};

async function fetchData() {
  try {
    const url = USER_EMAIL 
      ? `${API_URL}?action=personal&email=${encodeURIComponent(USER_EMAIL)}`
      : `${API_URL}?action=general`;
    const req = new Request(url);
    req.timeoutInterval = 30;
    return await req.loadJSON();
  } catch (e) {
    return { error: e.message };
  }
}

async function loadLogo() {
  try {
    const req = new Request(LOGO_URL);
    return await req.loadImage();
  } catch (e) {
    return null;
  }
}

function getOrdinal(n) {
  if (!n) return '';
  const num = parseInt(n);
  const s = ['th', 'st', 'nd', 'rd'];
  const v = num % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

function applyBackground(widget) {
  const gradient = new LinearGradient();
  gradient.locations = [0, 1];
  gradient.colors = [new Color('#0a0a1a'), new Color('#1a1a2e')];
  widget.backgroundGradient = gradient;
}

// ============ SMALL WIDGET ============
async function createSmallWidget(data, logo) {
  const widget = new ListWidget();
  applyBackground(widget);
  
  if (data.chartUrl) widget.url = data.chartUrl;
  
  if (data.error) {
    const err = widget.addText(USER_EMAIL ? '⚠️ Email not found' : '⚠️ Add email');
    err.textColor = new Color('#ff6b6b');
    err.font = Font.systemFont(12);
    return widget;
  }
  
  // Center content vertically
  widget.addSpacer();
  
  // Logo
  if (logo) {
    const logoImg = widget.addImage(logo);
    logoImg.imageSize = new Size(36, 36);
    logoImg.cornerRadius = 6;
    logoImg.centerAlignImage();
  }
  
  widget.addSpacer(8);
  
  // Moon - compact
  const moonStack = widget.addStack();
  moonStack.layoutHorizontally();
  moonStack.centerAlignContent();
  const moonEmoji = moonStack.addText(data.moon?.emoji || '🌙');
  moonEmoji.font = Font.systemFont(18);
  moonStack.addSpacer(6);
  const moonText = moonStack.addText(`${data.moon?.sign || ''} ${data.moon?.degree || ''}°`);
  moonText.textColor = new Color('#e8e0ff');
  moonText.font = Font.mediumSystemFont(13);
  
  widget.addSpacer(8);
  
  // Next Transit - one line
  if (data.transits?.length > 0) {
    const t = data.transits[0];
    const transitText = widget.addText(`${t.transit} ☌ ${t.natal} ${t.daysUntil}d`);
    transitText.textColor = new Color('#aabbcc');
    transitText.font = Font.systemFont(11);
    transitText.centerAlignText();
  }
  
  widget.addSpacer(6);
  
  // Retrogrades - compact
  const retros = data.retrogrades?.active || [];
  if (retros.length > 0) {
    const retroText = retros.slice(0, 2).map(r => `${r.planet} Rx`).join(' • ');
    const rt = widget.addText(retroText);
    rt.textColor = new Color('#ff6b6b');
    rt.font = Font.systemFont(11);
    rt.centerAlignText();
  }
  
  // Center content vertically
  widget.addSpacer();
  
  return widget;
}

// ============ MEDIUM WIDGET ============
async function createMediumWidget(data, logo) {
  const widget = new ListWidget();
  applyBackground(widget);
  
  if (data.chartUrl) widget.url = data.chartUrl;
  
  if (data.error) {
    const err = widget.addText(USER_EMAIL ? '⚠️ Email not found' : '⚠️ Add your email');
    err.textColor = new Color('#ff6b6b');
    err.font = Font.systemFont(12);
    return widget;
  }
  
  // Logo
  if (logo) {
    const logoImg = widget.addImage(logo);
    logoImg.imageSize = new Size(36, 36);
    logoImg.cornerRadius = 6;
  }
  
  widget.addSpacer(4);
  
  // Moon
  const moonStack = widget.addStack();
  moonStack.layoutHorizontally();
  moonStack.centerAlignContent();
  const moonEmoji = moonStack.addText(data.moon?.emoji || '🌙');
  moonEmoji.font = Font.systemFont(16);
  moonStack.addSpacer(4);
  const moonText = moonStack.addText(`Moon in ${data.moon?.sign || ''} ${data.moon?.degree || ''}°`);
  moonText.textColor = new Color('#e8e0ff');
  moonText.font = Font.mediumSystemFont(11);
  
  widget.addSpacer(4);
  
  // Next Transit
  if (data.transits?.length > 0) {
    const t = data.transits[0];
    const transitHeader = widget.addText('NEXT TRANSIT');
    transitHeader.textColor = new Color('#666677');
    transitHeader.font = Font.boldSystemFont(7);
    widget.addSpacer(1);
    
    const transitLine1 = widget.addText(`${t.transit} in ${t.transitSign} (${t.transitHouse}${getOrdinal(t.transitHouse)})`);
    transitLine1.textColor = new Color('#aabbcc');
    transitLine1.font = Font.systemFont(9);
    
    const transitLine2 = widget.addText(`☌ ${t.natal} in ${t.natalSign} (${t.natalHouse}${getOrdinal(t.natalHouse)})`);
    transitLine2.textColor = new Color('#aabbcc');
    transitLine2.font = Font.systemFont(9);
    
    const daysText = widget.addText(`${t.daysUntil} days`);
    daysText.textColor = new Color('#4a9');
    daysText.font = Font.systemFont(8);
    
    widget.addSpacer(4);
  }
  
  // Personal Retrogrades
  const retros = data.retrogrades?.active || [];
  if (retros.length > 0) {
    const retroHeader = widget.addText('PERSONAL RETROGRADES');
    retroHeader.textColor = new Color('#666677');
    retroHeader.font = Font.boldSystemFont(7);
    widget.addSpacer(1);
    
    for (const r of retros.slice(0, 2)) {
      const houseText = r.house ? ` (${r.house}${getOrdinal(r.house)})` : '';
      const retroLine = widget.addText(`${r.planet} Rx in ${r.sign}${houseText}`);
      retroLine.textColor = new Color('#ff6b6b');
      retroLine.font = Font.systemFont(9);
      
      const directLine = widget.addText(`  direct ${r.directDate} (${r.daysUntilDirect}d)`);
      directLine.textColor = new Color('#ffaa66');
      directLine.font = Font.systemFont(8);
    }
  }
  
  return widget;
}

// ============ LARGE WIDGET ============
async function createLargeWidget(data, logo) {
  const widget = new ListWidget();
  applyBackground(widget);
  
  if (data.chartUrl) widget.url = data.chartUrl;
  
  if (data.error) {
    const err = widget.addText(USER_EMAIL ? '⚠️ Email not found' : '⚠️ Add your email');
    err.textColor = new Color('#ff6b6b');
    err.font = Font.systemFont(14);
    return widget;
  }
  
  // Header with logo
  const headerStack = widget.addStack();
  headerStack.layoutHorizontally();
  headerStack.centerAlignContent();
  
  if (logo) {
    const logoImg = headerStack.addImage(logo);
    logoImg.imageSize = new Size(50, 50);
    logoImg.cornerRadius = 10;
    headerStack.addSpacer(12);
  }
  
  const titleStack = headerStack.addStack();
  titleStack.layoutVertically();
  const title = titleStack.addText('Triple Moon Goddess');
  title.textColor = new Color('#c9b8ff');
  title.font = Font.boldSystemFont(16);
  const subtitle = titleStack.addText('Personal Astrology');
  subtitle.textColor = new Color('#666677');
  subtitle.font = Font.systemFont(11);
  
  widget.addSpacer(12);
  
  // Moon section - larger
  const moonSection = widget.addStack();
  moonSection.layoutHorizontally();
  moonSection.centerAlignContent();
  
  const moonEmoji = moonSection.addText(data.moon?.emoji || '🌙');
  moonEmoji.font = Font.systemFont(32);
  moonSection.addSpacer(10);
  
  const moonInfo = moonSection.addStack();
  moonInfo.layoutVertically();
  
  const moonTitle = moonInfo.addText(`Moon in ${data.moon?.sign || ''}`);
  moonTitle.textColor = new Color('#e8e0ff');
  moonTitle.font = Font.boldSystemFont(16);
  
  const moonDetails = moonInfo.addText(`${data.moon?.degree || ''}° • ${data.moon?.phase || ''}`);
  moonDetails.textColor = new Color('#888899');
  moonDetails.font = Font.systemFont(12);
  
  widget.addSpacer(12);
  
  // Divider
  const divider1 = widget.addStack();
  divider1.backgroundColor = new Color('#333344');
  divider1.size = new Size(0, 1);
  widget.addSpacer(12);
  
  // Transits section
  if (data.transits?.length > 0) {
    const transitHeader = widget.addText('UPCOMING TRANSITS');
    transitHeader.textColor = new Color('#666677');
    transitHeader.font = Font.boldSystemFont(10);
    widget.addSpacer(6);
    
    for (const t of data.transits.slice(0, 3)) {
      const tStack = widget.addStack();
      tStack.layoutHorizontally();
      
      const tLeft = tStack.addStack();
      tLeft.layoutVertically();
      tLeft.size = new Size(260, 0);
      
      const tLine1 = tLeft.addText(`${t.transit} in ${t.transitSign} (${t.transitHouse}${getOrdinal(t.transitHouse)}) ☌`);
      tLine1.textColor = new Color('#aabbcc');
      tLine1.font = Font.systemFont(12);
      
      const tLine2 = tLeft.addText(`${t.natal} in ${t.natalSign} (${t.natalHouse}${getOrdinal(t.natalHouse)})`);
      tLine2.textColor = new Color('#aabbcc');
      tLine2.font = Font.systemFont(12);
      
      tStack.addSpacer();
      
      const tDays = tStack.addText(`${t.daysUntil}d`);
      tDays.textColor = new Color('#4a9');
      tDays.font = Font.boldSystemFont(14);
      
      widget.addSpacer(6);
    }
    
    widget.addSpacer(6);
  }
  
  // Divider
  const divider2 = widget.addStack();
  divider2.backgroundColor = new Color('#333344');
  divider2.size = new Size(0, 1);
  widget.addSpacer(12);
  
  // Retrogrades section
  const retros = data.retrogrades?.active || [];
  const retroHeader = widget.addText('PERSONAL RETROGRADES');
  retroHeader.textColor = new Color('#666677');
  retroHeader.font = Font.boldSystemFont(10);
  widget.addSpacer(6);
  
  if (retros.length === 0) {
    const noRetro = widget.addText('No retrogrades affecting your chart ✨');
    noRetro.textColor = new Color('#4a9');
    noRetro.font = Font.systemFont(12);
  } else {
    for (const r of retros.slice(0, 4)) {
      const rStack = widget.addStack();
      rStack.layoutHorizontally();
      
      const rLeft = rStack.addStack();
      rLeft.layoutVertically();
      rLeft.size = new Size(220, 0);
      
      const houseText = r.house ? ` (${r.house}${getOrdinal(r.house)} house)` : '';
      const rLine1 = rLeft.addText(`${r.planet} Rx in ${r.sign}${houseText}`);
      rLine1.textColor = new Color('#ff6b6b');
      rLine1.font = Font.mediumSystemFont(12);
      
      if (r.affects?.length > 0) {
        const rLine2 = rLeft.addText(`Affecting your ${r.affects.join(', ')}`);
        rLine2.textColor = new Color('#888899');
        rLine2.font = Font.systemFont(10);
      }
      
      rStack.addSpacer();
      
      const rDirect = rStack.addStack();
      rDirect.layoutVertically();
      
      const rDate = rDirect.addText(r.directDate);
      rDate.textColor = new Color('#ffaa66');
      rDate.font = Font.systemFont(11);
      rDate.rightAlignText();
      
      const rDays = rDirect.addText(`${r.daysUntilDirect}d`);
      rDays.textColor = new Color('#ffaa66');
      rDays.font = Font.boldSystemFont(12);
      rDays.rightAlignText();
      
      widget.addSpacer(8);
    }
  }
  
  widget.addSpacer();
  
  return widget;
}

// ============ MAIN ============
async function createWidget() {
  const data = await fetchData();
  const logo = await loadLogo();
  const size = config.widgetFamily || 'medium';
  
  if (size === 'small') {
    return createSmallWidget(data, logo);
  } else if (size === 'large') {
    return createLargeWidget(data, logo);
  } else {
    return createMediumWidget(data, logo);
  }
}

const widget = await createWidget();
if (config.runsInWidget) {
  Script.setWidget(widget);
} else {
  // Preview - change to test different sizes
  widget.presentLarge();
}
Script.complete();
