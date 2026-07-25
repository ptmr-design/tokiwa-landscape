/**
 * main.js
 * 機能単位のモジュール構成。JS操作は js- プレフィックスのフックのみ使用する。
 * サイドバーのメニュー開閉(ホバー)と無限スライダーはCSSで実装している。
 */

/**
 * ローディング画面(初回アクセス時のみ・sessionStorageで判定)
 * 再訪時の非表示は head 内スクリプトが付与する html.is-visited が担う
 */
const initLoading = () => {
  const loading = document.querySelector(".js-loading");
  if (!loading) return;

  const done = () => {
    loading.classList.add("is-done");
    sessionStorage.setItem("tokiwagi-visited", "true");
  };

  if (document.documentElement.classList.contains("is-visited")) return;

  // ロゴを見せてからフェードアウト
  window.addEventListener("load", () => {
    setTimeout(done, 1200);
  });
};

/**
 * お知らせモーダル(<dialog>)
 */
const initModal = () => {
  const openButtons = document.querySelectorAll(".js-modal-open");
  if (openButtons.length === 0) return;

  openButtons.forEach((button) => {
    const dialog = document.getElementById(button.dataset.modal);
    if (!dialog) return;

    button.addEventListener("click", () => {
      dialog.showModal();
      document.body.style.overflow = "hidden";
    });
  });

  document.querySelectorAll("dialog.js-modal").forEach((dialog) => {
    dialog.querySelectorAll(".js-modal-close").forEach((button) => {
      button.addEventListener("click", () => dialog.close());
    });

    // パネル外(オーバーレイ)クリックで閉じる
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) {
        dialog.close();
      }
    });

    // Escキーを含むあらゆるクローズでスクロールを戻す
    dialog.addEventListener("close", () => {
      document.body.style.overflow = "";
    });
  });
};

/**
 * SPハンバーガーメニュー開閉
 */
const initToggleMenu = () => {
  const button = document.querySelector(".js-toggle-menu");
  const nav = document.querySelector(".js-global-nav");
  if (!button || !nav) return;

  const isOpen = () => button.getAttribute("aria-expanded") === "true";

  const close = ({ returnFocus = false } = {}) => {
    button.setAttribute("aria-expanded", "false");
    nav.classList.remove("is-open");
    document.body.style.overflow = "";
    if (returnFocus) button.focus();
  };

  button.addEventListener("click", () => {
    if (isOpen()) {
      close();
    } else {
      button.setAttribute("aria-expanded", "true");
      nav.classList.add("is-open");
      document.body.style.overflow = "hidden";
    }
  });

  // ナビ内のリンクを押したら閉じる(ページ内アンカー対応)
  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      close();
    }
  });

  // 全画面ナビ表示中のキーボード操作: Escで閉じ、Tabフォーカスをメニュー内に閉じ込める
  document.addEventListener("keydown", (event) => {
    if (!isOpen()) return;

    if (event.key === "Escape") {
      close({ returnFocus: true });
      return;
    }

    if (event.key !== "Tab") return;

    // 開閉ボタン(先頭)とナビ内リンクの間でループさせる
    const focusables = [button, ...nav.querySelectorAll("a")];
    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
};

/**
 * お問い合わせフォーム: 必須項目が全て入力されるまで送信ボタンを無効化(仕様書指定)
 * 送信機能は持たないため、送信時は完了ページへ遷移する
 */
const initForm = () => {
  const form = document.querySelector(".js-form");
  if (!form) return;

  const submit = form.querySelector(".js-form-submit");

  const updateSubmitState = () => {
    submit.disabled = !form.checkValidity();
  };

  form.addEventListener("input", updateSubmitState);
  form.addEventListener("change", updateSubmitState);
  updateSubmitState();

  form.addEventListener("submit", (event) => {
    // 入力値をクエリ文字列に載せずに完了ページへ遷移する
    event.preventDefault();
    window.location.href = form.getAttribute("action");
  });
};

initLoading();
initToggleMenu();
initModal();
initForm();
