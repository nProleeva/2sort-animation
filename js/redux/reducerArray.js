import { handleActions } from 'redux-actions'

const FETCH_ARRAY = 'array/FETCH_ARRAY'

const fetchArrayAction = (sort,method,array) => ({
		type: FETCH_ARRAY,
		sort:sort, method:method, array:array
	});

const reducer = handleActions({
	[FETCH_ARRAY]: (state, action) => ({
		sort: action.sort,
		method: action.method,
		array: action.array
	})
}, {
	sort:{},
	method:{},
	array: []
});

export {fetchArrayAction,reducer}