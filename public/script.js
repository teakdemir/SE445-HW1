const form = document.getElementById("ticketForm");
const submitBtn = document.getElementById("submitBtn");
const result = document.getElementById("result");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const payload = {
    name: form.name.value,
    email: form.email.value,
    message: form.message.value
  };

  submitBtn.disabled = true;
  submitBtn.textContent = "Sending...";
  result.textContent = "Submitting ticket...";

  try {
    const response = await fetch("/process-message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      result.textContent = `Error: ${data.error || "Request failed."}`;
      return;
    }

    result.textContent = `Success!\nAI Summary: ${data.aiSummary}`;
  } catch (error) {
    result.textContent = `Error: ${error.message}`;
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit Ticket";
  }
});
