// ==========================================
// FIREBASE CONFIGURATION
// ==========================================

const firebaseConfig = {
    apiKey: "YOUR_EXISTING_API_KEY",
    authDomain: "plastic-watch-92c57.firebaseapp.com",
    projectId: "plastic-watch-92c57",
    storageBucket: "plastic-watch-92c57.firebasestorage.app",
    messagingSenderId: "282334221406",
    appId: "1:282334221406:web:228622e092b862de1790cf",
    measurementId: "G-0FC1SYZ9WY"
};


// ==========================================
// START FIREBASE
// ==========================================

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();


// ==========================================
// GET ELEMENTS
// ==========================================

const reportsContainer =
    document.getElementById("reportsContainer");

const totalReports =
    document.getElementById("totalReports");

const pendingReports =
    document.getElementById("pendingReports");

const progressReports =
    document.getElementById("progressReports");

const completedReports =
    document.getElementById("completedReports");


// ==========================================
// STORE ALL REPORTS
// ==========================================

let allReports = [];


// ==========================================
// LOAD REPORTS
// ==========================================

function loadReports() {

    db.collection("reports")
        .onSnapshot(function(snapshot) {

            allReports = [];

            snapshot.forEach(function(doc) {

                allReports.push({
                    id: doc.id,
                    ...doc.data()
                });

            });

            updateStatistics();

            showReports(allReports);

        }, function(error) {

            console.error(error);

            reportsContainer.innerHTML = `
                <p class="no-reports">
                    ❌ Unable to load reports.
                </p>
            `;

        });
}


// ==========================================
// UPDATE STATISTICS
// ==========================================

function updateStatistics() {

    let total = allReports.length;

    let pending = 0;

    let progress = 0;

    let completed = 0;


    allReports.forEach(function(report) {

        if (report.status === "Pending") {

            pending++;

        }

        else if (report.status === "In Progress") {

            progress++;

        }

        else if (report.status === "Completed") {

            completed++;

        }

    });


    totalReports.textContent = total;

    pendingReports.textContent = pending;

    progressReports.textContent = progress;

    completedReports.textContent = completed;
}


// ==========================================
// SHOW REPORTS
// ==========================================

function showReports(reports) {

    reportsContainer.innerHTML = "";


    if (reports.length === 0) {

        reportsContainer.innerHTML = `
            <p class="no-reports">
                No reports found.
            </p>
        `;

        return;
    }


    reports.forEach(function(report) {

        const card =
            document.createElement("div");

        card.className = "report-card";


        // ==================================
        // LOCATION DATA
        // ==================================

        const latitude =
            report.latitude;

        const longitude =
            report.longitude;


        // ==================================
        // GOOGLE MAP BUTTON
        // ==================================

        let mapButton = "";

        if (
            latitude !== undefined &&
            longitude !== undefined
        ) {

            mapButton = `

                <a
                    href="https://www.google.com/maps?q=${latitude},${longitude}"
                    target="_blank"
                    class="map-button"
                >
                    🗺️ View Location on Google Maps
                </a>

            `;

        } else {

            mapButton = `
                <p>
                    📍 GPS location not available
                </p>
            `;

        }


        // ==================================
        // REPORT CARD
        // ==================================

        card.innerHTML = `

            <h3>
                ♻️ Plastic Waste Report
            </h3>


            <p>
                <strong>🆔 Complaint ID:</strong>
                ${report.complaintId || "Not available"}
            </p>


            <p>
                <strong>📍 Location:</strong>
                ${report.location || "Not provided"}
            </p>


            <p>
                <strong>🌐 GPS Coordinates:</strong>
                ${
                    latitude !== undefined &&
                    longitude !== undefined
                    ? latitude + ", " + longitude
                    : "Not available"
                }
            </p>


            ${mapButton}


            <p>
                <strong>📝 Description:</strong>
                ${report.description || "Not provided"}
            </p>


            <p>
                <strong>📷 Photo:</strong>
                ${report.photoName || "No photo"}
            </p>


            <p>
                <strong>Status:</strong>

                <span class="status ${getStatusClass(report.status)}">
                    ${report.status || "Pending"}
                </span>

            </p>


            <label>
                Update Status:
            </label>


            <select
                onchange="updateStatus('${report.id}', this.value)"
            >

                <option value="Pending"
                    ${report.status === "Pending" ? "selected" : ""}>
                    Pending
                </option>

                <option value="In Progress"
                    ${report.status === "In Progress" ? "selected" : ""}>
                    In Progress
                </option>

                <option value="Completed"
                    ${report.status === "Completed" ? "selected" : ""}>
                    Completed
                </option>

            </select>


            <button
                class="delete-btn"
                onclick="deleteReport('${report.id}')"
            >
                Delete
            </button>

        `;


        reportsContainer.appendChild(card);

    });

}


// ==========================================
// STATUS CLASS
// ==========================================

function getStatusClass(status) {

    if (status === "In Progress") {

        return "progress";

    }

    if (status === "Completed") {

        return "completed";

    }

    return "pending";
}


// ==========================================
// UPDATE STATUS
// ==========================================

async function updateStatus(reportId, newStatus) {

    try {

        await db
            .collection("reports")
            .doc(reportId)
            .update({

                status: newStatus

            });

    }

    catch (error) {

        console.error(error);

        alert(
            "❌ Unable to update status."
        );

    }

}


// ==========================================
// DELETE REPORT
// ==========================================

async function deleteReport(reportId) {

    const answer =
        confirm(
            "Are you sure you want to delete this report?"
        );


    if (!answer) {

        return;

    }


    try {

        await db
            .collection("reports")
            .doc(reportId)
            .delete();

    }

    catch (error) {

        console.error(error);

        alert(
            "❌ Unable to delete report."
        );

    }

}


// ==========================================
// SIDEBAR BUTTONS
// ==========================================

const menuItems =
    document.querySelectorAll(".menu");


menuItems.forEach(function(menu) {

    menu.addEventListener("click", function() {


        // Remove active

        menuItems.forEach(function(item) {

            item.classList.remove("active");

        });


        // Add active

        menu.classList.add("active");


        // Get button text

        const text =
            menu.textContent.trim();


        // Dashboard

        if (text.includes("Dashboard")) {

            showReports(allReports);

        }


        // All Reports

        else if (text.includes("All Reports")) {

            showReports(allReports);

        }


        // Pending

        else if (text.includes("Pending")) {

            const pending =
                allReports.filter(function(report) {

                    return report.status === "Pending";

                });

            showReports(pending);

        }


        // In Progress

        else if (text.includes("In Progress")) {

            const progress =
                allReports.filter(function(report) {

                    return report.status === "In Progress";

                });

            showReports(progress);

        }


        // Completed

        else if (text.includes("Completed")) {

            const completed =
                allReports.filter(function(report) {

                    return report.status === "Completed";

                });

            showReports(completed);

        }


        // Rules

        else if (
            text.includes("Rules & Regulations")
        ) {

            document
                .querySelector(".rules-card")
                .scrollIntoView({
                    behavior: "smooth"
                });

        }


        // Settings

        else if (text.includes("Settings")) {

            alert(
                "⚙️ Settings feature will be added soon."
            );

        }

    });

});


// ==========================================
// START DASHBOARD
// ==========================================

loadReports();