require('../css/sort.scss');

import React from 'react'
import {connect} from 'react-redux'
import SortBubble from './sortBubble.jsx'
import SortBinaryTree from './sortBinaryTree.jsx'

class WrapperSort extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return <div className="col-md-8 col-sm-12 animationSort">
            {this.props.sort.bubble && <SortBubble array={this.props.array} method={this.props.method}/>}
            {this.props.sort.binaryTree && <SortBinaryTree array={this.props.array} method={this.props.method}/>}
        </div>
    }
}

export default connect(state =>({
    sort: state.reducerArray.sort,
    array: state.reducerArray.array,
    method: state.reducerArray.method
}))(WrapperSort);