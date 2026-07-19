/* =========================================================
   LINQFLO — Main JS
   Vanilla JS only. No external dependencies required.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initSmoothScrollClose();
  initFooterYear();
  initContactForm();
});

/* -----------------------------
   Mobile nav toggle
   ----------------------------- */
function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
}

/* -----------------------------
   Close mobile nav after clicking a link
   ----------------------------- */
function initSmoothScrollClose() {
  const nav = document.querySelector('.main-nav');
  const links = document.querySelectorAll('.main-nav a');

  links.forEach((link) => {
    link.addEventListener('click', () => {
      if (nav) {
        nav.classList.remove('open');
        const toggle = document.querySelector('.nav-toggle');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
      }
    });
  });
}

/* -----------------------------
   Footer copyright year
   ----------------------------- */
function initFooterYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

/* -----------------------------
   Contact form: validation + Supabase submit + thank-you animation
   ----------------------------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const wrap = form.closest('.contact-wrap');
  const successPanel = wrap ? wrap.querySelector('.form-success') : null;
  const submitBtn = form.querySelector('.submit-btn');
  const submitErrorEl = form.querySelector('.form-submit-error');
  const resetBtn = wrap ? wrap.querySelector('.form-success-reset') : null;

  const fieldRules = {
    first_name: { required: true },
    email: { required: true, type: 'email' },
    phone: { required: true },
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    submitErrorEl.textContent = '';

    const values = {
      first_name: form.first_name.value.trim(),
      last_name: form.last_name.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      message: form.message.value.trim(),
    };

    if (!validateFields(form, values, fieldRules)) return;

    setLoading(true);

    try {
      await submitToSupabase(values);
      showSuccess();
    } catch (err) {
      console.error('Contact form submission error:', err);
      submitErrorEl.textContent = 'Something went wrong sending your message. Please try again.';
    } finally {
      setLoading(false);
    }
  });

  // Clear individual field errors as the user corrects them
  form.querySelectorAll('input, textarea').forEach((field) => {
    field.addEventListener('input', () => {
      const errorEl = form.querySelector(`.form-error[data-error-for="${field.name}"]`);
      if (errorEl && field.checkValidity()) errorEl.textContent = '';
    });
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      if (successPanel) successPanel.classList.remove('visible');
    });
  }

  function setLoading(isLoading) {
    if (!submitBtn) return;
    submitBtn.disabled = isLoading;
    submitBtn.classList.toggle('loading', isLoading);
  }

  function showSuccess() {
    form.reset();
    if (successPanel) {
      successPanel.classList.add('visible');
      successPanel.setAttribute('role', 'status');
      // Restart the SVG draw animation each time it's shown
      successPanel.querySelectorAll('.circle, .check').forEach((el) => {
        el.style.animation = 'none';
        // Force reflow so the animation can be re-triggered
        void el.offsetWidth;
        el.style.animation = '';
      });
    }
  }
}

function validateFields(form, values, rules) {
  let isValid = true;

  Object.entries(rules).forEach(([name, rule]) => {
    const field = form[name];
    const errorEl = form.querySelector(`.form-error[data-error-for="${name}"]`);
    let message = '';

    if (rule.required && !values[name]) {
      message = 'This field is required.';
    } else if (rule.type === 'email' && values[name] && !field.checkValidity()) {
      message = 'Please enter a valid email address.';
    }

    if (message) isValid = false;
    if (errorEl) errorEl.textContent = message;
  });

  return isValid;
}

 const form = document.getElementById("contact-form");
  const successBox = document.querySelector(".form-success");
  const resetBtn = document.querySelector(".form-success-reset");
  const submitError = document.querySelector(".form-submit-error");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    submitError.textContent = "";

    const formData = new FormData(form);
    const object = Object.fromEntries(formData.entries());
    const json = JSON.stringify(object);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: json
      });

      const result = await response.json();

      if (response.ok && result.success) {
        form.reset();
        successBox.classList.add("visible");
      } else {
        submitError.textContent = result.message || "Something went wrong.";
      }
    } catch (error) {
      submitError.textContent = "Network error. Please try again.";
    }
  });

  resetBtn.addEventListener("click", function () {
    successBox.classList.remove("visible");
  });

/* -----------------------------
   Supabase submission
   ----------------------------- */
async function submitToSupabase(values) {
  const payload = {
    first_name: values.first_name,
    last_name: values.last_name || null,
    email: values.email,
    phone: values.phone,
    message: values.message || null,
  };

  // Falls back to a console log if js/supabase-config.js hasn't been
  // configured with a real project URL / anon key yet.
  if (!window.supabaseClient) {
    console.info('[LINQFLO] Supabase not configured — logging submission instead:', payload);
    return payload;
  }

  const { error } = await window.supabaseClient
    .from('contact_submissions')
    .insert([payload]);

  if (error) throw error;
  return payload;
}

