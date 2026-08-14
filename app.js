const menuButton = document.querySelector("[data-menu-toggle]");
const mobileNav = document.querySelector("[data-mobile-nav]");
const contactForm = document.querySelector("[data-contact-form]");
const toast = document.querySelector("[data-toast]");

const showToast = (message) => {
  toast.textContent = message;
  toast.classList.add("show");

  window.setTimeout(() => {
    toast.classList.remove("show");
  }, 3500);
};

menuButton?.addEventListener("click", () => {
  const isOpen = mobileNav.classList.toggle("open");

  menuButton.setAttribute("aria-expanded", String(isOpen));
});

mobileNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mobileNav.classList.remove("open");
    menuButton?.setAttribute("aria-expanded", "false");
  });
});

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!contactForm.checkValidity()) {
    contactForm.reportValidity();
    return;
  }

  showToast(
    "Cảm ơn bạn! NovaStudio sẽ phản hồi yêu cầu của bạn trong một ngày làm việc."
  );

  contactForm.reset();
});