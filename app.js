(function() {
const endpoint = 'https://randomuser.me/api/?results=30'; // Random users endpoint

const usersArr = [];

const suggestion = document.querySelector('.search');
const usersDOM = document.getElementById('users');
const sortDOM = document.getElementById('sort');
let filteredArr;

// Get random usres using fetch API
fetch(endpoint)
    .then( response => {

        if (!response.ok) {
            throw Error(response.statusText);
        }

        return response.json();
    } )
    .then( data => {
        const users = data.results; // Get users' data
        template ( users ); // Populate users
        usersArr.push( ...users ); // Add users to the users array
    } )
    .catch( error => {
        console.log(error);
    } );

// Template for displaying users
function template( users ) {

    const html = users.map( user => {

        // Highlight search characters
        const regex = new RegExp( this.value, 'gi' );
        const firstName = user.name.first.replace( this.value, `<span class="hl">${ this.value }</span>` )
        const lastName = user.name.last.replace( this.value, `<span class="hl">${ this.value }</span>` )

        return `
            <li>
                <img src="${ user.picture.medium }">
                <h4>${ lastName }, ${ firstName }</h4>
                Phone: ${ user.cell }<br>
                Email: <a href="mailto:${user.email}">${user.email}</a>
            </li>
            `;
    } ).join('');

    // Display users
    usersDOM.innerHTML = html;
}

// Find matched users
function findMatches( userToFind, usersArr ) {

    return usersArr.filter( user => {
        const regex = new RegExp( userToFind, 'gi' );
        return user.name.first.match( regex ) || user.name.last.match( regex ); // Search both in first names and last names
    } );
}

// Display matches
function displayMatches() {

    const matched = findMatches( this.value, usersArr );

    template.call(this, matched);

    filteredArr = matched;
}

// Sort users
function sort(event) {

    event.stopPropagation();

    let sortedArr, sortUsers;

    // If users are filtered use the filtered list for sorting
    typeof filteredArr !== 'undefined' ? sortUsers = filteredArr : sortUsers = usersArr;

    if( event.target.classList.contains('desc') ) {

        sortedArr = sortUsers.sort((a, b) => {
            return a.name.last > b.name.last ? -1 : 1;
        });

    } else if( event.target.classList.contains('asc') ) {

        sortedArr = sortUsers.sort((a, b) => {
            return a.name.last > b.name.last ? 1 : -1;
        });

    }

    template ( sortedArr );
}

sortDOM.addEventListener('click', sort);

suggestion.addEventListener('keyup', displayMatches);
})();
