import { sortArray } from '../utils/sort.util.js'

// For now we don't have a real database, so we will use a simple array to store our users
const users = [
    { id: 1, name: 'Alice', age: 19 },
    { id: 2, name: 'Bob', age: 31 },
    { id: 3, name: 'Charlie', age: 17 },
    { id: 4, name: 'Dorothée', age: 26 },
]

/**
 * Returns all users, sorted by the provided field and direction
 * @param {string} sortBy - The field to sort by (optional)
 * @param {string} sortDirection - The direction to sort by (optional, default is 'ASC')
 * @returns {Array} - An array of users
 */
export const getAll = (sortBy, sortDirection) => {
    // If the sortBy parameter is provided, we will sort the users array
    if (sortBy) {
        return sortArray(users, sortBy, sortDirection)
    }
    // Otherwise we will return the users array as is
    return users
}

/**
 * Returns a single user by its id
 * @param {number} id - The id of the user to get 
 * @returns {object} - The user object or null if not found
 */
export const getById = (id) => {
    // Here we assume that the id provided is a number, our objects have a numeric id we can use triple equals. Refers to the controller to see how we parse the id from the request.
    return users.find(user => user.id === id)
}

/**
 * Deletes a user by its id
 * @param {number} id 
 * @returns {boolean} - True if the user was deleted, false if not found
 */
export const deleteById = (id) => {
    // We will use the findIndex method to get the index of the user in the array
    const index = users.findIndex(user => user.id === id)

    // If the index is different from -1, we will delete the user from the array
    if (index !== -1) {
        users.splice(index, 1)
        return true
    }
    return false
}