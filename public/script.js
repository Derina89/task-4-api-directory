const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const clearButton = document.getElementById("clearButton");

const resourceGrid = document.getElementById("resourceGrid");
const resultCount = document.getElementById("resultCount");

const loading = document.getElementById("loading");
const error = document.getElementById("error");
const noResults = document.getElementById("noResults");


// =========================================
// LOAD RESOURCES
// =========================================

async function loadResources() {

    const search = searchInput.value.trim();
    const category = categoryFilter.value;

    loading.style.display = "block";
    error.style.display = "none";
    noResults.style.display = "none";
    resourceGrid.innerHTML = "";

    try {

        const params = new URLSearchParams();

        if (search) {
            params.append("search", search);
        }

        if (category) {
            params.append("category", category);
        }


        const query =
            params.toString()
                ? `?${params.toString()}`
                : "";


        const response =
            await fetch(`/api/search${query}`);


        const data =
            await response.json();


        if (!response.ok || !data.success) {

            throw new Error(
                data.message || "Unable to load resources."
            );

        }


        loading.style.display = "none";


        resultCount.textContent =
            `${data.count} Resource${data.count === 1 ? "" : "s"}`;


        if (data.items.length === 0) {

            noResults.style.display = "block";

            return;
        }


        displayResources(data.items);


    } catch (err) {

        console.error(err);

        loading.style.display = "none";

        error.textContent =
            "Unable to connect to the API. Please make sure the server is running.";

        error.style.display = "block";

        resultCount.textContent = "Error";

    }
}


// =========================================
// DISPLAY RESOURCE CARDS
// =========================================

function displayResources(items) {

    resourceGrid.innerHTML = items.map(item => {

        return `

            <article class="resource-card">

                <div class="card-top">

                    <div class="card-number">
                        ${item.id}
                    </div>

                    <span class="category">
                        ${escapeHTML(item.category)}
                    </span>

                </div>


                <h3>
                    ${escapeHTML(item.name)}
                </h3>


                <p>
                    ${escapeHTML(item.description)}
                </p>

            </article>

        `;

    }).join("");

}


// =========================================
// CLEAR FILTERS
// =========================================

clearButton.addEventListener("click", () => {

    searchInput.value = "";

    categoryFilter.value = "";

    loadResources();

});


// =========================================
// SEARCH
// =========================================

let searchTimer;

searchInput.addEventListener("input", () => {

    clearTimeout(searchTimer);

    searchTimer = setTimeout(() => {

        loadResources();

    }, 300);

});


// =========================================
// CATEGORY FILTER
// =========================================

categoryFilter.addEventListener("change", () => {

    loadResources();

});


// =========================================
// SECURITY HELPER
// =========================================

function escapeHTML(value) {

    const div = document.createElement("div");

    div.textContent = value;

    return div.innerHTML;

}


// =========================================
// INITIAL LOAD
// =========================================

loadResources();