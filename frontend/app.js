const API = "http://localhost:3000/api/meetings";

async function loadMeetings() {
  const res = await fetch(API);
  const data = await res.json();
  const tbody = document.getElementById("tableBody");
  tbody.innerHTML = "";
  data.forEach(m => {
    tbody.innerHTML += `<tr>
      <td>${m.id}</td>
      <td>${m.meeting_title}</td>
      <td>${m.book_title}</td>
      <td>${m.meeting_date}</td>
      <td>
        <button onclick="editMeeting(${m.id})">Edit</button>
        <button onclick="deleteMeeting(${m.id})">Delete</button>
      </td>
    </tr>`;
  });
}

document.getElementById("meetingForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = document.getElementById("id").value;
  const payload = {
    meeting_title: document.getElementById("meeting_title").value,
    book_title: document.getElementById("book_title").value,
    meeting_date: document.getElementById("meeting_date").value,
    location: document.getElementById("location").value,
    organizer: document.getElementById("organizer").value,
    description: document.getElementById("description").value
  };

  if (id) {
    await fetch(`${API}/${id}`, { method: "PUT", headers: {"Content-Type":"application/json"}, body: JSON.stringify(payload) });
  } else {
    await fetch(API, { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify(payload) });
  }
  resetForm();
  loadMeetings();
});

async function editMeeting(id) {
  const res = await fetch(`${API}/${id}`);
  const m = await res.json();
  document.getElementById("id").value = m.id;
  document.getElementById("meeting_title").value = m.meeting_title;
  document.getElementById("book_title").value = m.book_title;
  document.getElementById("meeting_date").value = m.meeting_date;
  document.getElementById("location").value = m.location;
  document.getElementById("organizer").value = m.organizer;
  document.getElementById("description").value = m.description;
}

async function deleteMeeting(id) {
  if (confirm("Delete this meeting?")) {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    loadMeetings();
  }
}

function resetForm() {
  document.getElementById("meetingForm").reset();
  document.getElementById("id").value = "";
}

loadMeetings();