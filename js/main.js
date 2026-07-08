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
    sessionStorage.setItem("aobotan-visited", "true");
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

  const close = () => {
    button.setAttribute("aria-expanded", "false");
    nav.classList.remove("is-open");
    document.body.style.overflow = "";
  };

  button.addEventListener("click", () => {
    const isOpen = button.getAttribute("aria-expanded") === "true";
    if (isOpen) {
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
};

initLoading();
initToggleMenu();
initModal();
