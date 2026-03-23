console.log("JS is working")

document.addEventListener("DOMContentLoaded", () => {

    // Regular Notes Variables:
    const notes_container = document.querySelector("#all-notes")
    const my_form = document.querySelector("#note-form")
    const change_form = document.querySelector("#note-change-form")
    const csrf = document.querySelector("[name=csrfmiddlewaretoken]")?.value

    // ---------------- CREATE NOTE ----------------
    if (my_form) {
        my_form.addEventListener("submit", async (event) => {

            event.preventDefault()

            const title = document.querySelector("#title").value
            const content = document.querySelector("#content").value

            console.log("TITLE:", title)
            console.log("CONTENT:", content)

            const response = await fetch("/notes/api/add_note/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrf
                },
                body: JSON.stringify({
                    title: title,
                    content: content
                })
            })

            if (!response.ok) {
                console.error("Error:", response.status)
                return
            }

            const data = await response.json()

            const note = document.createElement("div")
            note.classList.add("note")

            // 🔥 IMPORTANT: store id
            note.dataset.id = data.id

            note.innerHTML = `
                <h3>${data.title}</h3>
                <p>${data.content}</p>
                <button class="delete-btn">Delete</button>
            `

            notes_container.appendChild(note)

            my_form.reset()
        })
    }

    // ---------------- UPDATE NOTE ----------------
    if (change_form) {
        change_form.addEventListener("submit", async (e) => {
            e.preventDefault()

            const title = document.querySelector("#title").value
            const content = document.querySelector("#content").value
            const message = document.querySelector("#message")

            const noteId = change_form.dataset.id

            const response = await fetch(`/notes/update_note/${noteId}/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrf
                },
                body: JSON.stringify({
                    new_title: title,
                    new_content: content
                })
            })

            if (!response.ok) {
                console.error("Error:", response.status)
                return
            }

            const data = await response.json()
            message.textContent = data.message
        })
    }

    // ---------------- DELETE NOTE ----------------
    if (notes_container) {
        notes_container.addEventListener("click", async (event) => {

            if (event.target.classList.contains("delete-btn")) {

                const noteElement = event.target.closest(".note")
                const noteId = noteElement.dataset.id

                const response = await fetch(`/notes/delete_note/${noteId}/`, {
                    method: "POST",
                    headers: {
                        "X-CSRFToken": csrf
                    }
                })
 
                if (!response.ok) {
                    console.error("Delete failed")
                    return
                }

                const data = await response.json()

                noteElement.remove()
                console.log(data.message)
            }
        })
    }
})