// Watches what you type in any text field. When you pause, the English you just
// typed (everything after the last Japanese character on the current line) is
// translated and swapped in place with Japanese.

(() => {
  const DELAY_MS = 700;      // pause after typing before translating
  const MAX_CHARS = 3000;    // safety cap per translation
  const NON_JP_TAIL = /[^\u3000-\u30ff\u3400-\u9fff\uff00-\uffef\n]*$/;
  const HAS_LATIN = /[A-Za-z]/;
  const BAD_INPUT_TYPES = new Set([
    "password", "email", "url", "number", "tel", "date", "datetime-local",
    "month", "week", "time", "color", "file", "checkbox", "radio", "range",
    "submit", "button", "reset", "image", "hidden"
  ]);

  let enabled = true;
  let timer = null;
  let applying = false;

  chrome.storage.local.get({ enabled: true }, (v) => { enabled = v.enabled; });
  chrome.storage.onChanged.addListener((changes) => {
    if (changes.enabled) enabled = changes.enabled.newValue;
  });

  function isTextInput(el) {
    if (!el) return false;
    if (el.tagName === "TEXTAREA") return true;
    if (el.tagName === "INPUT") {
      const type = (el.getAttribute("type") || "text").toLowerCase();
      return !BAD_INPUT_TYPES.has(type);
    }
    return !!el.isContentEditable;
  }

  // Returns { tail, apply(japanese) -> bool } for the text right before the caret, or null.
  function getTarget(el) {
    if (el.tagName === "TEXTAREA" || el.tagName === "INPUT") {
      let s, e;
      try { s = el.selectionStart; e = el.selectionEnd; } catch (_) { return null; }
      if (s == null || s !== e) return null;
      const before = el.value.slice(0, s);
      const tail = before.match(NON_JP_TAIL)[0];
      return {
        tail,
        apply(ja) {
          const cur = el.value.slice(0, el.selectionStart);
          if (el.selectionStart !== el.selectionEnd || !cur.endsWith(tail)) return false;
          el.setSelectionRange(el.selectionStart - tail.length, el.selectionStart);
          if (document.execCommand("insertText", false, ja)) return true;
          // Fallback for fields that don't support execCommand
          const pos = el.selectionStart;
          const setter = Object.getOwnPropertyDescriptor(
            Object.getPrototypeOf(el), "value"
          ).set;
          setter.call(el, el.value.slice(0, pos) + ja + el.value.slice(el.selectionEnd));
          el.setSelectionRange(pos + ja.length, pos + ja.length);
          el.dispatchEvent(new Event("input", { bubbles: true }));
          return true;
        }
      };
    }

    // contenteditable (Gmail, Discord, Slack, WhatsApp Web, Notion, etc.)
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || !sel.isCollapsed) return null;
    const node = sel.anchorNode;
    if (!node || node.nodeType !== Node.TEXT_NODE) return null;
    const offset = sel.anchorOffset;
    const tail = node.data.slice(0, offset).match(NON_JP_TAIL)[0];
    return {
      tail,
      apply(ja) {
        const s2 = window.getSelection();
        if (!s2 || s2.anchorNode !== node || s2.anchorOffset !== offset) return false;
        if (!node.data.slice(0, offset).endsWith(tail)) return false;
        const range = document.createRange();
        range.setStart(node, offset - tail.length);
        range.setEnd(node, offset);
        s2.removeAllRanges();
        s2.addRange(range);
        return document.execCommand("insertText", false, ja);
      }
    };
  }

  async function run(el) {
    if (!enabled || !isTextInput(el)) return;
    if ((el.getRootNode().activeElement || document.activeElement) !== el &&
        document.activeElement !== el) return;

    const target = getTarget(el);
    if (!target) return;
    const tail = target.tail;
    if (!HAS_LATIN.test(tail) || tail.length > MAX_CHARS) return;

    const core = tail.trim();
    let resp;
    try {
      resp = await chrome.runtime.sendMessage({ type: "translate", text: core });
    } catch (_) { return; }
    if (!resp || !resp.ok || !resp.result) return;

    // The user may have kept typing while we waited. If so, drop this result;
    // a newer translation is already scheduled.
    const now = getTarget(el);
    if (!now || now.tail !== tail) return;

    applying = true;
    try { now.apply(resp.result); } finally { applying = false; }
  }

  document.addEventListener("input", (e) => {
    if (applying || e.isComposing || !enabled) return;
    const el = (e.composedPath && e.composedPath()[0]) || e.target;
    if (!isTextInput(el)) return;
    clearTimeout(timer);
    timer = setTimeout(() => run(el), DELAY_MS);
  }, true);
})();
