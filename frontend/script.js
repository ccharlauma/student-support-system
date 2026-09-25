const API_URL = "http://127.0.0.1:8000";


// ========================================
// LOAD TICKETS
// ========================================

async function loadTickets() {

    const container = document.getElementById("ticketsContainer");

    container.innerHTML = `
        <div class="no-tickets">
            Loading tickets...
        </div>
    `;

    try {

        const response = await fetch(`${API_URL}/tickets`);

        if (!response.ok) {
            throw new Error("Failed to load tickets");
        }

        const tickets = await response.json();

        displayTickets(tickets);

        updateStatistics(tickets);

    } catch (error) {

        console.error(error);

        container.innerHTML = `
            <div class="no-tickets">
                <div class="no-tickets-icon">⚠️</div>
                <p>Unable to connect to the backend.</p>
            </div>
        `;
    }
}


// ========================================
// DISPLAY TICKETS
// ========================================

function displayTickets(tickets) {

    const container =
        document.getElementById("ticketsContainer");

    container.innerHTML = "";

    if (tickets.length === 0) {

        container.innerHTML = `
            <div class="no-tickets">
                <div class="no-tickets-icon">📭</div>
                <p>No tickets found.</p>
            </div>
        `;

        return;
    }


    tickets.forEach(ticket => {

        const ticketElement =
            document.createElement("div");

        ticketElement.className = "ticket";


        // Status class

        let statusClass = "status-open";

        if (ticket.status === "In Progress") {
            statusClass = "status-progress";
        }

        if (ticket.status === "Resolved") {
            statusClass = "status-resolved";
        }


        // Priority class

        let priorityClass = "priority-medium";

        if (ticket.priority === "Low") {
            priorityClass = "priority-low";
        }

        if (ticket.priority === "High") {
            priorityClass = "priority-high";
        }


        ticketElement.innerHTML = `

            <div class="ticket-header">

                <div>

                    <div class="ticket-id">
                        Ticket #${ticket.id}
                    </div>

                    <h3 class="ticket-title">
                        ${ticket.subject}
                    </h3>

                </div>


                <div class="ticket-badges">

                    <span class="badge ${statusClass}">
                        ${ticket.status}
                    </span>

                    <span class="badge ${priorityClass}">
                        ${ticket.priority} Priority
                    </span>

                </div>

            </div>


            <div class="ticket-info">

                <div class="ticket-info-item">

                    <span class="ticket-info-label">
                        STUDENT
                    </span>

                    <span class="ticket-info-value">
                        ${ticket.student_name}
                    </span>

                </div>


                <div class="ticket-info-item">

                    <span class="ticket-info-label">
                        CATEGORY
                    </span>

                    <span class="ticket-info-value">
                        ${ticket.category}
                    </span>

                </div>

            </div>


            <div class="ticket-description">

                <span class="ticket-description-label">
                    DESCRIPTION
                </span>

                <p>
                    ${ticket.description}
                </p>

            </div>


            <div class="ticket-actions">

                <button
                    class="update-btn"
                    onclick="updateTicket(${ticket.id})">

                    Update Status

                </button>


                <button
                    class="delete-btn"
                    onclick="deleteTicket(${ticket.id})">

                    Delete

                </button>

            </div>

        `;


        container.appendChild(ticketElement);

    });
}


// ========================================
// STATISTICS
// ========================================

function updateStatistics(tickets) {

    const total =
        tickets.length;

    const open =
        tickets.filter(
            ticket => ticket.status === "Open"
        ).length;

    const progress =
        tickets.filter(
            ticket => ticket.status === "In Progress"
        ).length;

    const resolved =
        tickets.filter(
            ticket => ticket.status === "Resolved"
        ).length;


    document.getElementById("totalTickets")
        .textContent = total;

    document.getElementById("openTickets")
        .textContent = open;

    document.getElementById("progressTickets")
        .textContent = progress;

    document.getElementById("resolvedTickets")
        .textContent = resolved;
}


// ========================================
// CREATE TICKET
// ========================================

document
    .getElementById("ticketForm")
    .addEventListener("submit", async function(event) {

        event.preventDefault();


        const ticketData = {

            student_name:
                document.getElementById("student_name").value,

            category:
                document.getElementById("category").value,

            subject:
                document.getElementById("subject").value,

            description:
                document.getElementById("description").value,

            priority:
                document.getElementById("priority").value
        };


        try {

            const response =
                await fetch(`${API_URL}/tickets`, {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(ticketData)
                });


            if (!response.ok) {

                throw new Error(
                    "Failed to create ticket"
                );
            }


            alert(
                "Ticket created successfully!"
            );


            document
                .getElementById("ticketForm")
                .reset();


            loadTickets();


        } catch (error) {

            console.error(error);

            alert(
                "Unable to create ticket."
            );
        }

    });


// ========================================
// UPDATE TICKET
// ========================================

async function updateTicket(ticketId) {

    const newStatus =
        prompt(
            "Enter new status:\nOpen\nIn Progress\nResolved",
            "In Progress"
        );


    if (!newStatus) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/tickets/${ticketId}`,
                {

                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        status: newStatus
                    })
                }
            );


        if (!response.ok) {

            throw new Error(
                "Failed to update ticket"
            );
        }


        alert(
            "Ticket updated successfully!"
        );


        loadTickets();


    } catch (error) {

        console.error(error);

        alert(
            "Unable to update ticket."
        );
    }
}


// ========================================
// DELETE TICKET
// ========================================

async function deleteTicket(ticketId) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this ticket?"
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/tickets/${ticketId}`,
                {
                    method: "DELETE"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Failed to delete ticket"
            );
        }


        alert(
            "Ticket deleted successfully!"
        );


        loadTickets();


    } catch (error) {

        console.error(error);

        alert(
            "Unable to delete ticket."
        );
    }
}


// ========================================
// INITIAL LOAD
// ========================================

loadTickets();