export const sortArray = (array, sortBy, sortDirection) => {
    if (!sortDirection) sortDirection = 'ASC'
    if (sortBy && sortDirection) {
        return array.toSorted((a, b) => {
            if (sortDirection === 'ASC') {
                return a[sortBy] > b[sortBy] ? 1 : -1
            } else if (sortDirection === 'DESC') {
                return a[sortBy] < b[sortBy] ? 1 : -1
            }
        })
    }
    return array
}