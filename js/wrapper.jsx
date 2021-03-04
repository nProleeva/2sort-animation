import React from 'react'
import Form from './form.jsx'
import Sort from './wrapperSort.jsx'

class Wrapper extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <div className="d-flex">
            <Form/>
            <Sort/>
        </div>
    }
}
export default Wrapper