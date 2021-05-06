require('../css/animationTree.scss');

import React from 'react'

function* animationTree(branch) {
    if(branch.previous) yield* animationTree(branch.previous);
    yield branch;
}
function* recursioIBLeft(root) {
    if(root.right) yield* recursioIBLeft(root.right)
    yield root;
    if(root.left) yield* recursioIBLeft(root.left)
}
function* recursioIBRight(root) {
    if(root.left) yield* recursioIBRight(root.left)
    yield root;
    if(root.right) yield* recursioIBRight(root.right)
}

class BinaryTree extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            indexArray:[],
            indexBranch: [],
            widthTree:0
        }
        this.updateIndexBranch = this.updateIndexBranch.bind(this);
        this.updateWidthTree = this.updateWidthTree.bind(this);
        this.refTree = React.createRef();
    }
    componentDidMount() {
        this.setState({
            indexBranch: this.updateIndexBranch(),
            indexArray: [],
            widthTree: this.updateWidthTree()
        });
    }
    componentDidUpdate(prevProps) {
        if(prevProps!==this.props) {
            this.setState({
                indexBranch: this.updateIndexBranch(),
                indexArray: [],
                widthTree: this.updateWidthTree()
            });
        }
    }

    updateWidthTree() {
        return this.refTree.current.offsetWidth/2
    }
    updateIndexBranch() {
        let length = this.props.tree.length,
            indexBranch = new Array(length),
            left = -1,
            right = 1;
        if(length) {
            indexBranch[0] = 0;
            if(this.props.tree[0].left) {
                this.left = recursioIBLeft(this.props.tree[0].left);
                for (let branch of this.left){
                    indexBranch[branch.index] = left;
                    left--;
                }
            }
            if(this.props.tree[0].right) {
                this.right = recursioIBRight(this.props.tree[0].right);
                for (let branch of this.right) {
                    indexBranch[branch.index] = right;
                    right++;
                }
            }
        }
        return indexBranch
    }
    clickElArray(index) {
        this.animation = animationTree(this.props.tree[index]);
        let array = [];
        for (let branch of this.animation)
            array.push(branch.index);
        this.setState({indexArray:array});
    }

    render() {
        let _this = this,
            widthBranch = 52,
            maxHeightBranch = 50,
            heightLine = maxHeightBranch - 30 + 30/2,
            widthTree = _this.state.widthTree + Math.min(..._this.state.indexBranch)*widthBranch,
            styleTree = {
                height: (Math.max(...(_this.props.tree.length?_this.props.tree.map(el=>el.branch):[0]))+1)*maxHeightBranch,
                left: (-1)*widthTree
            }
            console.log(_this.state.widthTree, Math.min(..._this.state.indexBranch)*widthBranch)
        return <React.Fragment>
            <div className="array">
                {
                    _this.props.oldArray.map(function (item,index) {
                        return <div onClick={_this.clickElArray.bind(_this,index)} class={Math.max(..._this.state.indexArray)===index?'active':''}><p>{item}</p></div>
                    })
                }
            </div>
            <div className="tree" style={styleTree} ref={this.refTree}>
                {
                    _this.props.tree.map(function (item,index) {

                        let style={
                            top:item.branch*maxHeightBranch,
                            left: `calc(50% + (${_this.state.indexBranch[index]*widthBranch}px))`
                        },
                            styleAfter = {},
                            styleBefore = {};
                        if(item.left){
                            let width = (_this.state.indexBranch[index] - _this.state.indexBranch[item.left.index] - 0.5)*widthBranch,
                                d = Math.sqrt(heightLine**2+width**2), //высчитываем диагональ
                                sin = heightLine/d, //...синус угла между диагональю и стороной
                                deg = Math.asin(sin) * (180/Math.PI); //...угол

                            styleAfter = {
                                width: d,
                                transform:`rotate(-${deg}deg)`,
                                left: (-1)*width
                            }
                        }
                        if(item.right) {
                            let width = (_this.state.indexBranch[item.right.index] - _this.state.indexBranch[index] - 0.5)*widthBranch,
                                d = Math.sqrt(heightLine**2+width**2), //высчитываем диагональ
                                sin = heightLine/d, //...синус угла между диагональю и стороной
                                deg = Math.asin(sin) * (180/Math.PI); //...угол

                            styleBefore = {
                                width: d,
                                transform:`rotate(${deg}deg)`,
                                right: (-1)*width
                            }
                        }
                        if(_this.state.indexArray.includes(index)){
                            style.transitionDelay = `${item.branch*5}s`;
                            styleAfter.transitionDelay = `${item.branch*5 + 1.5}s`;
                            styleBefore.transitionDelay = `${item.branch*5 + 1.5}s`;
                            console.log(index, item.left&&_this.state.indexArray.includes(item.left.index), item.right&&_this.state.indexArray.includes(item.right.index))
                        }
                        return <div className={_this.state.indexArray.includes(index)?'active':''} style={style}><p className={`after ${item.left&&_this.state.indexArray.includes(item.left.index)?'active':''}`} style={styleAfter}>&lt;</p><p>{item.value}</p><p className={`before ${item.right&&_this.state.indexArray.includes(item.right.index)?'active':''}`} style={styleBefore}>&le;</p></div>
                    })
                }
            </div>
        </React.Fragment>
    }
}
export default BinaryTree