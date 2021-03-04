require('../css/main.scss');

import React from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'
import {createStore} from 'redux'
import reducers from './redux'
import Wrapper from './wrapper.jsx'

export default render((
    <Provider store={createStore(reducers)}>
        <Wrapper/>
    </Provider>
),
    document.getElementById('sorting')
)