/* globals fetch, moment */

// === constant selected elements ===
const ratingLabel = document.querySelector('#rating-label')
const ratingInput = document.querySelector('#rating')
const ratingsDiv = document.querySelector('#ratings')
const newratingForm = document.querySelector('#new-rating-form')

// === event listeners ===

window.addEventListener('load', function() {
    // set initial rating label emoji
    setratingLabel()

    // when I load the page, get the list of ratings from the API
    //  - then display them at the bottom of the page
    fetch('http://localhost:3000/notes/')
        .then(res => res.json())
        .then(ratingRecords => {
            console.log(ratingRecords)
            const ratingEls = ratingRecords.map(rating => createratingEl(rating))
            console.log(ratingEls)

            for (const el of ratingEls) {
                addToratingsDiv(el)
            }
        })
})

// make emoji on label change when I change the rating input
ratingInput.addEventListener('input', setratingLabel)

// store rating when I submit the new rating form

//  - update the list of previous ratings at the bottom of page
newratingForm.addEventListener('submit', function(event) {
    event.preventDefault()
        //  - send a request to the API to save the rating
    fetch('http://localhost:3000/notes/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rating: ratingInput.value, datetime: moment().format('YYYY-MM-DD HH:mm') })
        })
        .then(r => r.json())
        .then(newrating => {
            const newratingEl = createratingEl(newrating)
            addToratingsDiv(newratingEl)
        })
})

// // ==== helper functions ===

function getratingEmoji(ratingLevel) {
    const ratingEmojis = [
        '😢', // 1
        '🙁', // 2 - ☹️
        '😐', // 3
        '🙂', // 4
        '😁' // 5
    ]

    return ratingEmojis[ratingLevel - 1]
}

// function setratingLabel() {
//     const currentratingLevel = ratingInput.value
//     ratingLabel.textContent = getratingEmoji(currentratingLevel)
}

function createratingEl(rating) {
    const el = document.createElement('div')
    el.id = 'rating-' + rating.id
    el.classList.add('pa2', 'bg-light-blue', 'f3', 'flex', 'justify-between', 'mv2')

    let div = document.createElement('div')
    div.textContent = moment(rating.datetime).format('MMM D h:mm A')
    el.appendChild(div)

    div = document.createElement('div')
    const deleteButton = document.createElement('button')
    deleteButton.classList.add('f5', 'bg-red', 'white', 'br3', 'ph3', 'pv2', 'mb2', 'white', 'pointer')
    deleteButton.textContent = 'Delete'

    deleteButton.addEventListener('click', function() {
        deleteratingEntry(rating.id)
    })

    div.appendChild(deleteButton)
    el.appendChild(div)

    div = document.createElement('div')
    div.textContent = getratingEmoji(rating.rating)
    el.appendChild(div)

    return el
}

function addToratingsDiv(ratingEl) {
    ratingsDiv.appendChild(ratingEl)
}

function deleteratingEntry(ratingId) {
    // send a request to the API to delete this entry
    fetch('http://localhost:3000/notes/' + ratingId, {
            method: 'DELETE'
        })
        .then(res => {
            // then remove the element with the id rating-(ratingId) from the DOM
            if (res.status === 200) {
                const ratingEl = document.querySelector('#rating-' + ratingId)
                ratingEl.remove()
            }
        })
}