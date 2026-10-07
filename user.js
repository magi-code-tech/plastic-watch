// =====================================
// PLASTIC WATCH - USER DASHBOARD
// =====================================


// ===============================
// FIREBASE CONFIGURATION
// ===============================

const firebaseConfig = {

    apiKey: "AIzaSyCsOXDnIGajYQEm7393Cf2aED6b2yr9wkQ",

    authDomain: "plastic-watch-92c57.firebaseapp.com",

    projectId: "plastic-watch-92c57",

    storageBucket: "plastic-watch-92c57.firebasestorage.app",

    messagingSenderId: "282334221406",

    appId: "1:282334221406:web:228622e092b862de1790cf",

    measurementId: "G-0FC1SYZ9WY"
};


// ===============================
// CONNECT FIREBASE
// ===============================

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();


// ===============================
// CHANGE SECTION
// ===============================

function showSection(sectionName) {

    const sections =
        document.querySelectorAll(".section");

    sections.forEach(function(section) {
        section.classList.add("hidden");
    });


    const selectedSection =
        document.getElementById(sectionName);

    if (selectedSection) {
        selectedSection.classList.remove("hidden");
    }


    // Active menu

    const menus =
        document.querySelectorAll(".menu");

    menus.forEach(function(menu) {
        menu.classList.remove("active");
    });


    // Load My Reports

    if (sectionName === "reports") {
        loadMyReports();
    }
}


// ===============================
// REPORT NOW
// ===============================

function goReport() {

    window.location.href = "index.html";

}


// ===============================
// TRACK COMPLAINT
// ===============================

async function trackComplaint() {

    const input =
        document.getElementById("complaintId");

    const result =
        document.getElementById("trackResult");


    const complaintId =
        input.value.trim();


    if (complaintId === "") {

        result.innerHTML = `
            <div class="track-card">
                ❌ Please enter Complaint ID.
            </div>
        `;

        return;
    }


    result.innerHTML = `
        <div class="track-card">
            🔍 Searching...
        </div>
    `;


    try {

        const snapshot =
            await db
                .collection("reports")
                .where(
                    "complaintId",
                    "==",
                    complaintId
                )
                .get();


        if (snapshot.empty) {

            result.innerHTML = `
                <div class="track-card">
                    ❌ Complaint not found.
                    <br><br>
                    Please check your Complaint ID.
                </div>
            `;

            return;
        }


        snapshot.forEach(function(doc) {

            const report = doc.data();

            const status =
                report.status || "Pending";


            let statusClass = "pending";


            if (status === "In Progress") {
                statusClass = "progress";
            }


            if (status === "Completed") {
                statusClass = "completed";
            }


            result.innerHTML = `

                <div class="track-card">

                    <h3>
                        ♻️ Complaint Details
                    </h3>

                    <p>
                        <strong>Complaint ID:</strong>
                        ${report.complaintId}
                    </p>

                    <p>
                        <strong>📍 Location:</strong>
                        ${report.location || "Not provided"}
                    </p>

                    <p>
                        <strong>📝 Problem:</strong>
                        ${report.description || "Not provided"}
                    </p>

                    <p>
                        <strong>Status:</strong>

                        <span class="status ${statusClass}">
                            ${status}
                        </span>
                    </p>

                </div>
            `;

        });

    }

    catch (error) {

        console.error(
            "Firebase Error:",
            error
        );


        result.innerHTML = `
            <div class="track-card">
                ❌ Firebase connection error.
                <br><br>
                Check Firebase configuration.
            </div>
        `;
    }

}


// ===============================
// MY REPORTS
// ===============================

async function loadMyReports() {

    const container =
        document.getElementById("myReports");


    container.innerHTML = `
        <p>⏳ Loading reports...</p>
    `;


    try {

        const snapshot =
            await db
                .collection("reports")
                .get();


        if (snapshot.empty) {

            container.innerHTML = `
                <p>No reports found.</p>
            `;

            return;
        }


        container.innerHTML = "";


        snapshot.forEach(function(doc) {

            const report = doc.data();


            const status =
                report.status || "Pending";


            let statusClass = "pending";


            if (status === "In Progress") {
                statusClass = "progress";
            }


            if (status === "Completed") {
                statusClass = "completed";
            }


            const div =
                document.createElement("div");


            div.className = "report-item";


            div.innerHTML = `

                <h3>
                    ♻️ ${report.complaintId || "Complaint"}
                </h3>

                <p>
                    <strong>📍 Location:</strong>
                    ${report.location || "Not provided"}
                </p>

                <p>
                    <strong>📝 Description:</strong>
                    ${report.description || "Not provided"}
                </p>

                <p>
                    <strong>Status:</strong>

                    <span class="status ${statusClass}">
                        ${status}
                    </span>
                </p>

            `;


            container.appendChild(div);

        });

    }

    catch (error) {

        console.error(
            "My Reports Error:",
            error
        );


        container.innerHTML = `
            <p>
                ❌ Unable to load reports.
            </p>
        `;
    }

}