require('../css/sortBinaryTree.scss');

import React from 'react'

function treeBuilding(root, newBranch=null) {
    let branch = root;
    if(!newBranch)
        return branch;
    while((branch.value<=newBranch.value && branch.right) || (branch.value>newBranch.value && branch.left)) {
        if(branch.value<=newBranch.value && branch.right)
            branch = branch.right;
        else if(branch.value>newBranch.value && branch.left)
            branch = branch.left;
    }
    if(branch.value<=newBranch.value)
        branch.right = newBranch;
    else
        branch.left = newBranch;
}
function* sort(root,increase=true) {
    if (root.left || root.right) {
        if (root.left && increase) yield* sort(root.left)
        else if(root.right && !increase) yield* sort(root.right,increase)
        yield root.value;
        if (root.right && increase) yield* sort(root.right)
        else if (root.left && !increase) yield* sort(root.left, increase)
    }
    else yield root.value;

}

class SortBinaryTree extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            oldArray:props.array,
            tree: [],
            newArray:[],
            done: false
        }

        this.allEl = this.allEl.bind(this);
        this.updateState = this.updateState.bind(this);
    }
    allEl() {
        let root = {};
        let tree = this.state.oldArray.map(function(el, index) {
            let branch = {
                value: el
            };
            if(index===0) {
                root = branch;
                treeBuilding(root);
            }
            else treeBuilding(root,branch);
            return branch;
        });
        this.setState({tree:tree});
    }
    updateState() {
        if(this.state.newArray.length === 0) {
            this.sort = sort(this.state.tree[0], this.props.method.increase);
            let array = [];
            for (let value of this.sort)
                array.push(value);
            this.setState({done:true,newArray:array});
        }
    }
    componentDidMount() {
        this.allEl();
    }
    componentDidUpdate() {
        if (this.state.oldArray!==this.props.array) {
            this.setState({
                oldArray:this.props.array,
                tree: [],
                newArray:[],
                done: false
            });
            this.allEl();
        }
    }
    render() {
        const _this = this;
        return <React.Fragment>
            <div className="array">
                {
                    _this.state.oldArray.map(function (item, index) {
                        return <div><p>{item}</p></div>
                    })
                }
            </div>
            <button onClick={_this.updateState} disabled={_this.state.done}>Собрать массив</button>
            {_this.state.newArray.length > 0 &&
            <div className="array">
                {
                    _this.state.newArray.map(function (item, index) {
                        return <div><p>{item}</p></div>
                    })
                }
            </div>
            }
        </React.Fragment>
    }
}

export default SortBinaryTree