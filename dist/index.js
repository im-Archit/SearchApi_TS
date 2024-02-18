"use strict";
// Get reference to the HTML elements
const getUsername = document.querySelector("#user");
const formSubmit = document.querySelector("#form");
const main_container = document.querySelector(".main_container");
// Reusable function for fetching data from an API
async function myCustomFetcher(url, options) {
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error(`New response was not ok. Status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
    return data;
}
// Function to render user data in the UI
const showResultUI = (singleUser) => {
    // Implement your UI rendering logic here
    // Append data to the DOM or perform other actions based on the user data
    const { avatar_url, login, url, location } = singleUser; //! Destructuring
    main_container.insertAdjacentHTML("beforeend", `<div class='card'> 
      <img src=${avatar_url} alt=${login}>
      <hr/>
      <div class='card-footer'> 
        <img src="${avatar_url}" alt="${login}">
        <a href="${url}"> Github </a>
      </div>
    </div>`);
};
// Function to fetch user data from the GitHub API
function fetchUserData(url) {
    // Fetch user data and call the showResultUI function for each user
    myCustomFetcher(url, {}).then((userInfo) => {
        for (const singleUser of userInfo) {
            showResultUI(singleUser);
            console.log("login: " + singleUser.login);
        }
    });
}
// Call the fetchUserData function with the GitHub API URL
fetchUserData("https://api.github.com/users");
//& Performing Search
formSubmit.addEventListener('submit', async (e) => {
    e.preventDefault();
    const searchTerm = getUsername.value.toLowerCase();
    try {
        const url = "https://api.github.com/users";
        const allUserData = await myCustomFetcher(url, {});
        const matchingUsers = allUserData.filter((user) => {
            return user.login.toLowerCase().includes(searchTerm); //!Searching Filter
        });
        main_container.innerHTML = ""; //We are doing it empty to clear the previous data
        if (matchingUsers.length === 0) {
            main_container.insertAdjacentHTML("beforeend", `<p class="empty-msg"> No Matching Users </p>`);
        }
        else {
            for (const singleUser of matchingUsers) {
                showResultUI(singleUser); //^ Now we are calling the card but with matching user   jo jo user type karra hai usse related data hoga 
            }
        }
    }
    catch (error) {
        console.log(error);
    }
});
