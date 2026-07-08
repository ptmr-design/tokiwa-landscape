/**
 * main.js
 * 機能単位のモジュール構成。JS操作は js- プレフィックスのフックのみ使用する。
 * サイドバーのメニュー開閉(ホバー)はCSSの:hover/:focus-withinで実装している。
 */

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

initToggleMenu();
