require('../css/sortBinaryTree.scss');

import React from 'react'
import BinaryTree from "./animationBinaryTree.jsx";

//построение веток дерева
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

    newBranch.branch = branch.branch+1;
    newBranch.previous = branch;
}
//сортировка дерева, generator
function* sort(root,increase=true) {
    if (root.left || root.right) {
        if (root.left && increase) yield* sort(root.left)
        else if(root.right && !increase) yield* sort(root.right,increase)
        yield root;
        if (root.right && increase) yield* sort(root.right)
        else if (root.left && !increase) yield* sort(root.left, increase)
    }
    else yield root;
}

class SortBinaryTree extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            tree: [],
            newArray:[],
            done: false
        }

        this.allEl = this.allEl.bind(this);
        this.updateState = this.updateState.bind(this);
    }
    //построение дерева
    allEl() {
        let root = {};
        let tree = this.props.array.map(function(el, index) {
            let branch = {
                value: el,
                index: index
            };
            if(index===0) {
                root = branch;
                root.branch = 0;
                treeBuilding(root);
            }
            else treeBuilding(root,branch);
            return branch;
        });
        this.setState({tree:tree});
    }
    //построение нового массива
    updateState() {
        if(this.state.newArray.length === 0) {
            this.sort = sort(this.state.tree[0], this.props.method.increase);
            let array = [];
            for (let branch of this.sort)
                array.push(branch.value);
            this.setState({done:true,newArray:array});
        }
    }
    componentDidMount() {
        this.allEl();
    }
    componentDidUpdate(prevProps) {
        if (prevProps!==this.props) {
            this.allEl();
            this.setState({
                newArray:[],
                done: false
            });
        }
    }
    render() {
        const _this = this;

        return <React.Fragment>
            <BinaryTree oldArray={_this.props.array} tree={_this.state.tree}></BinaryTree>
            <button onClick={_this.updateState} disabled={_this.state.done}>обрать массив</button>
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