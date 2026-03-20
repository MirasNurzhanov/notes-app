document.addEventListener("DOMContentLoaded", () => {
    //Regular Notes Variables:
    const notes_container = document.querySelector("#all-notes")
    const my_form = document.querySelector("#note-form")
    const csrf = document.querySelector("[name=csrfmiddlewaretoken]").value
    //Changing Notes Variable:
    const change_form = document.querySelector("#note-change-form")
    //Deleting Notes Variable:
    const delete_btn = document.querySelector("#delete_btn")
    const delete_message = document.querySelector("#delete_message")


    my_form.addEventListener("submit", async (event) => {

        event.preventDefault()

        const title = document.querySelector("#title").value
        const content = document.querySelector("#content").value
        console.log("TITLE:", title)
        console.log("CONTENT:", content)

        const response = await fetch("/notes/api/add_note/", {
            method: "POST",
            headers: {"Content-Type": "application/json" , "X-CSRFToken": csrf},
            body: JSON.stringify({
                title: title,
                content: content
            })
        })

        const data = await response.json()

        const note = document.createElement("div")
        note.classList.add("note")

        note.innerHTML = `
            <h3>${data.title}</h3>
            <p>${data.content}</p>
        `

        notes_container.appendChild(note)

    })

    change_form.addEventListener("submit", async (e) => {
        e.preventDefault()

        const title = document.querySelector("#title").value
        const content = document.querySelector("#content").value
        const message = document.querySelector("#message")
        const noteElement = document.querySelector(".note")
        const noteId = noteElement.dataset.id

        const response = await fetch(`update_note/${noteId}/`, {
            method: "POST",
            headers: {"Content-Type": "application/json","X-CSRFToken": csrf},
            body: JSON.stringify({new_title: title , new_content: content ,note_id: noteId})
        })
        const data = await response.json()
        message.textContent = data.message
    })

    delete_btn.addEventListener("click" , async(event) => {
        event.preventDefault()

        const response = await fetch(`delete_note/${note.id}`, {
            method: "POST",
            headers: {"Content-Type": "application/json" ,
                "X-CSRFToken": csrf
            },
        })
        const data = await response.json()
        const noteElement = event.target.closest('.note')
        if (noteElement) {
            noteElement.remove()
        }
        delete_message.textContent = data.message

    })
})