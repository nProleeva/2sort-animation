import React from 'react'
import {connect} from 'react-redux'
import SortBubble from './sortBubble.jsx'

class WrapperSort extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return <div class="col-md-8 col-sm-12">
            {this.props.sort.bubble && <SortBubble array={this.props.array} method={this.props.method}/>}
            {/*this.props.sort.binaryTree && <sortBinaryTree array={this.props.array} method={this.props.method}/>*/}
        </div>
    }
}

export default connect(state =>({
    sort: state.reducerArray.sort,
    array: state.reducerArray.array,
    method: state.reducerArray.method
}))(WrapperSort);