const fileElem = document.getElementById("fileElem");
const uploadBtn = document.getElementById("uploadBtn");
const output = document.getElementById("output");
const dropArea = document.getElementById("drop-area");

uploadBtn.onclick = () => fileElem.click();

fileElem.addEventListener("change", handleFiles);

dropArea.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropArea.style.borderColor = "#00b4d8";
});
dropArea.addEventListener("dragleave", () => {
  dropArea.style.borderColor = "#555";
});
dropArea.addEventListener("drop", (e) => {
  e.preventDefault();
  dropArea.style.borderColor = "#555";
  handleFiles({ target: { files: e.dataTransfer.files } });
});

async function handleFiles(e) {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  output.innerHTML = `<p>Uploading <b>${file.name}</b>...</p>`;

  try {
    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();

    if (data.url) {
      output.innerHTML = `
        <p>✅ Upload Success!</p>
        <a href="${data.url}" target="_blank">${data.url}</a>
      `;
    } else {
      output.innerHTML = `<p>❌ Upload failed.</p>`;
    }
  } catch (err) {
    output.innerHTML = `<p>❌ Upload failed.</p>`;
  }
}
